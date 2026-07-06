"use client";

import { motion } from "framer-motion";
import { heroHeadline } from "@/data/home";
import styles from "./Hero.module.css";

/**
 * Full-bleed hero: a single large headline, matching the reference. The words
 * stagger in on load to set the motion tone.
 */
export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <motion.h1
          className={styles.headline}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
          }}
          aria-label={heroHeadline}
        >
          {heroHeadline.split(" ").map((word, i) => (
            <motion.span
              key={i}
              className={styles.word}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {word}&nbsp;
            </motion.span>
          ))}
        </motion.h1>
      </div>
    </section>
  );
}
