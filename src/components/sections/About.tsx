import Link from "next/link";
import { about } from "@/data/home";
import styles from "./About.module.css";

/**
 * About block: portrait on the left, heading + intro + bullet list on the
 * right. Swap the .portrait placeholder for a next/image of yourself.
 */
export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.portrait}>
            <span className={styles.portraitLabel}>Your photo</span>
          </div>

          <div className={styles.body}>
            <h2 className={styles.heading}>{about.heading}</h2>
            <p className={styles.intro}>{about.body}</p>
            <ul className={styles.bullets}>
              {about.bullets.map((b) => (
                <li key={b} className={styles.bullet}>
                  {b}
                </li>
              ))}
            </ul>
            <Link href="/about" className={styles.more}>
              Learn more <span aria-hidden>›</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
