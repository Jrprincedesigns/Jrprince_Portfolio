/**
 * Global site configuration — the single source of truth for identity,
 * navigation, and contact links.
 */

export const site = {
  name: "Lennox Prince",
  /** Full name as he introduces himself in prose (the About bio). */
  fullName: "Lennox Prince Jr.",
  wordmark: { lead: "LENX", mid: "PRINCE", tail: "DESIGN." },
  shortName: "LENXPRINCE",
  role: "Senior Product Designer",
  tagline: "Designing Intelligence for Modern Products",
  description:
    "Lennox Prince is a Senior Product Designer and founder in Dallas, TX, " +
    "working across UX, AI, and development in fintech, healthcare, and " +
    "creator platforms.",
  url: "https://www.jrprince.design",
  email: "lennoxprincejr1@gmail.com",
  location: "Dallas, TX",
  availability: "Available to work",
  socials: [
    { label: "LinkedIn", short: "in", href: "https://www.linkedin.com/in/lennox-prince" },
    { label: "TikTok", short: "TT", href: "https://www.tiktok.com/@theuxguy_jr" },
  ],
  nav: [
    { label: "About", href: "/#introduction" },
    { label: "Case Studies", href: "/#case-studies" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;

export type Site = typeof site;
