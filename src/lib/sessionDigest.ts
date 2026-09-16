/**
 * Builds the end-of-session Slack digest — what a visitor actually did,
 * summarised in one glanceable message.
 */

import { site } from "@/data/site";
import { describeReferrer, formatLocation, type VisitInfo } from "@/lib/visitor";

/** CTAs that mean the visitor actually tried to reach you. */
const CONTACT_CTAS = ["Email", "Phone", "Chat message"];

export interface PageEntry {
  path: string;
  title: string;
  engagedMs: number;
  maxScroll: number;
}

export interface ChapterEntry {
  path: string;
  label: string;
  engagedMs: number;
}

export interface ConversionEntry {
  label: string;
  path: string;
  atMs: number;
}

export interface SessionSummary {
  durationMs: number;
  entryPath: string;
  exitPath: string;
  referrer: string;
  utm: Record<string, string>;
  screen: string;
  returning: boolean;
  clicks: number;
  pages: PageEntry[];
  chapters: ChapterEntry[];
  rage: Record<string, number>;
  deadVisual: Record<string, number>;
  conversions: ConversionEntry[];
  /** True when an earlier digest already covered part of this session. */
  continued: boolean;
  geo: Pick<VisitInfo, "city" | "region" | "country">;
  device: Pick<VisitInfo, "browser" | "os" | "device">;
}

/** `6m 42s`, or `48s` under a minute. */
export function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return minutes ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

export function isCaseStudy(path: string): boolean {
  return path.startsWith("/work/");
}

/**
 * A short, readable name for a page.
 *
 * Document titles arrive as `Doorvest — Long positioning sentence. — Lennox
 * Prince`, which swamps a Slack line, so keep the leading project name and
 * fall back to a title-cased slug when no title came across.
 */
