"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as RPointerEvent,
} from "react";
import { useReducedMotion } from "framer-motion";
import styles from "./SuperfileSystemMap.module.css";
import {
  CATEGORIES,
  EDGES,
  EDGE_KINDS,
  LANES,
  MAP_META,
  NODES,
  NODE_TYPES,
  type AccessNode,
  type Category,
  type EdgeKind,
} from "./superfileAccessMap";

/* ---- layout constants (stage coordinate space) ---- */
const COL_W = 214;
const ORIGIN_X = 150;
const LANE_H = 172;
const ORIGIN_Y = 40;
const NODE_W = 176;
const NODE_H = 78;
const HW = NODE_W / 2;
const HH = NODE_H / 2;
const MIN_Z = 0.4;
const MAX_Z = 2.4;
const PAD = 60;

const laneIndex = Object.fromEntries(LANES.map((l, i) => [l.id, i]));
const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]));

function pos(n: AccessNode) {
  return {
    x: ORIGIN_X + n.col * COL_W,
    y: ORIGIN_Y + laneIndex[n.lane] * LANE_H + LANE_H / 2 + (n.dy ?? 0),
  };
}

// literal hex — CSS var() does not resolve inside SVG presentation attributes
const EDGE_COLORVAR: Record<EdgeKind, string> = {
  success: "#d0f010",
  failure: "#ff7a6b",
  security: "#4fd0e6",
  admin: "#b9a3ff",
  neutral: "#9a9a94",
  unresolved: "#9a9a94",
};

const typeLabel = Object.fromEntries(
  [...NODE_TYPES, { id: "actor", label: "Actor" }].map((t) => [t.id, t.label])
);

/** point where the segment A→B crosses B's box edge (so arrows aren't hidden). */
function boxEdge(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  if (dx === 0 && dy === 0) return { x: bx, y: by };
  const t = Math.min(
    dx !== 0 ? HW / Math.abs(dx) : Infinity,
    dy !== 0 ? HH / Math.abs(dy) : Infinity
  );
  return { x: bx + dx * Math.min(t, 1), y: by + dy * Math.min(t, 1) };
}

