import type { CSSProperties } from "react";
import styles from "./AmbasdrDiagrams.module.css";

/**
 * The product model as three layers: Identity, Knowledge, Conversation. This
 * was the architecture that kept the product coherent: what establishes who the
 * user is, what the AI is allowed to understand, and how a visitor explores it.
 * The username-vs-full-name rule lives in the Identity layer, where it belongs.
 */

const TIERS: { num: string; name: string; items: string[]; accent: string; note?: string }[] = [
  {
    num: "Layer 1",
    name: "Identity",
    accent: "var(--cs-accent, #4ea37c)",
    items: ["Username", "Name / company", "Positioning", "Bio & image", "Social & contact links", "Public URL"],
    note: "public",
  },
  {
    num: "Layer 2",
    name: "Knowledge",
    accent: "color-mix(in srgb, var(--cs-accent, #4ea37c) 70%, #4f7cff)",
    items: ["Experience & résumé", "Portfolio work", "Files", "Links & sites", "Highlights", "Approved content"],
  },
  {
    num: "Layer 3",
    name: "Conversation",
    accent: "color-mix(in srgb, var(--cs-ink) 45%, transparent)",
    items: ["Suggested questions", "Open questions", "Grounded answers", "File / link references", "Contact & collaboration"],
  },
];

export default function AmbasdrLayers() {
  return (
    <figure className={styles.root}>
      <div className={styles.panel}>
        <p className={styles.eyebrow}>The product model</p>
        <div className={styles.tiers}>
          {TIERS.map((t, i) => (
            <div key={t.name}>
              <div
                className={styles.tier}
                style={{ ["--tier-accent" as string]: t.accent } as CSSProperties}
              >
                <div className={styles.tierHead}>
                  <span className={styles.tierNum}>{t.num}</span>
                  <span className={styles.tierName}>{t.name}</span>
                </div>
                <div className={styles.tierItems}>
                  {t.items.map((it) => (
                    <span key={it} className={styles.tierChip}>
                      {it}
                    </span>
                  ))}
                </div>
                {t.note === "public" && (
                  <p className={styles.tierNote}>
                    One identity, two references: the profile shows <code>@username</code> publicly,
                    while the AI refers to the person by their full name or company inside an answer.
                  </p>
                )}
              </div>
              {i < TIERS.length - 1 && (
                <div className={styles.tierArrow} aria-hidden="true">↓</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <figcaption className={styles.caption}>
        Not a chatbot on a profile, but an identity system. Structured identity establishes who the
        user is, approved knowledge gives the AI something real to represent, and conversation is
        how a visitor explores it.
      </figcaption>
    </figure>
  );
}
