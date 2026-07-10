/**
 * Full content for the case-study detail pages (/work/[slug]).
 *
 * Separate from `data/caseStudies.ts` (which powers the Gemini assistant).
 * Order + card copy come from `home.ts`. Doorvest is the real published
 * case study (jrprince.design/work/doorvests-marketplace); the rest are drafts
 * from the card copy until their write-ups land (`draft: true`).
 */
import { caseStudies } from "./home";

export interface CaseMeta {
  label: string;
  value: string;
}

export interface CaseStat {
  value: string;
  label: string;
}

export interface CaseImage {
  src: string;
  w: number;
  h: number;
  alt?: string;
}

export type CaseBlock =
  | { kind: "section"; title: string; kicker?: string; body: string[]; id?: string }
  | { kind: "quote"; text: string }
  | { kind: "banner"; text: string; eyebrow?: string; id?: string }
  | { kind: "stats"; items: CaseStat[] }
  | { kind: "cards"; label?: string; items: { title: string; body: string }[] }
  | { kind: "timeline"; label?: string; items: { label: string; sub?: string }[] }
  | {
      kind: "decisionLog";
      title: string;
      rows: { label: string; text: string }[];
      id?: string;
    }
  | {
      kind: "evolution";
      label?: string;
      beforeLabel?: string;
      afterLabel?: string;
      rows: { before: string; after: string }[];
    }
  | { kind: "questions"; label?: string; items: string[]; id?: string }
  | {
      kind: "media";
      variant: "wide" | "panel" | "tall" | "grid";
      images?: CaseImage[];
      labels?: string[];
    }
  | { kind: "embed"; embed: string; caption?: string }
  | { kind: "reveal"; name: string; caption?: string };

/** Sticky-nav chapters (flagship studies); each id must match a block's id. */
export interface CaseChapter {
  id: string;
  label: string;
}

export interface CaseStudyContent {
  slug: string;
  project: string;
  /** Small eyebrow above the title (defaults to `project`). */
  eyebrow?: string;
  title: string;
  lead?: string;
  meta: CaseMeta[];
  focusAreas?: string[];
  heroImage?: CaseImage;
  /** Render the hero on a white field, scaled to 93% — for laptop/device
   *  mockups that read too large edge-to-edge. Keeps the full-bleed footprint. */
  heroFramed?: boolean;
  heroLabel?: string;
  /** When present, renders a sticky chapter rail + enables scroll reveal. */
  chapters?: CaseChapter[];
  blocks: CaseBlock[];
  draft?: boolean;
}

/** Canonical order (mirrors the home grid) — used for prev/next. */
export const caseOrder = caseStudies.map((c) => c.slug);

const BRAND: Record<string, string> = {
  "real-estate-investing": "Doorvest",
  "trust-at-scale": "Synctera",
  "secure-file-sharing": "Superfile",
  "kortshut-ai": "Kortshut AI",
  "digital-identity": "Ambasdr",
  "healthcare-data": "Pareto Intel",
};

