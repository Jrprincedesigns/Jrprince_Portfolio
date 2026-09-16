"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  KEYS,
  classifyCta,
  isMuted,
  locationLabel,
  readUtm,
  resolveReturning,
  safeGet,
  safeSet,
} from "@/lib/clientSession";

/**
 * Accumulates one visitor session and flushes a digest to Slack on departure.
 *
 * What it measures:
 *  - Engaged time per page (ticks only while the tab is visible, so a
 *    backgrounded tab doesn't inflate a four-second visit into forty minutes).
 *  - Max scroll depth per page.
 *  - Per-chapter dwell on case studies, read from the existing chapter rail.
 *  - Click count, rage clicks, and clicks on non-interactive visuals.
 *
 * State lives in sessionStorage so it survives a hard navigation, and the
 * digest is sent once via sendBeacon when the tab hides or unloads.
 */

/** Clicks this close together in space and time read as frustration. */
const RAGE_WINDOW_MS = 1000;
const RAGE_RADIUS_PX = 50;
const RAGE_THRESHOLD = 3;

/** Visuals a reader may click expecting a lightbox that isn't there. */
const VISUAL_SELECTOR = 'img, video, canvas, iframe, figure, [class*="shot"], [class*="Shot"], [class*="figure"], [class*="Figure"], [class*="embed"], [class*="Embed"]';
const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, summary, label, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])';

/** Bound every collection so a long session can't grow an unbounded payload. */
const MAX_PAGES = 25;
const MAX_CHAPTERS = 60;
const MAX_HOTSPOTS = 10;
const MAX_CONVERSIONS = 12;
/**
 * A session can report more than once. `visibilitychange` is the only reliable
 * departure signal on mobile, but it also fires when someone simply switches
 * tabs — so latching after the first flush would silently drop everything they
 * did on returning, including the contact click that matters most. Instead,
 * re-send only when something material changed, and cap the total.
 */
const MAX_DIGESTS = 3;

interface PageEntry {
  path: string;
  title: string;
  engagedMs: number;
  maxScroll: number;
}

interface ChapterEntry {
  path: string;
  label: string;
  engagedMs: number;
}

interface ConversionEntry {
  /** "Email", "LinkedIn", "Chat message", "Outbound · doorvest.com". */
  label: string;
  /** Page they converted from — the study that earned the click. */
  path: string;
  /** Milliseconds into the session, so the digest can say what came first. */
  atMs: number;
}

interface SessionState {
  startedAt: number;
  entryPath: string;
  referrer: string;
  utm: Record<string, string>;
  screen: string;
  returning: boolean;
  clicks: number;
  pages: PageEntry[];
  chapters: ChapterEntry[];
  rage: Record<string, number>;
  deadVisual: Record<string, number>;
  conversions: ConversionEntry[];
}

function loadState(): SessionState | null {
  const raw = safeGet(window.sessionStorage, KEYS.session);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionState;
  } catch {
    return null;
  }
}

function saveState(state: SessionState): void {
  safeSet(window.sessionStorage, KEYS.session, JSON.stringify(state));
}

function freshState(params: URLSearchParams): SessionState {
  return {
    startedAt: Date.now(),
    entryPath: window.location.pathname,
    referrer: document.referrer.slice(0, 300),
    utm: readUtm(params),
    screen: `${window.screen.width}×${window.screen.height}`,
    returning: resolveReturning(),
    clicks: 0,
    pages: [],
    chapters: [],
    rage: {},
    deadVisual: {},
    conversions: [],
  };
}

/** Percentage of the page the visitor has scrolled past, 0–100. */
function scrollDepth(): number {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round((window.scrollY / scrollable) * 100)));
}

/**
 * Chapters for the current page, read from the rail ChapterNav already renders.
 * Keeps the tracker in sync with the case study's own chapter list for free.
 */
function readChapters(): { id: string; label: string }[] {
  const links = document.querySelectorAll<HTMLAnchorElement>(
    'nav[aria-label="Chapters"] a[href^="#"]'
  );
  return Array.from(links)
    .map((a) => ({ id: a.getAttribute("href")!.slice(1), label: a.textContent?.trim() ?? "" }))
    .filter((c) => c.id && c.label);
}

/** Active chapter = the last one whose top has crossed the reading line. */
function activeChapter(chapters: { id: string; label: string }[]): string | null {
  if (!chapters.length) return null;
  const line = window.innerHeight * 0.4;
  let current: string | null = null;
  for (const c of chapters) {
    const el = document.getElementById(c.id);
    if (el && el.getBoundingClientRect().top - line <= 1) current = c.label;
  }
  return current;
}

function bump(map: Record<string, number>, key: string): void {
  if (map[key] === undefined && Object.keys(map).length >= MAX_HOTSPOTS) return;
  map[key] = (map[key] ?? 0) + 1;
}

