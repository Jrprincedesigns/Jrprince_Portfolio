"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import styles from "./LiveResearchStickies.module.css";

/**
 * Live user-research "design goals" sticky notes — a faithful port of the
 * Figma composition (node 4421:55538, file bWGhvU41WQyO2Vl6AFJfIj) together
 * with the interaction shipped in that file ("Enable sticky note movement").
 *
 * Six sticky notes carry the design goals we framed from research. They sit in
 * a clustered layout and can be grabbed and dragged around freely — picking one
 * up lifts it (shadow grows, scales to 1.05, its rotation straightens to ~25%),
 * and dropping it settles it back to its resting rotation. A "Tidy up" button
 * springs every note home with a bit of overshoot
 * (cubic-bezier(0.34, 1.56, 0.64, 1)), matching the Figma prototype.
 *
 * When nothing is being dragged, the notes breathe with a gentle ambient drift
 * so the composition feels alive on the page. Everything is laid out in the
 * Figma 500×400 cluster coordinate space on a fixed `.canvas`, which is scaled
 * to the container width via a ResizeObserver (same approach as DoorvestPanels
 * and AmbasdrHero).
 *
 * Reduced motion: the ambient drift is dropped and notes render settled at
 * their resting positions/rotations; drag + tidy-up remain available but move
 * instantly.
 */

const STAGE_W = 500;
const STAGE_H = 400;
const NOTE_W = 172;
const NOTE_MIN_H = 150;

/** Spring-with-overshoot used for the tidy-up return, straight from the file. */
const RETURN_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";

interface NoteData {
  id: number;
  text: string;
  color: string;
  initialX: number;
  initialY: number;
  rotation: number;
  /** Ambient drift amplitude (px / deg), derived per note for variety. */
  drift: { x: number; y: number; r: number; dur: number; delay: number };
}

const NOTES: NoteData[] = [
  {
    id: 0,
    text: "Educate without overwhelming",
    color: "#FAE07A",
    initialX: 0,
    initialY: 60,
    rotation: -3,
    drift: { x: 5, y: -7, r: 1.2, dur: 6.5, delay: 0 },
  },
  {
    id: 1,
    text: "Simplify while showing risk",
    color: "#7DD9D1",
    initialX: 155,
    initialY: 0,
    rotation: 1.5,
    drift: { x: -6, y: 5, r: -1, dur: 7.2, delay: 0.4 },
  },
  {
    id: 2,
    text: "help inexperienced users feel capable",
    color: "#B8AAEE",
    initialX: 320,
    initialY: 55,
    rotation: 2.5,
    drift: { x: 6, y: 6, r: 1.4, dur: 6.8, delay: 0.9 },
  },
  {
    id: 3,
    text: "Support operations transparency",
    color: "#F7A8B8",
    initialX: 20,
    initialY: 215,
    rotation: -2,
    drift: { x: -5, y: -6, r: -1.3, dur: 7.6, delay: 0.2 },
  },
  {
    id: 4,
    text: "give experienced investors faster decision making tools",
    color: "#C4A8E8",
    initialX: 170,
    initialY: 185,
    rotation: -1,
    drift: { x: 5, y: 7, r: 1, dur: 6.2, delay: 0.7 },
  },
  {
    id: 5,
    text: "reduce dependency on manual communication",
    color: "#C8BCEF",
    initialX: 315,
    initialY: 230,
    rotation: 1,
    drift: { x: -6, y: 5, r: -1.1, dur: 7.9, delay: 1.1 },
  },
];

interface NotePos {
  x: number;
  y: number;
}

interface DragState {
  noteId: number;
  startPointerX: number;
  startPointerY: number;
  startNoteX: number;
  startNoteY: number;
  /** container-width / STAGE_W, so pointer deltas map into canvas space. */
  scale: number;
}

