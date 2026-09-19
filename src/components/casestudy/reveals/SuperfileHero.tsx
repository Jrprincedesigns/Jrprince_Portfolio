"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import styles from "./SuperfileHero.module.css";

const B = "/img/cases/superfile";
const SRC =
  "https://uuataiyaotpgtyibulqv.supabase.co/storage/v1/object/public/sitemedia/mmrcj2p1cl01bqu.mp4";
const POSTER =
  "https://uuataiyaotpgtyibulqv.supabase.co/storage/v1/object/public/sitemedia/mmrcj2p1cl01bqu-poster.jpg";

/**
 * The SuperFile intro clip playing inside a studio-display mockup (monitor on a
 * lime field). The video is positioned over the mockup's screen area — measured
 * as a share of the 1630×965 image — so it tracks the frame at any size.
 *
 * Accessibility: the video is decorative (aria-hidden, muted); reduced-motion
 * users get the paused poster; a pause/play control can stop the loop (WCAG
 * 2.2.2).
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
    <figure className={styles.figure}>
      <div className={styles.frame}>
        <Image
          src={`${B}/monitor.png`}
          alt="The SuperFile product shown on a studio display"
          fill
          quality={95}
          sizes="(max-width: 1320px) 100vw, 1280px"
          className={styles.mockup}
        />
        <div className={styles.screen}>
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
          <button
            type="button"
            className={styles.toggle}
            onClick={toggle}
            aria-label={playing ? "Pause video" : "Play video"}
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
        </div>
      </div>
    </figure>
  );
}
