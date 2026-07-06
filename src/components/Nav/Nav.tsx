"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { site } from "@/data/site";
import styles from "./Nav.module.css";

/**
 * Minimal nav, matching the reference: just the name, top-left. Fades in on
 * load. Add links here later if you want them.
 */
export default function Nav() {
  return (
    <motion.header
      className={styles.header}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container">
        <Link href="/" className={styles.brand}>
          {site.name}
        </Link>
      </div>
    </motion.header>
  );
}