export default function SuperfileSystemMap() {
  const reduce = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ z: 0.7, tx: 0, ty: 0 });
  const [smooth, setSmooth] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [cats, setCats] = useState<Set<Category>>(new Set());
  const [dragging, setDragging] = useState(false);
  const touched = useRef(false);
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  const points = useMemo(
    () => Object.fromEntries(NODES.map((n) => [n.id, pos(n)])),
    []
  );
  const bounds = useMemo(() => {
    const xs = NODES.map((n) => points[n.id].x);
    const ys = NODES.map((n) => points[n.id].y);
    return {
      minX: Math.min(...xs) - HW,
      maxX: Math.max(...xs) + HW,
      minY: Math.min(...ys) - HH,
      maxY: Math.max(...ys) + HH,
    };
  }, [points]);
  const graphW = bounds.maxX - bounds.minX;
  const graphH = bounds.maxY - bounds.minY;

  const fit = useCallback(
    (animate = false) => {
      const el = viewportRef.current;
      if (!el) return;
      const vw = el.clientWidth;
      const vh = el.clientHeight;
      const z = Math.max(
        MIN_Z,
        Math.min(MAX_Z, Math.min((vw - 2 * PAD) / graphW, (vh - 2 * PAD) / graphH))
      );
      const tx = (vw - graphW * z) / 2 - bounds.minX * z;
      const ty = (vh - graphH * z) / 2 - bounds.minY * z;
      setSmooth(animate && !reduce);
      setView({ z, tx, ty });
    },
    [bounds.minX, bounds.minY, graphW, graphH, reduce]
  );

  // Opening view: a readable ~0.8 zoom on the start of the flow (top-left),
  // not the tiny full-fit. Fit-to-view is a separate control for the overview.
  const home = useCallback(
    (animate = false) => {
      const z = 0.82;
      setSmooth(animate && !reduce);
      setView({ z, tx: 52 - bounds.minX * z, ty: 46 - bounds.minY * z });
    },
    [bounds.minX, bounds.minY, reduce]
  );

  useEffect(() => {
    home(false);
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (!touched.current) home(false);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [home]);

  const zoomAt = useCallback(
    (cx: number, cy: number, factor: number, animate = false) => {
      touched.current = true;
      setView((v) => {
        const z = Math.max(MIN_Z, Math.min(MAX_Z, v.z * factor));
        const f = z / v.z;
        return { z, tx: cx - (cx - v.tx) * f, ty: cy - (cy - v.ty) * f };
      });
      setSmooth(animate && !reduce);
    },
    [reduce]
  );

  // native non-passive wheel listener so preventDefault reliably zooms
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.0016), false);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [zoomAt]);

  const onPointerDown = (e: RPointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-node]")) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    touched.current = true;
    setSmooth(false);
    setPinned(null);
    setDragging(true);
    drag.current = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty };
  };
  const onPointerMove = (e: RPointerEvent) => {
    if (!drag.current) return;
    setView((v) => ({
      ...v,
      tx: drag.current!.tx + (e.clientX - drag.current!.x),
      ty: drag.current!.ty + (e.clientY - drag.current!.y),
    }));
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  const btnZoom = (factor: number) => {
    const el = viewportRef.current!;
    zoomAt(el.clientWidth / 2, el.clientHeight / 2, factor, true);
  };

  const shown = active ?? pinned;
  const activeNode = shown ? nodeById[shown] : null;

  // connected set for highlighting
  const connected = useMemo(() => {
    if (!shown) return null;
    const nodes = new Set<string>([shown]);
    EDGES.forEach((e) => {
      if (e.from === shown) nodes.add(e.to);
      if (e.to === shown) nodes.add(e.from);
    });
    return nodes;
  }, [shown]);

  const catActive = useCallback(
    (c: Category[]) => cats.size === 0 || c.some((x) => cats.has(x)),
    [cats]
  );
  const nodeEmphasis = useCallback(
    (n: AccessNode) => {
      if (connected) return connected.has(n.id) ? 1 : 0.14;
      return catActive(n.cats) ? 1 : 0.16;
    },
    [connected, catActive]
  );

  // card screen position
  const cardPos = useMemo(() => {
    if (!activeNode) return null;
    const p = points[activeNode.id];
    const el = viewportRef.current;
    const vw = el?.clientWidth ?? 800;
    const vh = el?.clientHeight ?? 600;
    let left = view.tx + p.x * view.z + HW * view.z + 14;
    let top = view.ty + p.y * view.z - 20;
    const CW = 280;
    const CH = 200;
    if (left + CW > vw - 10) left = view.tx + p.x * view.z - HW * view.z - CW - 14;
    left = Math.max(10, Math.min(left, vw - CW - 10));
    top = Math.max(10, Math.min(top, vh - CH - 10));
    return { left, top };
  }, [activeNode, points, view]);

  const stageStyle = {
    transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.z})`,
    transition: smooth && !reduce ? "transform 0.24s cubic-bezier(0.22,1,0.36,1)" : "none",
  } as CSSProperties;

  return (
    <figure className={styles.figure}>
      <div className={styles.head}>
        <h3 className={styles.title}>{MAP_META.title}</h3>
        <p className={styles.subtitle}>{MAP_META.subtitle}</p>
        <p className={styles.intro}>{MAP_META.intro}</p>
        <p className={styles.principle}>
          <span aria-hidden="true">◆</span> {MAP_META.principle}
        </p>
      </div>

      {/* filters */}
      <div className={styles.filters} role="group" aria-label="Emphasize a path">
        <button
          type="button"
          className={styles.filterBtn}
          data-on={cats.size === 0 || undefined}
          onClick={() => setCats(new Set())}
        >
          All paths
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={styles.filterBtn}
            data-on={cats.has(c.id) || undefined}
            aria-pressed={cats.has(c.id)}
            onClick={() =>
              setCats((prev) => {
                const next = new Set(prev);
                if (next.has(c.id)) next.delete(c.id);
                else next.add(c.id);
                return next;
              })
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* viewport */}
      <div
        ref={viewportRef}
        className={styles.viewport}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setPinned(null);
            (document.activeElement as HTMLElement)?.blur?.();
          }
        }}
        data-dragging={dragging ? "" : undefined}
      >
        <span className={styles.hint} aria-hidden="true">
          Drag to pan · scroll to zoom
        </span>

        <div className={styles.stage} style={stageStyle}>
          {/* lane bands */}
          {LANES.map((l, i) => (
            <div
              key={l.id}
              className={styles.lane}
              style={{
                top: ORIGIN_Y + i * LANE_H,
                left: bounds.minX - 30,
                width: graphW + 60,
                height: LANE_H,
              }}
            >
              <span className={styles.laneLabel}>{l.label}</span>
            </div>
          ))}

          {/* edges */}
          <svg
            className={styles.edges}
            width={graphW + 120}
            height={graphH + 120}
            style={{ left: bounds.minX - 60, top: bounds.minY - 60 }}
            viewBox={`${bounds.minX - 60} ${bounds.minY - 60} ${graphW + 120} ${graphH + 120}`}
            aria-hidden="true"
          >
            <defs>
              {EDGE_KINDS.map((k) => (
                <marker
                  key={k.id}
                  id={`sm-arrow-${k.id}`}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill={EDGE_COLORVAR[k.id]} />
                </marker>
              ))}
            </defs>
            {EDGES.map((e, i) => {
              const a = points[e.from];
              const b = points[e.to];
              if (!a || !b) return null;
              const start = boxEdge(b.x, b.y, a.x, a.y);
              const end = boxEdge(a.x, a.y, b.x, b.y);
              const mx = (start.x + end.x) / 2;
              const my = (start.y + end.y) / 2;
              const bow = e.bow ?? 0;
              // perpendicular offset for the control point
              const dx = end.x - start.x;
              const dy = end.y - start.y;
              const len = Math.hypot(dx, dy) || 1;
              const cxp = mx + (-dy / len) * bow;
              const cyp = my + (dx / len) * bow;
              const d = bow
                ? `M ${start.x} ${start.y} Q ${cxp} ${cyp} ${end.x} ${end.y}`
                : `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
              const dim =
                connected != null
                  ? !(connected.has(e.from) && connected.has(e.to))
                  : !(catActive(nodeById[e.from].cats) && catActive(nodeById[e.to].cats));
              const lx = bow ? (mx + cxp) / 2 : mx;
              const ly = bow ? (my + cyp) / 2 : my;
              return (
                <g key={i} opacity={dim ? 0.12 : 1} className={styles.edgeG}>
                  <path
                    d={d}
                    fill="none"
                    stroke={EDGE_COLORVAR[e.kind]}
                    strokeWidth={2}
                    strokeDasharray={e.kind === "unresolved" ? "6 5" : undefined}
                    markerEnd={`url(#sm-arrow-${e.kind})`}
                  />
                  {e.label && (
                    <text
                      x={lx}
                      y={ly}
                      className={styles.edgeLabel}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {e.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* nodes */}
          {NODES.map((n) => {
            const p = points[n.id];
            const emph = nodeEmphasis(n);
            return (
              <button
                key={n.id}
                type="button"
                data-node
                data-type={n.type}
                data-tbd={n.tbd || undefined}
                data-active={shown === n.id || undefined}
                className={styles.node}
                style={{
                  left: p.x - HW,
                  top: p.y - HH,
                  width: NODE_W,
                  height: NODE_H,
                  opacity: emph,
                }}
                aria-label={`${n.title}. ${typeLabel[n.type] ?? n.type}. Actor: ${n.actor}. ${n.what}${
                  n.next ? " Next: " + n.next : ""
                }${n.tbd ? " Unresolved policy (TBD)." : ""}`}
                onMouseEnter={() => setActive(n.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(n.id)}
                onBlur={() => setActive(null)}
                onClick={() => setPinned((p2) => (p2 === n.id ? null : n.id))}
              >
                <span className={styles.nodeType} aria-hidden="true">
                  {typeLabel[n.type] ?? n.type}
                </span>
                <span className={styles.nodeTitle}>{n.title}</span>
                {n.tbd && (
                  <span className={styles.tbdBadge} aria-hidden="true">
                    {n.type === "tbd" ? "Policy TBD" : "TBD"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* contextual card */}
        {activeNode && cardPos && (
          <div
            className={styles.card}
            role="status"
            style={{ left: cardPos.left, top: cardPos.top }}
          >
            <div className={styles.cardType}>{typeLabel[activeNode.type] ?? activeNode.type}</div>
            <div className={styles.cardTitle}>{activeNode.title}</div>
            <div className={styles.cardActor}>Actor: {activeNode.actor}</div>
            <p className={styles.cardWhat}>{activeNode.what}</p>
            {activeNode.why && <p className={styles.cardWhy}>{activeNode.why}</p>}
            {activeNode.next && (
              <p className={styles.cardNext}>
                <span aria-hidden="true">→ </span>
                {activeNode.next}
              </p>
            )}
            {activeNode.tbd && <div className={styles.cardTbd}>Unresolved — policy decision required</div>}
          </div>
        )}

        {/* controls */}
        <div className={styles.controls}>
          <span className={styles.zoomPct} aria-live="off">
            {Math.round(view.z * 100)}%
          </span>
          <button type="button" className={styles.ctrlBtn} onClick={() => btnZoom(1.25)} aria-label="Zoom in">
            +
          </button>
          <button type="button" className={styles.ctrlBtn} onClick={() => btnZoom(0.8)} aria-label="Zoom out">
            −
          </button>
          <button type="button" className={styles.ctrlBtn} onClick={() => fit(true)} aria-label="Fit to view">
            ⤢
          </button>
          <button type="button" className={styles.ctrlBtn} onClick={() => home(true)} aria-label="Reset view">
            ⟲
          </button>
        </div>
      </div>

      {/* legend */}
      <div className={styles.legend}>
        <div className={styles.legendGroup}>
          <span className={styles.legendHead}>Node types</span>
          <ul>
            {NODE_TYPES.map((t) => (
              <li key={t.id}>
                <span className={styles.legendNode} data-type={t.id} aria-hidden="true" />
                {t.label}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.legendGroup}>
          <span className={styles.legendHead}>Connections</span>
          <ul>
            {EDGE_KINDS.map((k) => (
              <li key={k.id}>
                <span className={styles.legendEdge} data-kind={k.id} aria-hidden="true" />
                {k.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* accessible text alternative */}
      <div className={styles.srOnly}>
        <h4>Superfile paid access &amp; entitlement system — text description</h4>
        <p>{MAP_META.principle}</p>
        {LANES.map((l) => {
          const laneNodes = NODES.filter((n) => n.lane === l.id);
          if (!laneNodes.length) return null;
          return (
            <section key={l.id}>
              <h5>{l.label}</h5>
              <ul>
                {laneNodes.map((n) => (
                  <li key={n.id}>
                    <strong>{n.title}</strong> ({typeLabel[n.type] ?? n.type}
                    {n.tbd ? ", unresolved" : ""}) — Actor: {n.actor}. {n.what}
                    {n.next ? ` Next: ${n.next}` : ""}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <figcaption className={styles.caption}>
        {
          "Interactive service blueprint of Superfile's paid file access. Payment establishes an entitlement; the entitlement determines access; access produces a controlled file session. Open policy questions are marked TBD."
        }
      </figcaption>
    </figure>
  );
}
