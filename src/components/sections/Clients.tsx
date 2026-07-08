import { clients } from "@/data/home";
import styles from "./Clients.module.css";

/**
 * Clients — a wrapping row of names, each with its linked URL beneath, framed
 * by a hairline on the dark closing gradient.
 */
export default function Clients() {
  return (
    <section id="clients" className={styles.section}>
      <div className={styles.row}>
        <p className={styles.label}>Clients</p>
        <ul className={styles.list}>
          {clients.map((c) => (
            <li key={c.name} className={styles.client}>
              <span className={styles.name}>{c.name}</span>
              <a
                className={styles.url}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {c.url}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
