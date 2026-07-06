import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getCaseStudy,
  publishedCaseStudies,
} from "@/data/caseStudies";
import Reveal from "@/components/motion/Reveal";
import styles from "./page.module.css";

/** Pre-render every published case study at build time. */
export function generateStaticParams() {
  return publishedCaseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.title} — ${study.subtitle}`,
    description: study.summary,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study || !study.published) notFound();

  return (
    <article
      className={styles.page}
      style={{ ["--accent" as string]: study.accent }}
    >
      <div className="container">
        <Link href="/#work" className={styles.back}>
          ← All work
        </Link>

        <header className={styles.header}>
          <Reveal>
            <p className="eyebrow">
              {study.client} · {study.year}
            </p>
            <h1 className={styles.title}>{study.subtitle}</h1>
            <p className={styles.role}>{study.role}</p>
          </Reveal>

          <Reveal delay={0.1} className={styles.tags}>
            {study.disciplines.map((d) => (
              <span key={d} className={styles.tag}>
                {d}
              </span>
            ))}
          </Reveal>
        </header>

        <Reveal className={styles.cover}>
          {/* Swap for <Image> once you drop a real cover in /public */}
          <span className={styles.coverLabel}>{study.title}</span>
        </Reveal>

        <Reveal as="section" className={styles.metrics}>
          {study.metrics.map((m) => (
            <div key={m.label} className={styles.metric}>
              <span className={styles.metricValue}>{m.value}</span>
              <span className={styles.metricLabel}>{m.label}</span>
            </div>
          ))}
        </Reveal>

        <div className={styles.sections}>
          {study.sections.map((section, i) => (
            <Reveal
              as="section"
              key={section.heading}
              className={styles.section}
              delay={i * 0.05}
            >
              <h2 className={styles.sectionHeading}>{section.heading}</h2>
              <div className={styles.sectionBody}>
                {section.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <div className={styles.footerNav}>
          <Link href="/#work" className={styles.footerLink}>
            ← Back to all work
          </Link>
        </div>
      </div>
    </article>
  );
}