/* ------------------------------------------------------- Doorvest (full) --- */
const doorvest: CaseStudyContent = {
  slug: "real-estate-investing",
  project: "Doorvest",
  title: "Turning a high-touch service into a scalable investment marketplace.",
  lead:
    "As founding product designer at Doorvest, I owned the full investor " +
    "experience: onboarding, marketplace discovery, portfolio management, and " +
    "long-term ownership. The company was moving from a high-touch, service-heavy " +
    "model to a product-led marketplace. My job was to help people feel confident " +
    "doing something most had never done before: buying and managing a rental home " +
    "in a city they'd never visit.",
  meta: [
    { label: "Role", value: "Founding Product Designer" },
    { label: "Industry", value: "Proptech · Fintech · B2C" },
    { label: "Client", value: "Doorvest" },
    { label: "Timeline", value: "2021 – 2025" },
  ],
  blocks: [
    {
      kind: "section",
      title: "The problem space",
      body: [
        "Buying a rental property you'll never walk through is a lot to ask of someone. Most first-time investors didn't fully understand cash flow, appreciation, or reserve costs, and they had no real sense of how day-to-day tenant management worked. We were asking them to wire a large sum toward a house they'd only ever seen in photos.",
        "Almost everything came back to confidence. Before committing, people wanted to see the renovation work, understand how a home was underwritten, and know what returns to expect. The existing funnel was built around control instead of momentum, so every manual handoff added another delay and another reason to hesitate. That hesitation showed up directly in drop-off and weak repeat activity.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      images: [
        {
          src: "/img/cases/doorvest/problem-space.png",
          w: 2018,
          h: 1486,
          alt: "Framing the problem into design goals: educate without overwhelming, simplify while still showing risk, help first-time investors feel capable, and lean less on manual communication",
        },
      ],
    },
    {
      kind: "section",
      title: "Live user research",
      body: [
        "Reading through support conversations, the frustration was hard to miss. People were missing time-sensitive email alerts, and when they did show up, they were often looking at homes that had nothing to do with what they'd asked for.",
        "The problem wasn't one broken screen. The whole experience was held together by emails, spreadsheets, and sales calls, so people couldn't move on their own. Things stalled at exactly the moment they were starting to feel ready.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      images: [
        {
          src: "/img/cases/doorvest/user-research.png",
          w: 2018,
          h: 1486,
          alt: "A live user-research session with the Head of Product and a customer: “I keep missing the emails Doorvest sends. I really wanted that house!”",
        },
      ],
    },
    {
      kind: "section",
      title: "Core product insight",
      body: [
        "One pattern cut through everything: people weren't all using Doorvest the same way. Newer investors needed education and reassurance before they'd act. Experienced investors wanted the opposite: fast access to the numbers and sharper filters so they could move quickly.",
        "That split changed how I approached the work. One linear funnel was never going to fit both. The product had to flex to how confident and how decisive each person was in the moment.",
      ],
    },
    {
      kind: "quote",
      text: "Investors weren't all using Doorvest the same way. Some needed to be taught. Others just needed to be trusted to move fast.",
    },
    {
      kind: "section",
      title: "Marketplace intelligence & behavioral modeling",
      kicker: "We made immediate marketplace access the default.",
      body: [
        "The original experience relied on timed email property drops. The cadence manufactured pressure while giving people almost nothing to actually look at. I moved discovery and reservation straight into the product, so investors could browse and compare homes at their own pace instead of waiting for the next email.",
        "Each listing put everything in one place: photos, financial projections, neighborhood data, and a clear Reserve Home button. I focused the marketplace on the moments where money was on the line and cut the delays that had been quietly killing conversion.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      images: [
        {
          src: "/img/cases/doorvest/marketplace.png",
          w: 3840,
          h: 2160,
          alt: "The Doorvest marketplace: investment portfolios above the browsable in-app home inventory",
        },
      ],
    },
    {
      kind: "section",
      title: "“Doormatch” preference matching",
      body: [
        "Instead of a separate swipe app, I put Like and Dislike buttons on each property card. It borrowed the familiarity of swiping without pulling people out of the browsing flow. When someone liked a home, we recorded its attributes: location, price, home type, and so on.",
        "I argued against a standalone swipe experience. It would have rewarded novelty over real decisions and pulled people away from the actual investment. Those signals fed Doormatch, which surfaced homes likely to fit each person's criteria. It narrowed the field for them over time, without anyone filling out a preferences form.",
        "It personalized the marketplace and gave the sales team a read on what each person wanted, without the constant back-and-forth.",
      ],
    },
    {
      kind: "quote",
      text: "Doormatch helped people find a “yes” faster. An internal analysis showed a noticeable uptick in Letters of Intent after it launched. Even when someone didn't buy right away, they browsed more once the options felt tailored to them.",
    },
    {
      kind: "section",
      title: "Streamlined purchase flow",
      kicker: "The blocker was never intent. It was effort.",
      body: [
        "I cut the reservation flow down to a few clicks by removing unnecessary fields and reusing what we already knew from someone's profile. Instant feedback, a clear confirmation screen, and a follow-up email made committing feel quick and reassuring instead of daunting.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      images: [
        {
          src: "/img/cases/doorvest/reservation.png",
          w: 1440,
          h: 1100,
          alt: "The reservation confirmation and order summary screen",
        },
      ],
    },
    {
      kind: "section",
      title: "Dashboard evolution",
      body: [
        "Reserving a home was only half the journey. Ownership itself was scattered across emails, spreadsheets, and manual back-and-forth. Investors had no single place to see what they owned or how it was performing.",
        "I pulled the whole ownership lifecycle into one dashboard: portfolio performance, renovation status, leases, and documents. Owning through Doorvest became as self-serve as buying through it.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      images: [
        {
          src: "/img/cases/doorvest/dashboard.png",
          w: 2422,
          h: 1540,
          alt: "The centralized ownership dashboard on web and mobile: portfolio value, homes, distributions, recent activity, statements, and documents in one place",
        },
      ],
    },
    {
      kind: "evolution",
      label: "From fragmented service to owned product",
      beforeLabel: "Operator-heavy service",
      afterLabel: "Scalable product",
      rows: [
        { before: "Ownership scattered across email threads", after: "One dashboard for the whole portfolio" },
        { before: "Renovation status invisible", after: "Renovation progress tracked in-app" },
        { before: "Leases & documents requested manually", after: "Leases and documents self-serve" },
        { before: "Performance lived in spreadsheets", after: "Live portfolio tracking and returns" },
      ],
    },
    {
      kind: "section",
      title: "Operational impact",
      body: [
        "The platform took friction out for investors and internal teams at once. Bringing discovery, evaluation, and reservation into one place removed the manual coordination that had bottlenecked the sales team. It also gave everyone a shared view across investor demand, acquisitions, and operations.",
      ],
    },
    {
      kind: "embed",
      embed: "doorvest-system-map",
      caption:
        "How the redesigned platform connected the operation: every workflow, tool, and team, with the product at the center. Hover any node to trace its role and connections.",
    },
    {
      kind: "stats",
      items: [
        { value: "+13.8%", label: "Lift in visitor → active-investor conversion after launch" },
        { value: "+40%", label: "Increase in home reservations vs. the prior funnel" },
        { value: "~80%", label: "Active-investor engagement & retention" },
      ],
    },
    {
      kind: "section",
      title: "Reflection",
      body: [
        "My biggest takeaway was how emotional these decisions are. People weren't only weighing returns. They were deciding whether to hand a company a life-changing amount of money for a house they'd never set foot in.",
        "Over four years, Doorvest grew from a fragmented, operator-heavy service into a product that carries someone through the whole arc of investing: finding a home, reserving it, managing a portfolio, and the long tail of ownership.",
      ],
    },
    {
      kind: "quote",
      text: "With financial products, you're designing for confidence as much as for returns.",
    },
  ],
};

