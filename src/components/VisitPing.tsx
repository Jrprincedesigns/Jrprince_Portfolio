"use client";

import { useEffect } from "react";
import { KEYS, isMuted, readUtm, resolveReturning, safeGet, safeSet } from "@/lib/clientSession";

/**
 * Fires one `/api/visit` ping per browser session, so a Slack notification
 * lands the moment someone arrives. The end-of-session digest is handled
 * separately by SessionTracker.
 *
 * Guards, in order:
 *  - `?nonotify=1` permanently mutes this browser (use it on your own devices).
 *  - `sessionStorage` keeps it to one ping per tab session, not per page view.
 *  - `localStorage` marks the visitor as returning on later sessions.
 *
 * Nothing here blocks render, and every failure is swallowed — a visitor should
 * never see a broken page because Slack or storage is unavailable.
 */
export default function VisitPing() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (isMuted(params)) return;
    if (safeGet(window.sessionStorage, KEYS.pinged) === "1") return;

    // Claim the session slot up front so a re-render can't double-fire.
    safeSet(window.sessionStorage, KEYS.pinged, "1");

    const returning = resolveReturning();

    const payload = {
      path: window.location.pathname + window.location.hash,
      title: document.title,
      referrer: document.referrer,
      utm: readUtm(params),
      returning,
      screen: `${window.screen.width}×${window.screen.height}`,
    };

    // Small delay so the ping never competes with first paint.
    const timer = window.setTimeout(() => {
      void fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        /* offline or blocked — nothing to do */
      });
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
