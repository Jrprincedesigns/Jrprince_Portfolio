/**
 * Content for the single-page LENXPRINCE DESIGN home. Transcribed from the
 * portfolio design (Figma). One object per section; components read from here.
 */

/* ---------------------------------------------------------------- Hero --- */
export const hero = {
  eyebrow: "AI Product Designer",
  intro:
    "Every product starts with uncertainty. My role is to bring clarity " +
    "through research, product strategy, experience design, and AI-driven " +
    "thinking. I help teams move from early concepts to production-ready " +
    "systems that balance business goals, technical realities, and " +
    "exceptional user experiences.",
  sideLabel: "/Selected Work",
  portrait: "/img/portrait.jpg",
};

/**
 * Scroll-scrubbed hero animation (Apple-style). Frames live in
 * public/frames/hero (720×544, source-limited). The head-turn + sweeping glass
 * bands scrub with scroll under the pinned hero composition.
 */
export const scrollVideo = {
  basePath: "/frames/hero",
  frameCount: 122,
  ext: "jpg",
  pad: 3,
  /** Scroll distance the hero pins for — taller = slower scrub. */
  scrollHeight: "280vh",
};

/* -------------------------------------------------------- Introduction --- */
export const introduction = {
  eyebrow: "Introduction",
  /** Rendered as one block; `lead` shown in ink, the rest lighter. */
  lead: "Growing up in N",
  body:
    "ew York taught me to appreciate different cultures, perspectives, and " +
    "the stories people carry with them. Moving across the country taught me " +
    "to embrace those differences rather than assume them away. That mindset " +
    "shapes every product I design, helping me connect complex systems, " +
    "business goals, and human needs into experiences that feel natural for " +
    "everyone involved.",
};

/* --------------------------------------------------------- Case studies --- */
export type CardTheme = "green" | "cream" | "black" | "navy";

export interface CaseStudy {
  slug: string;
  title: string;
  /** Optional highlighted tail of the title (used on the black card). */
  titleHighlight?: string;
  theme: CardTheme;
  tags: string[];
  description: string;
  image: string;
  href: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "real-estate-investing",
    title: "Real Estate Investing Feel Simple",
    theme: "green",
    tags: ["Marketplace Design", "End 2 End Experience", "Design System"],
    description:
      "Designed the end-to-end investment experience, from onboarding through " +
      "portfolio management, helping first-time investors navigate one of " +
      "life's biggest financial decisions with confidence.",
    image: "/img/cases/case-real-estate.png",
    href: "#contact",
  },
  {
    slug: "trust-at-scale",
    title: "Designing for Trust at Scale",
    theme: "cream",
    tags: ["Operational UX", "Decision Support"],
    description:
      "Reimagined fraud monitoring and case resolution workflows, giving " +
      "analysts faster access to the information they needed while reducing " +
      "operational complexity.",
    image: "/img/cases/case-trust.png",
    href: "#contact",
  },
  {
    slug: "secure-file-sharing",
    title: "Rethinking",
    titleHighlight: "Secure File Sharing",
    theme: "black",
    tags: ["Zero-to-One Product", "Platform Architecture"],
    description:
      "Designed a new approach to secure file distribution, combining DRM, " +
      "payments, and streaming into a seamless product experience for " +
      "creators and businesses.",
    image: "/img/cases/case-secure.png",
    href: "#contact",
  },
  {
    slug: "kortshut-ai",
    title: "Kortshut AI",
    theme: "cream",
    tags: ["Co-Founder", "AI Product Engineering"],
    description:
      "Co-founded and designed a macOS AI platform that unified multiple " +
      "models, automations, and workflows into a single intelligent workspace.",
    image: "/img/cases/case-kortshut.png",
    href: "#contact",
  },
  {
    slug: "digital-identity",
    title: "Reimagining Digital Identity",
    theme: "cream",
    tags: ["AI Identity", "Conversation Design"],
    description:
      "Leading product strategy and experience design for an AI-powered " +
      "profile platform that helps professionals tell their story through " +
      "intelligent conversations.",
    image: "/img/cases/case-identity.png",
    href: "#contact",
  },
  {
    slug: "healthcare-data",
    title: "Making Healthcare Data Understandable",
    theme: "navy",
    tags: ["Information Design", "Healthcare Analytics"],
    description:
      "Designed dashboards and reporting systems that helped healthcare " +
      "organizations turn complex financial and operational data into " +
      "actionable decisions.",
    image: "/img/cases/case-healthcare.png",
    href: "#contact",
  },
];

/* ------------------------------------------------------------ Approach --- */
export interface ApproachItem {
  n: string;
  title: string;
  body: string;
}

export const approach: ApproachItem[] = [
  {
    n: "01",
    title: "Listen",
    body: "Every project starts by understanding people, not requirements.",
  },
  {
    n: "02",
    title: "Simplify.",
    body: "I break complex systems into clear, approachable experiences.",
  },
  {
    n: "03",
    title: "Prototype",
    body: "Working software teaches faster than perfect documentation.",
  },
  {
    n: "04",
    title: "Align.",
    body: "The best products emerge when engineering, design, and business move together.",
  },
  {
    n: "05",
    title: "Scale",
    body: "I design systems that continue creating value long after launch.",
  },
  {
    n: "06",
    title: "Refine.",
    body: "Great products aren't finished, they evolve with the people who use them.",
  },
];

/* ------------------------------------------------------------- Clients --- */
export interface Client {
  name: string;
  url: string;
  href: string;
}

export const clients: Client[] = [
  { name: "Fidelity Charitable", url: "Fidelitycharitable.org", href: "https://www.fidelitycharitable.org" },
  { name: "Kortshut AI", url: "Kortshut.ai", href: "https://kortshut.ai" },
  { name: "Savrr Inc.", url: "Savrrapp.com", href: "https://savrrapp.com" },
  { name: "Superfile", url: "Superfile.com", href: "https://superfile.com" },
  { name: "Synctera", url: "Synctera.com", href: "https://synctera.com" },
  { name: "Doorvest", url: "Doorvest.com", href: "https://doorvest.com" },
  { name: "M13", url: "M13.co", href: "https://m13.co" },
  { name: "Pareto Intel", url: "Paretointel.com", href: "https://paretointel.com" },
];

/* ------------------------------------------------------------- Contact --- */
export const contact = {
  greeting: "Hey! What would you like to know?",
  suggestions: [
    "How fast can you start?",
    "What kind of teams do you work with?",
    "What's your availability?",
    "What does a typical week look like?",
  ],
};
