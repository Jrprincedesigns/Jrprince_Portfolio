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
  type NodeType,
} from "./superfileAccessMap";

/* ---- layout constants (stage coordinate space) ---- */
const COL_W = 252;
const ORIGIN_X = 160;
const LANE_H = 178;
const ORIGIN_Y = 44;
const NODE_W = 212;
const NODE_H = 70;
const HW = NODE_W / 2;
const HH = NODE_H / 2;
const MIN_Z = 0.28;
const MAX_Z = 2.2;
const PAD = 60;
// Focused views never shrink below this — labels stay legible; if the flow is
// bigger than the viewport at this zoom, we anchor to its start and let the
// reader pan. "Full blueprint" opts out for a true fit-everything overview.
const READABLE_MIN = 0.56;

const laneIndex = Object.fromEntries(LANES.map((l, i) => [l.id, i]));
const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]));
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function pos(n: AccessNode) {
  return {
    x: ORIGIN_X + n.col * COL_W,
    y: ORIGIN_Y + laneIndex[n.lane] * LANE_H + LANE_H / 2 + (n.dy ?? 0),
  };
}

// literal hex — CSS var() does not resolve inside SVG presentation attributes
const EDGE_COLOR: Record<EdgeKind, string> = {
  success: "#d0f010",
  failure: "#ff7a6b",
  security: "#4fd0e6",
  admin: "#b9a3ff",
  neutral: "#8f8f95",
  unresolved: "#8f8f95",
};

const typeLabel = Object.fromEntries(
  [...NODE_TYPES, { id: "actor", label: "Actor" }].map((t) => [t.id, t.label])
);

/** small type icon (12×12) */
function TypeIcon({ type }: { type: NodeType }) {
  const p: Record<NodeType, JSX.Element> = {
    interface: (
      <>
        <rect x="1.5" y="2" width="9" height="8" rx="1.5" />
        <path d="M1.5 4.5h9" />
      </>
    ),
    process: <path d="M2 4h8M2 6h8M2 8h5" />,
    event: <path d="M7 1.2 2.5 6.6H5l-.8 4.2 5-6H6.2z" fill="currentColor" stroke="none" />,
    decision: <path d="M6 1.3 10.7 6 6 10.7 1.3 6z" />,
    state: <circle cx="6" cy="6" r="3.6" />,
    terminal: (
      <>
        <circle cx="6" cy="6" r="4" />
        <circle cx="6" cy="6" r="1.4" fill="currentColor" stroke="none" />
      </>
    ),
    admin: <path d="M6 1.2 10 3v3.2C10 9 6 10.8 6 10.8S2 9 2 6.2V3z" />,
    tbd: <path d="M4.3 4.6a1.7 1.7 0 1 1 2.6 1.4c-.6.4-.9.7-.9 1.4M6 9.4h.01" />,
    actor: <circle cx="6" cy="6" r="3.6" />,
  };
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      {p[type]}
    </svg>
  );
}

/** orthogonal (right-angle) connector between two node centres */
function ortho(a: { x: number; y: number }, b: { x: number; y: number }) {
  const right = b.x >= a.x + 12;
  const left = b.x <= a.x - 12;
  if (!right && !left) {
    // vertical connection
    const sy = b.y > a.y ? a.y + HH : a.y - HH;
    const ey = b.y > a.y ? b.y - HH : b.y + HH;
    return { d: `M ${a.x} ${sy} L ${b.x} ${ey}`, lx: (a.x + b.x) / 2, ly: (sy + ey) / 2 };
  }
  const sx = right ? a.x + HW : a.x - HW;
  const ex = right ? b.x - HW : b.x + HW;
  const midX = (sx + ex) / 2;
  const r = 8;
  const dirY = b.y > a.y ? 1 : -1;
  const dirX = right ? 1 : -1;
  const sameY = Math.abs(a.y - b.y) < 2;
  const d = sameY
    ? `M ${sx} ${a.y} L ${ex} ${b.y}`
    : `M ${sx} ${a.y} L ${midX - dirX * r} ${a.y} Q ${midX} ${a.y} ${midX} ${a.y + dirY * r} L ${midX} ${b.y - dirY * r} Q ${midX} ${b.y} ${midX + dirX * r} ${b.y} L ${ex} ${b.y}`;
  return { d, lx: midX, ly: (a.y + b.y) / 2 };
}

