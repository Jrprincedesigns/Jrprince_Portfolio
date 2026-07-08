import { approach } from "@/data/home";
import styles from "./Approach.module.css";

/**
 * Approach — six numbered principles in a three-up grid, framed by hairlines,
 * on the dark closing gradient.
 */
export default function Approach() {
  return (
    <section id="approach" className={styles.section}>
      <div className={styles.row}>
        <p className={styles.label}>Approach</p>
        <div className={styles.grid}>
          {approach.map((item) => (
            <div key={item.n} className={styles.item}>
              <span className={styles.n}>{item.n}</span>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.body}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
