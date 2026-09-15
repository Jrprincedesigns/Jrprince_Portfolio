/**
 * Slack transport — posts messages to an Incoming Webhook.
 *
 * Set `SLACK_WEBHOOK_URL` in the environment. When it is unset every helper
 * here no-ops, so local dev and preview deploys stay quiet instead of erroring.
 */

const TIMEOUT_MS = 4000;

/** True when a webhook is configured for this environment. */
export function slackConfigured(): boolean {
  return Boolean(process.env.SLACK_WEBHOOK_URL);
}

/**
 * Fire a Block Kit payload at the webhook.
 *
 * Never throws: a visitor's page load must not fail because Slack is down or
 * slow, so errors are logged server-side and swallowed.
 */
export async function postToSlack(payload: unknown): Promise<boolean> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return false;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[slack] webhook responded ${res.status}: ${detail.slice(0, 200)}`);
      return false;
    }
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[slack] webhook post failed: ${message}`);
    return false;
  } finally {
    clearTimeout(timer);
  }
}
