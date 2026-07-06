/**
 * Case studies as typed data objects.
 *
 * Each case study renders on the home grid (`/#work`) and on its own detail
 * page (`/work/[slug]`). Add or edit entries here — the routes, cards, and the
 * Gemini assistant's knowledge all read from this one array.
 *
 * To add a 5th case study, just append another object that satisfies
 * `CaseStudy`. TypeScript will tell you if anything is missing.
 */

export interface CaseStudyMetric {
  label: string;
  value: string;
}

export interface CaseStudySection {
  /** Section heading shown on the detail page, e.g. "The problem". */
  heading: string;
  /** One or more paragraphs of body copy. */
  body: string[];
  /** Optional image for this section (place files in /public/work/...). */
  image?: {
    src: string;
    alt: string;
    /** Optional caption rendered under the image. */
    caption?: string;
  };
}

export interface CaseStudy {
  /** URL segment: /work/[slug] */
  slug: string;
  title: string;
  /** Short subtitle shown on cards and the hero of the detail page. */
  subtitle: string;
  /** The client / product / company. */
  client: string;
  /** e.g. "2024" or "2023 — 2024". */
  year: string;
  /** Your role, e.g. "Lead Product Designer". */
  role: string;
  /** Short disciplines list for tags, e.g. ["Interaction", "Motion"]. */
  disciplines: string[];
  /** Accent color used for this project's theming. */
  accent: string;
  /** Cover image shown on the work grid. */
  cover: {
    src: string;
    alt: string;
  };
  /** One-paragraph summary used on cards and for the AI assistant's context. */
  summary: string;
  /** Headline numbers shown near the top of the detail page. */
  metrics: CaseStudyMetric[];
  /** The long-form story, section by section. */
  sections: CaseStudySection[];
  /** Set false to keep a draft out of the public grid. */
  published: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "aperture-mobile-banking",
    title: "Aperture",
    subtitle: "Rebuilding trust in mobile banking through motion",
    client: "Aperture Financial",
    year: "2024",
    role: "Lead Product Designer",
    disciplines: ["Product Design", "Interaction", "Motion", "Design Systems"],
    accent: "#6C5CE7",
    cover: {
      src: "/work/aperture/cover.jpg",
      alt: "Aperture banking app screens on a gradient background",
    },
    summary:
      "Led the redesign of a mobile banking app for 1.2M users, using " +
      "motion as a trust signal — every transaction, transfer, and balance " +
      "change is choreographed to feel deliberate and secure.",
    metrics: [
      { label: "Active users", value: "1.2M" },
      { label: "Task success", value: "+31%" },
      { label: "Support tickets", value: "-24%" },
    ],
    sections: [
      {
        heading: "The problem",
        body: [
          "Aperture's users didn't trust the app. Balances updated instantly " +
            "with no acknowledgement, transfers felt like they might have " +
            "failed, and the interface gave no sense of where money went.",
          "Trust in banking is emotional. Our hypothesis: purposeful motion " +
            "could make the invisible feel accountable.",
        ],
      },
      {
        heading: "Interaction model",
        body: [
          "We designed a system of 'money moments' — micro-interactions that " +
            "confirm every value change with weighted, physical motion. Money " +
            "visibly moves between accounts along a path, never teleports.",
        ],
      },
      {
        heading: "Outcome",
        body: [
          "Post-launch, task success rose 31% and money-movement support " +
            "tickets dropped 24%. Motion became a core part of the brand.",
        ],
      },
    ],
    published: true,
  },
  {
    slug: "cadence-music-workspace",
    title: "Cadence",
    subtitle: "A collaborative workspace for music producers",
    client: "Cadence",
    year: "2023 — 2024",
    role: "Senior Product Designer",
    disciplines: ["Product Design", "Interaction", "Prototyping"],
    accent: "#00B894",
    cover: {
      src: "/work/cadence/cover.jpg",
      alt: "Cadence collaborative timeline interface",
    },
    summary:
      "Designed a real-time collaborative timeline for remote music teams, " +
      "solving the hard interaction problem of multiple people editing the " +
      "same audio arrangement at once.",
    metrics: [
      { label: "Beta teams", value: "340" },
      { label: "Session length", value: "+2.4x" },
      { label: "NPS", value: "72" },
    ],
    sections: [
      {
        heading: "The challenge",
        body: [
          "Music production is spatial and temporal. Two producers editing the " +
            "same arrangement need to see each other's intent without chaos.",
        ],
      },
      {
        heading: "Presence & motion",
        body: [
          "I designed live cursors, region 'claiming', and smooth playhead " +
            "synchronisation so collaboration felt like being in the same room.",
        ],
      },
      {
        heading: "Impact",
        body: [
          "Average session length grew 2.4x during the beta and the tool " +
            "earned an NPS of 72 from professional producers.",
        ],
      },
    ],
    published: true,
  },
  {
    slug: "northwind-logistics-os",
    title: "Northwind OS",
    subtitle: "Taming complexity in a logistics control tower",
    client: "Northwind",
    year: "2023",
    role: "Product Designer",
    disciplines: ["Product Design", "Data Viz", "Interaction"],
    accent: "#0984E3",
    cover: {
      src: "/work/northwind/cover.jpg",
      alt: "Northwind logistics dashboard with live shipment map",
    },
    summary:
      "Rethought a dense logistics operations dashboard used by dispatchers " +
      "to track thousands of live shipments, prioritizing at-a-glance " +
      "situational awareness over raw data density.",
    metrics: [
      { label: "Shipments/day", value: "48K" },
      { label: "Time-to-triage", value: "-40%" },
      { label: "Screens replaced", value: "11 → 1" },
    ],
    sections: [
      {
        heading: "Context",
        body: [
          "Dispatchers juggled eleven separate tools to answer one question: " +
            "what needs my attention right now?",
        ],
      },
      {
        heading: "The single pane",
        body: [
          "We unified everything into one control tower with a priority " +
            "feed, using subtle motion to draw the eye to exceptions.",
        ],
      },
      {
        heading: "Results",
        body: [
          "Time-to-triage dropped 40% and eleven legacy screens collapsed " +
            "into a single, calmer interface.",
        ],
      },
    ],
    published: true,
  },
  {
    slug: "lumen-health-companion",
    title: "Lumen",
    subtitle: "A gentle daily health companion",
    client: "Lumen Health",
    year: "2022 — 2023",
    role: "Product & Motion Designer",
    disciplines: ["Product Design", "Motion", "Brand"],
    accent: "#E17055",
    cover: {
      src: "/work/lumen/cover.jpg",
      alt: "Lumen health companion app with soft illustrated states",
    },
    summary:
      "Shaped the product and motion language for a chronic-condition " +
      "companion app, using warm, breathing animations to make daily " +
      "check-ins feel supportive rather than clinical.",
    metrics: [
      { label: "Day-30 retention", value: "58%" },
      { label: "Daily check-ins", value: "+46%" },
      { label: "App Store", value: "4.8★" },
    ],
    sections: [
      {
        heading: "The brief",
        body: [
          "People managing chronic conditions were tired of apps that felt " +
            "like homework. Lumen needed to feel like a companion, not a chart.",
        ],
      },
      {
        heading: "Motion as tone of voice",
        body: [
          "I built a motion system around soft, breathing rhythms — nothing " +
            "snaps. Encouragement is expressed through timing and easing.",
        ],
      },
      {
        heading: "Where it landed",
        body: [
          "Daily check-ins rose 46% and the app holds a 4.8-star rating with " +
            "reviews that specifically mention how it 'feels'.",
        ],
      },
    ],
    published: true,
  },
];

/** All case studies that should appear publicly, in display order. */
export const publishedCaseStudies = caseStudies.filter((c) => c.published);

/** Look up a single case study by its slug. */
export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