/* ------------------------------------------------------ Superfile (full) --- */
const superfile: CaseStudyContent = {
  slug: "secure-file-sharing",
  project: "Superfile",
  title: "Designing secure monetization for a zero-trust file platform.",
  lead:
    "Superfile is a venture-backed cybersecurity startup building files that stay " +
    "under the creator's control even after they're shared. I led design for its " +
    "pay-to-unlock feature: a way to sell access to a file without ever giving up " +
    "ownership, built on a zero-trust foundation across macOS and web.",
  meta: [
    { label: "Role", value: "Founding Product Designer" },
    { label: "Industry", value: "Cybersecurity · Fintech · B2C" },
    { label: "Team", value: "CEO, CTO, PM · 7 engineers" },
    { label: "Timeline", value: "2024 – 2025" },
  ],
  chapters: [
    { id: "the-problem-space", label: "The problem space" },
    { id: "building-a-new-mental-model", label: "A new mental model" },
    { id: "the-product-ecosystem", label: "Product ecosystem" },
    { id: "building-with-stripe", label: "Building with Stripe" },
    { id: "a-controlled-payment-surface", label: "Payment surface" },
    { id: "component-architecture", label: "Component architecture" },
    { id: "investor-storytelling", label: "Investor storytelling" },
    { id: "reflection", label: "Reflection" },
  ],
  blocks: [
    {
      kind: "section",
      title: "The problem space",
      body: [
        "With normal file sharing, you lose control the moment someone downloads a copy. Ownership, rights, and access are gone. For creators, the value isn't only in the file itself. It's in what happens to it afterward: who has it, how it's used, and whether it stays protected.",
        "Superfile changes that. You upload a file, grant access, watch how it's used, adjust permissions, and revoke access whenever you want, all while keeping ownership. A file stays an asset instead of becoming a liability the moment it leaves your hands. My job was to let people sell access to those files without weakening any of that.",
      ],
    },
    {
      kind: "section",
      title: "Building a new mental model",
      body: [
        "Changing how ownership works meant designing around permissions and durable access control. Rather than treating a file as infinitely copyable, Superfile tracks where it came from, verifies who's opening it, and adjusts what each viewer can do.",
        "Control flows from the creator into the file, and each viewer gets their own permissions. It works a little like enterprise access controls, but applied to creative rights.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      images: [
        {
          src: "/img/cases/superfile/capabilities.png",
          w: 1500,
          h: 1368,
          alt: "Superfile's file-native capabilities: trackable, unhackable, and take-backable files",
        },
      ],
    },
    {
      kind: "section",
      title: "The product ecosystem",
      body: [
        "Superfile spans a macOS app, a web platform, secure viewers, payments, permissioning, ownership verification, accounts, and usage tracking. Together they enforce digital rights and let creators actually make money from their work.",
        "The map below lays out how the pieces relate and where value moves between them, so the whole thing stays legible whether you're an engineer or an investor.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: [
        "The Superfile product ecosystem: macOS app, web, secure viewers, payments, permissioning, ownership verification, and tracking",
      ],
    },
    {
      kind: "section",
      title: "Context: why this mattered",
      kicker: "Payment had to sit on top of security, never replace it.",
      body: [
        "The push to monetize came straight from leadership and investors, centered on file ownership. The audience went beyond creators. It included anyone with digital assets who wanted to sell access while keeping control and protection intact.",
        "That ruled out ordinary paywall patterns right away. If access could be copied, bypassed, or handed over too early, the product would undercut the exact thing it promised to protect.",
      ],
    },
    {
      kind: "quote",
      text: "The real question wasn't whether to monetize. It was how to do so without breaking Superfile's zero-trust foundation.",
    },
    {
      kind: "section",
      title: "Building with Stripe",
      kicker: "I owned this end to end, across product strategy, UX, and engineering.",
      body: [
        "We used Stripe as the payment layer instead of building our own. The real work wasn't dropping in a checkout form. It was figuring out how an outside payment provider could safely unlock access inside a security-first product. I led how Stripe's events connected to Superfile's access model, in both design and implementation.",
        "A payment was a prerequisite for access, not proof of ownership. A successful charge didn't unlock a file on its own. Access was only released after the payment was confirmed and matched to the right file and the right recipient. That gave us room to handle retries, failures, and revocation without ever exposing a sensitive state or granting access too early.",
        "The map became a shared contract between design and engineering. It drew the boundaries of who owned what, and separated the states that were technically impossible from the ones we simply didn't want.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      images: [
        {
          src: "/img/cases/superfile/system-map.png",
          w: 1800,
          h: 1392,
          alt: "Pay-to-unlock map: how Stripe events safely trigger access without granting ownership",
        },
      ],
    },
    {
      kind: "section",
      title: "A controlled payment surface",
      kicker: "Monetization had to live inside the product without weakening its security.",
      body: [
        "Instead of Stripe's default checkout, I designed a custom pay card that lived natively inside Superfile. It let us control exactly how a payment was expressed and validated, and made sure a transaction could never hand over ownership or slip past the security model.",
      ],
    },
    {
      kind: "section",
      title: "Component architecture",
      body: [
        "The pay-to-unlock surface is built in layers that separate the intent to pay from the authority to grant access. As you move up the stack, the product takes on more of the decision and the user controls less of the outcome: from basic inputs like card number and cardholder name, through the transaction-intent layer, up to the container that finally releases access.",
      ],
    },
    {
      kind: "media",
      variant: "panel",
      labels: [
        "How the pay card is layered: basic inputs → transaction-intent layer → the container that releases access",
      ],
    },
    {
      kind: "section",
      title: "Cross-platform decisions & trade-offs",
      body: [
        "One big call was whether to build separate payment logic for macOS and web. Going fully native on each was tempting, but over time the two would drift apart in how they handled payments, webhooks, and security. I proposed embedding a lightweight web view inside the macOS app so both platforms ran the same Stripe flow and the same backend logic. That left fewer places for bugs or security gaps to creep in.",
      ],
    },
    {
      kind: "section",
      title: "Investor storytelling",
      body: [
        "Complex technology only matters if people get it. Early on, investors were handed technical diagrams. Later, they followed a story instead: the problem, ownership, how it makes money, control, and the market. Showing it visually turned out to be the bridge between technical depth and business value.",
      ],
    },
    {
      kind: "evolution",
      label: "Reframing infrastructure as narrative",
      beforeLabel: "What investors saw before",
      afterLabel: "What they understood after",
      rows: [
        { before: "Technical diagrams & processes", after: "A story: problem → ownership → monetization" },
        { before: "Raw infrastructure detail", after: "Control and market opportunity" },
        { before: "Product depth without context", after: "Business value made legible" },
      ],
    },
    {
      kind: "section",
      title: "What shipped",
      kicker: "A working pay-to-unlock flow, used end to end before it ever went public.",
      body: [
        "The feature launched internally first. Investors ran the full pay-to-unlock flow themselves from invite-only accounts, paying to open a protected file without ever gaining ownership of it. The point of that internal launch was to put a working feature in front of the people funding the company, a live security model they could evaluate rather than a diagram.",
        "Because the feature kept changing while the company pivoted, I documented every flow, state, and security boundary in Figma and Notion. On a security-sensitive surface those weren't deliverables. They were how design and engineering stayed aligned on what was technically impossible versus what we simply chose not to allow.",
      ],
    },
    {
      kind: "section",
      title: "Reflection",
      body: [
        "The hardest part of this project was never the interface. It was holding one line steady, that a payment can unlock access without ever transferring ownership, across product, design, and engineering while the rest of the product kept moving underneath it.",
        "It taught me that on infrastructure this abstract, the design work is as much about making the system legible to engineers, investors, and users as it is about the screens themselves.",
      ],
    },
    {
      kind: "quote",
      text: "The hard part was never secure file sharing. It was designing for confidence and control in a place where ownership usually feels temporary.",
    },
  ],
};