export default function SessionTracker() {
  const pathname = usePathname();
  const stateRef = useRef<SessionState | null>(null);
  const activeRef = useRef(false);

  // One-time session setup and the departure flush.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (isMuted(params)) return;

    activeRef.current = true;
    stateRef.current = loadState() ?? freshState(params);
    saveState(stateRef.current);

    const clickPositions: { x: number; y: number; t: number }[] = [];
    /** When a same-origin link was last clicked. */
    let internalNavAt = 0;

    const onClick = (event: MouseEvent) => {
      const state = stateRef.current;
      if (!state) return;
      state.clicks += 1;

      const target = event.target as Element | null;

      // Decorative overlays sit above the content and swallow clicks, so look
      // down the stack for the visual the visitor was actually aiming at.
      // Nav uses plain anchors, so an internal link is a full page load. That
      // fires pagehide, but the visitor has not left — the next page picks the
      // session back up from sessionStorage, so it must not flush a digest.
      const anchor = target?.closest("a[href]");
      const href = anchor?.getAttribute("href") ?? "";
      if (href && !href.startsWith("#")) {
        try {
          if (new URL(href, window.location.href).origin === window.location.origin) {
            internalNavAt = Date.now();
          }
        } catch {
          /* malformed href — treat as external */
        }
      }

      // Contact and outbound clicks. Recorded before anything else, because an
      // outbound link can navigate away mid-handler.
      const cta = classifyCta(target);
      if (cta && state.conversions.length < MAX_CONVERSIONS) {
        state.conversions.push({
          label: cta,
          path: window.location.pathname,
          atMs: Date.now() - state.startedAt,
        });
        saveState(state);
      }

      const stack = document.elementsFromPoint(event.clientX, event.clientY);
      const visual = stack.find((el) => el.matches(VISUAL_SELECTOR)) ?? null;
      const interactive = stack.find((el) => el.matches(INTERACTIVE_SELECTOR)) ?? null;

      // Rage: several clicks bunched in one spot in under a second.
      const now = Date.now();
      clickPositions.push({ x: event.clientX, y: event.clientY, t: now });
      while (clickPositions.length && now - clickPositions[0].t > RAGE_WINDOW_MS) {
        clickPositions.shift();
      }
      if (clickPositions.length >= RAGE_THRESHOLD) {
        const first = clickPositions[0];
        const clustered = clickPositions.every(
          (p) => Math.hypot(p.x - first.x, p.y - first.y) <= RAGE_RADIUS_PX
        );
        if (clustered) {
          bump(state.rage, locationLabel(visual ?? target));
          clickPositions.length = 0;
        }
      }

      // A click on a visual that leads nowhere — usually someone trying to
      // enlarge a mockup. High-signal for a portfolio, unlike generic dead
      // clicks on body copy, which are just text selection.
      if (visual && !interactive) {
        bump(state.deadVisual, locationLabel(visual));
      }

      saveState(state);
    };

    const flush = () => {
      const state = stateRef.current;
      if (!state) return;
      // Nothing worth reporting from an instant bounce.
      if (Date.now() - state.startedAt < 3000) return;
      // Mid-flight internal navigation: the next page continues this session.
      if (Date.now() - internalNavAt < 2000) return;

      // Discrete actions only — elapsed time and scrolling alone are not worth
      // a second message, but a new page, click or contact click are.
      const signature = [state.pages.length, state.clicks, state.conversions.length].join(":");
      if (safeGet(window.sessionStorage, KEYS.digestSent) === signature) return;

      const sent = Number(safeGet(window.sessionStorage, KEYS.digestCount) ?? "0");
      if (sent >= MAX_DIGESTS) return;
      safeSet(window.sessionStorage, KEYS.digestSent, signature);
      safeSet(window.sessionStorage, KEYS.digestCount, String(sent + 1));

      const payload = {
        continued: sent > 0,
        durationMs: Date.now() - state.startedAt,
        entryPath: state.entryPath,
        exitPath: window.location.pathname,
        referrer: state.referrer,
        utm: state.utm,
        screen: state.screen,
        returning: state.returning,
        clicks: state.clicks,
        pages: state.pages.slice(0, MAX_PAGES),
        chapters: state.chapters.slice(0, MAX_CHAPTERS),
        rage: state.rage,
        deadVisual: state.deadVisual,
        conversions: state.conversions.slice(0, MAX_CONVERSIONS),
      };

      try {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        // sendBeacon survives unload, where fetch is routinely cancelled.
        navigator.sendBeacon("/api/session", blob);
      } catch {
        /* beacon unavailable — the session just goes unreported */
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
    };
  }, []);

  // Per-page accounting. Re-runs on every client-side navigation.
  useEffect(() => {
    if (!activeRef.current) return;
    const state = stateRef.current;
    if (!state) return;

    const path = pathname || "/";
    let page = state.pages.find((p) => p.path === path);
    if (!page) {
      if (state.pages.length >= MAX_PAGES) return;
      page = { path, title: document.title, engagedMs: 0, maxScroll: 0 };
      state.pages.push(page);
    }

    let chapters = readChapters();
    // The rail mounts a tick after navigation; pick it up on the first read.
    let retried = false;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        page!.maxScroll = Math.max(page!.maxScroll, scrollDepth());
      });
    };

    // Engaged time: one tick per visible second, credited to the current page
    // and, on a case study, to whichever chapter is under the reading line.
    const tick = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;

      if (!chapters.length && !retried) {
        chapters = readChapters();
        retried = true;
      }

      page!.engagedMs += 1000;

      const label = activeChapter(chapters);
      if (label) {
        let chapter = state.chapters.find((c) => c.path === path && c.label === label);
        if (!chapter && state.chapters.length < MAX_CHAPTERS) {
          chapter = { path, label, engagedMs: 0 };
          state.chapters.push(chapter);
        }
        if (chapter) chapter.engagedMs += 1000;
      }

      saveState(state);
    }, 1000);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.clearInterval(tick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      saveState(state);
    };
  }, [pathname]);

  return null;
}
