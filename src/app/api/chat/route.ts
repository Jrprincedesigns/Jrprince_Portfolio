import { NextRequest, NextResponse } from "next/server";
import { buildSystemInstruction, getGemini, GEMINI_MODEL } from "@/lib/gemini";
import { postToSlack, slackConfigured } from "@/lib/slack";
import { buildChatMessage } from "@/lib/chatNotify";
import { parseUserAgent } from "@/lib/visitor";

/**
 * POST /api/chat
 *
 * Body: { messages: { role: "user" | "assistant"; content: string }[] }
 * Returns: { reply: string }
 *
 * The floating ChatWidget calls this route. The assistant is grounded in the
 * portfolio's own case-study data via a system instruction (see lib/gemini.ts).
 *
 * This is intentionally non-streaming to keep the scaffold simple. To stream,
 * swap `generateContent` for `generateContentStream` and pipe a ReadableStream.
 */

export const runtime = "nodejs";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MAX_MESSAGES = 20;
const MAX_CHARS = 4000;

export async function POST(req: NextRequest) {
  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return NextResponse.json(
      { error: "messages array is required." },
      { status: 400 }
    );
  }

  // Basic input hygiene: cap history length and per-message size.
  const trimmed = messages.slice(-MAX_MESSAGES).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: String(m.content ?? "").slice(0, MAX_CHARS) }],
  }));

  try {
    const ai = getGemini();
    const result = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: trimmed,
      config: {
        systemInstruction: buildSystemInstruction(),
        temperature: 0.6,
        maxOutputTokens: 512,
      },
    });

    const reply =
      result.text?.trim() ||
      "Sorry, I couldn't generate a response just now. Please try again.";

    // Mirror the exchange to Slack so each question is visible. Awaited so the
    // post survives in serverless (no background work after the response), but
    // postToSlack never throws and caps itself at a short timeout.
    if (slackConfigured()) {
      const lastQuestion = [...messages]
        .reverse()
        .find((m) => m.role === "user");
      if (lastQuestion?.content) {
        const userCount = messages.filter((m) => m.role === "user").length;
        const location = [
          decodeURIComponent(req.headers.get("x-vercel-ip-city") ?? ""),
          req.headers.get("x-vercel-ip-country") ?? "",
        ]
          .filter(Boolean)
          .join(", ") || "Unknown location";
        const ua = parseUserAgent(req.headers.get("user-agent") ?? "");
        await postToSlack(
          buildChatMessage({
            question: String(lastQuestion.content),
            reply,
            turn: userCount,
            location,
            device: `${ua.device} · ${ua.os} · ${ua.browser}`,
          })
        );
      }
    }

    return NextResponse.json({ reply });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown server error.";
    // Surface config errors clearly in dev; keep it generic in production.
    const isConfig = message.includes("GEMINI_API_KEY");
    return NextResponse.json(
      {
        error: isConfig
          ? message
          : "The assistant is temporarily unavailable.",
      },
      { status: isConfig ? 500 : 502 }
    );
  }
}
