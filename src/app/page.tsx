import Link from "next/link";
import { site } from "@/data/site";
import { publishedCaseStudies } from "@/data/caseStudies";
import CaseStudyCard from "@/components/CaseStudyCard/CaseStudyCard";
import Reveal from "@/components/motion/Reveal";
import Hero from "./_home/Hero";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="work" className={styles.work}>
        <div className="container">
          <Reveal className={styles.sectionHead}>
            <p className="eyebrow">Selected work</p>
            <h2 className={styles.sectionTitle}>
              Four projects, from problem to pixels in motion.
            </h2>
          </Reveal>

          <div className={styles.grid}>
            {publishedCaseStudies.map((study, i) => (
              <CaseStudyCard key={study.slug} study={study} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.about}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">About</p>
            <p className={styles.aboutText}>{site.description}</p>
            <Link href="/about" className={styles.aboutLink}>
              More about me →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
