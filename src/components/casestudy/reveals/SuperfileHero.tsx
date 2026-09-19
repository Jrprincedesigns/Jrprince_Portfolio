"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import styles from "./SuperfileHero.module.css";

const SRC =
  "https://uuataiyaotpgtyibulqv.supabase.co/storage/v1/object/public/sitemedia/mmrcj2p1cl01bqu.mp4";
const POSTER =
  "https://uuataiyaotpgtyibulqv.supabase.co/storage/v1/object/public/sitemedia/mmrcj2p1cl01bqu-poster.jpg";

/**
 * Full-bleed cinematic product moment: a looping, muted background video with
 * the SuperFile intro copy overlaid (à la the AG3 Labs hero). The video is
 * decorative (aria-hidden) — the heading carries the meaning.
 *
 * Accessibility: reduced-motion users get the paused poster frame, never an
 * autoplaying loop; and a pause/play control is always available so the moving
 * content can be stopped (WCAG 2.2.2). Muted, so there's no audio to manage.
 */
export default function SuperfileHero() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduce) {
      v.pause();
      setPlaying(false);
      return;
    }
    const p = v.play();
    if (p && typeof p.then === "function") {
      p.then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [reduce]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section className={styles.hero} data-cs-dark aria-label="Introducing SuperFile">
      <video
        ref={ref}
        className={styles.video}
        src={SRC}
        poster={POSTER}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.inner}>
        <span className={styles.eyebrow}>Introducing SuperFile</span>
        <h2 className={styles.title}>
          Redefining how the world secures, controls, and interacts with files.
        </h2>
        <p className={styles.sub}>
          Every file you issue is signed with a name the world can verify — and
          revoke in one click.
        </p>
      </div>

      <button
        type="button"
        className={styles.toggle}
        onClick={toggle}
        aria-label={playing ? "Pause background video" : "Play background video"}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <rect x="2.5" y="1.5" width="3" height="11" rx="1" fill="currentColor" />
            <rect x="8.5" y="1.5" width="3" height="11" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 1.5v11l9-5.5z" fill="currentColor" />
          </svg>
        )}
      </button>
    </section>
  );
}