/* ------------------------------------------------------- Synctera (full) --- */
const synctera: CaseStudyContent = {
  slug: "trust-at-scale",
  project: "Synctera",
  title: "Redesigning fraud operations for trust at scale.",
  lead:
    "I redesigned fraud operations at Synctera, helping analysts cut wrongful " +
    "transaction blocks by 20% and getting banks and fintechs onto one shared " +
    "platform.",
  meta: [
    { label: "Role", value: "Lead Product Designer" },
    { label: "Industry", value: "Fintech · Banking infrastructure" },
    { label: "Client", value: "Synctera" },
    { label: "Timeline", value: "Oct 2023 – Mar 2024" },
  ],
  heroImage: {
    src: "/img/cases/synctera/hero-cases.png",
    w: 1800,
    h: 1280,
    alt: "Synctera fraud operations: the redesigned Cases dashboard",
  },
  blocks: [
    {
      kind: "section",
      title: "About Synctera",
      body: [
        "Synctera is the infrastructure banks and fintechs use to launch and run regulated financial products. Inside that world, fraud teams review alerts, investigate risky activity, and make calls that affect customers, partner banks, and the company's standing with regulators.",
        "As the company grew, fraud work got harder. Analysts were handling more alerts across KYC, transaction monitoring, and compliance while coordinating with several outside partners. Every decision was time-sensitive, auditable, and hard to walk back.",
        "The goal wasn't just speed. It was trusting that a case reflected what was actually true right now, especially when the work was blocked, half-finished, or waiting on someone else.",
      ],
    },
    {
      kind: "section",
      title: "What was Broken",
      kicker:
        "With plenty of tools and alerts, analysts still couldn't reliably tell a case's status, priority, or owner. The result was premature closures, stuck work, and risk no one could see.",
      body: [
        "A case's status didn't match reality. There was no clear sense of where a case sat in its lifecycle. In some workflows the only way to advance a case was to mark it complete, even when work was still going. So active investigations looked resolved, and stalled ones disappeared.",
        "Ownership was murky. Nothing reliably showed who was working a case or whether it was blocked. Two analysts could pick up the same investigation without realizing it, duplicating work and reaching conflicting decisions.",
        "A lot of the real work happened off-platform. Blocked cases got sorted out over Slack, email, or a phone call. If a document came in by email and never got uploaded, the case quietly stalled, and none of it made it back into the record.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      images: [
        {
          src: "/img/cases/synctera/case-model.png",
          w: 2400,
          h: 606,
          alt: "Case-state model: the record stays true to the work, even when a case is blocked",
        },
      ],
    },
    {
      kind: "section",
      title: "How I Changed the System",
      kicker:
        "The system must always reflect the current truth of work, even when progress is blocked.",
      body: [
        "I anchored the redesign to one principle: the record should always reflect the current truth of the work. From there I focused on three moves: pulling the scattered tools together, cutting the coordination noise, and making case visibility hold up as volume grew.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      images: [
        {
          src: "/img/cases/synctera/tooling.png",
          w: 1800,
          h: 1280,
          alt: "Consolidating Hawk AI, Onfido and Dotfile into one in-context experience with intent-based notifications",
        },
      ],
    },
    {
      kind: "section",
      title: "Consolidate Fragmented Tooling",
      kicker: "Creating a single source of truth without replacing core tools.",
      body: [
        "Investigations used to make analysts bounce between Hawk AI, Onfido, and Dotfile, stitching together identity checks, risk signals, and decisions as they went. I mapped how those tools were actually used, then rebuilt the workflow into one internal experience that kept the whole investigation in a single place.",
        "Rather than replace those tools, I gave analysts a simple way to open them in context, then come right back to the case to record findings and notes without losing their place. That cut the back-and-forth, removed manual reconciliation, and gave everyone a more reliable picture of each case.",
      ],
    },
    {
      kind: "section",
      title: "Reduced Coordination Noise",
      body: [
        "Analysts needed to stay informed without being interrupted constantly. So instead of broadcasting every notification, alerts only fired on a clear signal, like a mention or a case someone was actively watching.",
        "For teams that lived in Slack, case notifications flowed into shared channels, pulling coordination back to the record without pulling people out of their work.",
      ],
    },
    {
      kind: "section",
      title: "Rebuilt Case Visibility at Scale",
      kicker:
        "The dashboard made priority, ownership, and workload obvious at a glance, so analysts didn't have to guess urgency from a table or from memory.",
      body: [
        "Before the redesign, urgency was a social guess. Anything more than a few days old was assumed urgent, and people carried their workload in their heads instead of the tool.",
        "The new dashboard put priority right into the interface. Cases were ranked by risk signals and manager assignment, so analysts could go straight to the highest-risk work instead of sorting it themselves.",
        "At a glance it answered three questions: what needs attention now, who's working on what, and where things are stuck. That replaced tribal knowledge with a picture everyone shared.",
      ],
    },
    {
      kind: "stats",
      items: [
        { value: "20%", label: "Reduction in wrongful transaction blocks" },
        { value: "3", label: "External tools unified into one in-context flow" },
        { value: "1", label: "System of record for every case decision" },
      ],
    },
    {
      kind: "section",
      title: "Impact & Validation",
      body: [
        "I measured impact by watching how cases moved before and after launch, mainly the time spent in active investigation and the drop in stalled or prematurely closed cases. Working closely with Operations and interviewing analysts afterward confirmed the gains were real changes in how people worked, even as case volume climbed.",
      ],
    },
    {
      kind: "section",
      title: "What I'd Protect Going Forward",
      kicker:
        "The dashboard was a workload stabilizer for the fraud team, not a reporting screen.",
      body: [
        "If another designer picked this up, I'd tell them to be careful with the dashboard. It wasn't only a task list. It was how analysts understood their workload, their progress, and how much they could take on.",
        "By showing assignment, priority, and active work at both the personal and team level, it helped analysts plan their day, set expectations, and shake the feeling of always being behind. It didn't just move more cases. It eased burnout by trading uncertainty for a clear picture.",
        "Across the team, that shared view let work move around before pressure boiled over. The dashboard shaped how people behaved, how they felt, and how much they trusted the tool. Any future change should be tested against real operational behavior and judged by what it does to workload balance and team health.",
      ],
    },
  ],
};

