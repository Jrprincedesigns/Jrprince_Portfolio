"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import styles from "./ScrollVideo.module.css";

interface ScrollVideoProps {
  /** Folder under /public holding the frames, e.g. "/frames/hero". */
  basePath: string;
  /** Number of frames in the sequence. */
  frameCount: number;
  /** File extension without the dot. */
  ext?: string;
  /** Zero-padding width of the frame index, e.g. 3 → frame-007.jpg. */
  pad?: number;
  /** Total scroll distance the pin occupies (taller = slower scrub). */
  scrollHeight?: string;
  /** Overlay content (e.g. a headline) rendered over the video, pinned. */
  children?: React.ReactNode;
}

/**
 * Apple-style scroll-scrubbed "video": a sequence of image frames drawn to a
 * pinned <canvas>, where the current frame is driven by scroll position.
 *
 * Because we draw pre-decoded images instead of seeking a <video>, scrubbing is
 * smooth and bidirectional. Swap the placeholder frames in /public/frames/hero
 * for a real export (see the README in that folder) — no code change needed
 * beyond the frameCount.
 */
export default function ScrollVideo({
  basePath,
  frameCount,
  ext = "jpg",
  pad = 3,
  scrollHeight = "300vh",
  children,
}: ScrollVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  const srcs = useMemo(
    () =>
      Array.from(
        { length: frameCount },
        (_, i) => `${basePath}/frame-${String(i).padStart(pad, "0")}.${ext}`
      ),
    [basePath, frameCount, ext, pad]
  );

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });
  // Spring smoothing so the scrub eases rather than snapping frame-to-frame.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 32,
    mass: 0.35,
  });

  // Headline overlay fades out over the first third of the scrub and stays
  // gone (explicit terminal stops keep it clamped down, not rebounding).
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [1, 0, 0]);
  const overlayY = useTransform(scrollYProgress, [0, 0.3, 1], [0, -40, -40]);

  /** Draw a given frame index, cover-fitting into the canvas. */
  const draw = useCallback(
    (frame: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const imgs = imagesRef.current;
      let f = Math.max(0, Math.min(frameCount - 1, frame));
      let img: HTMLImageElement | undefined = imgs[f];
      // If the exact frame isn't decoded yet, fall back to the nearest earlier one.
      if (!img || !img.complete || !img.naturalWidth) {
        for (let k = f; k >= 0; k--) {
          const cand = imgs[k];
          if (cand && cand.complete && cand.naturalWidth) {
            img = cand;
            break;
          }
        }
      }
      if (!img || !img.naturalWidth) return;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw: number, dh: number;
      if (ir > cr) {
        dh = ch;
        dw = ch * ir;
      } else {
        dw = cw;
        dh = cw / ir;
      }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    },
    [frameCount]
  );

  const scheduleDraw = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      draw(frameRef.current);
    });
  }, [draw]);

  // Preload every frame; each decode lets us redraw the current position.
  useEffect(() => {
    let alive = true;
    let count = 0;
    const imgs = srcs.map((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      img.onload = img.onerror = () => {
        if (!alive) return;
        count += 1;
        setLoaded(count);
        scheduleDraw();
      };
      return img;
    });
    imagesRef.current = imgs;
    return () => {
      alive = false;
    };
  }, [srcs, scheduleDraw]);

  // Size the canvas backing store to the display size × DPR, and redraw.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(frameRef.current);
    };

    resize();
    setReady(true);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  // Map smoothed scroll progress → frame index and draw.
  useMotionValueEvent(smooth, "change", (v) => {
    frameRef.current = Math.round(v * (frameCount - 1));
    scheduleDraw();
  });

  const allLoaded = loaded >= frameCount;
  const pct = Math.round((loaded / frameCount) * 100);

  return (
    <section
      ref={wrapperRef}
      className={styles.wrapper}
      style={{ height: scrollHeight }}
      aria-label="Scroll-controlled intro animation"
    >
      <div className={styles.sticky}>
        <canvas ref={canvasRef} className={styles.canvas} />

        {children && (
          <motion.div
            className={styles.overlay}
            style={{ opacity: overlayOpacity, y: overlayY }}
          >
            {children}
          </motion.div>
        )}

        {/* Loader: shown until all frames are decoded so the scrub never
            reveals a missing frame. */}
        <div
          className={styles.loader}
          data-hidden={ready && allLoaded}
          aria-hidden={ready && allLoaded}
        >
          <span className={styles.loaderText}>Loading {pct}%</span>
        </div>
      </div>
    </section>
  );
}
