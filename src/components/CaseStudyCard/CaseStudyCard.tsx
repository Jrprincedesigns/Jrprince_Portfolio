import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/data/home";
import styles from "./CaseStudyCard.module.css";

/**
 * A case-study card in the home grid.
 *
 * The card artwork is a single composed image, so the hover notch is the one
 * piece of card content that lives in the DOM. It carries the study's headline
 * result — something the artwork does not already say — and is carved out of
 * the artwork's bottom-right corner with two concave fillets, so it reads as
 * cut from the card rather than laid on top of it.
 *
 * A study with no measured outcome renders no notch.
 */
export default function CaseStudyCard({ study }: { study: CaseStudy }) {
  const { outcome } = study;

  // The notch is the only place this result appears, and it is visual-only on
  // hover — so it goes in the link's accessible name and the rendered copy is
  // hidden, rather than being announced twice or not at all.
  const label = outcome
    ? `${study.title} — view case study. Result: ${outcome.value} ${outcome.label}.`
    : `${study.title} — view case study`;

  return (
    <Link
      href={`/work/${study.slug}`}
      className={styles.card}
      data-theme={study.theme}
      aria-label={label}
    >
      <span className={styles.frame}>
        <Image
          src={study.image}
          alt=""
          width={848}
          height={1206}
          quality={95}
          sizes="(max-width: 640px) 92vw, (max-width: 1000px) 46vw, 30vw"
          className={styles.art}
        />

        {outcome && (
          <span className={styles.notchWindow} aria-hidden="true">
            <span className={styles.notch}>
              <span className={`${styles.fillet} ${styles.filletTop}`} />
              <span className={`${styles.fillet} ${styles.filletSide}`} />
              <span className={styles.outcomeValue}>{outcome.value}</span>
              <span className={styles.outcomeLabel}>{outcome.label}</span>
            </span>
          </span>
        )}
      </span>
    </Link>
  );
}
