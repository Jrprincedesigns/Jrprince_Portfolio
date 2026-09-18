"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import styles from "./DoorvestPanels.module.css";

const B = "/img/cases/doorvest";
const STAGE_W = 1440;

/**
 * The problem-space media, a faithful port of the Figma composition
 * (node 4408:47906) laid out in its 1440×1054 coordinate space and scaled to
 * the container. Two looping motions straight from the Figma prototype cohort
 * (2s, linear, moving over the first 52.6% then holding): the Doorvest sidebar
 * slides in over the sunset (x: 0→-284), and the browser window scrolls up out
 * of the lower-left panel (y: 0→-513). The statement card is static.
 *
 * Reduced motion: render both at their revealed end-state so the content reads
 * without animating.
 */
/* Seamless loop: reveal in, hold, reveal back out, repeat — returning to the
 * start value so there's no hard snap at the loop seam. */
const LOOP = {
  duration: 5.4,
  times: [0, 0.16, 0.84, 1],
  ease: "easeInOut" as const,
  repeat: Infinity,
};

export default function DoorvestPanels({ caption }: { caption?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const apply = () =>
      canvas.style.setProperty("--s", String(stage.clientWidth / STAGE_W));
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const sidebar = reduce
    ? { x: -284, y: -3 }
    : { x: [0, -284, -284, 0], y: [0, -3, -3, 0] };
  const browser = reduce ? { y: -513 } : { y: [0, -513, -513, 0] };

  return (
    <figure className={styles.figure}>
      <div className={styles.stage} ref={stageRef}>
        <div className={styles.canvas} ref={canvasRef}>
          {/* Statement panel (static) */}
          <div
            className={styles.panel}
            style={{ left: 24, top: 24, width: 684, height: 329 }}
          >
            <Image
              src={`${B}/panel-statement.png`}
              alt=""
              width={996}
              height={312}
              quality={95}
              className={styles.statement}
              style={{ left: 103, top: 97, width: 478, height: 136 }}
              sizes="480px"
            />
          </div>

          {/* Browser panel — window scrolls up (y: 0 → -513) */}
          <div
            className={styles.panel}
            style={{ left: 24, top: 371, width: 684, height: 659, overflow: "hidden" }}
          >
            <motion.div
              className={styles.browser}
              style={{ left: 145, top: 578, width: 393, height: 712 }}
              initial={reduce ? browser : { y: 0 }}
              animate={browser}
              transition={reduce ? { duration: 0 } : LOOP}
              aria-hidden="true"
            >
              <div className={styles.chrome}>
                <span />
                <span />
                <span />
              </div>
              <Image
                src={`${B}/marketplace.png`}
                alt=""
                width={3840}
                height={2160}
                quality={95}
                className={styles.browserImg}
                sizes="480px"
              />
            </motion.div>
          </div>

          {/* Right panel — sunset field + sidebar sliding in (x: 0 → -284) */}
          <div
            className={styles.panelImg}
            style={{ left: 732, top: 24, width: 684, height: 1006 }}
          >
            <Image
              src={`${B}/panel-sunset.png`}
              alt=""
              width={1367}
              height={2012}
              quality={95}
              className={styles.sunset}
              sizes="(max-width: 900px) 100vw, 740px"
            />
            <motion.div
              className={styles.sidebar}
              style={{ left: 470, top: 59, width: 240, height: 894 }}
              initial={reduce ? sidebar : { x: 0, y: 0 }}
              animate={sidebar}
              transition={reduce ? { duration: 0 } : LOOP}
            >
              <Image
                src={`${B}/panel-sidebar.png`}
                alt="The Doorvest ownership dashboard navigation"
                width={964}
                height={3580}
                quality={95}
                className={styles.sidebarImg}
                sizes="320px"
              />
            </motion.div>
          </div>
        </div>
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
