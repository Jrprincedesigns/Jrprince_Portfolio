/**
 * Which Slack notifications this deployment sends.
 *
 * - `arrival` — only the "someone just landed" ping.
 * - `digest`  — only the end-of-session summary. Quieter: one message per
 *               visitor instead of two.
 * - `both`    — default.
 */

export type NotifyMode = "arrival" | "digest" | "both";

export function notifyMode(): NotifyMode {
  const raw = (process.env.VISIT_NOTIFY_MODE ?? "both").toLowerCase();
  return raw === "arrival" || raw === "digest" ? raw : "both";
}
