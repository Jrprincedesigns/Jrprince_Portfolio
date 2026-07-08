"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { site } from "@/data/site";
import styles from "./Nav.module.css";

const COLLAPSED_W = 255; // logo-only pill (Figma 4350-1448)
const EXPANDED_W = 478; //  logo + links pill (Figma 4344-1867)
const LOGO_LEFT_COLLAPSED = 101; // (255 − logo) / 2 → centered
const LOGO_LEFT_EXPANDED = 24;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * Global glass-pill nav. On the home hero it plays the collapse→expand
 * choreography (hidden during the white intro, appears once the curtains are
 * gone, then grows). On every other page it's simply the full pill, always
 * visible, with a darker fill so it stays legible on light backgrounds.
 */
export default function Nav() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const vh = useRef(1);

  useEffect(() => {
    const set = () => {
      vh.current = window.innerHeight || 1;
    };
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  const appear = useTransform(scrollY, (v) =>
    clamp((v - 0.52 * vh.current) / (0.12 * vh.current), 0, 1)
  );
  const grow = useTransform(scrollY, (v) =>
    clamp((v - 0.66 * vh.current) / (0.7 * vh.current), 0, 1)
  );

  const width = useTransform(grow, [0, 1], [COLLAPSED_W, EXPANDED_W]);
  const logoLeft = useTransform(grow, [0, 1], [LOGO_LEFT_COLLAPSED, LOGO_LEFT_EXPANDED]);
  const linksOpacity = useTransform(grow, [0, 0.4, 1], [0, 0, 1]);
  const pointerEvents = useTransform(appear, (v) => (v > 0.5 ? "auto" : "none"));

  const logo = (
    <Image
      src="/img/logo-script.png"
      alt=""
      width={458}
      height={190}
      className={styles.logo}
      priority
    />
  );

  const links = (
    <ul className={styles.links}>
      {site.nav.map((item) => (
        <li key={item.href}>
          <a href={item.href} className={styles.link}>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );

  /** The full, always-visible pill used everywhere except the home hero. */
  const staticPill = (solid: boolean) => (
    <header className={styles.header}>
      <nav
        className={solid ? `${styles.pill} ${styles.solid}` : styles.pill}
        style={{ width: EXPANDED_W }}
        aria-label="Primary"
      >
        <Link
          href="/"
          className={styles.brand}
          style={{ left: LOGO_LEFT_EXPANDED }}
          aria-label={`${site.name} — home`}
        >
          {logo}
        </Link>
        {links}
      </nav>
    </header>
  );

  // Off the home page: darker glass so it reads on light case-study pages.
  if (pathname !== "/") return staticPill(true);
  // Home + reduced motion: full pill, no choreography.
  if (reduced) return staticPill(false);

  return (
    <motion.header
      className={styles.header}
      style={{ opacity: appear, pointerEvents }}
    >
      <motion.nav className={styles.pill} style={{ width }} aria-label="Primary">
        <motion.a
          href="#top"
          className={styles.brand}
          style={{ left: logoLeft }}
          aria-label={`${site.name} — home`}
        >
          {logo}
        </motion.a>
        <motion.ul className={styles.links} style={{ opacity: linksOpacity }}>
          {site.nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={styles.link}>
                {item.label}
              </a>
            </li>
          ))}
        </motion.ul>
      </motion.nav>
    </motion.header>
  );
}
