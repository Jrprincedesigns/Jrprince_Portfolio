"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { work } from "@/data/home";
import styles from "./Work.module.css";

/**
 * Three-up work grid. Each card is a tinted placeholder block until you drop in
 * real project imagery (swap the .cover div for next/image).
 */
export default function Work() {
  return (
    <section className={styles.work} id="work">
      <div className="container">
        <div className={styles.grid}>
          {work.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={item.href} className={styles.card}>
                <div
                  className={styles.cover}
                  style={{ ["--tint" as string]: item.accent ?? "#333" }}
                  aria-hidden
                />
                <div className={styles.meta}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.subtitle}>{item.subtitle}</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
