import Link from "next/link";
import styles from "./Section.module.css";

interface SectionProps {
  /** Small label shown in the narrow left column. */
  label?: string;
  /** Optional right-aligned action, e.g. "View all". */
  action?: { label: string; href: string };
  /** Anchor id for in-page navigation. */
  id?: string;
  children: React.ReactNode;
  /** Remove the top border divider (used for the first section). */
  bare?: boolean;
}

/**
 * The layout signature of the reference site: a narrow left column holding a
 * small section label, and a wide right column holding the content. Collapses
 * to a single column on mobile.
 */
export default function Section({
  label,
  action,
  id,
  children,
  bare = false,
}: SectionProps) {
  return (
    <section id={id} className={styles.section} data-bare={bare}>
      <div className="container">
        <div className={styles.grid}>
          {(label || action) && (
            <div className={styles.aside}>
              {label && <span className={styles.label}>{label}</span>}
              {action && (
                <Link href={action.href} className={styles.action}>
                  {action.label} <span aria-hidden>›</span>
                </Link>
              )}
            </div>
          )}
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </section>
  );
}
