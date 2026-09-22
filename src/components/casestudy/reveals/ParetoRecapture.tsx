"use client";

import { useState, type CSSProperties } from "react";
import styles from "./ParetoCharts.module.css";

/**
 * Recapture-rate KPIs — the reconciliation dashboard, redesigned so recovered
 * revenue and recapture performance read at a glance. A filter switches line of
 * business; KPI tiles and the current-vs-prior-year bars update together.
 * Sample data only — it illustrates the redesigned pattern, not real figures.
 */

type Group = { name: string; cy: number; py: number };
type Segment = {
  id: string;
  label: string;
  kpis: { recovered: string; avg: number; resolved: string; reviewed: string; delta: number };
  groups: Group[];
};

const SCALE = 80; // % axis top
const TARGET = 60;

const SEGMENTS: Segment[] = [
  {
    id: "ma",
    label: "Medicare Advantage",
    kpis: { recovered: "$12.4M", avg: 52, resolved: "8,240", reviewed: "218K", delta: 6 },
    groups: [
      { name: "Group A", cy: 67, py: 58 },
      { name: "Group B", cy: 54, py: 49 },
      { name: "Group C", cy: 61, py: 55 },
      { name: "Group D", cy: 44, py: 46 },
      { name: "Group E", cy: 58, py: 51 },
    ],
  },
  {
    id: "aca",
    label: "ACA Exchange",
    kpis: { recovered: "$7.8M", avg: 49, resolved: "5,120", reviewed: "164K", delta: 4 },
    groups: [
      { name: "Group A", cy: 59, py: 52 },
      { name: "Group B", cy: 47, py: 45 },
      { name: "Group C", cy: 55, py: 50 },
      { name: "Group D", cy: 41, py: 43 },
      { name: "Group E", cy: 52, py: 48 },
    ],
  },
  {
    id: "medicaid",
    label: "Medicaid",
    kpis: { recovered: "$5.1M", avg: 46, resolved: "3,880", reviewed: "142K", delta: 3 },
    groups: [
      { name: "Group A", cy: 55, py: 51 },
      { name: "Group B", cy: 43, py: 44 },
      { name: "Group C", cy: 50, py: 47 },
      { name: "Group D", cy: 38, py: 40 },
      { name: "Group E", cy: 48, py: 45 },
    ],
  },
];

export default function ParetoRecapture() {
  const [segId, setSegId] = useState("ma");
  const [hover, setHover] = useState<number | null>(null);
  const seg = SEGMENTS.find((s) => s.id === segId)!;
  const k = seg.kpis;

  const tiles = [
    { label: "Recovered YTD", value: k.recovered, delta: `+${k.delta}% vs PY`, up: true },
    { label: "Avg recapture rate", value: `${k.avg}%`, delta: `+${k.delta} pts`, up: true },
    { label: "Discrepancies resolved", value: k.resolved, delta: "this quarter", up: true },
    { label: "Members reviewed", value: k.reviewed, delta: seg.label, up: true },
  ];

  return (
    <figure className={styles.root}>
      <div className={styles.panel}>
        <div className={styles.head}>
          <div className={styles.headText}>
            <p className={styles.eyebrow}>Reconciliation dashboard</p>
            <h3 className={styles.title}>Recapture performance</h3>
            <p className={styles.sub}>Recovered revenue and recapture rate at a glance, with current vs prior year by provider group.</p>
          </div>
          <div className={styles.toggle} role="group" aria-label="Line of business">
            {SEGMENTS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={styles.toggleBtn}
                data-on={s.id === segId || undefined}
                aria-pressed={s.id === segId}
                onClick={() => { setSegId(s.id); setHover(null); }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.kpis}>
          {tiles.map((t) => (
            <div key={t.label} className={styles.kpi}>
              <div className={styles.kpiLabel}>{t.label}</div>
              <div className={styles.kpiValue}>{t.value}</div>
              <div className={`${styles.kpiDelta} ${t.up ? styles.kpiUp : styles.kpiDown}`}>{t.delta}</div>
            </div>
          ))}
        </div>

        <div className={styles.chart}>
          <div className={styles.plot} aria-hidden="true">
            {[0.25, 0.5, 0.75, 1].map((g) => (
              <div key={g} className={styles.gridline} style={{ bottom: `${g * 100}%` }}>
                <span>{Math.round(SCALE * g)}%</span>
              </div>
            ))}
            <div className={styles.target} style={{ bottom: `${(TARGET / SCALE) * 100}%` }}>
              <span>Target {TARGET}%</span>
            </div>
            {seg.groups.map((grp, i) => (
              <div
                key={grp.name}
                className={styles.col}
                data-active={hover === i || undefined}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <div className={styles.bars}>
                  <div className={styles.bar} data-series="prev" style={{ height: `${(grp.py / SCALE) * 100}%` }} />
                  <div className={styles.bar} style={{ height: `${(grp.cy / SCALE) * 100}%` }} />
                </div>
                <span className={styles.colLabel}><b>{grp.name}</b></span>
                {hover === i && (
                  <div className={styles.tip} style={{ bottom: `${(Math.max(grp.cy, grp.py) / SCALE) * 100}%`, left: "50%" } as CSSProperties}>
                    <div className={styles.tipTitle}>{grp.name}</div>
                    <div className={styles.tipRow}><span>Current year</span><b>{grp.cy}%</b></div>
                    <div className={styles.tipRow}><span>Prior year</span><b>{grp.py}%</b></div>
                    <div className={styles.tipRow}><span>Change</span><b>{grp.cy - grp.py >= 0 ? "+" : ""}{grp.cy - grp.py} pts</b></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.legend}>
          <span className={styles.legendItem}><span className={`${styles.swatch} ${styles.swTeal}`} />Current year</span>
          <span className={styles.legendItem}><span className={`${styles.swatch} ${styles.swTealSoft}`} />Prior year</span>
          <span className={styles.legendItem}><span className={`${styles.swatch} ${styles.swMagenta}`} />Target</span>
        </div>

        <table className={styles.srOnly}>
          <caption>Recapture rate by provider group for {seg.label} (sample data)</caption>
          <thead><tr><th>Provider group</th><th>Current year</th><th>Prior year</th></tr></thead>
          <tbody>
            {seg.groups.map((g) => (
              <tr key={g.name}><th scope="row">{g.name}</th><td>{g.cy}%</td><td>{g.py}%</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className={styles.caption}>
        The redesigned reconciliation dashboard: recovered revenue and recapture rate surfaced first, with a target line and prior-year comparison so teams see where recovery is on track.
        <span className={styles.demoTag}>Sample data</span>
      </figcaption>
    </figure>
  );
}
