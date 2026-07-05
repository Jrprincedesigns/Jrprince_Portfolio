"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { site } from "@/data/site";
import {
  staggerContainer,
  staggerItem,
} from "@/components/motion/motion";
import styles from "./Hero.module.css";

/**
 * Landing hero. The headline animates in word-by-word via a stagger, setting
 * the motion tone for the whole site on first paint.
 */
export default function Hero() {
  const headline = site.tagline;

  return (
    <section className={styles.hero}>
      <div className="container">
        <motion.div
          className={styles.inner}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.p className={styles.eyebrow} variants={staggerItem}>
            {site.role} · {site.location}
          </motion.p>

          <h1 className={styles.headline} aria-label={headline}>
            {headline.split(" ").map((word, i) => (
              <motion.span
                key={i}
                className={styles.word}
                variants={staggerItem}
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </h1>

          <motion.p className={styles.lead} variants={staggerItem}>
            {site.description}
          </motion.p>

          <motion.div className={styles.actions} variants={staggerItem}>
            <Link href="#work" className={styles.primary}>
              View work
            </Link>
            <Link href="/about" className={styles.secondary}>
              About me
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        className={styles.orb}
        animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  );
}
