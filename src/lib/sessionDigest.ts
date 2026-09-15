/**
 * Builds the end-of-session Slack digest — what a visitor actually did,
 * summarised in one glanceable message.
 */

import { site } from "@/data/site";
import { describeReferrer, formatLocation, type VisitInfo } from "@/lib/visitor";

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
  const studies = summary.pages.filter((p) => isCaseStudy(p.path));
  const deepRead = studies.some((p) => p.maxScroll >= 70 && p.engagedMs >= 60_000);
  // Depth counts even in a short session: someone who scrolled most of a case
  // study engaged with the work, however fast they moved.
  const skimmed = studies.some((p) => p.maxScroll >= 40);
  const minutes = summary.durationMs / 60_000;

  if (deepRead && minutes >= 3) return { emoji: "🔥", label: "Deep read" };
  if (skimmed || (studies.length > 0 && minutes >= 1)) {
    return { emoji: "🎯", label: "Engaged session" };
  }
  if (minutes < 0.5) return { emoji: "💨", label: "Quick bounce" };
  return { emoji: "👋", label: "Session ended" };
}

export function buildDigestMessage(summary: SessionSummary) {
  const base = site.url.replace(/\/$/, "");
  const { emoji, label } = engagementLabel(summary);
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
      return `${bar(p.maxScroll)} \`${String(p.maxScroll).padStart(3)}%\` · ${formatDuration(p.engagedMs)} — ${link}`;
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

  const headline = studies.length
    ? `${prettyPath(studies[0])} ${studies[0].maxScroll}%`
    : summary.exitPath;

  return {
    text: `${emoji} ${label} — ${duration} · ${headline} · ${location} via ${source}`,
    blocks,
  };
}
