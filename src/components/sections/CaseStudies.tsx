import Image from "next/image";
import Link from "next/link";
import { caseStudies } from "@/data/home";
import Crown from "@/components/ui/Crown";
import styles from "./CaseStudies.module.css";

/**
 * Case Studies — a three-up grid of colour-themed project cards. Each card is
 * the composed design (title, tags, mockup) rendered as one artwork, wrapped in
 * an accessible link.
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
            <Link
              href={`/work/${cs.slug}`}
              className={styles.card}
              aria-label={`${cs.title} — view case study`}
            >
              <Image
                src={cs.image}
                alt={`${cs.title}. ${cs.description}`}
                width={848}
                height={1206}
                quality={95}
                sizes="(max-width: 640px) 92vw, (max-width: 1000px) 46vw, 30vw"
                className={styles.cardImg}
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
