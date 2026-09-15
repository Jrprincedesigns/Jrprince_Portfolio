import { NextRequest, NextResponse } from "next/server";
import { postToSlack, slackConfigured } from "@/lib/slack";
import { notifyMode } from "@/lib/notifyMode";
import {
  buildVisitMessage,
  fingerprint,
  isBot,
  parseUserAgent,
  type VisitInfo,
} from "@/lib/visitor";

/**
 * POST /api/visit
 *
 * Body: { path, title, referrer, utm, returning, screen }
 * Returns: 204 always (fire-and-forget from the client).
 *
 * The VisitPing component calls this once per browser session. Geo and IP come
 * from Vercel's edge headers — the IP is hashed for rate limiting only and is
 * never persisted or sent to Slack.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Minimum gap between pings from the same fingerprint. */
const DEDUPE_WINDOW_MS = 30 * 60 * 1000;
/** Ceiling on notifications per instance per hour, so a burst can't flood Slack. */
const HOURLY_CAP = 60;
const MAX_ENTRIES = 500;

/**
 * Best-effort in-memory dedupe. Serverless instances are recycled, so this
 * trims duplicates within a warm instance rather than guaranteeing uniqueness;
 * the client's sessionStorage guard does the primary de-duplication.
 */
const seen = new Map<string, number>();
let windowStart = Date.now();
let windowCount = 0;

function throttled(key: string): boolean {
  const now = Date.now();

  if (now - windowStart > 60 * 60 * 1000) {
    windowStart = now;
    windowCount = 0;
  }
  if (windowCount >= HOURLY_CAP) return true;

  const last = seen.get(key);
  if (last && now - last < DEDUPE_WINDOW_MS) return true;

  if (seen.size >= MAX_ENTRIES) {
    for (const [k, t] of seen) {
      if (now - t > DEDUPE_WINDOW_MS) seen.delete(k);
    }
    if (seen.size >= MAX_ENTRIES) seen.clear();
  }

  seen.set(key, now);
  windowCount += 1;
  return false;
}

function str(value: unknown, max = 200): string {
  return typeof value === "string" ? value.slice(0, max).trim() : "";
}

export async function POST(req: NextRequest) {
  // Nothing configured (local dev, preview), or arrival pings are off.
  if (!slackConfigured() || notifyMode() === "digest") {
    return new NextResponse(null, { status: 204 });
  }

  const userAgent = req.headers.get("user-agent") ?? "";
  if (isBot(userAgent)) return new NextResponse(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const ip =
    req.headers.get("x-vercel-forwarded-for") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (throttled(fingerprint(ip, userAgent))) {
    return new NextResponse(null, { status: 204 });
  }

  const rawUtm = (body.utm ?? {}) as Record<string, unknown>;
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const value = str(rawUtm[key], 80);
    if (value) utm[key] = value;
  }

  const info: VisitInfo = {
    path: str(body.path, 300) || "/",
    title: str(body.title, 120),
    referrer: str(body.referrer, 300),
    utm,
    city: decodeURIComponent(req.headers.get("x-vercel-ip-city") ?? ""),
    region: req.headers.get("x-vercel-ip-country-region") ?? "",
    country: req.headers.get("x-vercel-ip-country") ?? "",
    returning: body.returning === true,
    screen: str(body.screen, 40),
    ...parseUserAgent(userAgent),
  };

  await postToSlack(buildVisitMessage(info));

  return new NextResponse(null, { status: 204 });
}
