"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./AmbasdrScrollVideo.module.css";

/**
 * Ambasdr "business card → conversational identity" sequence (Figma slide
 * 2466:13108). A short clip of two people exchanging a paper business card
 * plays once when the block scrolls into view. 0.5s before the clip ends, the
 * Ambasdr profile card slides up from below and the video blurs behind it —
 * the old handoff giving way to the conversational identity layer.
 *
 * Layout mirrors the Figma 16:9 slide: the video is inset (matching the
 * white margins), the profile card is taller than the video and rises into
 * the margins. Everything is positioned in percentages so it scales cleanly.
 */

const B = "/img/cases/ambasdr";
const LEAD = 0.5; // seconds before the video ends to start the card

export default function AmbasdrScrollVideo({ caption }: { caption?: string }) {
  const slideRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Play once, when the block scrolls into view.
  useEffect(() => {
    if (reduce) {
      setRevealed(true); // static end-state, no autoplay
      return;
    }
    const slide = slideRef.current;
    const video = videoRef.current;
    if (!slide || !video) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            video.play().catch(() => setRevealed(true)); // autoplay blocked
          }
        }
      },
      { threshold: 0.55 }
    );
    io.observe(slide);
    return () => io.disconnect();
  }, [reduce]);

  // Start the card 0.5s before the clip finishes.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => {
      if (video.duration && video.currentTime >= video.duration - LEAD) {
        setRevealed(true);
      }
    };
    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, []);

  return (
    <figure className={styles.figure}>
      <div ref={slideRef} className={styles.slide} data-revealed={revealed}>
        <div className={styles.videoWrap}>
          <video
            ref={videoRef}
            className={styles.video}
            muted
            playsInline
            preload="auto"
            poster={`${B}/handoff-poster.jpg`}
            aria-hidden="true"
          >
            <source src={`${B}/handoff.webm`} type="video/webm" />
            <source src={`${B}/handoff.mp4`} type="video/mp4" />
          </video>
        </div>
        <div className={styles.card}>
          <Image
            src={`${B}/identity-card.png`}
            alt=""
            width={436}
            height={1012}
            sizes="(max-width: 900px) 32vw, 300px"
            className={styles.cardImg}
          />
        </div>
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
