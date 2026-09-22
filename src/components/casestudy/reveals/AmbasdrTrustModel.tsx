import type { CSSProperties } from "react";
import styles from "./AmbasdrDiagrams.module.css";

/**
 * The trust model: representation is a trust problem, so authority stays with
 * the owner. The owner defines what's true; the AI represents them from that
 * knowledge and admits what it doesn't know; visitors ask questions; every gap
 * becomes feedback that improves the profile. Drawn from the case study's four
 * trust questions and the "users remain the source of truth" principle.
 */

const OWNER = [
  "Defines what's accurate & what matters",
  "Sets tone and what stays private",
  "Remains the source of truth",
];
const VISITOR = [
  "Asks questions; conversation is the interface",
  "Gets answers grounded in the real person",
  "Sees the AI admit what it doesn't know",
];
const QUESTIONS = [
  { q: "Accuracy", t: "Can the AI represent me accurately?" },
  { q: "Control", t: "Can I control what it knows?" },
  { q: "Trust", t: "Can visitors trust the answers?" },
  { q: "Improvement", t: "Can I keep improving how I come across?" },
];

export default function AmbasdrTrustModel() {
  return (
    <figure className={styles.root}>
      <div className={styles.panel}>
        <p className={styles.eyebrow}>The trust model</p>
        <div className={styles.trust}>
          <section
            className={`${styles.tCard} ${styles.trustOwner}`}
            style={{ ["--t-accent" as string]: "var(--cs-accent, #4ea37c)" } as CSSProperties}
          >
            <div className={styles.tRole}>
              Authority · <strong>Owner</strong>
            </div>
            <ul className={styles.tList}>
              {OWNER.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          <section className={`${styles.tCard} ${styles.trustCore}`}>
            <span className={styles.coreKicker}>Represents, never invents</span>
            <strong className={styles.coreTitle}>Ambasdr AI</strong>
            <span className={styles.coreSub}>
              Answers from the owner’s knowledge, in their voice, and says so when it
              doesn’t know, rather than guessing.
            </span>
          </section>

          <section
            className={`${styles.tCard} ${styles.trustVisitor}`}
            style={{ ["--t-accent" as string]: "color-mix(in srgb, var(--cs-ink) 45%, transparent)" } as CSSProperties}
          >
            <div className={styles.tRole}>
              Audience · <strong>Visitor</strong>
            </div>
            <ul className={styles.tList}>
              {VISITOR.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          <div className={styles.trustLoop}>
            <span className={styles.loopMark} aria-hidden="true">↺</span>
            <span>
              <b>Feedback loop:</b> every unanswered question becomes a prompt for the owner
              to add context, so the profile gets better the more it’s used.
            </span>
          </div>
        </div>

        <div className={styles.questions}>
          {QUESTIONS.map((q) => (
            <div key={q.q} className={styles.question}>
              <span>{q.q}</span>
              {q.t}
            </div>
          ))}
        </div>
      </div>
      <figcaption className={styles.caption}>
        Every major feature traces back to four questions. Representation is a{" "}
        <em>trust</em> problem: the owner stays the source of truth, the AI represents rather
        than generates, and gaps feed back instead of becoming wrong answers.
      </figcaption>
    </figure>
  );
}
