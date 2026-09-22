import styles from "./SuperfileNarrative.module.css";

/**
 * The "states before screens" lesson, made concrete: the mental model shifted
 * from the screen as the source of truth to the entitlement as the source of
 * truth. A conceptual comparison, not a pair of fabricated product screens.
 */
export default function SuperfileReflection() {
  return (
    <figure className={styles.root}>
      <div className={styles.reflect}>
        <div className={styles.reflectCard}>
          <span className={styles.reflectTag}>Before</span>
          <p className={styles.reflectText}>“A successful payment changes the screen.”</p>
        </div>
        <span className={styles.reflectArrow} aria-hidden="true">→</span>
        <div className={`${styles.reflectCard} ${styles.reflectAfter}`}>
          <span className={styles.reflectTag}>After</span>
          <p className={styles.reflectText}>
            “A verified entitlement changes the state; the screen communicates the result.”
          </p>
        </div>
      </div>
      <figcaption className={styles.caption}>
        The interface revision was small because the important redesign happened in the model
        underneath it.
      </figcaption>
    </figure>
  );
}
