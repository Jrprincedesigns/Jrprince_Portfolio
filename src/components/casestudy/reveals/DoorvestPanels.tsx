"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import styles from "./DoorvestPanels.module.css";

const B = "/img/cases/doorvest";
const STAGE_W = 1440;

/**
 * The problem-space media, a port of the Figma composition (node 4408:47906)
 * laid out in its 1440×1054 coordinate space and scaled to the container. Two
 * looping motions: the browser window scrolls up out of the lower-left panel
 * (y: 0→-513), and the full Doorvest dashboard floats over the sunset with a
 * gentle vertical parallax. The statement card is static.
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

  const dashboard = reduce ? { y: 0 } : { y: [22, -8, -8, 22] };
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

          {/* Right panel — sunset field + full dashboard floating (gentle parallax) */}
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
              className={styles.dashboardCard}
              style={{ left: 32, top: 306, width: 620, height: 394 }}
              initial={reduce ? dashboard : { y: 22 }}
              animate={dashboard}
              transition={reduce ? { duration: 0 } : LOOP}
            >
              <Image
                src={`${B}/panel-dashboard.png`}
                alt="The Doorvest ownership dashboard"
                width={4226}
                height={2685}
                quality={95}
                className={styles.dashboardImg}
                sizes="(max-width: 900px) 90vw, 620px"
              />
            </motion.div>
          </div>
        </div>
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
