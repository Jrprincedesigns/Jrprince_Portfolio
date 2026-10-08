import { site } from "@/data/site";

/**
 * Block Kit payload for one chat exchange — the visitor's question and the
 * assistant's reply — so each question asked of the Q&A bot shows up in Slack.
 *
 * Posted per turn from POST /api/chat, so a question is captured the moment it
 * is asked, even if the visitor closes the tab immediately after.
 */

export interface ChatExchange {
  question: string;
  reply: string;
  /** 1-based turn number within the conversation, for context. */
  turn: number;
  location: string;
  device: string;
}

/** Slack section text tops out at 3000 chars; keep bubbles well under that. */
const MAX_FIELD = 1500;

function clamp(text: string, max = MAX_FIELD): string {
  const trimmed = text.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}

export function buildChatMessage(exchange: ChatExchange) {
  const base = site.url.replace(/\/$/, "");
  const { question, reply, turn, location, device } = exchange;

  const when = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const turnLabel = turn > 1 ? ` · follow-up #${turn}` : "";

  return {
    // Fallback text drives the mobile/desktop notification preview.
    text: `💬 Chat: “${clamp(question, 140)}”`,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "💬 Chatbot question", emoji: true },
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: `*Asked*\n${clamp(question)}` },
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: `*Replied*\n${clamp(reply)}` },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `${when} CT · ${location} · ${device}${turnLabel} · ${base.replace(
              /^https?:\/\//,
              ""
            )}`,
          },
        ],
      },
    ],
  };
}
