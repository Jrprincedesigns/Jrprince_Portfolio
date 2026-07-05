"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { site } from "@/data/site";
import styles from "./Nav.module.css";

/**
 * Sticky top navigation. The bar condenses on scroll — a small interaction
 * detail that signals the page is responsive to the user.
 */
export default function Nav() {
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setCondensed(y > 24);
  });

  return (
    <motion.header
      className={styles.header}
      data-condensed={condensed}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand} aria-label={`${site.name}, home`}>
          {site.shortName}
          <span className={styles.dot} aria-hidden />
        </Link>

        <ul className={styles.links}>
          {site.nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}
