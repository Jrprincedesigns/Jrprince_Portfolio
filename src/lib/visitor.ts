/**
 * Visitor notifications — turns an incoming ping into a readable Slack message.
 *
 * Deliberately cookieless and IP-free: the raw IP is hashed only to rate-limit
 * repeat pings and is never stored or sent to Slack.
 */

import { createHash } from "node:crypto";
import { site } from "@/data/site";

export interface VisitInfo {
  path: string;
  title: string;
  referrer: string;
  utm: Record<string, string>;
  city: string;
  region: string;
  country: string;
  browser: string;
  os: string;
  device: string;
  returning: boolean;
  screen: string;
}

/** Obvious crawlers and preview bots — never worth a Slack ping. */
const BOT_PATTERN =
  /bot|crawl|spider|slurp|bingpreview|headless|lighthouse|pagespeed|preview|monitor|curl|wget|python-requests|axios|node-fetch|postman|facebookexternalhit|whatsapp|telegram|discord|slackbot|vercel-screenshot|chrome-lighthouse/i;

export function isBot(userAgent: string): boolean {
  return !userAgent || BOT_PATTERN.test(userAgent);
}

/** Human-readable source for a referrer URL. */
export function describeReferrer(referrer: string): string {
  if (!referrer) return "Direct / unknown";

  let host: string;
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "Direct / unknown";
  }

  const siteHost = (() => {
    try {
      return new URL(site.url).hostname.replace(/^www\./, "").toLowerCase();
    } catch {
      return "";
    }
  })();
  if (host === siteHost) return "Internal";

  const known: Record<string, string> = {
    "linkedin.com": "LinkedIn",
    "lnkd.in": "LinkedIn",
    "google.com": "Google Search",
    "bing.com": "Bing",
    "duckduckgo.com": "DuckDuckGo",
    "tiktok.com": "TikTok",
    "x.com": "X / Twitter",
    "twitter.com": "X / Twitter",
    "t.co": "X / Twitter",
    "instagram.com": "Instagram",
    "dribbble.com": "Dribbble",
    "behance.net": "Behance",
    "github.com": "GitHub",
    "read.cv": "Read.cv",
    "medium.com": "Medium",
    "reddit.com": "Reddit",
  };

  for (const [domain, label] of Object.entries(known)) {
    if (host === domain || host.endsWith(`.${domain}`)) return label;
  }
  return host;
}

/** Lightweight UA parse — enough for a glanceable Slack line, no dependency. */
export function parseUserAgent(ua: string): Pick<VisitInfo, "browser" | "os" | "device"> {
  const browser = /edg\//i.test(ua)
    ? "Edge"
    : /opr\/|opera/i.test(ua)
      ? "Opera"
      : /firefox\//i.test(ua)
        ? "Firefox"
        : /chrome\/|crios/i.test(ua)
          ? "Chrome"
          : /safari\//i.test(ua)
            ? "Safari"
            : "Browser";

  const os = /iphone|ipad|ipod/i.test(ua)
    ? "iOS"
    : /android/i.test(ua)
      ? "Android"
      : /mac os x|macintosh/i.test(ua)
        ? "macOS"
        : /windows/i.test(ua)
          ? "Windows"
          : /linux/i.test(ua)
            ? "Linux"
            : "Unknown OS";

  const device = /ipad|tablet/i.test(ua)
    ? "Tablet"
    : /mobi|iphone|android.*mobile/i.test(ua)
      ? "Mobile"
      : "Desktop";

  return { browser, os, device };
}

/** Stable, non-reversible key for rate limiting. Never leaves the server. */
export function fingerprint(ip: string, userAgent: string): string {
  const salt = process.env.VISIT_HASH_SALT ?? "jrprince-visit";
  return createHash("sha256").update(`${salt}:${ip}:${userAgent}`).digest("hex").slice(0, 32);
}

/** Location line from Vercel's edge geo headers, which arrive already decoded. */
export function formatLocation(info: VisitInfo): string {
  const parts = [info.city, info.region, info.country].filter(Boolean);
  return parts.length ? parts.join(", ") : "Unknown location";
}

function formatUtm(utm: Record<string, string>): string {
  const entries = Object.entries(utm).filter(([, v]) => v);
  if (!entries.length) return "";
  return entries.map(([k, v]) => `${k.replace(/^utm_/, "")}=${v}`).join(" · ");
}

/** Build the Block Kit payload for one visit. */
export function buildVisitMessage(info: VisitInfo) {
  const base = site.url.replace(/\/$/, "");
  const pageUrl = `${base}${info.path}`;
  const location = formatLocation(info);
  const source = describeReferrer(info.referrer);
  const label = info.returning ? "Returning visitor" : "New visitor";
  const emoji = info.returning ? "🔁" : "👀";

  const fields = [
    { type: "mrkdwn", text: `*Page*\n<${pageUrl}|${info.title || info.path}>` },
    { type: "mrkdwn", text: `*Came from*\n${source}` },
    { type: "mrkdwn", text: `*Location*\n${location}` },
    { type: "mrkdwn", text: `*Device*\n${info.device} · ${info.os} · ${info.browser}` },
  ];

  const campaign = formatUtm(info.utm);
  if (campaign) {
    fields.push({ type: "mrkdwn", text: `*Campaign*\n${campaign}` });
  }
  if (info.screen) {
    fields.push({ type: "mrkdwn", text: `*Screen*\n${info.screen}` });
  }

  const when = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return {
    // Fallback text drives the mobile/desktop notification preview.
    text: `${emoji} ${label} on ${info.path} — ${location}, via ${source}`,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: `${emoji} ${label}`, emoji: true },
      },
      { type: "section", fields },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: `${when} CT · ${base.replace(/^https?:\/\//, "")}` }],
      },
    ],
  };
}
