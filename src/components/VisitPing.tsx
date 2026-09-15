"use client";

import { useEffect } from "react";

/**
 * Fires one `/api/visit` ping per browser session so a Slack notification lands
 * when someone lands on the site.
 *
 * Guards, in order:
 *  - `?nonotify=1` permanently mutes this browser (use it on your own devices).
 *  - `sessionStorage` keeps it to one ping per tab session, not per page view.
 *  - `localStorage` marks the visitor as returning on later sessions.
 *
 * Nothing here blocks render, and every failure is swallowed — a visitor should
 * never see a broken page because Slack or storage is unavailable.
 */

const SESSION_KEY = "jrp:visit-pinged";
const RETURNING_KEY = "jrp:seen-before";
const MUTE_KEY = "jrp:notify-muted";

function safeGet(store: Storage | undefined, key: string): string | null {
  try {
    return store?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function safeSet(store: Storage | undefined, key: string, value: string): void {
  try {
    store?.setItem(key, value);
  } catch {
    /* private mode or blocked storage — ignore */
  }
}

export default function VisitPing() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Opt this browser out for good, then stay quiet.
    if (params.get("nonotify") === "1") {
      safeSet(window.localStorage, MUTE_KEY, "1");
      return;
    }
    if (safeGet(window.localStorage, MUTE_KEY) === "1") return;
    if (safeGet(window.sessionStorage, SESSION_KEY) === "1") return;

    // Claim the session slot up front so a re-render can't double-fire.
    safeSet(window.sessionStorage, SESSION_KEY, "1");

    const returning = safeGet(window.localStorage, RETURNING_KEY) === "1";
    safeSet(window.localStorage, RETURNING_KEY, "1");

    const utm: Record<string, string> = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const value = params.get(key);
      if (value) utm[key] = value;
    }

    const payload = {
      path: window.location.pathname + window.location.hash,
      title: document.title,
      referrer: document.referrer,
      utm,
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
