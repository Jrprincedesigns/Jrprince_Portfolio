"use client";

import { useEffect, useState } from "react";
import type { CaseChapter } from "@/data/caseStudyContent";
import styles from "./CaseStudy.module.css";

/**
 * Sticky chapter rail for flagship case studies. Anchor links work without JS;
 * the IntersectionObserver only adds the active-state highlight.
 */
export default function ChapterNav({ chapters }: { chapters: CaseChapter[] }) {
  const [active, setActive] = useState(chapters[0]?.id ?? "");
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    let frame = 0;

    // Active chapter = the last section whose top has crossed a reading line
    // (~40% down the viewport). Defaults to the first chapter when scrolled
    // above it — so clicking the first dot (which scrolls it to the top,
    // above any center band) still highlights correctly.
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const line = vh * 0.4;
      let current = chapters[0]?.id ?? "";
      for (const c of chapters) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top - line <= 1) current = c.id;
      }
      setActive(current);

      // The rail sits at the vertical centre; flip its dots to light whenever a
      // dark section (banner/footer) is what's behind it there.
      const mid = vh / 2;
      let dark = false;
      document.querySelectorAll("[data-cs-dark]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) dark = true;
      });
      setOnDark(dark);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [chapters]);

  return (
    <nav
      className={onDark ? `${styles.chapterNav} ${styles.onDark}` : styles.chapterNav}
      aria-label="Chapters"
    >
      <ul>
        {chapters.map((c) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              className={styles.chapterLink}
              data-active={active === c.id ? "true" : undefined}
              aria-current={active === c.id ? "true" : undefined}
            >
              <span className={styles.chapterDot} />
              <span className={styles.chapterLabel}>{c.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
