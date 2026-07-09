import { contact } from "@/data/home";
import { site } from "@/data/site";
import styles from "./Contact.module.css";
import ContactChat from "./ContactChat";

/**
 * Contact — an inline chat that closes the page. The section shell renders on
 * the server; the interactive card (ContactChat) is a client component that
 * talks to the Gemini-backed /api/chat, grounded in this portfolio's data.
 */
export default function Contact() {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.row}>
        <p className={styles.label}>Contact</p>
        <ContactChat
          greeting={contact.greeting}
          suggestions={contact.suggestions}
          socials={site.socials}
        />
      </div>
    </section>
  );
}
