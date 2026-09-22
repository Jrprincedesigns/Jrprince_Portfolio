import type { CSSProperties } from "react";
import styles from "./SuperfileNarrative.module.css";

type Cat = "user" | "pay" | "verify" | "state" | "owner";

const ACCENT: Record<Cat, string> = {
  user: "var(--c-user)",
  pay: "var(--c-pay)",
  verify: "var(--c-verify)",
  state: "var(--c-state)",
  owner: "var(--c-owner)",
};

type Stage = { title: string; actor: string; cat: Cat; terminal?: boolean };

/**
 * The primary journey, from a protected file to an open viewer. Every stage is
 * drawn from the entitlement model documented in `superfileAccessMap.ts` — no
 * step is invented. Colour encodes who owns each stage (see the legend), so the
 * eye can follow authority moving from the buyer, through Stripe, to Superfile.
 */
const STAGES: Stage[] = [
  { title: "No access", actor: "Entitlement state", cat: "state" },
  { title: "Access requested", actor: "Recipient", cat: "user" },
  { title: "Payment initiated", actor: "Recipient", cat: "user" },
  { title: "Payment confirmed", actor: "Stripe → server", cat: "pay" },
  { title: "Recipient & file matched", actor: "Superfile verification", cat: "verify" },
  { title: "Access granted", actor: "Entitlement state", cat: "state" },
  { title: "Protected viewer opens", actor: "File-delivery service", cat: "verify", terminal: true },
];

/** Supported branches from the granted state — each one exists as a state/edge
 *  in the entitlement model; nothing here is speculative. */
const BRANCHES: { label: string; body: string; cat: Cat }[] = [
  {
    label: "Owner revokes access",
    body: "The owner can invalidate a paid entitlement; a refund is required to do so.",
    cat: "owner",
  },
  {
    label: "Access expires",
    body: "A time-limited entitlement ends at the owner-set duration; access simply stops.",
    cat: "state",
  },
  {
    label: "Payment is refunded",
    body: "A refund or chargeback automatically revokes the entitlement.",
    cat: "pay",
  },
  {
    label: "Sharing is attempted",
    body: "A shared link lands on a gated page; it never transfers the entitlement.",
    cat: "user",
  },
];

const LEGEND: { label: string; dot: string }[] = [
  { label: "Recipient actions", dot: styles.dUser },
  { label: "Payment-system events", dot: styles.dPay },
  { label: "Superfile verification", dot: styles.dVerify },
  { label: "Entitlement states", dot: styles.dState },
  { label: "Owner-control actions", dot: styles.dOwner },
];

export default function SuperfileLifecycle() {
  return (
    <figure className={`${styles.root}`}>
      <header className={styles.lifeHead}>
        <h2 className={styles.lifeTitle}>Instant for the buyer. Reversible for the owner.</h2>
        <p className={styles.lifeSub}>
          A payment moved the recipient directly into the protected viewer while the file
          owner retained the ability to monitor, limit, and revoke access.
        </p>
      </header>

      <div className={styles.panel}>
        <ol className={styles.track} aria-label="Entitlement lifecycle, from no access to an open viewer">
          {STAGES.map((s, i) => (
            <li
              key={s.title}
              className={`${styles.stage} ${s.terminal ? styles.stageTerminal : ""}`}
              style={{ ["--stage-accent" as string]: ACCENT[s.cat] } as CSSProperties}
            >
              <span className={styles.stageStep}>Step {i + 1}</span>
              <span className={styles.stageTitle}>{s.title}</span>
              <span className={styles.stageActor}>{s.actor}</span>
            </li>
          ))}
        </ol>

        <div className={styles.branchHead}>
          <h3 className={styles.branchTitle}>From the granted state</h3>
          <span className={styles.branchNote}>
            Access is a verified entitlement, not a one-time unlock — so it can still change.
          </span>
        </div>
        <ul className={styles.branches}>
          {BRANCHES.map((b) => (
            <li
              key={b.label}
              className={styles.branch}
              style={{ ["--branch-accent" as string]: ACCENT[b.cat] } as CSSProperties}
            >
              <span className={styles.branchLabel}>{b.label}</span>
              <span className={styles.branchBody}>{b.body}</span>
            </li>
          ))}
        </ul>

        <div className={styles.legend} aria-hidden="true">
          {LEGEND.map((l) => (
            <span key={l.label} className={styles.legendItem}>
              <span className={`${styles.legendDot} ${l.dot}`} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <figcaption className={styles.caption}>
        The entitlement lifecycle: payment establishes an entitlement, the entitlement
        determines access, and only a <em>verified</em> transition opens the protected
        viewer — while revoke, expiry, refund, and attempted-sharing stay live, owner-addressable states.
      </figcaption>
    </figure>
  );
}
