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
 * About page. The bio is Lennox's own, lightly edited; Focus and Tools are
 * drawn from the work the case studies actually document.
 */
export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">About</p>
          <h1 className={styles.title}>
            I design the system first, then the details that make it feel
            intuitive.
          </h1>
        </Reveal>

        <Reveal delay={0.1} className={styles.body}>
          <p>
            I&apos;m {site.fullName}, a senior product designer and founder
            based in {site.location.split(",")[0]}. I work across UX, AI, and
            development, which usually means designing the logic underneath a
            product as much as the screens on top of it.
          </p>
          <p>
            My experience spans fintech, healthcare, and platforms for
            creators. I&apos;ve designed tools for investigating fraud, helped
            people navigate real estate investing, and now work on making
            Fidelity Charitable&apos;s donor platform configurable for
            financial firms. I enjoy figuring out how the whole system needs to
            work, then getting into the details that make it feel intuitive.
          </p>
          <p>
            That same curiosity drives what I build myself. As co-founder of
            Ambasdr, I design and develop a mobile app that lets people have a
            conversation with someone&apos;s professional experience. Working
            directly with AI, from shaping the interactions to implementing the
            product, has expanded how I think about design and what I can bring
            to life.
          </p>
          <p>
            The fit of an outfit, the balance of colors, the way light falls on
            someone&apos;s face: those things get my attention. Photography
            through Lenxprince gives me another way to explore expression and
            identity, and that eye follows me into product work. I want what I
            make to work well, feel thoughtful, and have some character,
            whether I&apos;m shaping a product, framing a portrait, or getting
            dressed for the day.
          </p>
        </Reveal>

        <Reveal delay={0.15} className={styles.grid}>
          <div className={styles.col}>
            <h2 className={styles.colTitle}>Focus</h2>
            <ul className={styles.list}>
              <li>Product design</li>
              <li>UX &amp; systems design</li>
              <li>AI product design</li>
              <li>Design systems</li>
            </ul>
          </div>
          <div className={styles.col}>
            <h2 className={styles.colTitle}>Tools</h2>
            <ul className={styles.list}>
              <li>Figma &amp; Figma Make</li>
              <li>Claude Code, Cursor, v0</li>
              <li>React &amp; React Native</li>
              <li>Prototyping &amp; front-end</li>
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
