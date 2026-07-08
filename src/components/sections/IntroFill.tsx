"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { introduction } from "@/data/home";
import Crown from "@/components/ui/Crown";
import styles from "./IntroFill.module.css";

const FAINT = "rgba(244, 244, 248, 0.34)";
const INK = "#0d0d10";

function Word({
  progress,
  start,
  end,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  children: string;
}) {
  const color = useTransform(progress, [start, end], [FAINT, INK]);
  return (
    <motion.span className={styles.word} style={{ color }}>
      {children}{" "}
    </motion.span>
  );
}

/**
 * Introduction — the statement fills from faint to ink word-by-word as the
 * pinned section scrolls past. Reduced-motion renders it solid.
 */
export default function IntroFill() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 38,
    mass: 0.14,
  });

  const words = (introduction.lead + introduction.body).split(/\s+/);
  const n = words.length;

  const body = (
    <div className={styles.inner}>
      <span className={styles.eyebrow}>
        <Crown className={styles.crown} />
        {introduction.eyebrow}
      </span>
      <p className={styles.display}>
        {reduced
          ? (introduction.lead + introduction.body)
          : words.map((w, i) => {
              const start = 0.06 + (i / n) * 0.74;
              const end = Math.min(start + (1 / n) * 2.4, 0.96);
              return (
                <Word key={i} progress={smooth} start={start} end={end}>
                  {w}
                </Word>
              );
            })}
      </p>
    </div>
  );

  if (reduced) {
    return (
      <section id="introduction" className={styles.staticSection}>
        {body}
      </section>
    );
  }

  return (
    <section ref={ref} id="introduction" className={styles.wrapper}>
      <div className={styles.sticky}>{body}</div>
    </section>
  );
}