export default function LiveResearchStickies({
  caption,
}: {
  caption?: string;
}) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(1);
  const rafRef = useRef<number | null>(null);

  const [positions, setPositions] = useState<NotePos[]>(
    NOTES.map(() => ({ x: 0, y: 0 }))
  );
  const [dragging, setDragging] = useState<DragState | null>(null);
  const [zOrders, setZOrders] = useState<number[]>(NOTES.map((_, i) => i + 1));
  const [isReturning, setIsReturning] = useState(false);
  const [moved, setMoved] = useState(false);

  // Scale the fixed 500×400 canvas to the container width (ResizeObserver),
  // and keep the current scale in a ref for mapping pointer deltas while
  // dragging.
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const apply = () => {
      const s = stage.clientWidth / STAGE_W;
      scaleRef.current = s;
      canvas.style.setProperty("--s", String(s));
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent, id: number) => {
      e.preventDefault();
      setIsReturning(false);
      setMoved(true);
      setZOrders((prev) => {
        const maxZ = Math.max(...prev) + 1;
        return prev.map((z, i) => (i === id ? maxZ : z));
      });
      setDragging({
        noteId: id,
        startPointerX: e.clientX,
        startPointerY: e.clientY,
        startNoteX: positions[id].x,
        startNoteY: positions[id].y,
        scale: scaleRef.current || 1,
      });
    },
    [positions]
  );

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => {
      // Divide by scale so a screen-space drag lands 1:1 in canvas coords.
      const dx = (e.clientX - dragging.startPointerX) / dragging.scale;
      const dy = (e.clientY - dragging.startPointerY) / dragging.scale;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPositions((prev) =>
          prev.map((p, i) =>
            i === dragging.noteId
              ? { x: dragging.startNoteX + dx, y: dragging.startNoteY + dy }
              : p
          )
        );
      });
    };
    const onUp = () => setDragging(null);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [dragging]);

  const tidyUp = () => {
    setDragging(null);
    setIsReturning(true);
    setPositions(NOTES.map(() => ({ x: 0, y: 0 })));
    setMoved(false);
    window.setTimeout(() => setIsReturning(false), 900);
  };

  // Ambient drift runs only when nothing has been touched yet, motion is
  // allowed, and no drag/return is in flight.
  const ambient = !reduce && !moved && !dragging && !isReturning;

  return (
    <figure className={styles.figure}>
      <div className={styles.stage} ref={stageRef}>
        <div className={styles.canvas} ref={canvasRef}>
          {NOTES.map((note, i) => {
            const isDragging = dragging?.noteId === i;
            const rotation = isDragging ? note.rotation * 0.25 : note.rotation;
            const scale = isDragging ? 1.05 : 1;
            const pos = positions[i];

            const transition = isDragging
              ? "box-shadow 0.15s ease, transform 0.12s ease"
              : isReturning
                ? `transform 0.65s ${RETURN_EASE}, box-shadow 0.3s ease`
                : "box-shadow 0.2s ease, transform 0.22s ease";

            // Ambient keyframes translate/rotate around the resting pose.
            const animate = ambient
              ? {
                  x: [pos.x, pos.x + note.drift.x, pos.x],
                  y: [pos.y, pos.y + note.drift.y, pos.y],
                  rotate: [rotation, rotation + note.drift.r, rotation],
                  scale,
                }
              : { x: pos.x, y: pos.y, rotate: rotation, scale };

            return (
              <motion.div
                key={note.id}
                className={styles.note}
                onPointerDown={(e) => handlePointerDown(e, note.id)}
                style={{
                  left: note.initialX,
                  top: note.initialY,
                  width: NOTE_W,
                  minHeight: NOTE_MIN_H,
                  backgroundColor: note.color,
                  cursor: isDragging ? "grabbing" : "grab",
                  zIndex: zOrders[i],
                  boxShadow: isDragging
                    ? "0 24px 52px rgba(0,0,0,0.28), 0 8px 18px rgba(0,0,0,0.14)"
                    : "0 3px 10px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.07)",
                  // CSS transitions drive the drag/return feel; framer drives
                  // only the ambient keyframes. Disable the CSS transition while
                  // ambient runs so the two don't fight.
                  transition: ambient ? "box-shadow 0.2s ease" : transition,
                }}
                animate={animate}
                transition={
                  ambient
                    ? {
                        duration: note.drift.dur,
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: note.drift.delay,
                      }
                    : { duration: 0 }
                }
              >
                <p className={styles.text}>{note.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <button type="button" className={styles.tidy} onClick={tidyUp}>
        Tidy up
        <span aria-hidden="true"> 😊</span>
      </button>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
