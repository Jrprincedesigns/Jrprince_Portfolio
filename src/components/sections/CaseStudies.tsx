import { caseStudies } from "@/data/home";
import Crown from "@/components/ui/Crown";
import CaseStudyCard from "@/components/CaseStudyCard/CaseStudyCard";
import styles from "./CaseStudies.module.css";

/**
 * Case Studies — a three-up grid of colour-themed project cards. Each card is
 * the composed design rendered as one artwork; CaseStudyCard adds the hover
 * notch carrying that study's headline result.
 */
export default function CaseStudies() {
  return (
    <section id="case-studies" className={styles.section}>
      <header className={styles.head}>
        <Crown className={styles.crown} />
        <h2 className={styles.title}>Case Studies</h2>
      </header>

      <ul className={styles.grid}>
        {caseStudies.map((cs) => (
          <li key={cs.slug}>
            <CaseStudyCard study={cs} />
          </li>
        ))}
      </ul>
    </section>
  );
}
