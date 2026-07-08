/**
 * Global site configuration — the single source of truth for identity,
 * navigation, and contact links.
 */

export const site = {
  name: "Lennox Prince",
  wordmark: { lead: "LENX", mid: "PRINCE", tail: "DESIGN." },
  shortName: "LENXPRINCE",
  role: "AI Product Designer",
  tagline: "Designing Intelligence for Modern Products",
  description:
    "Lennox Prince is an AI Product Designer in Dallas, TX. I bring clarity to " +
    "complex products through research, product strategy, experience design, " +
    "and AI-driven thinking — moving teams from early concepts to " +
    "production-ready systems.",
  url: "https://lenxprince.vercel.app",
  email: "lennoxprincejr1@gmail.com",
  location: "Dallas, TX",
  availability: "Available to work",
  socials: [
    { label: "X", short: "X", href: "https://x.com/" },
    { label: "Threads", short: "✳", href: "https://threads.net/" },
    { label: "LinkedIn", short: "in", href: "https://www.linkedin.com/" },
  ],
  nav: [
    { label: "About", href: "/#introduction" },
    { label: "Case Studies", href: "/#case-studies" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;

export type Site = typeof site;