function prettyPath(entry: PageEntry): string {
  const title = entry.title
    .replace(new RegExp(`\\s*[—–-]\\s*${site.name}\\s*$`), "")
    .trim();
  if (title) {
    const lead = title.split(/\s+[—–]\s+/)[0]?.trim();
    const best = lead && lead.length >= 3 ? lead : title;
    return best.length > 48 ? `${best.slice(0, 47)}…` : best;
  }
  const slug = entry.path.replace(/^\/work\//, "").replace(/^\//, "") || "Home";
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * How fast they moved through a page, as engaged milliseconds per percent of
 * depth covered. Depth alone can't tell a read from a flick: covering 100% of
 * a case study in 22s and reading it properly both render as a full bar.
 *
 * Thresholds are per-percent so they hold whether someone covered a third of a
 * study or all of it — 600ms/% is a minute for a full pass, 250ms/% is 25s.
 */
const READ_PACE = 600;
const SKIM_PACE = 250;
/** Below this there isn't enough of a page covered to judge pace. */
const MIN_DEPTH_TO_JUDGE = 10;

export type ReadingPace = "read" | "skimmed" | null;

export function readingPace(entry: PageEntry): ReadingPace {
  if (entry.maxScroll < MIN_DEPTH_TO_JUDGE) return null;
  const msPerPercent = entry.engagedMs / entry.maxScroll;
  if (msPerPercent >= READ_PACE) return "read";
  if (msPerPercent < SKIM_PACE) return "skimmed";
  return null;
}

/** Suffix for a case-study line. The middle pace stays unlabelled. */
function paceLabel(entry: PageEntry): string {
  const pace = readingPace(entry);
  if (pace === "read") return "  📖 read";
  if (pace === "skimmed") return "  ⚡ skimmed";
  return "";
}

/** Ten-cell bar — reads cleanly in Slack's proportional font. */
function bar(percent: number): string {
  const filled = Math.max(0, Math.min(10, Math.round(percent / 10)));
  return "█".repeat(filled) + "░".repeat(10 - filled);
}

function topEntries(map: Record<string, number>, limit = 3): [string, number][] {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

/**
 * How engaged the session was overall — a quick read before opening the
 * details. Thresholds are tuned for a portfolio: a genuine case-study read
 * runs minutes, not seconds.
 */
function engagementLabel(summary: SessionSummary): { emoji: string; label: string } {
  if (summary.conversions.some((c) => CONTACT_CTAS.includes(c.label))) {
    return { emoji: "✉️", label: "Reached out" };
  }

  const studies = summary.pages.filter((p) => isCaseStudy(p.path));
  const deepRead = studies.some(
    (p) => p.maxScroll >= 70 && p.engagedMs >= 60_000 && readingPace(p) === "read"
  );
  // Depth counts in a short session, but a flick through does not: covering a
  // case study at skimming pace is not the same as engaging with it.
  const covered = studies.some((p) => p.maxScroll >= 40 && readingPace(p) !== "skimmed");
  const minutes = summary.durationMs / 60_000;

  if (deepRead && minutes >= 3) return { emoji: "🔥", label: "Deep read" };
  if (covered || (studies.length > 0 && minutes >= 1)) {
    return { emoji: "🎯", label: "Engaged session" };
  }
  if (minutes < 0.5) return { emoji: "💨", label: "Quick bounce" };
  return { emoji: "👋", label: "Session ended" };
}

export function buildDigestMessage(summary: SessionSummary) {
  const base = site.url.replace(/\/$/, "");
  const engagement = engagementLabel(summary);
  const emoji = engagement.emoji;
  const label = summary.continued ? `${engagement.label} (cont.)` : engagement.label;
  const location = formatLocation({ ...summary.geo } as VisitInfo);
  const source = describeReferrer(summary.referrer);
  const duration = formatDuration(summary.durationMs);
  const engagedMs = summary.pages.reduce((sum, p) => sum + p.engagedMs, 0);

  const blocks: unknown[] = [
    {
      type: "header",
      text: { type: "plain_text", text: `${emoji} ${label} — ${duration}`, emoji: true },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Engaged*\n${formatDuration(engagedMs)} of ${duration}`,
        },
        { type: "mrkdwn", text: `*Came from*\n${source}` },
        { type: "mrkdwn", text: `*Location*\n${location}` },
        {
          type: "mrkdwn",
          text: `*Device*\n${summary.device.device} · ${summary.device.os} · ${summary.device.browser}`,
        },
        { type: "mrkdwn", text: `*Pages*\n${summary.pages.length}` },
        { type: "mrkdwn", text: `*Clicks*\n${summary.clicks}` },
      ],
    },
  ];

  // What they read, deepest engagement first.
  const studies = summary.pages
    .filter((p) => isCaseStudy(p.path))
    .sort((a, b) => b.engagedMs - a.engagedMs);

  if (studies.length) {
    const lines = studies.map((p) => {
      const link = `<${base}${p.path}|${prettyPath(p)}>`;
      return `${bar(p.maxScroll)} \`${String(p.maxScroll).padStart(3)}%\` · ${formatDuration(p.engagedMs)} — ${link}${paceLabel(p)}`;
    });
    blocks.push({ type: "divider" });
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Case studies read*\n${lines.join("\n")}` },
    });
  }

  // Chapter depth for the study they spent the most time in — this is where
  // the drop-off actually shows up.
  const focus = studies[0];
  if (focus) {
    const chapters = summary.chapters
      .filter((c) => c.path === focus.path)
      .sort((a, b) => b.engagedMs - a.engagedMs)
      .slice(0, 8);
    if (chapters.length) {
      const lines = chapters.map((c) => `• *${c.label}* — ${formatDuration(c.engagedMs)}`);
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Time per chapter — ${prettyPath(focus)}*\n${lines.join("\n")}`,
        },
      });
    }
  }

  // What they did about it — the block worth reading first.
  if (summary.conversions.length) {
    const lines = summary.conversions.map((c) => {
      const from = isCaseStudy(c.path) ? ` from ${c.path.replace("/work/", "")}` : "";
      return `• *${c.label}* — ${formatDuration(c.atMs)} in${from}`;
    });
    blocks.push({ type: "divider" });
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Clicked through*\n${lines.join("\n")}` },
    });
  }

  // Friction signals.
  const rage = topEntries(summary.rage);
  const dead = topEntries(summary.deadVisual);
  if (rage.length || dead.length) {
    const parts: string[] = [];
    if (rage.length) {
      parts.push(
        `😤 *Rage clicks* — ${rage.map(([sel, n]) => `\`${sel}\` ×${n}`).join(", ")}`
      );
    }
    if (dead.length) {
      parts.push(
        `🖱️ *Clicked a visual that does nothing* — ${dead
          .map(([sel, n]) => `\`${sel}\` ×${n}`)
          .join(", ")}`
      );
    }
    blocks.push({ type: "divider" });
    blocks.push({ type: "section", text: { type: "mrkdwn", text: parts.join("\n") } });
  }

  const visitorKind = summary.returning ? "Returning" : "New";
  const campaign = Object.entries(summary.utm)
    .map(([k, v]) => `${k.replace(/^utm_/, "")}=${v}`)
    .join(" · ");

  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: [
          `${visitorKind} visitor`,
          `entry \`${summary.entryPath}\``,
          `exit \`${summary.exitPath}\``,
          summary.screen,
          campaign,
        ]
          .filter(Boolean)
          .join(" · "),
      },
    ],
  });

  const converted = summary.conversions.map((c) => c.label).join(", ");
  const headline = [
    converted,
    studies.length ? `${prettyPath(studies[0])} ${studies[0].maxScroll}%` : summary.exitPath,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    text: `${emoji} ${label} — ${duration} · ${headline} · ${location} via ${source}`,
    blocks,
  };
}
