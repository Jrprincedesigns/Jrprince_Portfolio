"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import styles from "./LiveResearchStickies.module.css";

/**
 * Live user-research "design goals" — the six sticky notes framed from research,
 * ported from the Figma composition (node 4421:55538). The notes are draggable
 * and stay **within the board** (positions are clamped to the frame), matching
 * the interaction shipped alongside the design. Grabbing a note lifts it — its
 * shadow grows, it scales up slightly, straightens toward level, and jumps to
 * the front. Colours, text and the clustered layout come from the design.
 *
 * Laid out in a fixed 1200×675 board coordinate space scaled to the container
 * (ResizeObserver → --s), the same approach as the other reveals. Reduced
 * motion drops the lift transition; dragging still works.
 */

const BOARD_W = 1200;
const BOARD_H = 675;
const NOTE = 168;

interface Note {
  id: number;
  text: string;
  color: string;
  x: number;
  y: number;
  rot: number;
  z: number;
}

const NOTES: Note[] = [
  { id: 0, text: "Educate without overwhelming", color: "#FFE299", x: 404, y: 248, rot: -3, z: 3 },
  { id: 1, text: "Simplify while showing risk", color: "#ACFFF0", x: 529, y: 211, rot: 2, z: 1 },
  { id: 2, text: "help inexperienced users feel capable", color: "#A197FA", x: 630, y: 259, rot: 3, z: 2 },
  { id: 3, text: "give experienced investors faster decision making tools", color: "#FFE299", x: 532, y: 288, rot: -1, z: 6 },
  { id: 4, text: "Support operations transparency", color: "#FF91B9", x: 434, y: 327, rot: -2, z: 4 },
  { id: 5, text: "reduce dependency on manual communication", color: "#A0B8F9", x: 565, y: 329, rot: 1.5, z: 5 },
];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

interface Drag {
  id: number;
  pointerX: number;
  pointerY: number;
  originX: number;
  originY: number;
  scale: number;
}

export default function LiveResearchStickies({ caption }: { caption?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(1);
  const rafRef = useRef<number | null>(null);

  const [pos, setPos] = useState(() => NOTES.map((n) => ({ x: n.x, y: n.y })));
  const [z, setZ] = useState(() => NOTES.map((n) => n.z));
  const [drag, setDrag] = useState<Drag | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const apply = () => {
      const s = stage.clientWidth / BOARD_W;
      scaleRef.current = s;
      canvas.style.setProperty("--s", String(s));
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const onDown = useCallback(
    (e: ReactPointerEvent, id: number) => {
      e.preventDefault();
      setZ((prev) => {
        const max = Math.max(...prev) + 1;
        return prev.map((v, i) => (i === id ? max : v));
      });
      setDrag({
        id,
        pointerX: e.clientX,
        pointerY: e.clientY,
        originX: pos[id].x,
        originY: pos[id].y,
        scale: scaleRef.current || 1,
      });
    },
    [pos]
  );

  useEffect(() => {
    if (!drag) return;
    const onMove = (e: PointerEvent) => {
      const dx = (e.clientX - drag.pointerX) / drag.scale;
      const dy = (e.clientY - drag.pointerY) / drag.scale;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPos((prev) =>
          prev.map((p, i) =>
            i === drag.id
              ? {
                  // Clamp so the note can never leave the board.
                  x: clamp(drag.originX + dx, 0, BOARD_W - NOTE),
                  y: clamp(drag.originY + dy, 0, BOARD_H - NOTE),
                }
              : p
          )
        );
      });
    };
    const onUp = () => setDrag(null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drag]);

  return (
    <figure className={styles.figure}>
      <div className={styles.stage} ref={stageRef}>
        <div className={styles.board} ref={canvasRef}>
          {NOTES.map((note, i) => {
            const grabbed = drag?.id === i;
            const rot = grabbed ? note.rot * 0.25 : note.rot;
            const scale = grabbed ? 1.05 : 1;
            return (
              <div
                key={note.id}
                className={`${styles.note} ${grabbed ? styles.grabbed : ""}`}
                onPointerDown={(e) => onDown(e, note.id)}
                style={{
                  width: NOTE,
                  height: NOTE,
                  backgroundColor: note.color,
                  zIndex: z[i],
                  transform: `translate(${pos[i].x}px, ${pos[i].y}px) rotate(${rot}deg) scale(${scale})`,
                }}
              >
                <span className={styles.text}>{note.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
