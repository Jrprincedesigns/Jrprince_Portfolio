import styles from "./AmbasdrDiagrams.module.css";

/**
 * Knowledge architecture as a living system, not a static page. What the owner
 * provides feeds a knowledge base the AI reasons over; conversations flow back
 * out as answers and insights; gaps return as prompts to add context. The lists
 * mirror the case study: profile data, files, links, resource context,
 * instructions, tone → responses, summaries, top questions, missing signals.
 */

const INPUTS = [
  "Profile data",
  "Files & links",
  "Resource context",
  "Instructions & tone",
];
const OUTPUTS = [
  "Grounded AI responses",
  "Conversation summaries",
  "Top questions & topics",
  "Signals about what's missing",
];

export default function AmbasdrKnowledge() {
  return (
    <figure className={styles.root}>
      <div className={styles.panel}>
        <p className={styles.eyebrow}>Knowledge architecture</p>
        <div className={styles.know}>
          <div className={styles.knowCol}>
            <span className={styles.knowColHead}>What the owner provides</span>
            {INPUTS.map((i) => (
              <div key={i} className={styles.knowItem}>
                {i}
              </div>
            ))}
          </div>

          <div className={styles.knowArrow} aria-hidden="true">→</div>

          <div className={styles.knowCore}>
            <span className={styles.knowCoreKicker}>Living knowledge base</span>
            <strong className={styles.knowCoreTitle}>Ambasdr reasons & represents</strong>
            <span className={styles.knowCoreSub}>
              Answers when it has enough to go on; when it doesn’t, the gap becomes feedback.
            </span>
          </div>

          <div className={styles.knowArrow} aria-hidden="true">→</div>

          <div className={styles.knowCol}>
            <span className={styles.knowColHead}>What comes back</span>
            {OUTPUTS.map((o) => (
              <div key={o} className={styles.knowItem}>
                {o}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.knowLoop}>
          <span className={styles.loopMark} aria-hidden="true">↺</span>
          <span>
            <b>It runs both ways:</b> the owner adds context, uploads a resource, or updates
            instructions, and the profile gets better the more it’s used, while insights show
            how they’re coming across and what their audience wants most.
          </span>
        </div>
      </div>
      <figcaption className={styles.caption}>
        A visitor asks; the AI answers if it has enough to go on. If it doesn’t, that gap is
        feedback, so knowledge is a <em>living</em> system that improves with every
        conversation, not a page that goes stale.
      </figcaption>
    </figure>
  );
}