export default function SuperfileSystemMap() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ z: 0.8, tx: 0, ty: 0 });
  const [smooth, setSmooth] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [cats, setCats] = useState<Set<Category>>(new Set(["primary"]));
  const [dragging, setDragging] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const [full, setFull] = useState(false);
  const touched = useRef(false);
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  const points = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, pos(n)])), []);
  const primaryIds = useMemo(() => NODES.filter((n) => n.cats.includes("primary")).map((n) => n.id), []);

  const matchingIds = useCallback(
    (c: Set<Category>) =>
      c.size === 0 ? NODES.map((n) => n.id) : NODES.filter((n) => n.cats.some((x) => c.has(x))).map((n) => n.id),
    []
  );

  const fitNodes = useCallback(
    (ids: string[], animate: boolean, readable = false) => {
      const el = viewportRef.current;
      if (!el) return;
      const use = ids.length ? ids : NODES.map((n) => n.id);
      const xs: number[] = [];
      const ys: number[] = [];
      use.forEach((id) => {
        const p = points[id];
        if (p) {
          xs.push(p.x - HW, p.x + HW);
          ys.push(p.y - HH, p.y + HH);
        }
      });
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const w = maxX - minX;
      const h = maxY - minY;
      const vw = el.clientWidth;
      const vh = el.clientHeight;
      const raw = Math.min((vw - 2 * PAD) / w, (vh - 2 * PAD) / h);
      const z = clamp(readable ? Math.max(raw, READABLE_MIN) : raw, MIN_Z, MAX_Z);
      const contentW = w * z;
      const contentH = h * z;
      // When a readable flow overflows the viewport, anchor to its start
      // (top-left) so the progression reads from the beginning; otherwise centre.
      const overflow = readable && (contentW > vw - 2 * PAD || contentH > vh - 2 * PAD);
      const tx = overflow ? PAD - minX * z : (vw - contentW) / 2 - minX * z;
      const ty = overflow ? PAD - minY * z : (vh - contentH) / 2 - minY * z;
      setSmooth(animate && !reduce);
      setView({ z, tx, ty });
    },
    [points, reduce]
  );

  // Fit whenever the active filter changes: focused filters frame their flow at a
  // readable zoom; "Full blueprint" (empty set) does a true fit-everything overview.
  const firstFit = useRef(true);
  useEffect(() => {
    fitNodes(matchingIds(cats), !firstFit.current, cats.size !== 0);
    firstFit.current = false;
    touched.current = false;
  }, [cats, fitNodes, matchingIds, full]);

  // Refit current flow on resize until the user manually pans/zooms.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (!touched.current) fitNodes(matchingIds(cats), false, cats.size !== 0);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [cats, fitNodes, matchingIds]);

  const zoomAt = useCallback(
    (cx: number, cy: number, factor: number, animate: boolean) => {
      touched.current = true;
      setView((v) => {
        const z = clamp(v.z * factor, MIN_Z, MAX_Z);
        const f = z / v.z;
        return { z, tx: cx - (cx - v.tx) * f, ty: cy - (cy - v.ty) * f };
      });
      setSmooth(animate && !reduce);
    },
    [reduce]
  );

  // Wheel zoom only with a modifier (or in fullscreen) so the page can still scroll.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey || full)) return; // let the page scroll
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.0016), false);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [zoomAt, full]);

  const onPointerDown = (e: RPointerEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("[data-node]") || t.closest("[data-ui]")) return;
    t.setPointerCapture?.(e.pointerId);
    touched.current = true;
    setSmooth(false);
    setDragging(true);
    drag.current = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty };
  };
  const onPointerMove = (e: RPointerEvent) => {
    if (!drag.current) return;
    setView((v) => ({ ...v, tx: drag.current!.tx + (e.clientX - drag.current!.x), ty: drag.current!.ty + (e.clientY - drag.current!.y) }));
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  const btnZoom = (factor: number) => {
    const el = viewportRef.current!;
    zoomAt(el.clientWidth / 2, el.clientHeight / 2, factor, true);
  };

  const toggleFull = () => setFull((f) => !f);

  const activeId = hover ?? selected;
  const connected = useMemo(() => {
    if (!activeId) return null;
    const s = new Set<string>([activeId]);
    EDGES.forEach((e) => {
      if (e.from === activeId) s.add(e.to);
      if (e.to === activeId) s.add(e.from);
    });
    return s;
  }, [activeId]);

  const catActive = useCallback((c: Category[]) => cats.size === 0 || c.some((x) => cats.has(x)), [cats]);
  const nodeEmphasis = useCallback(
    (n: AccessNode) => {
      if (connected) return connected.has(n.id) ? 1 : 0.12;
      return catActive(n.cats) ? 1 : 0.14;
    },
    [connected, catActive]
  );

  // hover quick-card position
  const quick = hover ? nodeById[hover] : null;
  const quickPos = useMemo(() => {
    if (!quick) return null;
    const p = points[quick.id];
    const el = viewportRef.current;
    const vw = el?.clientWidth ?? 800;
    const vh = el?.clientHeight ?? 600;
    let left = view.tx + p.x * view.z + HW * view.z + 12;
    let top = view.ty + p.y * view.z - 12;
    const CW = 250;
    if (left + CW > vw - 8) left = view.tx + p.x * view.z - HW * view.z - CW - 12;
    left = clamp(left, 8, Math.max(8, vw - CW - 8));
    top = clamp(top, 8, Math.max(8, vh - 150));
    return { left, top };
  }, [quick, points, view]);

  const detail = selected ? nodeById[selected] : null;

  const onNodeKey = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelected((s) => (s === id ? null : id));
    }
  };

  const fitSelectedFlow = () => {
    if (activeId && connected) fitNodes([...connected], true, true);
    else fitNodes(matchingIds(cats), true, cats.size !== 0);
  };

  const stageStyle = {
    transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.z})`,
    transition: smooth && !reduce ? "transform 0.28s cubic-bezier(0.22,1,0.36,1)" : "none",
  } as CSSProperties;

  return (
    <figure className={styles.figure}>
      <div
        ref={wrapRef}
        className={`${styles.wrap} ${full ? styles.full : ""}`}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            if (selected) setSelected(null);
            else if (full) setFull(false);
          }
        }}
      >
        {/* filters */}
        <div className={styles.filters} role="group" aria-label="Frame a path" data-ui>
          {CATEGORIES.map((c) => {
            const on = cats.has(c.id);
            const solo = cats.size === 1 && on;
            return (
              <button
                key={c.id}
                type="button"
                className={styles.filterBtn}
                data-on={on || undefined}
                aria-pressed={on}
                onClick={() => setCats(solo ? new Set() : new Set([c.id]))}
              >
                {c.id === "primary" ? "Primary journey" : c.label}
              </button>
            );
          })}
          <button
            type="button"
            className={styles.filterBtn}
            data-on={cats.size === 0 || undefined}
            onClick={() => setCats(new Set())}
          >
            Full blueprint
          </button>
        </div>

        {/* viewport */}
        <div
          ref={viewportRef}
          className={styles.viewport}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          data-dragging={dragging ? "" : undefined}
        >
          <span className={styles.hint} aria-hidden="true" data-ui>
            Drag to pan · {full ? "scroll to zoom" : "⌘/Ctrl-scroll to zoom"}
          </span>

          <div className={styles.stage} style={stageStyle}>
            {/* lanes */}
            {LANES.map((l, i) => (
              <div
                key={l.id}
                className={styles.lane}
                style={{ top: ORIGIN_Y + i * LANE_H, left: -400, width: 4200, height: LANE_H }}
              >
                <span className={styles.laneLabel}>{l.label}</span>
              </div>
            ))}

            {/* edges */}
            <svg className={styles.edges} width={4200} height={2600} style={{ left: -400, top: -200 }} viewBox="-400 -200 4200 2600" aria-hidden="true">
              <defs>
                {EDGE_KINDS.map((k) => (
                  <marker key={k.id} id={`sm2-arrow-${k.id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" fill={EDGE_COLOR[k.id]} />
                  </marker>
                ))}
              </defs>
              {EDGES.map((e, i) => {
                const a = points[e.from];
                const b = points[e.to];
                if (!a || !b) return null;
                const { d, lx, ly } = ortho(a, b);
                const dim = connected != null ? !(connected.has(e.from) && connected.has(e.to)) : !(catActive(nodeById[e.from].cats) && catActive(nodeById[e.to].cats));
                return (
                  <g key={i} opacity={dim ? 0.08 : 1} className={styles.edgeG}>
                    <path d={d} fill="none" stroke={EDGE_COLOR[e.kind]} strokeWidth={2} strokeLinejoin="round" strokeDasharray={e.kind === "unresolved" ? "6 5" : undefined} markerEnd={`url(#sm2-arrow-${e.kind})`} />
                    {e.label && (
                      <text x={lx} y={ly} className={styles.edgeLabel} textAnchor="middle" dominantBaseline="middle">
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
              return (
                <button
                  key={n.id}
                  type="button"
                  data-node
                  data-type={n.type}
                  data-tbd={n.tbd || undefined}
                  data-active={activeId === n.id || undefined}
                  data-selected={selected === n.id || undefined}
                  className={styles.node}
                  style={{ left: p.x - HW, top: p.y - HH, width: NODE_W, height: NODE_H, opacity: nodeEmphasis(n) }}
                  aria-label={`${n.title}. ${typeLabel[n.type] ?? n.type}. Owner: ${n.actor}. ${n.what}${n.next ? " Next: " + n.next : ""}${n.tbd ? " Unresolved policy." : ""}`}
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(n.id)}
                  onBlur={() => setHover(null)}
                  onClick={() => setSelected((s) => (s === n.id ? null : n.id))}
                  onKeyDown={(e) => onNodeKey(e, n.id)}
                >
                  <span className={styles.nodeIcon} aria-hidden="true">
                    <TypeIcon type={n.type} />
                  </span>
                  <span className={styles.nodeBody}>
                    <span className={styles.nodeTitle}>{n.title}</span>
                    <span className={styles.nodeSub}>{n.actor}</span>
                  </span>
                  {n.tbd && (
                    <span className={styles.tbdBadge} aria-hidden="true">
                      {n.type === "tbd" ? "Policy" : "TBD"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* hover quick card */}
          {quick && quickPos && !dragging && (
            <div className={styles.quick} style={{ left: quickPos.left, top: quickPos.top }} aria-hidden="true" data-ui>
              <div className={styles.quickType}>{typeLabel[quick.type] ?? quick.type}</div>
              <div className={styles.quickTitle}>{quick.title}</div>
              <div className={styles.quickWhat}>{quick.what}</div>
            </div>
          )}

          {/* details drawer */}
          {detail && (
            <div className={styles.drawer} role="dialog" aria-label={`${detail.title} details`} data-ui>
              <button type="button" className={styles.drawerClose} onClick={() => setSelected(null)} aria-label="Close details">
                ✕
              </button>
              <div className={styles.drawerType}>
                <span className={styles.drawerIcon} aria-hidden="true">
                  <TypeIcon type={detail.type} />
                </span>
                {typeLabel[detail.type] ?? detail.type}
                {detail.tbd && <span className={styles.drawerTbd}>Policy decision required</span>}
              </div>
              <h4 className={styles.drawerTitle}>{detail.title}</h4>
              <dl className={styles.drawerMeta}>
                <dt>Owner</dt>
                <dd>{detail.actor}</dd>
              </dl>
              <p className={styles.drawerWhat}>{detail.what}</p>
              {detail.why && <p className={styles.drawerWhy}>{detail.why}</p>}
              {detail.next && (
                <p className={styles.drawerNext}>
                  <span aria-hidden="true">→ </span>
                  {detail.next}
                </p>
              )}
              <button type="button" className={styles.drawerFit} onClick={fitSelectedFlow}>
                Fit connected flow
              </button>
            </div>
          )}

          {/* legend popover */}
          {legendOpen && (
            <div className={styles.legend} data-ui>
              <div className={styles.legendGroup}>
                <span className={styles.legendHead}>Node types</span>
                <ul>
                  {NODE_TYPES.map((t) => (
                    <li key={t.id}>
                      <span className={styles.legendIcon} data-type={t.id} aria-hidden="true">
                        <TypeIcon type={t.id} />
                      </span>
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
          )}

          {/* controls */}
          <div className={styles.controls} data-ui>
            <button type="button" className={styles.ctrlText} onClick={() => setLegendOpen((o) => !o)} aria-expanded={legendOpen} aria-label="Toggle legend">
              Legend
            </button>
            <span className={styles.zoomPct}>{Math.round(view.z * 100)}%</span>
            <button type="button" className={styles.ctrlBtn} onClick={() => btnZoom(0.8)} aria-label="Zoom out">−</button>
            <button type="button" className={styles.ctrlBtn} onClick={() => btnZoom(1.25)} aria-label="Zoom in">+</button>
            <button type="button" className={styles.ctrlBtn} onClick={fitSelectedFlow} aria-label="Fit selected flow" title="Fit selected flow">⊹</button>
            <button type="button" className={styles.ctrlBtn} onClick={() => fitNodes(matchingIds(cats), true, cats.size !== 0)} aria-label="Reset view" title="Reset view">⟲</button>
            <button type="button" className={styles.ctrlBtn} onClick={() => fitNodes([], true, false)} aria-label="Fit full blueprint" title="Fit full blueprint">⤢</button>
            <button type="button" className={styles.ctrlBtn} onClick={toggleFull} aria-label={full ? "Exit fullscreen" : "Fullscreen"} aria-pressed={full} title="Fullscreen">
              {full ? "⤡" : "⛶"}
            </button>
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
                      {n.tbd ? ", unresolved" : ""}) — Owner: {n.actor}. {n.what}
                      {n.next ? ` Next: ${n.next}` : ""}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      <figcaption className={styles.caption}>
        {
          "This model defined the checkout boundary: payment could initiate access, but only a verified entitlement could authorize a protected session."
        }
      </figcaption>
    </figure>
  );
}