/* -------------------------------------------------------- Ambasdr (full) --- */
const ambasdr: CaseStudyContent = {
  slug: "digital-identity",
  project: "Ambasdr",
  title: "Designing the identity layer between people and AI.",
  lead:
    "An AI-powered identity layer for professionals, creators, and founders. One " +
    "place that explains who someone is, what they do, and why it matters, and can " +
    "answer for them even when they're not in the room.",
  meta: [
    { label: "Role", value: "Co-founder · Product & AI UX" },
    { label: "Timeline", value: "~1 year, concept → beta" },
    { label: "Team", value: "3-person founding team" },
    { label: "Platforms", value: "Web · iOS · Android" },
  ],
  // Curated chapter rail; ids map to the slugified section titles the view generates.
  chapters: [
    { id: "first-principles", label: "First principles" },
    { id: "research-validation", label: "Research & validation" },
    { id: "designing-an-ai-that-represents-people", label: "Designing the AI" },
    { id: "teaching-instead-of-uploading", label: "Teaching the AI" },
    { id: "knowledge-architecture", label: "Knowledge architecture" },
    { id: "outcome", label: "Outcome" },
    { id: "reflection", label: "Reflection" },
  ],
  blocks: [
    {
      kind: "reveal",
      name: "ambasdr-hero",
      caption: "The public Ambasdr profile beside the AI conversation interface",
    },
    {
      kind: "section",
      title: "First principles",
      kicker: "Modern identity has outgrown the tools built to represent it.",
      body: [
        "A person isn't just a job title, a resume, or a single profile anymore. Someone can be a designer, a founder, a photographer, an investor, and a community builder all at once, and each of those usually lives in a different place.",
        "LinkedIn favors work history, Instagram a visual identity, TikTok personality, a portfolio a few projects, GitHub code, Calendly your calendar. There was never a shortage of information. The problem was that every platform flattened someone into a narrow slice, and none of them explained how the slices fit together. A designer who's also a founder can't show both without looking unfocused. A founder misses inbound because there's no single place that tells the whole story.",
        "The opportunity was never to replace those platforms. It was to build a layer above them: one place that pulls the fragments together and can actually be talked to. Ambasdr sits between a person and everyone trying to understand them.",
      ],
    },
    {
      kind: "quote",
      text: "A resume documents what you have done. An Ambasdr explains why it matters.",
    },
    {
      kind: "stats",
      items: [
        { value: "500", label: "Waitlist signups" },
        { value: "450+", label: "Research & validation conversations" },
        { value: "20", label: "Beta users" },
        { value: "15", label: "Onboarding iterations" },
        { value: "3", label: "Person founding team" },
        { value: "~1yr", label: "Concept to beta readiness" },
      ],
    },
    {
      kind: "reveal",
      name: "ambasdr-scroll-video",
      caption: "From business card → QR code → link page → conversational identity layer",
    },
    {
      kind: "quote",
      text: "Don't replace the places people already use to represent themselves. Create the layer that explains how those places connect.",
    },
    {
      kind: "section",
      title: "Research & validation",
      kicker: "Direction was shaped through 450+ conversations.",
      body: [
        "The direction came out of conversations with recruiters, creators, professionals, influencers, hiring managers, VCs, beta testers, and waitlist users, not one narrow persona. The same pattern showed up across all of them: people weren't struggling to present information, they were struggling because it was scattered across too many places.",
        "Plenty of them juggled several resumes, portfolios, and audiences at once. Those sides of a person aren't separate in real life, but the tools made them separate online. People wanted to be understood without shrinking down to a single title.",
      ],
    },
    {
      kind: "cards",
      label: "What the research kept surfacing",
      items: [
        {
          title: "Multidisciplinary people couldn't show how their work connected",
          body: "They knew what they'd done. What frustrated them was how hard it was to show why it all belonged together. That pushed the product toward context instead of categories.",
        },
        {
          title: "Everyone wanted an assistant, not just a profile",
          body: "Independent work comes with overhead: intros, the same questions again and again, digging up the right link, following up. People wanted something that could stand in for them when they weren't around.",
        },
        {
          title: "The hiring use case was too narrow",
          body: "Recruiters were interested, but the stronger signal came from people who wanted to network, collaborate, build a brand, and understand how they were perceived.",
        },
      ],
    },
    {
      kind: "cards",
      label: "Product pivots",
      items: [
        {
          title: "Hiring tool → identity platform",
          body: "People wanted to represent themselves across networking, collaboration, creative work, and business, not just employment.",
        },
        {
          title: "Static profile → conversational interface",
          body: "A nicer profile still left visitors to interpret everything on their own. Conversation became the main way people discovered someone.",
        },
        {
          title: "File upload → AI teaching",
          body: "Files without context make for a shallow picture. Onboarding turned into a place where users explain why each resource matters.",
        },
        {
          title: "Voice as core → voice as enhancement",
          body: "People were into voice, but a structured profile was more useful day to day. Voice became a way to show personality, not the whole interaction.",
        },
      ],
    },
    {
      kind: "cards",
      label: "Product principles",
      items: [
        {
          title: "Representation over generation",
          body: "The AI shouldn't make up a plausible answer. It should represent the real person behind the profile, and admit when it doesn't know.",
        },
        {
          title: "Context is more valuable than content",
          body: "A file shows what someone did. It rarely shows what mattered. That's why the product grew from uploading files into teaching the AI what they mean.",
        },
        {
          title: "Conversation is discovery",
          body: "People get to know each other by asking questions. So questions became the interface. The profile acts less like a brochure and more like a conversation.",
        },
        {
          title: "Users remain the source of truth",
          body: "The model never owns the user's identity. The owner defines what's accurate, what matters, the tone, and what's public.",
        },
      ],
    },
    {
      kind: "section",
      title: "Designing an AI that represents people",
      kicker: "The hard part wasn't answering questions. It was speaking for someone.",
      body: [
        "Most AI interfaces just answer prompts. Ambasdr had a touchier job: it was speaking for a real person, which raised the stakes on trust. Visitors had to trust the answers were useful. Owners had to trust the AI wasn't putting words in their mouth. And the product had to make clear the person always had the final say.",
        "Every major feature traces back to four questions: Can the AI represent me accurately? Can I control what it knows? Can visitors trust the answers? Can I keep improving how I come across?",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: ["The trust model: owner control, knowledge sources, AI response, visitor question, and feedback loop"],
    },
    {
      kind: "cards",
      label: "Decision log",
      items: [
        {
          title: "The AI should admit uncertainty",
          body: "In most AI products, an unanswered question feels like failure. For Ambasdr, a wrong answer was much worse. When it doesn't know, it says so, and nudges the owner to fill the gap in their profile.",
        },
        {
          title: "Every file needed context",
          body: "Uploading isn't where the intelligence happens. One project might show leadership, taste, technical depth, or community pull, but without context the AI can summarize a file without grasping what it means. So each resource carries a label, an intent, and a link to the person's identity.",
        },
        {
          title: "Mobile became the authoring tool",
          body: "Managing your Ambasdr should be as quick as sending a text. Mobile stopped being a companion app and became the fastest place to update information, manage resources, and tune how the AI represents you.",
        },
        {
          title: "Plan management stayed on the web",
          body: "Free, Pro, and Premium tiers were kept on the web to sidestep App Store and Play Store payment cuts. It wasn't only a pricing call. It shaped where parts of the product could live.",
        },
      ],
    },
    {
      kind: "section",
      title: "Teaching instead of uploading",
      kicker: "Onboarding turned into a way to teach the AI, not just fill out a form.",
      body: [
        "Across roughly 15 versions of onboarding, tested with a community of 50 to 100 people, it became clear a setup flow wasn't enough. Ambasdr wasn't collecting information. It was learning how to represent someone.",
        "So onboarding had to get at deeper questions: what does this person want to be known for, what topics should the AI understand, which resources matter most and why, what should it avoid saying, what tone should it strike, and what should visitors be prompted to ask. That's why Teach Your Ambasdr became one of the most important parts of the product.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: [
        "Onboarding flow: Purpose → Profile → Resources → Context → Teach Your Ambasdr → Preview → Publish → Pricing",
      ],
    },
    {
      kind: "section",
      title: "Knowledge architecture",
      kicker: "A living system, not a static page.",
      body: [
        "The toughest problem was working out how all these documents relate, and how each should shape the AI behind the scenes. Ambasdr ties together profile data, files, links, resource context, instructions, tone, visitor questions, AI responses, conversation summaries, and signals about what's missing.",
        "A visitor asks a question. The AI answers if it has enough to go on. If it doesn't, that gap becomes feedback. The owner adds context, uploads a resource, or updates instructions, and the profile gets better the more it's used.",
        "Those conversations run both ways. For the owner they become analytics, top questions, recurring topics, and prompts about what's missing, a read on how they're coming across and what their audience wants most.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: ["How knowledge comes together: resources, context, instructions, visitor questions, and conversation insights"],
    },
    {
      kind: "section",
      title: "Role & ownership",
      kicker: "From product design into founder-level product ownership.",
      body: [
        "As a co-founder on a three-person team, I owned product and AI UX end to end, from research and information architecture through onboarding, mobile, and prompt and context design, while sharing strategy, pricing, and go-to-market with my co-founders.",
        "On a team that small, design, business, and engineering decisions were tightly linked. The work was less about handing off screens and more about shaping the product with the team, continuously.",
      ],
    },
    {
      kind: "section",
      title: "Outcome",
      kicker: "Approaching launch with a validated waitlist and a product still evolving.",
      body: [
        "After about a year, Ambasdr grew from an early hiring hypothesis into a broader platform for professional and creative representation: 500 on the waitlist, around 20 beta users, 450+ research conversations, 15 onboarding iterations, a test community of 50 to 100 people, and a product spanning web, iOS, and Android.",
        "The direction is sharper now. Ambasdr isn't about making another profile. It's about giving people a living representation of who they are, what they do, and why it matters.",
      ],
    },
    {
      kind: "quote",
      text: "Designing an AI product taught me that representation is a trust problem.",
    },
    {
      kind: "section",
      title: "Reflection",
      body: [
        "The hardest part of Ambasdr wasn't getting the AI to respond. It was making sure each response felt accurate, controlled, and true to the person behind it. AI usually gets talked about in terms of speed and automation. But once it's speaking for someone, the real question is trust.",
        "If Ambasdr works ten years from now, the proof won't be that everyone uses AI. It'll be that people can show up as their full professional, creative, and entrepreneurial selves in one place, instead of being boxed in by LinkedIn, Linktree, resumes, portfolios, or a pile of context-free links.",
      ],
    },
  ],
};

/* -------------------------------------------------------- Kortshut (full) --- */
const kortshut: CaseStudyContent = {
  slug: "kortshut-ai",
  project: "Kortshut",
  title: "Designing a context-first operating system.",
  lead:
    "An ongoing exploration of AI-native workflows, and what computing looks like " +
    "when context matters more than the apps you're in. This is a record of how " +
    "the thinking is evolving, not a finished product.",
  meta: [
    { label: "Role", value: "Co-Founder & Product Designer" },
    { label: "Timeline", value: "2025 – Present" },
    { label: "Team", value: "3 founders · Product · Eng · AI" },
    { label: "Platform", value: "macOS" },
  ],
  focusAreas: [
    "Product Strategy",
    "AI Workflow Design",
    "macOS Product Design",
    "Information Architecture",
    "Human–AI Interaction",
    "Design Systems",
    "AI-Assisted Development",
  ],
  chapters: [
    { id: "shift", label: "The Shift" },
    { id: "observation", label: "Observation" },
    { id: "hypothesis", label: "Hypothesis" },
    { id: "research", label: "Research" },
    { id: "explorations", label: "Explorations" },
    { id: "decisions", label: "Decisions" },
    { id: "questions", label: "Open Questions" },
    { id: "reflection", label: "Reflection" },
  ],
  blocks: [
    { kind: "media", variant: "wide", labels: ["Kortshut running on macOS"] },
    {
      kind: "section",
      id: "shift",
      title: "The shift",
      kicker: "LLMs didn't remove the work. They moved where it happens.",
      body: [
        "The bottleneck was no longer writing. It became assembling enough context for the AI to produce something useful.",
        "Every design review, engineering task, research session, and strategy doc followed the same loop: grab some information, screenshot, copy text, switch apps, rebuild the context, prompt an AI, go back to work, and do it again.",
        "The models got better fast. The workflow didn't. Kortshut started as an attempt to cut that friction.",
      ],
    },
    {
      kind: "banner",
      eyebrow: "The question",
      text: "What happens when computers understand context instead of applications?",
    },
    {
      kind: "section",
      id: "observation",
      title: "Observation",
      kicker: "Computers organize work around files and applications. People organize work around context.",
      body: [
        "A designer isn't thinking about Figma. They're thinking about redesigning onboarding. A developer isn't thinking about Finder. They're thinking about fixing a bug, using notes, screenshots, logs, and earlier discussions.",
        "Today's operating systems know where files live. They don't know why those files belong together. That gap became the basis for every product decision that followed.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: ["Fragmented context across Figma, browser, Claude, Cursor, screenshots, clipboard, and notes"],
    },
    {
      kind: "section",
      id: "hypothesis",
      title: "Early hypothesis",
      kicker: "“If we make AI easier to access, people will work faster.”",
      body: [
        "Early concepts chased faster prompting, keyboard shortcuts, AI launchers, and a better clipboard. They made things quicker, but missed the bigger problem.",
        "The real bottleneck wasn't opening AI. It was rebuilding context before every conversation.",
      ],
    },
    {
      kind: "section",
      id: "research",
      title: "Research & continuous discovery",
      kicker: "Kortshut evolved through steady observation and dogfooding, not a fixed philosophy.",
      body: [
        "The same patterns kept surfacing: screenshots became temporary memory; clipboard contents disappeared despite remaining valuable; users repeatedly rebuilt the same prompt context; AI quality depended more on context than prompt wording; and keyboard shortcuts only mattered when attached to repeatable workflows.",
        "That shifted the product away from “AI utilities” toward workflow orchestration.",
      ],
    },
    {
      kind: "stats",
      items: [
        { value: "~1yr", label: "Of product exploration" },
        { value: "~15", label: "Workflow & onboarding iterations" },
        { value: "20", label: "Active beta users" },
        { value: "3", label: "Person founding team" },
        { value: "100s", label: "Design explorations across Figma, Claude Code, Cursor, Codex & Stitch" },
      ],
    },
    { kind: "banner", eyebrow: "Emerging principle", text: "Context is more valuable than prompts." },
    {
      kind: "section",
      title: "Why context, not prompts",
      body: [
        "Early versions leaned on prompts. What we saw was that people cared far less about prompts than about outcomes. The better question turned out to be: how fast can someone gather everything the AI needs without breaking their flow? That still guides the roadmap.",
      ],
    },
    {
      kind: "section",
      id: "explorations",
      title: "Exploration 01 — Persistent context",
      kicker: "What if copied information wasn't disposable, but persistent working memory?",
      body: [
        "Instead of treating the clipboard as throwaway, we explored it as working memory that sticks around. Past clipboard items, screenshots, and saved references became reusable pieces of context rather than temporary scraps.",
        "The goal wasn't to remember what had been copied. It was to recover the thinking behind it.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: ["The clipboard as persistent, searchable working memory"],
    },
    {
      kind: "section",
      title: "Exploration 02 — Workflow shortcuts",
      kicker: "Keyboard shortcuts were never the point. They were a way into repeatable workflows.",
      body: [
        "The real design challenge shifted from cutting clicks to protecting focus.",
      ],
    },
    {
      kind: "evolution",
      label: "The workflow, compressed",
      beforeLabel: "Traditional workflow",
      afterLabel: "Explored workflow",
      rows: [
        { before: "Capture, copy, screenshot", after: "One shortcut" },
        { before: "Switch apps, open AI", after: "Context assembles automatically" },
        { before: "Paste, rebuild the prompt", after: "AI responds in place" },
        { before: "Return, repeat", after: "Keep working" },
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: ["One shortcut that assembles context and brings the AI in place"],
    },
    {
      kind: "decisionLog",
      id: "decisions",
      title: "We stopped designing around prompts.",
      rows: [
        { label: "Initial belief", text: "Prompts were the primary unit of interaction." },
        { label: "Observation", text: "Users repeated workflows more consistently than prompts." },
        { label: "Current direction", text: "Design around reusable workflows that naturally contain prompting." },
      ],
    },
    {
      kind: "decisionLog",
      title: "The clipboard became working memory.",
      rows: [
        { label: "The shift", text: "Copied content stopped being transient and became searchable, referenceable, and context-aware." },
        { label: "Status", text: "This remains an active area of product exploration." },
      ],
    },
    {
      kind: "section",
      title: "What we chose not to build",
      body: [
        "Kortshut deliberately avoids becoming another chatbot, launcher, note-taking app, or prompt marketplace. Those already exist. The opening is in connecting them through context.",
      ],
    },
    {
      kind: "section",
      title: "Designed while adopting AI",
      body: [
        "Kortshut was designed while leaning on AI throughout. Claude Code, Cursor, Codex, Google Stitch, and Figma AI sped up prototyping, implementation, and experimentation. They shortened the loop between a hypothesis and a real test, without replacing the design thinking.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: ["AI-assisted product development: hypothesis → prototype → validate → iterate"],
    },
    {
      kind: "evolution",
      label: "How my thinking changed",
      beforeLabel: "Earlier thinking",
      afterLabel: "Current thinking",
      rows: [
        { before: "AI needs faster access.", after: "AI needs better context." },
        { before: "Prompts are the product.", after: "Workflows are the product." },
        { before: "Clipboard history adds utility.", after: "Persistent context enables better decisions." },
        { before: "Keyboard shortcuts save time.", after: "Embedded workflows preserve focus." },
      ],
    },
    {
      kind: "questions",
      id: "questions",
      label: "Open questions",
      items: [
        "Should context be assembled manually, or inferred automatically?",
        "Is the clipboard the right primitive, or is context itself the primitive?",
        "When does automation become invisible enough to feel natural?",
        "How should AI balance initiative with user control?",
      ],
    },
    {
      kind: "banner",
      id: "reflection",
      eyebrow: "Reflection",
      text: "Designing AI products is rarely about designing better AI. It's about designing better ways for people to capture, keep, find, and reuse context.",
    },
    {
      kind: "section",
      title: "An active exploration",
      body: [
        "Kortshut remains an active exploration into that problem. Rather than documenting a finished product, this case study documents an evolving way of thinking about human–computer interaction in an AI-native world.",
        "The product remains alive. The thinking continues.",
      ],
    },
  ],
};

/* -------------------------------------------------------- Pareto (full) --- */
const pareto: CaseStudyContent = {
  slug: "healthcare-data",
  project: "Pareto Intelligence",
  title: "Bringing clarity to enterprise healthcare analytics.",
  lead:
    "I turned Pareto Intelligence's data platform into something built around its " +
    "users, through a full portal redesign and the company's first real design " +
    "system.",
  meta: [
    { label: "Role", value: "Lead UX Designer" },
    { label: "Industry", value: "Healthcare analytics · Enterprise" },
    { label: "Client", value: "Pareto Intelligence" },
    { label: "Timeline", value: "Mar 2020 – Jun 2022" },
  ],
  heroImage: {
    src: "/img/cases/pareto/hero-dashboard.png",
    w: 1800,
    h: 1012,
    alt: "Pareto Intelligence: the redesigned analytics portal on macOS",
  },
  heroFramed: true,
  blocks: [
    {
      kind: "stats",
      items: [
        { value: "25%", label: "Reduction in task completion time" },
        { value: "30%", label: "Decrease in user error rates" },
        { value: "20%", label: "Increase in new subscriptions" },
      ],
    },
    {
      kind: "section",
      title: "About Pareto",
      body: [
        "Pareto Intelligence builds data products for some of the largest healthcare payers in the U.S., including Cigna, Blue Cross Blue Shield, and Humana. Its tools help these organizations reconcile millions in financial discrepancies, dig into complex claims data, and run more efficiently.",
        "When I joined, the analytics underneath were strong, but the experience on top was a patchwork. Dashboards didn't match each other, workflows were confusing, and dense datasets made it hard for analysts to read a screen and act on it. My job was to bring order and usability to a set of enterprise tools handling huge volumes of sensitive financial and clinical data.",
      ],
    },
    {
      kind: "section",
      title: "The Challenge",
      body: [
        "There was no shared design system, so teams built components on their own and the same UI element behaved differently from one product to the next. The mismatches in color, spacing, type, and interaction piled up design and engineering debt, slowed onboarding, made errors more likely in financial workflows, and pushed maintenance costs up over time.",
        "At the same time, the platform had to handle dense healthcare data: claims, diagnoses, risk scoring, audits, payments, RAF charts, and compliance triggers. But the underlying structure was weak, so it was hard to spot anomalies, decide what to fix first, or compare trends. Everything leaned on Tableau dashboards that worked but didn't scale, with no clear hierarchy, clumsy cross-filtering, and little support for how specific people worked.",
        "The company was moving to Looker and needed a UX lead to shape that transition. There was a bigger problem underneath it too: navigation, filtering, and insight patterns changed from tool to tool, so analysts had to keep relearning how to work as they moved between products.",
      ],
    },
    {
      kind: "section",
      title: "Research & Insights",
      kicker: "Users weren't asking for more data. They wanted to trust what they were already looking at.",
      body: [
        "I ran a thorough UX audit: heuristic evaluations, cognitive-load and task-time analysis, error reviews with subject-matter experts, accessibility checks, and a look at how consistent the products were with each other. The same issues kept coming up: insights weren't prioritized, filtering was inconsistent, data tables were overbuilt, it took too many clicks to reach the important details, key metrics were buried, and visual noise hid the trends. Alongside that, I interviewed and shadowed analysts, claims auditors, actuarial teams, operations leaders, executives, and compliance partners.",
        "From there, I restructured the information around a simple flow: insight, then context, then action, then audit. I standardized filtering, simplified navigation, and added reusable data groupings and priority-based layouts for the metrics that mattered most. I designed and built Pareto's first design system, then led the vision for moving dozens of Tableau dashboards into Looker: rebuilding the visuals with consistent logic, clearer drill paths, shared charting rules, better comparison views, and stronger performance under load. I validated it with interactive Figma prototypes tested with analysts across teams.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      images: [
        {
          src: "/img/cases/pareto/research-board.png",
          w: 940,
          h: 1217,
          alt: "Design Jam: auditing every dashboard's charts, downloads, and insight naming across markets",
        },
      ],
    },
    {
      kind: "section",
      title: "System Design & Architecture",
      kicker: "The real breakthrough was a design system that could scale across enterprise healthcare analytics.",
      body: [
        "I built a single design system that every product adopted. It standardized the type hierarchy; color coding for statuses, risk states, and data confidence; and reusable dashboard pieces like cards, KPIs, comparison tables, and filters. It also set navigation patterns, spacing, grids, composition rules, and interaction behaviors like hover, expand, drilldown, sort, and compare.",
        "It cleared our worst internal bottlenecks: quicker, clearer specs for engineering, consistent layouts for analysts, and more predictable timelines for leadership on new features. It was easier to maintain too, and it became the foundation for every product update over the next two years.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      images: [
        {
          src: "/img/cases/pareto/design-system.png",
          w: 1600,
          h: 1435,
          alt: "Pareto's design system: typography, color scales, components, buttons, and badges",
        },
      ],
    },
    {
      kind: "section",
      title: "Dashboard Redesigns",
      kicker: "From cluttered screens to intuitive analytics.",
      body: [
        "I redesigned several of the key dashboards so scattered data turned into something people could act on. They didn't just look better. They were measurably faster to use, easier to read, and closer to how analysts actually think, which led to sharper decisions.",
      ],
    },
    {
      kind: "banner",
      eyebrow: "Reconciliation dashboards",
      text: "Help teams catch discrepancies faster and more accurately, the reconciliation work that recovers millions for payers.",
    },
    {
      kind: "media",
      variant: "wide",
      labels: [
        "The redesigned reconciliation dashboard, with discrepancies and recovered-revenue signals surfaced at a glance",
      ],
    },
    {
      kind: "cards",
      label: "What the redesign focused on",
      items: [
        {
          title: "KPI visibility",
          body: "Reordered top-level metrics so analysts understand health, risk, and revenue position at a glance.",
        },
        {
          title: "Drilldown flows",
          body: "Streamlined filter-to-insight pathways move users from “what happened?” to “why?” with fewer clicks.",
        },
        {
          title: "Visual hierarchy",
          body: "Removed low-value charts, clarified comparison views, and surfaced anomalies earlier.",
        },
        {
          title: "Membership & risk views",
          body: "Added contextual tooltips, confidence markers, and forecast indicators to support better decisions.",
        },
      ],
    },
    {
      kind: "media",
      variant: "grid",
      labels: [
        "Redesigned KPI & reconciliation views",
        "Drilldown, comparison, and membership / risk views",
      ],
    },
    {
      kind: "section",
      title: "Impact",
      body: [
        "Measured against the old portal, the redesign was associated with a 25% drop in task-completion time and a 30% drop in error rates, the metrics closest to the interface itself, in testing with analysts. Over the two years that followed, the company also saw a 20% rise in new subscriptions; the redesign was one contributor among sales, pricing, and product changes rather than the sole cause.",
        "Just as important operationally, the design system gave engineering a single, consistent foundation for every release that came after.",
      ],
    },
    {
      kind: "section",
      title: "Reflection",
      body: [
        "The lasting lesson wasn't about any one dashboard. It was that in enterprise analytics the interface is only as trustworthy as the system beneath it, and a design system is what makes that trust repeatable across products, teams, and years.",
        "If I ran it again, I'd instrument the rollout from day one, so the story of what the redesign changed could be told in measured before-and-afters instead of reconstructed after the fact.",
      ],
    },
    {
      kind: "quote",
      text: "The hardest part of enterprise UX isn't making one screen clear. It's making every screen agree with the next one.",
    },
  ],
};

const FULL: Record<string, CaseStudyContent> = {
  "real-estate-investing": doorvest,
  "secure-file-sharing": superfile,
  "trust-at-scale": synctera,
  "digital-identity": ambasdr,
  "kortshut-ai": kortshut,
  "healthcare-data": pareto,
};

/** Draft content synthesized from the card until the real write-up lands. */
function draftFor(slug: string): CaseStudyContent | null {
  const card = caseStudies.find((c) => c.slug === slug);
  if (!card) return null;
  const project = BRAND[slug] ?? card.title;
  return {
    slug,
    project,
    eyebrow: project,
    title: card.titleHighlight
      ? `${card.title} ${card.titleHighlight}`
      : card.title,
    lead: card.description,
    meta: [
      { label: "Scope", value: card.tags[0] ?? "Product design" },
      { label: "Role", value: "Product Designer" },
      { label: "Client", value: project },
    ],
    focusAreas: card.tags,
    heroLabel: card.title,
    blocks: [],
    draft: true,
  };
}

export function getCaseStudy(slug: string): CaseStudyContent | null {
  return FULL[slug] ?? draftFor(slug);
}

export interface CaseRef {
  slug: string;
  project: string;
}

/** Prev is null on the first study; next always exists (wraps) — you can always
 *  move forward even when you can't go back. */
export function getAdjacent(slug: string): { prev: CaseRef | null; next: CaseRef | null } {
  const i = caseOrder.indexOf(slug);
  if (i === -1) return { prev: null, next: null };
  const ref = (s: string): CaseRef => ({
    slug: s,
    project: BRAND[s] ?? caseStudies.find((c) => c.slug === s)?.title ?? s,
  });
  return {
    prev: i > 0 ? ref(caseOrder[i - 1]) : null,
    next: ref(caseOrder[(i + 1) % caseOrder.length]),
  };
}
