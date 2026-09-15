/**
 * Shared browser-storage helpers for visitor instrumentation.
 *
 * Both VisitPing (arrival) and SessionTracker (departure digest) read the same
 * keys, so a browser muted via `?nonotify=1` stays quiet for both.
 */

export const KEYS = {
  /** Accumulated session state, flushed to Slack on pagehide. */
  session: "jrp:session",
  /** Arrival ping already fired this tab session. */
  pinged: "jrp:visit-pinged",
  /** Visitor has been here in a previous session. */
  returning: "jrp:seen-before",
  /** This browser opted out of notifications for good. */
  muted: "jrp:notify-muted",
  /** Digest already sent — guards against a double flush. */
  digestSent: "jrp:digest-sent",
  /** Whether this visitor had been here before THIS session started. */
  returningResolved: "jrp:was-returning",
} as const;

export const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export function safeGet(store: Storage | undefined, key: string): string | null {
  try {
    return store?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function safeSet(store: Storage | undefined, key: string, value: string): void {
  try {
    store?.setItem(key, value);
  } catch {
    /* private mode or blocked storage — instrumentation is never load-bearing */
  }
}

/** True when this browser opted out, or is opting out via `?nonotify=1`. */
export function isMuted(params: URLSearchParams): boolean {
  if (params.get("nonotify") === "1") {
    safeSet(window.localStorage, KEYS.muted, "1");
    return true;
  }
  return safeGet(window.localStorage, KEYS.muted) === "1";
}

/**
 * Whether this visitor has been here before, resolved once per session.
 *
 * The first caller reads localStorage and then marks the visitor as seen, so a
 * later caller in the same session gets the original answer rather than the
 * flag the first one just wrote.
 */
export function resolveReturning(): boolean {
  const cached = safeGet(window.sessionStorage, KEYS.returningResolved);
  if (cached !== null) return cached === "1";

  const returning = safeGet(window.localStorage, KEYS.returning) === "1";
  safeSet(window.sessionStorage, KEYS.returningResolved, returning ? "1" : "0");
  safeSet(window.localStorage, KEYS.returning, "1");
  return returning;
}

export function readUtm(params: URLSearchParams): Record<string, string> {
  const utm: Record<string, string> = {};
  for (const key of UTM_PARAMS) {
    const value = params.get(key);
    if (value) utm[key] = value.slice(0, 80);
  }
  return utm;
}

/**
 * Where on the page a click landed, in words you can act on.
 *
 * Prefers the enclosing section's heading ("Dashboard evolution") over a class
 * name, because a decorative overlay swallowing the click would otherwise
 * report something like `div.curtainTop`, which says nothing about location.
 */
export function locationLabel(el: Element | null): string {
  if (!el) return "unknown";
  const element = describeElement(el);
  const chapter = enclosingChapter(el);
  return chapter ? `${chapter} · ${element}` : element;
}

/**
 * Which case-study chapter an element sits under.
 *
 * Image and embed blocks are rendered as unanchored sections between the
 * anchored text sections, so `closest()` finds nothing. Instead, match the
 * chapter rail's own rule: the last anchored section starting above this
 * element is the chapter it belongs to.
 */
function enclosingChapter(el: Element): string {
  const top = el.getBoundingClientRect().top;
  let current: Element | null = null;
  document.querySelectorAll("section[id]").forEach((section) => {
    if (section.getBoundingClientRect().top <= top) current = section;
  });
  if (!current) return "";
  const section = current as Element;
  const heading = section.querySelector("h2, h3, h1")?.textContent?.trim();
  return (heading || section.id.replace(/-/g, " ")).slice(0, 60);
}

/** Compact, readable identifier for a clicked element. */
export function describeElement(el: Element | null): string {
  if (!el) return "unknown";
  const tag = el.tagName.toLowerCase();
  if (el.id) return `${tag}#${el.id}`;

  const className = typeof el.className === "string" ? el.className : "";
  // CSS-module classes arrive hashed (`CaseStudy_shot__a1b2`) — strip the hash
  // so the same element reads consistently across deploys.
  const first = className.trim().split(/\s+/)[0] ?? "";
  const readable = first.replace(/__[A-Za-z0-9-]+$/, "").replace(/^[A-Za-z]+_/, "");
  return readable ? `${tag}.${readable}` : tag;
}
