/**
 * Global site configuration — the single source of truth for identity,
 * navigation, and contact links. Edit these values and everything updates.
 */

export const site = {
  name: "Jonathan Prince",
  shortName: "jrprince",
  role: "Product Designer",
  // A one-line positioning statement used in the hero and metadata.
  tagline: "Product designer specializing in interaction & motion design.",
  description:
    "I design digital products end to end — from systems thinking and " +
    "interaction models to the motion that makes them feel alive.",
  // Update this once you know your Vercel/custom domain.
  url: "https://jrprince.vercel.app",
  email: "hello@example.com",
  location: "Available worldwide · Remote",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/" },
    { label: "Dribbble", href: "https://dribbble.com/" },
    { label: "Read.cv", href: "https://read.cv/" },
    { label: "Email", href: "mailto:hello@example.com" },
  ],
  nav: [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "mailto:hello@example.com" },
  ],
} as const;

export type Site = typeof site;
