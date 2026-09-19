"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import styles from "./SuperfileHero.module.css";

const B = "/img/cases/superfile";
const V =
  "https://uuataiyaotpgtyibulqv.supabase.co/storage/v1/object/public/sitemedia";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  sub: string;
  cta: string | null;
  video: string;
  poster: string;
};

// The SuperFile marketing hero, recreated to play inside the display.
const SLIDES: Slide[] = [
  {
    id: "intro",
    eyebrow: "Introducing SuperFile",
    title: "Redefining how the world secures, controls, and interacts with files.",
    sub: "Every file you issue is signed with a name the world can verify — and revoke in one click.",
    cta: "Join the waitlist",
    video: "mmrcj2p1cl01bqu.mp4",
    poster: "mmrcj2p1cl01bqu-poster.jpg",
  },
  {
    id: "businesses",
    eyebrow: "For Businesses",
    title: "Every document signed with a brand the world can trust.",
    sub: ".ibm, .gartner, .nascar, .ufc, .yourbrand — provably yours, anywhere it travels.",
    cta: null,
    video: "mmrcj3ortnqreyy.mp4",
    poster: "mmrcj3ortnqreyy-poster.jpg",
  },
  {
    id: "governments",
    eyebrow: "For Governments",
    title: "Public records, verifiable anywhere they travel.",
    sub: ".gov and .mil domains, examined by human reviewers before every grant.",
    cta: null,
    video: "mmrcizzobcbopko.mp4",
    poster: "mmrcizzobcbopko-poster.jpg",
  },
  {
    id: "individuals",
    eyebrow: "For Individuals",
    title: "Your name on every file you send.",
    sub: "Revocable, provable, and yours — from a $0 verification that's never charged.",
    cta: "Reserve your @handle",
    video: "mmrciz7k676lott.mp4",
    poster: "mmrciz7k676lott-poster.jpg",
  },
];

const ADVANCE_MS = 6500;

/**
 * The SuperFile marketing slideshow playing inside a studio-display mockup: each
 * slide is a looping, muted background video with the site's eyebrow / headline
 * / subhead (and CTA where it has one). The video is positioned over the
 * mockup's screen area — measured as a share of the 1630×965 image.
 *
 * Accessibility: videos are decorative (aria-hidden, muted); the auto-advance
 * can be paused and the slides stepped through by hand (WCAG 2.2.2). It starts
 * paused for reduced-motion users (posters, no crossfade), who can still browse
 * via the dots.
 */
export default function SuperfileHero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  // Default to playing unless the user prefers reduced motion.
  useEffect(() => {
    setPlaying(!reduce);
  }, [reduce]);

  // Only the active slide's video runs.
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && playing) v.play().catch(() => {});
      else v.pause();
    });
  }, [active, playing]);

  // Auto-advance; the timer resets whenever the slide changes (incl. manual).
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(
      () => setActive((a) => (a + 1) % SLIDES.length),
      ADVANCE_MS
    );
    return () => clearTimeout(id);
  }, [playing, active]);

  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        <Image
          src={`${B}/monitor.png`}
          alt="The SuperFile website shown on a studio display"
          fill
          quality={95}
          sizes="(max-width: 1320px) 100vw, 1280px"
          className={styles.mockup}
        />

        <div
          className={styles.screen}
          role="group"
          aria-roledescription="carousel"
          aria-label="SuperFile website"
        >
          {SLIDES.map((s, i) => (
            <div
              key={s.id}
              className={`${styles.slide} ${i === active ? styles.on : ""}`}
              aria-hidden={i === active ? undefined : true}
            >
              <video
                ref={(el) => {
                  videos.current[i] = el;
                }}
                className={styles.video}
                src={`${V}/${s.video}`}
                poster={`${V}/${s.poster}`}
                muted
                loop
                playsInline
                preload={i === 0 ? "metadata" : "none"}
                aria-hidden="true"
                tabIndex={-1}
              />
              <div className={styles.scrim} aria-hidden="true" />
              <div className={styles.slideIn}>
                <span className={styles.eyebrow}>{s.eyebrow}</span>
                <h3 className={styles.title}>{s.title}</h3>
                <p className={styles.sub}>{s.sub}</p>
                {s.cta && <span className={styles.cta}>{s.cta}</span>}
              </div>
            </div>
          ))}

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            >
              {playing ? (
                <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
                  <rect x="2.5" y="1.5" width="3" height="11" rx="1" fill="currentColor" />
                  <rect x="8.5" y="1.5" width="3" height="11" rx="1" fill="currentColor" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M3 1.5v11l9-5.5z" fill="currentColor" />
                </svg>
              )}
            </button>

            <div className={styles.dots}>
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  className={`${styles.dot} ${i === active ? styles.dotOn : ""}`}
                  aria-label={`Show slide ${i + 1}: ${s.eyebrow}`}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => setActive(i)}
                >
                  <span className={styles.dotMark} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
