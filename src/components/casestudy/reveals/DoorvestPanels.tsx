"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { easeOut } from "@/components/motion/motion";
import styles from "./DoorvestPanels.module.css";

const B = "/img/cases/doorvest";

/**
 * The problem-space media, rebuilt in code from the Figma composition so it
 * animates instead of sitting as a flat export with dead space. A statement
 * card rises into a soft panel on the left (with an app window auto-scrolling
 * its listings behind it); the ownership dashboard on its sunset field holds
 * the right. Reduced motion: the global rule freezes the CSS scroll, and the
 * rise-in is opted out here (`data-reveal` also forces it visible).
 */
export default function DoorvestPanels({ caption }: { caption?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();

  const rise = {
    initial: reduce ? false : { opacity: 0, y: 44 },
    animate: reduce
      ? { opacity: 1, y: 0 }
      : inView
        ? { opacity: 1, y: 0 }
        : { opacity: 0, y: 44 },
  };

  return (
    <figure className={styles.figure}>
      <div className={styles.grid} ref={ref}>
        <div className={styles.left}>
          {/* App window with the marketplace auto-scrolling behind the card */}
          <div className={styles.window} aria-hidden="true">
            <div className={styles.chrome}>
              <span />
              <span />
              <span />
            </div>
            <div className={styles.viewport}>
              <div className={`${styles.scroller} ${inView ? styles.run : ""}`}>
                <Image
                  src={`${B}/marketplace.png`}
                  alt=""
                  width={3840}
                  height={2160}
                  sizes="(max-width: 900px) 88vw, 560px"
                  className={styles.scrollImg}
                />
                <Image
                  src={`${B}/marketplace.png`}
                  alt=""
                  width={3840}
                  height={2160}
                  sizes="(max-width: 900px) 88vw, 560px"
                  className={styles.scrollImg}
                />
              </div>
            </div>
          </div>

          <motion.div
            className={styles.statement}
            data-reveal=""
            initial={rise.initial}
            animate={rise.animate}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.12 }}
          >
            <Image
              src={`${B}/panel-statement.png`}
              alt=""
              width={1000}
              height={320}
              sizes="(max-width: 900px) 72vw, 420px"
              className={styles.statementImg}
            />
          </motion.div>
        </div>

        <div className={styles.right}>
          <Image
            src={`${B}/panel-dashboard.png`}
            alt=""
            width={1368}
            height={2012}
            sizes="(max-width: 900px) 100vw, 600px"
            className={styles.rightImg}
          />
        </div>
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
