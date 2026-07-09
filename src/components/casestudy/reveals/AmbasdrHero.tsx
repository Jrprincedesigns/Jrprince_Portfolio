"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "./AmbasdrHero.module.css";

/**
 * Ambasdr hero — a faithful port of the Figma composition (node 2449:12571).
 * A portrait sits on top of an empty room; four layers (two app screenshots,
 * a profile card + avatar, and the name/roles) are tucked behind her. On hover
 * (or keyboard focus) they fan out into place using the Figma translate
 * keyframes. Touch devices and reduced-motion users see the fanned-out state
 * by default, since hover doesn't exist there.
 *
 * Everything is laid out in the Figma 1440×1024 coordinate space on a fixed
 * `.canvas`, which is scaled to the container width via a ResizeObserver.
 */

const B = "/img/cases/ambasdr";
const EASE = [0.22, 1, 0.36, 1] as const;
const STAGE_W = 1440;

/** rest → reveal translate (px, in 1440×1024 space), straight from Figma. */
function fan(
  rx: number,
  ry: number,
  vx: number,
  vy: number
): Variants {
  return { rest: { x: rx, y: ry }, reveal: { x: vx, y: vy } };
}

const LAYERS = {
  screenA: fan(94, -118, -354, 84),
  profile: fan(30, 40, 397, -79),
  name: fan(-2, -75, -354, -12),
  screenB: fan(-57, -193, 393.998, 0),
};

export default function AmbasdrHero({ caption }: { caption?: string }) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    setCoarse(window.matchMedia("(hover: none)").matches);
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

  const revealed = hovered || coarse || !!reduce;
  const state = revealed ? "reveal" : "rest";
  const tr = (i: number) =>
    reduce ? { duration: 0 } : { duration: 0.7, ease: EASE, delay: i * 0.05 };

  return (
    <figure className={styles.figure}>
      <div
        ref={stageRef}
        className={styles.stage}
        tabIndex={0}
        role="img"
        aria-label={caption ?? "Ambasdr profile and AI conversation interface"}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <div ref={canvasRef} className={styles.canvas}>
          <Image
            src={`${B}/room.jpg`}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 1280px"
            className={styles.room}
          />

          {/* Screenshot A (rotated left) */}
          <motion.div
            className={styles.layer}
            variants={LAYERS.screenA}
            initial={false}
            animate={state}
            transition={tr(0)}
          >
            <div
              className={styles.box}
              style={{ left: 507, top: 556, width: 464.443, height: 296.361 }}
            >
              <div style={{ transform: "rotate(-16.09deg)" }}>
                <div
                  className={styles.card}
                  style={{
                    width: 430.204,
                    height: 184.341,
                    boxShadow: "0 4px 28px rgba(0,0,0,0.25)",
                  }}
                >
                  <Image
                    src={`${B}/screen-a.jpg`}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 60vw, 440px"
                    className={styles.cover}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Profile card + avatar */}
          <motion.div
            className={styles.layer}
            variants={LAYERS.profile}
            initial={false}
            animate={state}
            transition={tr(1)}
          >
            <div
              className={styles.card}
              style={{
                position: "absolute",
                left: 654,
                top: 298,
                width: 330,
                height: 257.97,
                borderRadius: 24,
              }}
            >
              <Image
                src={`${B}/profile.jpg`}
                alt=""
                fill
                sizes="(max-width: 900px) 50vw, 340px"
                className={styles.cover}
              />
            </div>
            <div
              className={styles.avatar}
              style={{ left: 661.42, top: 334.85, width: 78.492, height: 78.492 }}
            >
              <Image
                src={`${B}/avatar.jpg`}
                alt=""
                fill
                sizes="90px"
                className={styles.cover}
              />
            </div>
          </motion.div>

          {/* Name + roles */}
          <motion.div
            className={styles.layer}
            variants={LAYERS.name}
            initial={false}
            animate={state}
            transition={tr(2)}
          >
            <div
              className={styles.box}
              style={{ left: 440, top: 218, width: 455.504, height: 434.331 }}
            >
              <div style={{ transform: "rotate(-38.73deg)" }}>
                <div className={styles.name}>
                  <span className={styles.nameFirst}>Aaliyah</span>
                  <span className={styles.nameLast}>Monroe</span>
                </div>
              </div>
            </div>
            <div
              className={styles.box}
              style={{ left: 591, top: 452, width: 243.558, height: 208.677 }}
            >
              <div style={{ transform: "rotate(-40deg)" }}>
                <div className={styles.roles}>
                  <span>Storyteller</span>
                  <span>lifestyle creator</span>
                  <span>Brand collaborator</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Screenshot B (rotated right) */}
          <motion.div
            className={styles.layer}
            variants={LAYERS.screenB}
            initial={false}
            animate={state}
            transition={tr(3)}
          >
            <div
              className={styles.box}
              style={{ left: 590, top: 570, width: 396.599, height: 315.604 }}
            >
              <div style={{ transform: "rotate(21.39deg)" }}>
                <div
                  className={styles.card}
                  style={{
                    width: 346.306,
                    height: 203.299,
                    boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
                  }}
                >
                  <Image
                    src={`${B}/screen-b.jpg`}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 50vw, 350px"
                    className={styles.cover}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Portrait cutout on top — the layers emerge from behind her */}
          <div
            className={styles.portrait}
            style={{ left: 240, top: 35, width: 960, height: 1286 }}
          >
            <Image
              src={`${B}/portrait.png`}
              alt=""
              fill
              quality={90}
              sizes="(max-width: 900px) 70vw, 960px"
              className={styles.portraitImg}
            />
          </div>
        </div>
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
