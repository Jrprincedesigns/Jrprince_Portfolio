import { NextRequest, NextResponse } from "next/server";
import { postToSlack, slackConfigured } from "@/lib/slack";
import { isBot, parseUserAgent } from "@/lib/visitor";
import { buildDigestMessage, type SessionSummary } from "@/lib/sessionDigest";
import { notifyMode } from "@/lib/notifyMode";

/**
 * POST /api/session
 *
 * Receives the end-of-session digest sent by SessionTracker via sendBeacon and
 * posts a summary to Slack. Returns 204 always — a beacon ignores the response,
 * and a visitor leaving the site must never see an error.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PAGES = 25;
const MAX_CHAPTERS = 60;
const MAX_HOTSPOTS = 10;
const MAX_CONVERSIONS = 12;
/** Longer than any plausible read; guards against a clock-skewed payload. */
const MAX_DURATION_MS = 6 * 60 * 60 * 1000;

function num(value: unknown, max: number): number {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(max, Math.round(n)));
}

function str(value: unknown, max = 200): string {
  return typeof value === "string" ? value.slice(0, max).trim() : "";
}

function hotspots(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, number> = {};
  for (const [key, count] of Object.entries(value as Record<string, unknown>)) {
    if (Object.keys(out).length >= MAX_HOTSPOTS) break;
    const label = str(key, 60);
    const n = num(count, 999);
    if (label && n > 0) out[label] = n;
  }
  return out;
}

export async function POST(req: NextRequest) {
  if (!slackConfigured() || notifyMode() === "arrival") {
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

  const rawPages = Array.isArray(body.pages) ? body.pages.slice(0, MAX_PAGES) : [];
  const pages = rawPages.map((p) => {
    const entry = (p ?? {}) as Record<string, unknown>;
    return {
      path: str(entry.path, 300) || "/",
      title: str(entry.title, 120),
      engagedMs: num(entry.engagedMs, MAX_DURATION_MS),
      maxScroll: num(entry.maxScroll, 100),
    };
  });

  const rawChapters = Array.isArray(body.chapters) ? body.chapters.slice(0, MAX_CHAPTERS) : [];
  const chapters = rawChapters.map((c) => {
    const entry = (c ?? {}) as Record<string, unknown>;
    return {
      path: str(entry.path, 300),
      label: str(entry.label, 80),
      engagedMs: num(entry.engagedMs, MAX_DURATION_MS),
    };
  });

  const rawConversions = Array.isArray(body.conversions)
    ? body.conversions.slice(0, MAX_CONVERSIONS)
    : [];
  const conversions = rawConversions
    .map((c) => {
      const entry = (c ?? {}) as Record<string, unknown>;
      return {
        label: str(entry.label, 40),
        path: str(entry.path, 300),
        atMs: num(entry.atMs, MAX_DURATION_MS),
      };
    })
    .filter((c) => c.label);

  const rawUtm = (body.utm ?? {}) as Record<string, unknown>;
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const value = str(rawUtm[key], 80);
    if (value) utm[key] = value;
  }

  const summary: SessionSummary = {
    durationMs: num(body.durationMs, MAX_DURATION_MS),
    entryPath: str(body.entryPath, 300) || "/",
    exitPath: str(body.exitPath, 300) || "/",
    referrer: str(body.referrer, 300),
    utm,
    screen: str(body.screen, 40),
    returning: body.returning === true,
    clicks: num(body.clicks, 9999),
    pages,
    chapters,
    rage: hotspots(body.rage),
    deadVisual: hotspots(body.deadVisual),
    conversions,
    continued: body.continued === true,
    geo: {
      city: decodeURIComponent(req.headers.get("x-vercel-ip-city") ?? ""),
      region: req.headers.get("x-vercel-ip-country-region") ?? "",
      country: req.headers.get("x-vercel-ip-country") ?? "",
    },
    device: parseUserAgent(userAgent),
  };

  await postToSlack(buildDigestMessage(summary));

  return new NextResponse(null, { status: 204 });
}
