"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type CSSProperties } from "react";
import type { CaseImage } from "@/data/caseStudyContent";
import { easeOut } from "@/components/motion/motion";
import styles from "./HeroShowcase.module.css";

/**
 * Product-showcase hero: a framed screenshot floating on a brand-coloured band,
 * with a faded wordmark behind it. The card rises and settles into place as it
 * scrolls into view — the Figma prototype looped this, but a one-shot entrance
 * reads better on a page than an infinite bob. Reduced-motion users get the
 * settled state immediately (framer-motion's JS tween isn't covered by the
 * global CSS reduced-motion rule, so it's opted out of here explicitly).
 */
export default function HeroShowcase({
  image,
  wordmark,
  band,
}: {
  image: CaseImage;
  wordmark: string;
  band?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();

  const settled = { opacity: 1, y: 0, scale: 1 };
  const resting = { opacity: 0, y: 64, scale: 1.03 };

  return (
    <div
      className={styles.band}
      data-cs-dark
      style={band ? ({ ["--cs-band"]: band } as CSSProperties) : undefined}
    >
      <span className={styles.wordmark} aria-hidden="true">
        {wordmark}
      </span>
      <motion.div
        ref={ref}
        className={styles.card}
        data-reveal=""
        initial={reduce ? false : resting}
        animate={reduce ? settled : inView ? settled : resting}
        transition={{ duration: 0.9, ease: easeOut }}
      >
        <Image
          src={image.src}
          alt={image.alt ?? ""}
          width={image.w}
          height={image.h}
          quality={95}
          priority
          sizes="(max-width: 620px) 92vw, 560px"
          className={styles.cardImg}
        />
      </motion.div>
    </div>
  );
}
