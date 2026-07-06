import Section from "@/components/Section/Section";
import { contactSuggestions } from "@/data/home";
import styles from "./ContactChat.module.css";

/**
 * Contact section styled as an inline chat, matching the reference.
 *
 * This is a STATIC shell for now — the layout and look only. In the next pass
 * we'll wire it to POST /api/chat (Gemini) so the suggestion chips and input
 * actually drive a conversation grounded in the case studies.
 */
export default function ContactChat() {
  return (
    <Section label="Contact" id="contact">
      <div className={styles.panel}>
        <div className={styles.thread}>
          <div className={styles.avatar} aria-hidden>
            ✦
          </div>
          <div className={styles.bubble}>Hey! What would you like to know?</div>
        </div>

        <div className={styles.suggestions}>
          {contactSuggestions.map((s) => (
            <button key={s} className={styles.chip} type="button">
              {s}
            </button>
          ))}
        </div>

        <form
          className={styles.inputRow}
          // TODO: wire to /api/chat in the next pass.
        >
          <div className={styles.socials} aria-hidden>
            <span className={styles.social}>X</span>
            <span className={styles.social}>✉</span>
            <span className={styles.social}>in</span>
          </div>
          <input
            className={styles.input}
            placeholder="Message…"
            aria-label="Message"
          />
        </form>
      </div>
    </Section>
  );
}
