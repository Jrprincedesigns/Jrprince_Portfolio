"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import styles from "./ChatWidget.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What kind of work does Jonathan do?",
  "Tell me about the Aperture project",
  "What's his approach to motion design?",
];

const GREETING: Message = {
  role: "assistant",
  content: `Hi! I'm ${site.shortName}'s assistant. Ask me anything about the work, process, or experience.`,
};

/**
 * Floating chat launcher + panel. Talks to POST /api/chat, which is grounded in
 * the portfolio's case-study data via Gemini. Client component: it holds the
 * conversation state and never sees the API key.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send only the real conversation, not the local greeting.
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
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
    <>
      <motion.button
        className={styles.launcher}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close assistant" : "Open assistant"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        <span className={styles.launcherIcon} data-open={open} aria-hidden>
          {open ? "×" : "✦"}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.section
            className={styles.panel}
            role="dialog"
            aria-label="Portfolio assistant"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className={styles.header}>
              <div className={styles.headerTitle}>
                <span className={styles.pulse} aria-hidden />
                Ask about my work
              </div>
              <span className={styles.poweredBy}>Powered by Gemini</span>
            </header>

            <div className={styles.messages} ref={scrollRef}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={styles.message}
                  data-role={m.role}
                >
                  {m.content}
                </div>
              ))}

              {loading && (
                <div className={styles.message} data-role="assistant">
                  <span className={styles.typing}>
                    <i /> <i /> <i />
                  </span>
                </div>
              )}

              {error && <p className={styles.error}>{error}</p>}

              {messages.length <= 1 && !loading && (
                <div className={styles.suggestions}>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      className={styles.suggestion}
                      onClick={() => send(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              className={styles.inputRow}
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                className={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                aria-label="Message"
                disabled={loading}
              />
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={loading || !input.trim()}
                aria-label="Send"
              >
                ↑
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
