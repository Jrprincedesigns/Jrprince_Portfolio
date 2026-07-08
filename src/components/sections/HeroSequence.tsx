"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import NextImage from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { site } from "@/data/site";
import { hero, scrollVideo } from "@/data/home";
import Crown from "@/components/ui/Crown";
import styles from "./HeroSequence.module.css";

const { basePath, frameCount: N, ext, pad } = scrollVideo;

/* Scroll-progress checkpoints for the choreography (0 → 1 across the pin). */
const SPLASH_OUT = [0, 0.05, 0.11] as const; //  splash titles hold then fade
const CURTAIN = [0.09, 0.26] as const; //         white curtains part
const COMP_IN = [0.2, 0.32] as const; //          hero composition fades in
const SCRUB = [0.27, 0.98] as const; //           video scrubs once the white is gone

export default function HeroSequence() {
  const reduced = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const srcs = useMemo(
    () =>
      Array.from(
        { length: N },
        (_, i) => `${basePath}/frame-${String(i).padStart(pad, "0")}.${ext}`
      ),
    []
  );

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });
  // Snappy spring: enough to smooth the curtains/fades without trailing scroll.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 380,
    damping: 44,
    mass: 0.12,
  });

  const splashOpacity = useTransform(smooth, [...SPLASH_OUT], [1, 1, 0]);
  const splashScale = useTransform(smooth, [0, SPLASH_OUT[2]], [1, 0.96]);
  const curtainTopY = useTransform(smooth, [...CURTAIN], ["0%", "-100%"]);
  const curtainBottomY = useTransform(smooth, [...CURTAIN], ["0%", "100%"]);
  const compOpacity = useTransform(smooth, [...COMP_IN], [0, 1]);
  const cueOpacity = useTransform(smooth, [0, 0.06], [1, 0]);

  /** Draw a frame index, cover-fitting into the canvas. */
  const draw = useCallback((frame: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const imgs = imagesRef.current;
    const f = Math.max(0, Math.min(N - 1, frame));
    let img: HTMLImageElement | undefined = imgs[f];
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
  }, []);

  const scheduleDraw = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      draw(frameRef.current);
    });
  }, [draw]);

  // Preload frames (skip the heavy work when the sequence is disabled).
  useEffect(() => {
    if (reduced) return;
    let alive = true;
    const imgs = srcs.map((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      img.onload = img.onerror = () => {
        if (alive) scheduleDraw();
      };
      return img;
    });
    imagesRef.current = imgs;
    return () => {
      alive = false;
    };
  }, [srcs, scheduleDraw, reduced]);

  // Size the canvas backing store to display size × DPR.
  useEffect(() => {
    if (reduced) return;
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
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw, reduced]);

  // Map raw scroll → frame during the scrub window (no spring = no trailing).
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduced) return;
    const t = Math.min(1, Math.max(0, (v - SCRUB[0]) / (SCRUB[1] - SCRUB[0])));
    frameRef.current = Math.round(t * (N - 1));
    scheduleDraw();
  });

  const composition = (
    <>
      <p className={styles.tagline}>{site.tagline}</p>

      <h1 className={styles.wordmark}>
        <span className={styles.brandWord}>
          <span className={styles.lead}>{site.wordmark.lead}</span>
          <span className={styles.mid}>
            PR
            <span className={styles.crownLetter}>
              I
              <Crown className={styles.crown} />
            </span>
            NCE
          </span>
        </span>{" "}
        <span className={styles.tail}>{site.wordmark.tail}</span>
      </h1>

      <div className={styles.sideLeft} aria-hidden="true">
        <span className={styles.sideLine} />
        <span className={styles.sideText}>{hero.sideLabel}</span>
      </div>

      <div className={styles.sideRight}>
        <span className={styles.sideLine} />
        <span className={styles.sideText}>{site.location}</span>
        <span className={styles.pulse} />
        <span className={styles.sideText}>{site.availability}</span>
      </div>

      <div className={styles.introBlock}>
        <div className={styles.introHead}>
          <span className={styles.introTitle}>{hero.eyebrow}</span>
          <span className={styles.introRule} />
        </div>
        <p className={styles.introBody}>{hero.intro}</p>
      </div>
    </>
  );

  // Reduced-motion / no-JS friendly static hero.
  if (reduced) {
    return (
      <section id="top" className={styles.staticHero}>
        <div className={styles.bg}>
          <NextImage
            src={hero.portrait}
            alt="Portrait of Lennox Prince"
            fill
            priority
            quality={95}
            sizes="100vw"
            className={styles.portrait}
          />
          <div className={styles.scrim} aria-hidden="true" />
        </div>
        <div className={styles.staticComp}>{composition}</div>
      </section>
    );
  }

  return (
    <section
      ref={wrapperRef}
      id="top"
      className={styles.wrapper}
      aria-label="Intro"
    >
      <div className={styles.sticky}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.scrim} aria-hidden="true" />

        <motion.div className={styles.comp} style={{ opacity: compOpacity }}>
          {composition}
        </motion.div>

        {/* White curtains that part to reveal the portrait */}
        <motion.div className={styles.curtainTop} style={{ y: curtainTopY }} />
        <motion.div className={styles.curtainBottom} style={{ y: curtainBottomY }} />

        {/* Splash titles on the white */}
        <motion.div
          className={styles.splash}
          style={{ opacity: splashOpacity, scale: splashScale }}
        >
          <p className={styles.splashMark}>
            <span className={styles.sLead}>LENX</span>
            <span className={styles.sThin}>PRINCE</span>
            <sup className={styles.sReg}>®</sup>
            <span className={styles.sTail}>&nbsp;DESIGN.</span>
          </p>
          <p className={styles.splashSub}>
            Design thought with aesthetics
            <span className={styles.subLine} />
          </p>
        </motion.div>

        <motion.div
          className={styles.scrollCue}
          style={{ opacity: cueOpacity }}
          aria-hidden="true"
        >
          Scroll
        </motion.div>
      </div>
    </section>
  );
}
