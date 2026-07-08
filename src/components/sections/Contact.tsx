import { contact } from "@/data/home";
import { site } from "@/data/site";
import styles from "./Contact.module.css";

/**
 * Contact — an inline chat shell that closes the page. Static for now (layout
 * only); the suggestion chips and input are the future home of the Gemini
 * assistant (POST /api/chat), wired in a later pass.
 */
export default function Contact() {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.row}>
        <p className={styles.label}>Contact</p>
        <div className={styles.card}>
          <div className={styles.thread}>
            <span className={styles.spark} aria-hidden="true">
              ✦
            </span>
            <p className={styles.greeting}>{contact.greeting}</p>
          </div>

          <ul className={styles.suggestions}>
            {contact.suggestions.map((s) => (
              <li key={s}>
                <button type="button" className={styles.chip}>
                  {s}
                </button>
              </li>
            ))}
          </ul>

          <form className={styles.inputRow} aria-label="Message Lennox">
            <div className={styles.socials}>
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className={styles.social}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.short}
                </a>
              ))}
            </div>
            <input
              className={styles.input}
              placeholder="Message…"
              aria-label="Message"
            />
          </form>
        </div>
      </div>
    </section>
  );
}
