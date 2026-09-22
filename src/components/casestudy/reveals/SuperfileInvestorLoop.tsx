import styles from "./SuperfileNarrative.module.css";

/**
 * What investors actually operated — a complete control loop they ran
 * themselves, not a prototype they watched. Paired with an explicit boundary
 * between what that validated and what it did not, so the demo is never
 * mistaken for creator validation or a cause of the fundraise.
 */

const STEPS = [
  "Purchase access",
  "View the protected file",
  "Monitor who has access",
  "Observe attempted sharing",
  "Revoke access live",
];

const VALIDATED = [
  "The end-to-end flow functioned",
  "The model was understandable to investors",
  "Access could be monitored and revoked live",
];

const NOT_YET = [
  "Creator adoption",
  "Buyer comprehension at scale",
  "Conversion",
  "Retention",
  "Marketplace behavior",
];

export default function SuperfileInvestorLoop() {
  return (
    <figure className={styles.root}>
      <div className={styles.panel}>
        <ol className={styles.loop} aria-label="The control loop investors operated">
          {STEPS.map((s, i) => (
            <li key={s} className={styles.loopStep}>
              <span className={styles.loopNum}>{i + 1}</span>
              <span className={styles.loopLabel}>{s}</span>
            </li>
          ))}
        </ol>
        <p className={styles.loopBack}>
          Investors operated the complete control loop themselves — they did not only watch a
          prototype or read a technical diagram.
        </p>
      </div>

      <div className={styles.boundary}>
        <section className={`${styles.boundaryCol} ${styles.boundaryValidated}`}>
          <h3 className={styles.boundaryHead}>Validated</h3>
          <ul className={styles.boundaryList}>
            {VALIDATED.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </section>
        <section className={`${styles.boundaryCol} ${styles.boundaryOpen}`}>
          <h3 className={styles.boundaryHead}>Not yet validated</h3>
          <ul className={styles.boundaryList}>
            {NOT_YET.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </section>
      </div>
      <figcaption className={styles.caption}>
        A working loop, operated end to end — evidence the system was legible and operable,
        not a claim about adoption, conversion, or the raise.
      </figcaption>
    </figure>
  );
}
