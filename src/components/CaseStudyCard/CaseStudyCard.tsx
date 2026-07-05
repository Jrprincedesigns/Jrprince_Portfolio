"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { PointerEvent } from "react";
import type { CaseStudy } from "@/data/caseStudies";
import styles from "./CaseStudyCard.module.css";

// A motion-enabled Link so we can drive `rotateX`/`rotateY` motion values.
const MotionLink = motion.create(Link);

interface CaseStudyCardProps {
  study: CaseStudy;
  index: number;
}

/**
 * A case-study card with a subtle 3D tilt that follows the cursor — an
 * interaction-design flourish that rewards hovering without being noisy.
 * On touch devices (no hover) it stays flat.
 */
export default function CaseStudyCard({ study, index }: CaseStudyCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 20,
  });

  function handlePointerMove(e: PointerEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.article
      className={styles.wrap}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <MotionLink
        href={`/work/${study.slug}`}
        className={styles.card}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ rotateX, rotateY }}
        aria-label={`${study.title}: ${study.subtitle}`}
      >
        <div
          className={styles.cover}
          style={{ ["--accent" as string]: study.accent }}
        >
          {/* Replace this placeholder block with next/image once you add assets:
              <Image src={study.cover.src} alt={study.cover.alt} fill /> */}
          <span className={styles.coverLabel}>{study.title}</span>
        </div>

        <div className={styles.body}>
          <div className={styles.meta}>
            <span>{study.client}</span>
            <span>{study.year}</span>
          </div>
          <h3 className={styles.title}>{study.subtitle}</h3>
          <ul className={styles.tags}>
            {study.disciplines.slice(0, 3).map((d) => (
              <li key={d} className={styles.tag}>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </MotionLink>
    </motion.article>
  );
}
