"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Contact.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Social {
  label: string;
  short: string;
  href: string;
}

interface ContactChatProps {
  greeting: string;
  suggestions: string[];
  socials: readonly Social[];
}

/**
 * Interactive chat card for the Contact section. Holds the conversation state
 * and talks to POST /api/chat (grounded in the portfolio via lib/gemini.ts).
 * The greeting is a canned client-side line and is not sent to the model.
 */
export default function ContactChat({
  greeting,
  suggestions,
  socials,
}: ContactChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: greeting },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const started = messages.length > 1;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Drop the canned greeting (index 0); send only the real exchange.
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.messages} ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={styles.msgRow} data-role={m.role}>
            {m.role === "assistant" && (
              <span className={styles.spark} aria-hidden="true">
                ✦
              </span>
            )}
            <p className={styles.bubble} data-role={m.role}>
              {m.content}
            </p>
          </div>
        ))}

        {loading && (
          <div className={styles.msgRow} data-role="assistant">
            <span className={styles.spark} aria-hidden="true">
              ✦
            </span>
            <p className={styles.bubble} data-role="assistant">
              <span className={styles.typing} aria-label="Thinking">
                <i />
                <i />
                <i />
              </span>
            </p>
          </div>
        )}

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>

      {!started && !loading && (
        <ul className={styles.suggestions}>
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                className={styles.chip}
                onClick={() => send(s)}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        className={styles.inputRow}
        aria-label="Message Lennox"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <div className={styles.socials}>
          {socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className={styles.social}
              aria-label={s.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.short}
            </a>
          ))}
        </div>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message…"
          aria-label="Message"
          disabled={loading}
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          ↑
        </button>
      </form>
    </div>
  );
}
