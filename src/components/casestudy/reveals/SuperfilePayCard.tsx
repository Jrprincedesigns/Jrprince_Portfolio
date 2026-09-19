import styles from "./SuperfileDiagrams.module.css";

/**
 * The pay card, layered so the authority to grant access is separated from the
 * intent to pay — the study's "as you move up the stack, the product decides
 * more and the user controls less." Replaces the placeholder so the core
 * artifact is actually shown.
 */
export default function SuperfilePayCard() {
  return (
    <figure className={styles.figure}>
      <div className={styles.stack}>
        <div className={styles.axis} aria-hidden="true">
          <span className={styles.axisCap}>Product decides more</span>
          <span className={styles.axisLine} />
          <span className={styles.axisCap}>User controls less</span>
        </div>

        <div className={styles.layers}>
          <div className={`${styles.layer} ${styles.layer3}`}>
            <span className={styles.layerTag}>Access container</span>
            <p className={styles.layerBody}>
              Releases the file only after the charge is <em>confirmed</em> and{" "}
              <em>matched</em> to the right file and the right recipient.
            </p>
          </div>
          <div className={styles.layer}>
            <span className={styles.layerTag}>Transaction intent</span>
            <p className={styles.layerBody}>
              What is being bought, for whom, and under which permissions.
            </p>
          </div>
          <div className={styles.layer}>
            <span className={styles.layerTag}>Inputs</span>
            <p className={styles.layerBody}>Card number, cardholder name, amount.</p>
          </div>
        </div>
      </div>
      <figcaption className={styles.caption}>
        The pay card is layered so the authority to grant access is separated
        from the intent to pay — a charge alone never unlocks a file;
        confirm-and-match does.
      </figcaption>
    </figure>
  );
}
