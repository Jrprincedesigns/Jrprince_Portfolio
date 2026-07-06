import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import Reveal from "@/components/motion/Reveal";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
};

/**
 * About page. Placeholder copy — replace with your real story, background,
 * and the tools/skills you want to highlight.
 */
export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">About</p>
          <h1 className={styles.title}>
            I design products that move — literally and figuratively.
          </h1>
        </Reveal>

        <Reveal delay={0.1} className={styles.body}>
          <p>
            I&apos;m {site.name}, a {site.role.toLowerCase()} focused on
            interaction and motion design. I care about the moments between
            screens — the transitions, the feedback, the timing that turns a
            static interface into something that feels alive and trustworthy.
          </p>
          <p>
            Replace this section with your real background: where you&apos;ve
            worked, how you approach problems, and what you&apos;re looking for
            next. Keep it human.
          </p>
        </Reveal>

        <Reveal delay={0.15} className={styles.grid}>
          <div className={styles.col}>
            <h2 className={styles.colTitle}>Focus</h2>
            <ul className={styles.list}>
              <li>Product design</li>
              <li>Interaction design</li>
              <li>Motion &amp; prototyping</li>
              <li>Design systems</li>
            </ul>
          </div>
          <div className={styles.col}>
            <h2 className={styles.colTitle}>Tools</h2>
            <ul className={styles.list}>
              <li>Figma</li>
              <li>Framer / After Effects</li>
              <li>React &amp; front-end</li>
              <li>Rive / Lottie</li>
            </ul>
          </div>
          <div className={styles.col}>
            <h2 className={styles.colTitle}>Elsewhere</h2>
            <ul className={styles.list}>
              {site.socials.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className={styles.link}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
