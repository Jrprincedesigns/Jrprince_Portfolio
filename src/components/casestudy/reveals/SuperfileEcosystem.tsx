import styles from "./SuperfileDiagrams.module.css";

/**
 * The SuperFile ecosystem, as described in the study: the surfaces people work
 * in, the file at the centre, and the services that keep ownership provable as
 * it travels. Replaces the placeholder so the systems claim is actually shown.
 */
export default function SuperfileEcosystem() {
  return (
    <figure className={styles.figure}>
      <div className={styles.eco}>
        <div className={styles.ecoCol}>
          <span className={styles.ecoColLabel}>Where people work</span>
          <div className={styles.chip}>macOS app</div>
          <div className={styles.chip}>Web platform</div>
          <div className={styles.chip}>Secure viewers</div>
        </div>

        <div className={styles.ecoArrow} aria-hidden="true">
          →
        </div>

        <div className={styles.ecoCore}>
          <span className={styles.ecoCoreKicker}>The file</span>
          <strong className={styles.ecoCoreTitle}>Owned · signed · revocable</strong>
          <span className={styles.ecoCoreSub}>
            Control flows from the creator into the file; every viewer gets their
            own scoped permissions.
          </span>
        </div>

        <div className={styles.ecoArrow} aria-hidden="true">
          →
        </div>

        <div className={styles.ecoCol}>
          <span className={styles.ecoColLabel}>What keeps it true</span>
          <div className={styles.chip}>Payments</div>
          <div className={styles.chip}>Permissioning</div>
          <div className={styles.chip}>Ownership verification</div>
          <div className={styles.chip}>Usage tracking</div>
          <div className={styles.chip}>Accounts</div>
        </div>
      </div>
      <figcaption className={styles.caption}>
        The SuperFile ecosystem: the surfaces people work in, the file at the
        centre, and the services that keep ownership provable wherever it travels.
      </figcaption>
    </figure>
  );
}
