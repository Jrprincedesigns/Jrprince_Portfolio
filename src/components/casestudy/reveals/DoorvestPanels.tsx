"use client";

import Image from "next/image";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import styles from "./DoorvestPanels.module.css";

const B = "/img/cases/doorvest";
const STAGE_W = 1440;

/**
 * The problem-space media, a faithful port of the Figma composition
 * (node 4408:47906) laid out in its 1440×1054 coordinate space and scaled to
 * the container. Two one-shot motions that play once when the figure scrolls
 * into view (no loop): the app window rises up out of the lower-left panel
 * (y: 0→-513), and the Doorvest dashboard — placed at its NATIVE 1408×894 size
 * (node 4408:47913) at x:470 so only its sidebar peeks past the clipping panel
 * (node 4408:47911) — slides left (x: 0→-284, y: 0→-3) to reveal the main view.
 * The statement card is static.
 *
 * Reduced motion: render both at their revealed end-state so the content reads
 * without animating.
 */
const RISE = { duration: 1.6, ease: [0.22, 1, 0.36, 1] as const };
const SLIDE = { duration: 1.05, ease: [0.22, 1, 0.36, 1] as const };

export default function DoorvestPanels({ caption }: { caption?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(stageRef, { once: true, amount: 0.3 });

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

  const revealed = reduce || inView;

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
              width={1992}
              height={624}
              quality={95}
              className={styles.statement}
              style={{ left: 103, top: 90, width: 478, height: 150 }}
              sizes="560px"
            />
          </div>

          {/* App window — rises up out of the lower-left panel (y: 0 → -513) */}
          <div
            className={styles.panel}
            style={{ left: 24, top: 371, width: 684, height: 659, overflow: "hidden" }}
          >
            <motion.div
              className={styles.browser}
              style={{ left: 145, top: 578, width: 393, height: 712 }}
              initial={{ y: 0 }}
              animate={{ y: revealed ? -513 : 0 }}
              transition={reduce ? { duration: 0 } : RISE}
              aria-hidden="true"
            >
              <Image
                src={`${B}/panel-app.png`}
                alt=""
                width={1572}
                height={2848}
                quality={95}
                className={styles.browserImg}
                sizes="440px"
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
              style={{ left: 470, top: 59, width: 1408, height: 894 }}
              initial={{ x: 0, y: 0 }}
              animate={revealed ? { x: -284, y: -3 } : { x: 0, y: 0 }}
              transition={reduce ? { duration: 0 } : SLIDE}
            >
              <Image
                src={`${B}/panel-dashboard.png`}
                alt="The Doorvest ownership dashboard"
                width={4226}
                height={2685}
                quality={95}
                className={styles.dashboardImg}
                sizes="(max-width: 900px) 200vw, 1040px"
              />
            </motion.div>
          </div>
        </div>
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
