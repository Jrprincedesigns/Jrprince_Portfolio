import styles from "./SuperfileNarrative.module.css";

/**
 * Access is not ownership. This matrix separates what each actor can do after a
 * purchase. Only supported capabilities are marked; Stripe performs no
 * file-access actions, and Superfile enforces every capability without ever
 * standing in as the owner or the viewer.
 */

type Val = "yes" | "no" | "enforces";

const COLS = [
  { key: "owner", label: "File owner", cls: styles.colOwner },
  { key: "active", label: "Recipient · active", cls: "" },
  { key: "none", label: "Recipient · no access", cls: "" },
  { key: "stripe", label: "Stripe", cls: styles.colStripe },
  { key: "superfile", label: "Superfile system", cls: styles.colSuperfile },
] as const;

const ROWS: { label: string; vals: Val[] }[] = [
  { label: "View file", vals: ["yes", "yes", "no", "no", "enforces"] },
  { label: "Download or export", vals: ["yes", "yes", "no", "no", "enforces"] },
  { label: "Share access", vals: ["yes", "no", "no", "no", "enforces"] },
  { label: "Monitor activity", vals: ["yes", "no", "no", "no", "enforces"] },
  { label: "Set access duration", vals: ["yes", "no", "no", "no", "enforces"] },
  { label: "Revoke access", vals: ["yes", "no", "no", "no", "enforces"] },
  { label: "Change protection settings", vals: ["yes", "no", "no", "no", "enforces"] },
];

function Cell({ v }: { v: Val }) {
  if (v === "yes")
    return (
      <>
        <span className={`${styles.cellGlyph} ${styles.cellYes}`} aria-hidden="true">✓</span>
        <span className={styles.srOnly}>Yes</span>
      </>
    );
  if (v === "enforces")
    return (
      <>
        <span className={`${styles.cellGlyph}`} style={{ color: "var(--c-state)" }} aria-hidden="true">◆</span>
        <span className={styles.srOnly}>Enforces</span>
      </>
    );
  return (
    <>
      <span className={`${styles.cellGlyph} ${styles.cellNo}`} aria-hidden="true">—</span>
      <span className={styles.srOnly}>No</span>
    </>
  );
}

export default function SuperfilePermissions() {
  return (
    <figure className={styles.root}>
      <div className={styles.matrixScroll}>
        <table className={styles.matrix}>
          <caption>Access vs. ownership — what each actor can do after a purchase</caption>
          <thead>
            <tr>
              <th scope="col">Capability</th>
              {COLS.map((c) => (
                <th scope="col" key={c.key} className={c.cls}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.label}>
                <th scope="row">{r.label}</th>
                {r.vals.map((v, i) => (
                  <td key={COLS[i].key}>
                    <Cell v={v} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.matrixKey} aria-hidden="true">
        <span>
          <span className={styles.cellYes}>✓</span> can do
        </span>
        <span>
          <span style={{ color: "var(--c-state)" }}>◆</span> Superfile enforces
        </span>
        <span>
          <span className={styles.cellNo}>—</span> cannot
        </span>
      </div>
      <figcaption className={styles.caption}>
        Paying for access never conferred ownership. The owner keeps every control; a
        recipient with active access can only view and download within the entitlement;
        Stripe performs <em>no</em> file-access action; Superfile enforces each capability
        without ever becoming the owner.
      </figcaption>
    </figure>
  );
}
