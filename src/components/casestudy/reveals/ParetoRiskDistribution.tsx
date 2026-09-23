"use client";

import { useState, type CSSProperties } from "react";
import styles from "./ParetoCharts.module.css";

/**
 * RAF (Risk Adjustment Factor) risk distribution — one of the redesigned
 * membership-and-risk views. Members are bucketed into risk tiers; a filter
 * switches line of business and the bars re-scale. Sample data only — this
 * illustrates the redesigned pattern, not any real payer's population.
 */

type Tier = { tier: string; members: number; raf: number };
const MARKETS: { id: string; label: string; tiers: Tier[] }[] = [
  {
    id: "ma",
    label: "Medicare Advantage",
    tiers: [
      { tier: "Low", members: 8200, raf: 0.42 },
      { tier: "Rising", members: 6400, raf: 0.78 },
      { tier: "Moderate", members: 4100, raf: 1.15 },
      { tier: "High", members: 2300, raf: 1.82 },
      { tier: "Very high", members: 950, raf: 2.64 },
    ],
  },
  {
    id: "aca",
    label: "ACA Exchange",
    tiers: [
      { tier: "Low", members: 12400, raf: 0.38 },
      { tier: "Rising", members: 7100, raf: 0.71 },
      { tier: "Moderate", members: 3200, raf: 1.08 },
      { tier: "High", members: 1400, raf: 1.74 },
      { tier: "Very high", members: 480, raf: 2.55 },
    ],
  },
  {
    id: "medicaid",
    label: "Medicaid",
    tiers: [
      { tier: "Low", members: 15800, raf: 0.35 },
      { tier: "Rising", members: 5900, raf: 0.69 },
      { tier: "Moderate", members: 2600, raf: 1.05 },
      { tier: "High", members: 1100, raf: 1.7 },
      { tier: "Very high", members: 360, raf: 2.5 },
    ],
  },
];

const fmt = (n: number) => n.toLocaleString("en-US");

export default function ParetoRiskDistribution() {
  const [marketId, setMarketId] = useState("ma");
  const [hover, setHover] = useState<number | null>(null);
  const market = MARKETS.find((m) => m.id === marketId)!;
  const max = Math.max(...market.tiers.map((t) => t.members));
  const total = market.tiers.reduce((s, t) => s + t.members, 0);
  const highShare = ((market.tiers[3].members + market.tiers[4].members) / total) * 100;
  const avgRaf =
    market.tiers.reduce((s, t) => s + t.raf * t.members, 0) / total;

  return (
    <figure className={styles.root}>
      <div className={styles.panel}>
        <div className={styles.head}>
          <div className={styles.headText}>
            <p className={styles.eyebrow}>Membership &amp; risk</p>
            <h3 className={styles.title}>RAF risk distribution</h3>
            <p className={styles.sub}>Members by risk-adjustment tier. Hover a bar for detail; switch line of business to re-scale.</p>
          </div>
          <div className={styles.toggle} role="group" aria-label="Line of business">
            {MARKETS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={styles.toggleBtn}
                data-on={m.id === marketId || undefined}
                aria-pressed={m.id === marketId}
                onClick={() => { setMarketId(m.id); setHover(null); }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.chart}>
          <div className={styles.plot} aria-hidden="true">
            {[0.25, 0.5, 0.75, 1].map((g) => (
              <div key={g} className={styles.gridline} style={{ bottom: `${g * 100}%` }}>
                <span>{fmt(Math.round(max * g))}</span>
              </div>
            ))}
            {market.tiers.map((t, i) => {
              const h = (t.members / max) * 100;
              return (
                <div
                  key={t.tier}
                  className={styles.col}
                  data-active={hover === i || undefined}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <div className={styles.bars}>
                    <div className={styles.bar} data-tier={i} style={{ height: `${h}%` }} />
                  </div>
                  <span className={styles.colLabel}>
                    <b>{t.tier}</b>
                    <br />
                    {fmt(t.members)}
                  </span>
                  {hover === i && (
                    <div className={styles.tip} style={{ bottom: `${h}%`, left: "50%" } as CSSProperties}>
                      <div className={styles.tipTitle}>{t.tier} risk</div>
                      <div className={styles.tipRow}><span>Members</span><b>{fmt(t.members)}</b></div>
                      <div className={styles.tipRow}><span>Share</span><b>{((t.members / total) * 100).toFixed(1)}%</b></div>
                      <div className={styles.tipRow}><span>Avg RAF</span><b>{t.raf.toFixed(2)}</b></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.legend}>
          <span className={styles.legendItem}><span className={`${styles.swatch} ${styles.swTeal}`} />Lower risk tiers</span>
          <span className={styles.legendItem}><span className={`${styles.swatch} ${styles.swMagenta}`} />High &amp; very-high risk</span>
        </div>

        <div className={styles.summary}>
          <span><b>{fmt(total)}</b> members</span>
          <span>Avg RAF <b>{avgRaf.toFixed(2)}</b></span>
          <span><b>{highShare.toFixed(1)}%</b> in high / very-high tiers</span>
          <span>{market.label}</span>
        </div>

        {/* accessible data table alternative */}
        <table className={styles.srOnly}>
          <caption>RAF risk distribution for {market.label} (sample data)</caption>
          <thead><tr><th>Risk tier</th><th>Members</th><th>Avg RAF</th></tr></thead>
          <tbody>
            {market.tiers.map((t) => (
              <tr key={t.tier}><th scope="row">{t.tier}</th><td>{fmt(t.members)}</td><td>{t.raf.toFixed(2)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className={styles.caption}>
        The redesigned membership-and-risk view: members bucketed by RAF tier, high-risk cohorts pulled out in a contrasting tone so an analyst reads population risk at a glance.
        <span className={styles.demoTag}>Sample data</span>
      </figcaption>
    </figure>
  );
}
