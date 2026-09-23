import styles from "./SuperfileNarrative.module.css";

/**
 * The pay card, framed by architectural responsibility rather than by UI atoms.
 * Four layers carry a charge from raw inputs to an entitlement result — but the
 * card itself only ever captured transaction intent. Ownership, ongoing
 * entitlement, revocation, expiration, and sharing were deliberately kept out
 * of it; Superfile held those.
 */

const LAYERS = [
  {
    tag: "Entitlement result",
    body: "A confirmed, matched charge activates the entitlement, the only thing that opens the file.",
    top: true,
  },
  {
    tag: "Confirmation state",
    body: "The card reflects a “confirming” state; the browser success screen is never authoritative.",
  },
  {
    tag: "Payment intent",
    body: "What is being bought, for whom, and under which permissions.",
  },
  {
    tag: "Transaction inputs",
    body: "Card number, cardholder name, amount.",
  },
];

const CAPTURES = ["Intended recipient", "Unlock price", "Payment method", "Confirmation action"];
const NOT_AUTHORITY = ["Ownership", "Ongoing entitlement", "Revocation", "Expiration", "Sharing permissions"];

export default function SuperfilePayCard() {
  return (
    <figure className={styles.root}>
      <div className={styles.panel}>
        <div className={styles.payGrid}>
          <div className={styles.payStack}>
            <span className={styles.payAxis}>Higher in the stack, the product decides more</span>
            {LAYERS.map((l) => (
              <div key={l.tag} className={`${styles.payLayer} ${l.top ? styles.payLayerTop : ""}`}>
                <span className={styles.payLayerTag}>{l.tag}</span>
                <p className={styles.payLayerBody}>{l.body}</p>
              </div>
            ))}
          </div>

          <div className={styles.payCallouts}>
            <section className={`${styles.callout} ${styles.calloutIn}`}>
              <h3 className={styles.calloutHead}>Transaction intent — what the card captured</h3>
              <ul className={styles.calloutList}>
                {CAPTURES.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>
            <section className={`${styles.callout} ${styles.calloutOut}`}>
              <h3 className={styles.calloutHead}>Not access authority — deliberately kept out</h3>
              <ul className={styles.calloutList}>
                {NOT_AUTHORITY.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
      <figcaption className={styles.caption}>
        The payment surface captured transaction intent, not access authority. It established
        the recipient, price, and payment details before Superfile matched the confirmed
        charge to the correct file and entitlement.
      </figcaption>
    </figure>
  );
}
