import type { CSSProperties } from "react";
import styles from "./SuperfileNarrative.module.css";

/**
 * Who the system served and where authority lived. Superfile sits at the centre
 * because it — not Stripe, and not the payment result — owns the entitlement.
 * Each actor's capabilities are drawn from the case study and the entitlement
 * model; nothing is attributed to an actor that the model doesn't support.
 */

const OWNER = [
  "Sets access conditions",
  "Delivers the protected file",
  "Monitors who has access",
  "Sees attempted sharing",
  "Revokes or limits access",
  "Retains ownership",
];
const RECIPIENT = [
  "Encounters a protected file",
  "Requests or purchases access",
  "Gets immediate viewership after confirmation",
  "Views within the granted entitlement",
];
const STRIPE = [
  "Processes the transaction",
  "Confirms whether payment succeeded",
  "Does not determine file ownership",
  "Does not maintain the entitlement",
];
const SUPERFILE = [
  "Matches the payment to recipient & file",
  "Grants the entitlement",
  "Enforces the current access state",
  "Records monitoring events",
  "Responds to revoke, expiry & refund",
];

export default function SuperfileActorMap() {
  return (
    <figure className={styles.root}>
      <div className={styles.panel}>
        <div className={styles.actorGrid}>
          <section
            className={`${styles.actor} ${styles.actorOwner}`}
            style={{ ["--actor-accent" as string]: "var(--c-owner)" } as CSSProperties}
          >
            <div className={styles.actorRole}>
              Authority · <strong>File owner</strong>
            </div>
            <ul className={styles.actorList}>
              {OWNER.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          <section className={`${styles.actor} ${styles.actorCore}`}>
            <span className={styles.coreKicker}>Holds authority</span>
            <strong className={styles.coreTitle}>Superfile</strong>
            <ul className={styles.actorList}>
              {SUPERFILE.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          <section
            className={`${styles.actor} ${styles.actorStripe}`}
            style={{ ["--actor-accent" as string]: "var(--c-pay)" } as CSSProperties}
          >
            <div className={styles.actorRole}>
              Payment · <strong>Stripe</strong>
            </div>
            <ul className={styles.actorList}>
              {STRIPE.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          <section
            className={`${styles.actor} ${styles.actorRecipient}`}
            style={{ ["--actor-accent" as string]: "var(--c-user)" } as CSSProperties}
          >
            <div className={styles.actorRole}>
              Buyer · <strong>Recipient</strong>
            </div>
            <ul className={styles.actorList}>
              {RECIPIENT.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          <div className={styles.actorNote}>
            <p className={styles.actorNoteText}>
              <b>Stripe confirms payment. Superfile grants access. The owner retains control.</b>
            </p>
          </div>
        </div>
      </div>
      <figcaption className={styles.caption}>
        The actor map: authority never moves to the payment processor. Stripe reports the
        charge; Superfile turns a confirmed, matched charge into an entitlement; the owner
        keeps ownership and the power to monitor and revoke.
      </figcaption>
    </figure>
  );
}
