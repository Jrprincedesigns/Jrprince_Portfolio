import Section from "@/components/Section/Section";
import { testimonials } from "@/data/home";
import styles from "./Testimonials.module.css";

/**
 * Horizontally-scrolling testimonial cards, matching the reference. On mobile
 * this becomes a swipeable row.
 */
export default function Testimonials() {
  return (
    <Section label="In their words" id="testimonials">
      <div className={styles.scroller}>
        {testimonials.map((t, i) => (
          <figure key={i} className={styles.card}>
            <blockquote className={styles.quote}>“{t.quote}”</blockquote>
            <figcaption className={styles.author}>
              <span className={styles.name}>{t.author}</span>
              <span className={styles.role}>{t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
