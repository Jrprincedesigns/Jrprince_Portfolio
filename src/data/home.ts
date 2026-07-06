/**
 * Content for the single-page home shell. Placeholder copy that mirrors the
 * reference layout's structure — swap in your own words and assets.
 *
 * (This is separate from caseStudies.ts, which powers the /work detail pages
 * and the Gemini assistant. We'll reconnect those in a later pass.)
 */

export interface WorkItem {
  title: string;
  subtitle: string;
  href: string;
  /** Optional image; falls back to a tinted placeholder block. */
  image?: string;
  accent?: string;
}

export const heroHeadline = "Product Designer for Early-Stage Teams";

export const work: WorkItem[] = [
  {
    title: "Project One",
    subtitle: "A one-line description of the product",
    href: "/work/aperture-mobile-banking",
    accent: "#6c5ce7",
  },
  {
    title: "Project Two",
    subtitle: "A one-line description of the product",
    href: "/work/cadence-music-workspace",
    accent: "#00b894",
  },
  {
    title: "Project Three",
    subtitle: "A one-line description of the product",
    href: "/work/northwind-logistics-os",
    accent: "#0984e3",
  },
];

export const about = {
  heading: "I help early-stage teams ship fast without compromising quality.",
  body:
    "Short intro paragraph. Say who you are, the kind of work you do, and the " +
    "outcomes you drive for the teams you partner with. Keep it human and " +
    "specific — this is the first thing people read about you.",
  bullets: [
    "Shape product strategy without drowning in docs.",
    "Create high-fidelity, interactive prototypes to validate ideas.",
    "Work directly with engineering to iterate fast.",
    "Build and nurture design systems set up to scale.",
  ],
};

export const capabilities = [
  "Product Design",
  "Interaction Design",
  "Motion Design",
  "Prototyping",
  "Design Systems",
  "Branding",
  "Web Design",
  "Strategy",
];

export interface ApproachItem {
  n: string;
  title: string;
  body: string;
}

export const approach: ApproachItem[] = [
  {
    n: "01",
    title: "Shared ownership.",
    body: "Whether I work independently or integrate with your team, everyone comes along.",
  },
  {
    n: "02",
    title: "I work fast.",
    body: "Quick iteration lets us zoom through explorations until something feels right.",
  },
  {
    n: "03",
    title: "Show and tell.",
    body: "I share work in progress often via screen recordings and voice-over.",
  },
  {
    n: "04",
    title: "Bias for action.",
    body: "I prefer tangible artifacts over lengthy documents that go ignored.",
  },
  {
    n: "05",
    title: "I work in systems.",
    body: "I create reusable components, whether it's a feature or a full design system.",
  },
  {
    n: "06",
    title: "Design is thinking.",
    body: "I explore divergent solutions. The more the merrier.",
  },
];

/** Client / logo row — text placeholders until you add real logo SVGs. */
export const clients = [
  "Client A",
  "Client B",
  "Client C",
  "Client D",
  "Client E",
  "Client F",
];

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "A placeholder testimonial. Replace with a real quote about what it was " +
      "like to work with you — the impact, the process, the collaboration.",
    author: "Name Surname",
    role: "Title, Company",
  },
  {
    quote:
      "Another placeholder quote. Two or three sentences works best — specific " +
      "and warm beats generic praise every time.",
    author: "Name Surname",
    role: "Title, Company",
  },
  {
    quote:
      "A third short quote. Keep a few here so the row scrolls nicely on both " +
      "desktop and mobile.",
    author: "Name Surname",
    role: "Title, Company",
  },
];

/** Suggested prompts shown in the Contact chat shell. */
export const contactSuggestions = [
  "How fast can you start?",
  "What kind of teams do you work with?",
  "What's your availability?",
  "What does a typical week look like?",
];
