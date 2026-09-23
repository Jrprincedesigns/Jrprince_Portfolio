import type { CSSProperties } from "react";
import styles from "./SuperfileNarrative.module.css";

/**
 * The pay-to-access sequence across five lanes. The buyer's path (top and
 * bottom lanes) reads fast and direct; the verification that makes it safe
 * (middle lanes) sits underneath — "immediate in the interface, verified
 * underneath." Steps trace the checkout boundary in `superfileAccessMap.ts`.
 */

const COLS = ["Select", "Capture", "Charge", "Match", "Grant", "Open"];

type Kind = "visible" | "verify";
type Lane = {
  label: string;
  accent: string;
  cells: Record<number, { text: string; kind: Kind }>;
};

const LANES: Lane[] = [
  {
    label: "Recipient",
    accent: "var(--c-user)",
    cells: { 0: { text: "Selects “Pay to unlock”", kind: "visible" } },
  },
  {
    label: "Payment card",
    accent: "var(--c-user)",
    cells: { 1: { text: "Captures recipient, price & payment inputs", kind: "visible" } },
  },
  {
    label: "Stripe",
    accent: "var(--c-pay)",
    cells: { 2: { text: "Processes, then confirms server-side; the browser screen isn't proof", kind: "verify" } },
  },
  {
    label: "Superfile entitlement service",
    accent: "var(--c-verify)",
    cells: {
      3: { text: "Matches the charge to the intended recipient & file", kind: "verify" },
      4: { text: "Entitlement → Access granted", kind: "verify" },
    },
  },
  {
    label: "Protected viewer",
    accent: "var(--c-verify)",
    cells: { 5: { text: "Opens the protected session", kind: "visible" } },
  },
];

export default function SuperfileSequence() {
  return (
    <figure className={styles.root}>
      <div className={styles.panel}>
        <div className={styles.seqScroll}>
          <div className={styles.seq} role="table" aria-label="Pay-to-access sequence across five lanes">
            {/* header row */}
            <div className={`${styles.seqLaneLabel} ${styles.seqHeadCell}`} role="columnheader" />
            {COLS.map((c) => (
              <div key={c} className={`${styles.seqCell} ${styles.seqHeadCell}`} role="columnheader">
                {c}
              </div>
            ))}

            {/* lane rows */}
            {LANES.map((lane) => (
              <div key={lane.label} style={{ display: "contents" }} role="row">
                <div
                  className={styles.seqLaneLabel}
                  role="rowheader"
                  style={{ ["--lane-accent" as string]: lane.accent } as CSSProperties}
                >
                  {lane.label}
                  <span className={styles.seqLaneAccent}>lane</span>
                </div>
                {COLS.map((_, ci) => {
                  const cell = lane.cells[ci];
                  return (
                    <div key={ci} className={styles.seqCell} role="cell">
                      {cell && (
                        <div
                          className={`${styles.seqStep} ${
                            cell.kind === "visible" ? styles.seqVisible : styles.seqVerify
                          }`}
                          style={{ ["--step-accent" as string]: lane.accent } as CSSProperties}
                        >
                          {cell.text}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.seqBadgeRow}>
          <span className={styles.seqBadge}>
            <span className={styles.swatchVisible} /> Immediate in the interface
          </span>
          <span className={styles.seqBadge}>
            <span className={styles.swatchVerify} /> Verified underneath
          </span>
        </div>
      </div>
      <figcaption className={styles.caption}>
        Immediate in the interface. Verified underneath. Throughout, the owner remains able
        to monitor the entitlement or revoke it — the buyer’s fast path never removes the
        owner’s control.
      </figcaption>
    </figure>
  );
}
