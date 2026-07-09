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
    "As founding product designer at Doorvest, I owned the investor experience " +
    "end to end — onboarding, marketplace discovery, portfolio management, and " +
    "long-term ownership. The company was shifting from a high-touch, service-heavy " +
    "model to a scalable, product-led marketplace, and my focus was helping people " +
    "feel confident navigating something most had never done: investing in real " +
    "estate, remotely.",
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
        "Remote real estate investing carries real operational and emotional weight. Most people didn't fully grasp cash flow, appreciation, reserve costs, or how tenant management actually worked — and they were being asked to commit capital to a home they would never physically visit.",
        "Trust was the core challenge. Investors wanted visibility into renovations, underwriting logic, and projected returns before they'd move forward. But the existing funnel optimized for control, not momentum — every manual handoff added delay, uncertainty, and cognitive fatigue that directly suppressed conversion and repeat engagement.",
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
          alt: "Framing the problem into design goals — educate without overwhelming, simplify while showing risk, help inexperienced users feel capable, and reduce dependency on manual communication",
        },
      ],
    },
    {
      kind: "section",
      title: "Live user research",
      body: [
        "Digging into customer support conversations surfaced an overwhelming tone of unhappiness. Users were missing time-sensitive email notifications, and when they did engage, they were often shown homes that didn't match their stated preferences.",
        "The friction wasn't a single broken screen — it was an experience stitched together from emails, spreadsheets, and sales coordination. People couldn't self-serve, so momentum stalled exactly where confidence needed to build.",
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
          alt: "A live user-research session with the Head of Product and a customer — “I keep missing the emails Doorvest sends. I really wanted that house!”",
        },
      ],
    },
    {
      kind: "section",
      title: "Core product insight",
      body: [
        "One pattern cut through everything: investors were not all using Doorvest the same way. Newer investors needed education and reassurance before they'd act. Experienced investors needed the opposite — faster access to the numbers and sharper filtering to move quickly.",
        "That split reframed the work. The product couldn't be one linear funnel; it had to flex to the confidence and intent of whoever was using it at the time.",
      ],
    },
    {
      kind: "quote",
      text: "Investors were not all using Doorvest the same way — some needed to be taught, and some needed to be trusted to move fast.",
    },
    {
      kind: "section",
      title: "Marketplace intelligence & behavioral modeling",
      kicker: "We made immediate marketplace access the default.",
      body: [
        "The original experience relied on timed email property drops — a cadence that manufactured pressure while offering almost no visibility. I moved discovery and reservation directly into the product, so investors could browse and compare properties at their own pace instead of waiting for the next drop.",
        "Each listing surfaced everything at a glance: property photos, financial projections, neighborhood data, and a clear Reserve Home action. The marketplace was designed to prioritize clarity and trust at the exact moments of financial commitment — removing the delay that had been suppressing conversion.",
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
          alt: "The Doorvest marketplace — investment portfolios above the browsable in-app home inventory",
        },
      ],
    },
    {
      kind: "section",
      title: "“Doormatch” preference matching",
      body: [
        "Rather than a separate swipe app, we implemented Like / Dislike buttons on each property card — subtly reminiscent of the swipe idea, but contained within the browsing experience. When a user liked a property, the system logged its attributes: location, price, home type, and more.",
        "We deliberately avoided a standalone swipe experience to prevent novelty-driven behavior and keep users anchored in real investment context. This data fueled the Doormatch algorithm, which highlighted properties likely to fit the user's criteria — reducing analysis paralysis by progressively narrowing the decision space without requiring explicit configuration.",
        "It personalized the marketplace and gave the sales team insight into what each user wanted, without constant back-and-forth.",
      ],
    },
    {
      kind: "quote",
      text: "Doormatch sped up the process of finding a “yes” property — an internal analysis showed a notable uptick in Letters of Intent after it launched. Even when users didn't immediately purchase, they browsed more when the options felt tailored to them.",
    },
    {
      kind: "section",
      title: "Streamlined purchase flow",
      kicker: "The primary blocker wasn't intent — it was effort.",
      body: [
        "I redesigned the reservation flow down to just a few clicks, eliminating unnecessary fields and leaning on saved profile information. The interface delivered instant feedback, a clear confirmation screen, and an email follow-up — so committing felt fast and reassuring rather than daunting.",
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
        "Reserving a home was only half the journey. Ownership itself had been fragmented across emails, spreadsheets, and manual communication — investors had no single place to understand what they actually owned or how it was performing.",
        "I centralized the entire investment lifecycle into one dashboard: portfolio tracking, renovation visibility, lease access, and document retrieval. Owning through Doorvest became as clear and self-serve as buying through it.",
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
          alt: "The centralized ownership dashboard on web and mobile — portfolio value, homes, distributions, recent activity, statements, and documents in one place",
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
        "The platform reduced friction for users and internal teams alike. By centralizing discovery, evaluation, and reservation, it removed the manual coordination that had bottlenecked the sales team — and it created shared visibility between investor demand, acquisition strategy, and operational workflows.",
      ],
    },
    {
      kind: "embed",
      embed: "doorvest-system-map",
      caption:
        "The operational architecture the redesigned investor platform connected — every workflow, tool, and team, with the platform at the center. Hover any node to trace its role and connections.",
    },
    {
      kind: "stats",
      items: [
        { value: "+13.8%", label: "Visitor → active investor conversion" },
        { value: "+40%", label: "Home reservations" },
        { value: "~80%", label: "User engagement & retention" },
      ],
    },
    {
      kind: "section",
      title: "Reflection",
      body: [
        "The most important lesson was that financial products are emotional systems. People weren't only evaluating returns — they were deciding whether to trust a company with a life-changing amount of money, on a home they'd never set foot in.",
        "Over four years, Doorvest evolved from a fragmented, operator-heavy service into a connected, scalable product — one that supports the full arc of investing: marketplace discovery, reservation, portfolio management, and the long tail of ownership.",
      ],
    },
    {
      kind: "quote",
      text: "The most important lesson was that financial products are emotional systems — you're designing for confidence as much as for returns.",
    },
  ],
};

/* ------------------------------------------------------ Superfile (full) --- */
const superfile: CaseStudyContent = {
  slug: "secure-file-sharing",
  project: "Superfile",
  title: "Designing secure monetization for a zero-trust file platform.",
  lead:
    "Superfile is a venture-backed cybersecurity startup building sovereign file " +
    "control — files that stay secure and under the creator's control even after " +
    "they're shared. I led design for its pay-to-unlock system: a way to sell " +
    "access to a file without ever surrendering ownership, built on a zero-trust " +
    "foundation across macOS and web.",
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
        "Traditional file sharing means losing control the instant someone downloads a copy — ownership, rights, and access are gone. For creators, real value isn't tied only to the file, but to its journey: who has it, how it's used, and whether it stays protected.",
        "Superfile changes the model — upload, grant access, monitor usage, modify permissions, revoke access, maintain ownership. It flips ownership from a lost event into an adaptive, monitored, revocable system where the file stays an asset, not a liability. The challenge I owned was letting people sell access to those files without ever weakening security or trust.",
      ],
    },
    {
      kind: "section",
      title: "Building a new mental model",
      body: [
        "To shift digital ownership, we designed around permission states and resilient access control. Instead of files being infinitely replicable, the system tracks provenance, authenticates viewers, and adapts permissions dynamically.",
        "Ownership context loops from the creator through the file; permissions are then layered and states enforced for every viewer — much like enterprise SaaS documentation, but for creative rights.",
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
          alt: "Superfile's file-native capabilities — trackable, unhackable, and take-backable files",
        },
      ],
    },
    {
      kind: "section",
      title: "The product ecosystem",
      body: [
        "The Superfile ecosystem spans a macOS app, web platform, secure viewers, payments, permissioning, ownership verification, accounts, and tracking. Together these systems enforce digital rights and enable creative monetization.",
        "The system map lays out roles, relationships, and routes of value across the platform — making the complexity navigable for every audience, from engineers to investors.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: [
        "The Superfile product ecosystem map — macOS app, web, secure viewers, payments, permissioning, ownership verification, and tracking",
      ],
    },
    {
      kind: "section",
      title: "Context: why this mattered",
      kicker: "Payment wasn't meant to replace security — it was meant to sit on top of it.",
      body: [
        "The push for monetization came directly from leadership and investors, with a focus on the ownership of files. The audience wasn't just creators — it was owners of digital assets who want control, protection, and the ability to sell access without giving up ownership.",
        "That framing immediately ruled out traditional paywall patterns. If access could be copied, bypassed, or granted prematurely, the product would undermine the very idea of ownership it claimed to protect.",
      ],
    },
    {
      kind: "quote",
      text: "The real question wasn't whether to monetize. It was how to do so without breaking Superfile's zero-trust foundation.",
    },
    {
      kind: "section",
      title: "Building with Stripe",
      kicker: "I owned this work end-to-end across product strategy, UX, and engineering execution.",
      body: [
        "Stripe was used intentionally as the transaction layer rather than reinventing payments in house. The work wasn't simply integrating a checkout form — it was defining how an external payment provider could safely trigger access inside a security-first system. I led the design and implementation strategy for how Stripe events connected to Superfile's access model.",
        "Payments were treated as a prerequisite for access, not proof of ownership. A successful transaction didn't unlock a file by default — it only allowed the system to release access after payment confirmation was validated and matched against the correct file and recipient. This let Superfile support retries, failures, and revocation without exposing sensitive states or granting premature access.",
        "The system map became a shared contract between design and engineering, defining ownership boundaries and distinguishing which states were technically impossible versus simply undesired.",
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
          alt: "Pay-to-unlock system map — how Stripe events safely trigger access without granting ownership",
        },
      ],
    },
    {
      kind: "section",
      title: "A controlled payment surface",
      kicker: "Monetization had to exist inside the product without weakening its zero-trust foundation.",
      body: [
        "Rather than relying on Stripe's default checkout, I designed a custom pay-card component that lived natively inside the Superfile experience. This let us control how payment intent was expressed and validated, while ensuring transactions could never directly grant ownership or bypass the security model.",
      ],
    },
    {
      kind: "section",
      title: "Component architecture",
      body: [
        "The pay-to-unlock surface is a layered component structure that separates payment intent from access authority, so monetization never weakens Superfile's security model. Each layer increases system authority while intentionally reducing user-controlled outcomes — from primitive inputs like card number and cardholder name, up through the transaction-intent layer, to the container that finally grants access.",
      ],
    },
    {
      kind: "media",
      variant: "panel",
      labels: [
        "Component architecture — primitive inputs → transaction-intent layer → the pay-to-unlock container that releases access",
      ],
    },
    {
      kind: "section",
      title: "Cross-platform decisions & trade-offs",
      body: [
        "A major decision was whether to implement platform-specific payment logic for macOS versus web. Native implementations felt appealing but introduced long-term risk of divergence in payment behavior, webhook handling, and security assumptions. I proposed embedding a lightweight web view inside the macOS app so both platforms reused the same Stripe checkout flow and backend logic — reducing the surface area for bugs and security drift.",
      ],
    },
    {
      kind: "section",
      title: "Investor storytelling",
      body: [
        "Complex technology only matters if people understand it. Before, investors saw technical diagrams and processes; after, they grasped the narrative — problem, ownership, monetization, control, market opportunity. Visual storytelling became a core tool for bridging technical depth and business value.",
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
      title: "My contribution",
      body: [
        "Discovery, product definition, architecture, design systems, investor demos, user testing, engineering collaboration, and fundraising support — every phase required systems thinking, from inside the interface to the pitch deck.",
      ],
    },
    {
      kind: "section",
      title: "Execution, checks & learnings",
      body: [
        "Throughout the project I ran structured sprints alongside the product manager, prioritized work in Jira, and documented system flows, UI decisions, and constraints in Figma and Notion. These artifacts weren't just deliverables — they were safeguards against misalignment in a security-sensitive feature, crucial while Superfile pivoted and changed features often.",
        "The product launched internally and was tested and used by investors, who successfully experienced the pay-to-unlock feature while logged into their invite-only Superfile accounts.",
      ],
    },
    {
      kind: "section",
      title: "Reflection",
      body: [
        "Superfile's journey was less about pixels and more about frameworks, relationships, and outcomes — a lesson in product narrative as much as product design.",
      ],
    },
    {
      kind: "quote",
      text: "The challenge was never designing secure file sharing. It was designing confidence, control, and trust in a digital environment where ownership often feels temporary.",
    },
  ],
};

/* ------------------------------------------------------- Synctera (full) --- */
const synctera: CaseStudyContent = {
  slug: "trust-at-scale",
  project: "Synctera",
  title: "Redesigning fraud operations for trust at scale.",
  lead:
    "Where I redesigned fraud operations — helping operatives reduce wrongful " +
    "transaction blocks by 20% and aligning banks and fintechs on a unified " +
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
    alt: "Synctera fraud operations — the redesigned Cases dashboard",
  },
  blocks: [
    {
      kind: "section",
      title: "About Synctera",
      body: [
        "Synctera provides the infrastructure that enables banks and fintechs to launch and operate regulated financial products. Within this ecosystem, fraud operations teams review alerts, investigate high-risk activity, and make decisions that directly impact customers, partner banks, and regulatory posture.",
        "As the platform scaled, fraud operations became increasingly complex. Analysts managed growing alert volume across KYC, transaction monitoring, and compliance workflows while coordinating with multiple external partners. Decisions were time-sensitive, auditable, and difficult to reverse.",
        "The challenge wasn't simply moving faster. It was maintaining confidence that decisions reflected the current reality of an investigation — especially when work was blocked, incomplete, or dependent on others.",
      ],
    },
    {
      kind: "section",
      title: "What was Broken",
      kicker:
        "Despite multiple tools and alerts, analysts lacked a reliable way to understand case state, priority, and ownership — leading to premature closure, blocked work, and invisible risk.",
      body: [
        "Case state didn't reflect reality. Cases had no clear sense of where they were in the investigation lifecycle. In several workflows, the only way to move a case forward was to mark it complete even when work was still ongoing — so in-progress investigations could appear resolved, while stalled work became invisible.",
        "Ownership was unclear. There was no reliable signal showing who was actively working a case or whether progress was blocked. Multiple analysts could unknowingly work the same investigation, duplicating effort and creating conflicting decisions.",
        "Progress moved outside the system. Blocked cases were resolved through Slack messages, emails, or phone calls. If documentation arrived by email and wasn't uploaded, cases stalled silently — none of it reflected back into the system of record.",
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
          alt: "Case-state model — the system reflects the current truth of work, even when blocked",
        },
      ],
    },
    {
      kind: "section",
      title: "How I Changed the System",
      kicker:
        "The system must always reflect the current truth of work, even when progress is blocked.",
      body: [
        "To address the pain points, I reframed fraud case management around a single principle — the system must always reflect the current truth of work — and rebuilt the experience around three moves: consolidating fragmented tooling, reducing coordination noise, and rebuilding case visibility at scale.",
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
        "Fraud investigations used to force analysts to jump between products like Hawk AI, Onfido, and Dotfile, piecing together identity checks, risk signals, and decisions across multiple tools. I mapped how those systems were actually being used and redesigned the workflow into a single internal experience that kept the investigation anchored in one place.",
        "Instead of replacing existing tools, I created a simple in-context way for analysts to open third-party systems when needed, then return to the case to capture findings and add notes without losing progress. This reduced back-and-forth, removed manual reconciliation, and gave teams a clearer, more reliable view of what was happening in each case.",
      ],
    },
    {
      kind: "section",
      title: "Reduced Coordination Noise",
      body: [
        "Analysts needed timely updates without constant interruption. Rather than broadcasting notifications, I designed alerts to activate only when intent was explicit — such as mentions or active watching.",
        "For teams that relied heavily on Slack, case notifications were connected directly to shared channels, anchoring coordination back to the system of record while preserving focus.",
      ],
    },
    {
      kind: "section",
      title: "Rebuilt Case Visibility at Scale",
      kicker:
        "The dashboard made priority, ownership, and workload immediately legible — without requiring analysts to infer urgency from tables or tribal knowledge.",
      body: [
        "Before the redesign, urgency was inferred socially. Cases older than a few days were assumed to be urgent, and workload lived in analysts' heads rather than the system.",
        "The redesigned dashboard encoded priority directly into the interface. Cases were ranked using priority signals and manager assignment, letting analysts focus on the highest-risk work without manual sorting.",
        "At a glance, it answered three questions — what needs attention now, who is working on what, and where work is getting stuck — replacing tribal knowledge with shared situational awareness.",
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
        "Impact was validated by tracking how cases moved through the system before and after launch — focusing on time spent in active investigation and the reduction in stalled or prematurely closed cases. Partnering closely with Operations and conducting post-launch analyst interviews confirmed that improvements reflected real workflow change, even as overall case volume increased.",
      ],
    },
    {
      kind: "section",
      title: "What I'd Protect Going Forward",
      kicker:
        "The dashboard functioned as a workload stabilizer for fraud operations — not a reporting surface.",
      body: [
        "If another designer took over this system, I'd caution against casual changes to the dashboard. It wasn't just a place to view tasks; it became the primary mechanism through which analysts understood their workload, progress, and capacity.",
        "By making assignment, priority, and active work visible at both the individual and team level, it helped analysts plan their day, set expectations, and avoid the constant feeling of falling behind. This visibility didn't just improve throughput — it reduced burnout by replacing uncertainty with clarity.",
        "At a team level, shared visibility let work be redistributed before pressure became unsustainable. The dashboard shaped behavior, morale, and trust — so any future changes should be validated against real operational behavior and evaluated for their impact on workload balance and team health.",
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
    "An AI-powered identity layer for modern professionals, creators, and " +
    "founders — one contextual, conversational place that explains who someone " +
    "is, what they do, and why it matters, even when they're not in the room.",
  meta: [
    { label: "Role", value: "Co-founder · Product & AI UX" },
    { label: "Timeline", value: "~1 year, concept → beta" },
    { label: "Team", value: "3-person founding team" },
    { label: "Platforms", value: "Web · iOS · Android" },
  ],
  // Curated chapter rail (16 section headings is too many); ids map to the
  // slugified section titles the view generates.
  chapters: [
    { id: "first-principles", label: "First principles" },
    { id: "the-problem-space", label: "The problem space" },
    { id: "research-validation", label: "Research & validation" },
    { id: "designing-an-ai-that-represents-people", label: "Designing the AI" },
    { id: "knowledge-architecture", label: "Knowledge architecture" },
    { id: "building-with-ai", label: "Building with AI" },
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
        "A person is no longer just a job title, a resume, a portfolio, or a social profile. The same person might be a designer, founder, photographer, investor, speaker, consultant, and community builder — and each part of that identity usually lives somewhere different.",
        "LinkedIn owns one version. Instagram owns another. TikTok, a portfolio, a resume, GitHub, YouTube, Calendly, Shopify, podcasts, and PDFs all hold fragments of the same person. The problem was never a lack of information — it was that the information had no connective tissue.",
        "Ambasdr is an AI-powered identity layer that brings those fragments together into one contextual, conversational experience — the layer between people and AI.",
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
      kind: "section",
      title: "The shift",
      kicker: "Individuals are becoming businesses.",
      body: [
        "The founding insight wasn't that people needed another profile — it was that individuals increasingly operate like businesses. They have brands, offers, audiences, inbound opportunities, content, proof of work, and context to explain.",
        "But the tools available to them were built around static representation. A resume is static. A portfolio is selective. A Linktree is a list. A QR code transfers contact details but never explains the person behind them.",
        "Professional identity should be contextual, always available, and able to answer questions even when the person isn't in the room.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: ["From business card → QR code → link page → conversational identity layer"],
    },
    {
      kind: "section",
      title: "The problem space",
      kicker:
        "Modern identity is fragmented across platforms that don't understand each other.",
      body: [
        "For multidisciplinary people, the challenge isn't too much information — it's that each platform forces a narrow version of who they are. LinkedIn favors work history, Instagram visual identity, TikTok personality, a portfolio curated case studies, GitHub code, YouTube video, Calendly scheduling, commerce links transactions.",
        "None of them explain how the pieces relate. A designer who is also a founder struggles to show both without seeming unfocused; a candidate never knows where context was lost after a conversation; a founder misses inbound because no single destination explains the full picture.",
        "The opportunity wasn't to replace those platforms. It was to create a layer above them.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: [
        "Identity distributed across platforms that don't understand each other — LinkedIn, Instagram, TikTok, GitHub, portfolio, resume, YouTube, commerce, Calendly",
      ],
    },
    {
      kind: "section",
      title: "What we chose not to build",
      kicker: "The product got clearer once we defined what it was not.",
      body: [
        "We weren't building another LinkedIn, another Linktree, another chatbot, another resume builder, another portfolio template, or another social network. People had already invested real time shaping their presence across those platforms — Ambasdr wasn't meant to erase that work. It was meant to make it understandable.",
      ],
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
        "Ambasdr was informed by recruiters, creators, professionals, influencers, hiring managers, VCs, beta testers, and waitlist users — not one narrow persona. Across all of them, the same pattern kept surfacing: people weren't struggling to present information, they were struggling because their information was scattered across too many systems.",
        "Many had multiple resumes, portfolios, audiences, and identities at once. Those identities weren't separate in real life, but existing tools forced them to become separate online. People needed a way to be understood without flattening themselves into one title.",
      ],
    },
    {
      kind: "cards",
      label: "What the research kept surfacing",
      items: [
        {
          title: "Multidisciplinary people couldn't show how their work connected",
          body: "They weren't confused about what they'd done — they were frustrated by how hard it was to show why it belonged together. That shaped the product around context, not categories.",
        },
        {
          title: "Everyone wanted an assistant, not just a profile",
          body: "Independent work creates overhead: introductions, repeated questions, the right link, follow-ups. People wanted something that could represent them when they were unavailable.",
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
          body: "People wanted to represent themselves across networking, collaboration, creative work, and business — not only employment.",
        },
        {
          title: "Static profile → conversational interface",
          body: "A better profile still made visitors interpret everything themselves. Conversation became the primary discovery model.",
        },
        {
          title: "File upload → AI teaching",
          body: "Files without context produce shallow representation. Onboarding became a system where users explain why resources matter.",
        },
        {
          title: "Voice as core → voice as enhancement",
          body: "Users were interested in voice, but structured profile interaction was more immediately useful. Voice became an expression of personality, not the only interaction.",
        },
      ],
    },
    {
      kind: "cards",
      label: "Product principles",
      items: [
        {
          title: "Representation over generation",
          body: "The AI shouldn't generate plausible answers — it should faithfully represent the person behind the profile. If it doesn't know, it admits uncertainty.",
        },
        {
          title: "Context is more valuable than content",
          body: "A file explains what someone did; it rarely explains what mattered. The product evolved from file upload into knowledge teaching.",
        },
        {
          title: "Conversation is discovery",
          body: "People learn about each other through questions. Questions became the interface — a profile that behaves less like a brochure and more like a conversation.",
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
      kicker: "The challenge wasn't answering questions — it was speaking on someone's behalf.",
      body: [
        "Most AI interfaces answer prompts. Ambasdr introduced a more sensitive problem: the AI had to represent a real person, which changed the definition of trust. Visitors needed to trust the answers were useful; owners needed to trust the AI wasn't misrepresenting them; and the product had to make clear that the user remained the source of truth.",
        "Every major feature connects back to four questions: Can the AI accurately represent me? Can I control what it knows? Can visitors trust the answers? Can I continuously improve how I'm represented?",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: ["Trust model — owner control, knowledge sources, AI response, visitor question, feedback loop"],
    },
    {
      kind: "cards",
      label: "Decision log",
      items: [
        {
          title: "The AI should admit uncertainty",
          body: "In most AI products an unanswered question feels like failure; for Ambasdr, an inaccurate answer was far worse. If it doesn't know, it doesn't say it — and guides the owner to improve their profile instead.",
        },
        {
          title: "Every file needed context",
          body: "Upload isn't the moment of intelligence. A project might show leadership, taste, technical depth, or community influence — without context the AI can summarize content but can't represent meaning. Resources carry labels, intent, and relationship to identity.",
        },
        {
          title: "Mobile became the authoring tool",
          body: "Users should manage their Ambasdr as quickly as sending a text. Mobile stopped being a companion and became the fastest place to update information, manage resources, and refine how the AI represents them.",
        },
      ],
    },
    {
      kind: "section",
      title: "Teaching instead of uploading",
      kicker: "Onboarding became a knowledge-transfer system.",
      body: [
        "Across roughly 15 onboarding versions, tested with a community of 50–100 people, the team realized a profile-setup flow wasn't enough. Ambasdr wasn't collecting information — it was learning how to represent someone.",
        "So onboarding had to answer deeper questions: what is this person trying to be known for, what topics should the AI understand, which resources matter most and why, what should it avoid saying, what tone should it use, and what should visitors be encouraged to ask. This is why Teach Your Ambasdr became one of the most important parts of the product.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: [
        "Onboarding flow — Purpose → Profile → Resources → Context → Teach Your Ambasdr → Preview → Publish → Pricing",
      ],
    },
    {
      kind: "section",
      title: "Knowledge architecture",
      kicker: "A living system, not a static page.",
      body: [
        "The hardest product problem was understanding how documents relate and how they should influence the AI in the background. Ambasdr connects profile data, files, links, resource context, system instructions, tone, visitor questions, AI responses, conversation summaries, and missing-information signals.",
        "A visitor asks a question; the AI answers if it has enough information; if it doesn't, the gap becomes useful feedback. The owner adds context, uploads resources, or updates instructions — and the profile improves through use.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: ["Knowledge architecture — resources + context + instructions + visitor questions + conversation insights"],
    },
    {
      kind: "section",
      title: "Public profile & conversational identity",
      kicker: "Balancing familiarity and intelligence.",
      body: [
        "A surprising beta insight: users still valued familiar link-based behavior. They liked connecting existing platforms — Linktree-style links, commerce pages, YouTube, socials — and Ambasdr added context around those destinations.",
        "So the experience has two layers: a familiar profile surface with links, identity, content, and proof; and a conversational AI layer that helps visitors understand what those things mean. Users preserve their existing presence while visitors get a better way to navigate it.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: ["Public profile — header, links, resources, and the AI chat entry point"],
    },
    {
      kind: "section",
      title: "Mobile as the authoring experience",
      kicker: "The fastest way to manage identity.",
      body: [
        "People update their professional story in motion — they meet someone, finish a project, add a link, change a role, adjust a prompt. Requiring a desktop return made the product feel too slow for the behavior we wanted to support.",
        "So mobile became more than a companion app. It became the place where users manage resources, revise context, and refine how the AI represents them — as quick as sending a text.",
      ],
    },
    {
      kind: "media",
      variant: "grid",
      labels: ["Mobile dashboard & file management", "Link management & profile editing"],
    },
    {
      kind: "section",
      title: "Conversation intelligence",
      kicker: "Visitor questions became product feedback.",
      body: [
        "Conversations aren't only a visitor experience — they're owner intelligence. When visitors ask questions, they reveal what people want to know. Repeated questions are a signal; unanswered ones are a knowledge gap; questions about collaboration, booking, hiring, press, or pricing are intent data.",
        "That opened the door to conversation summaries, top questions, topic clustering, missing-information prompts, suggested resources, and profile-improvement loops — helping users understand how they're perceived and what their audience needs most.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: ["Conversation analytics — top questions, topics, summaries, and suggested profile improvements"],
    },
    {
      kind: "section",
      title: "Pricing & business model",
      kicker: "Utility without overcomplicating access.",
      body: [
        "Pricing had to be accessible for individuals yet valuable for creators, professionals, and founders building serious personal brands. The team explored Free, Pro, and Premium tiers with a trial — keeping plan management primarily web-based to avoid App Store and Play Store payment constraints. It wasn't only a pricing decision; it was a product-architecture decision.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: ["Pricing — Free · Pro · Premium with a 7-day trial"],
    },
    {
      kind: "section",
      title: "Building with AI",
      kicker: "The way Ambasdr was built changed how the product was built.",
      body: [
        "Ambasdr wasn't only an AI product — it was designed and prototyped through an AI-assisted workflow: Figma, Figma Make, Claude Code, Codex, Cursor, Google Stitch, v0, React Native, and responsive-web prototyping.",
        "That let a three-person founding team explore more prototypes, test more ideas, and move faster across platforms than usual. The exact count mattered less than the operating model: prototype quickly, validate direction, translate patterns into implementation, and keep learning.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: ["AI-assisted workflow — design → code → prototype → test → feedback → iterate"],
    },
    {
      kind: "timeline",
      label: "How the product evolved",
      items: [
        { label: "Hiring use case", sub: "Help people get hired" },
        { label: "Professional profile", sub: "Represent the full picture" },
        { label: "Conversational representation", sub: "Questions become the interface" },
        { label: "AI identity layer", sub: "The layer between people & AI" },
        { label: "Beta readiness", sub: "500 waitlist · 20 beta" },
      ],
    },
    {
      kind: "section",
      title: "Role & ownership",
      kicker: "From product design into founder-level product ownership.",
      body: [
        "As a co-founder on a three-person team, the work spanned product vision, research, and strategy; information architecture and AI interaction design; onboarding, mobile, and web UX; design systems and prototyping; prompt and context design; pricing and roadmap; investor conversations, go-to-market, beta planning, and community.",
        "With a team that small, design, business, and engineering constraints were deeply connected. The work was less about handing off screens and more about continuously shaping the product with the team.",
      ],
    },
    {
      kind: "section",
      title: "Outcome",
      kicker: "Approaching launch with a validated waitlist and an evolving system.",
      body: [
        "After roughly a year, Ambasdr grew from an early hiring hypothesis into a broader platform for professional and creative representation: 500 on the waitlist, ~20 beta users, 450+ research conversations, 15 onboarding iterations, a tested community of 50–100, and a cross-platform product spanning web, iOS, and Android.",
        "The direction is sharper now. Ambasdr isn't just helping people create a profile — it's helping them create a living representation of who they are, what they do, and why it matters.",
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
        "The hardest part of Ambasdr wasn't making the AI respond. It was making sure the response felt accurate, controlled, and representative of the person behind it. AI products are usually discussed in terms of speed and automation — but when AI speaks on behalf of a person, the deeper issue is trust.",
        "If Ambasdr succeeds ten years from now, we won't know we won because everyone uses AI. We'll know because people feel they can be their full professional, creative, and entrepreneurial selves in one place — without being trapped inside the limits of LinkedIn, Linktree, resumes, portfolios, or scattered links with no context.",
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
    "An ongoing exploration into AI-native workflows — and what computing looks " +
    "like when context matters more than applications. This documents how the " +
    "thinking evolves, not a finished product.",
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
      kicker: "LLMs didn't eliminate work — they shifted where work happens.",
      body: [
        "The bottleneck was no longer writing. It became assembling enough context for AI to produce meaningful results.",
        "Every design review, engineering task, research session, or strategy doc followed the same pattern: capture information, screenshot, copy text, switch apps, reconstruct context, prompt an AI, return to work — and repeat.",
        "The models improved rapidly. The workflow did not. Kortshut began as an exploration into reducing that friction.",
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
        "A designer isn't thinking about Figma — they're thinking about redesigning onboarding. A developer isn't thinking about Finder — they're thinking about solving a bug using notes, screenshots, logs, and previous discussions.",
        "Current operating systems understand where files live. They don't understand why they belong together. That observation became the foundation for every subsequent product decision.",
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
        "Early concepts focused on faster prompting, keyboard shortcuts, AI launchers, and clipboard improvements. They improved speed — but failed to address the larger issue.",
        "The real bottleneck wasn't opening AI. It was rebuilding context before every conversation.",
      ],
    },
    {
      kind: "section",
      id: "research",
      title: "Research & continuous discovery",
      kicker: "Kortshut evolved through continuous observation and dogfooding — not a fixed philosophy.",
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
        "Early versions emphasized prompts. Research suggested users cared far less about prompts than outcomes. The better question became: how quickly can someone gather everything AI needs without breaking their flow? This principle continues to shape the roadmap.",
      ],
    },
    {
      kind: "section",
      id: "explorations",
      title: "Exploration 01 — Persistent context",
      kicker: "What if copied information wasn't disposable, but persistent working memory?",
      body: [
        "Instead of viewing the clipboard as transient, we explored it as persistent working memory. Historical clipboard items, screenshots, and captured references became reusable pieces of context rather than temporary artifacts.",
        "The goal wasn't to remember what had been copied. It was to recover thinking.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: ["Clipboard architecture — copied content as persistent, searchable working memory"],
    },
    {
      kind: "section",
      title: "Exploration 02 — Workflow shortcuts",
      kicker: "Keyboard shortcuts were never the destination — they became vehicles for repeatable workflows.",
      body: [
        "The design challenge shifted from reducing clicks to preserving cognitive flow.",
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
      labels: ["Keyboard-driven workflow — a shortcut that assembles context and returns AI in place"],
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
        "Kortshut intentionally avoids becoming another chatbot, another launcher, another note-taking app, or another prompt marketplace. Those categories already exist. The opportunity lies in connecting them through context.",
      ],
    },
    {
      kind: "section",
      title: "Designed while adopting AI",
      body: [
        "Kortshut was designed while actively adopting AI throughout the process. Claude Code, Cursor, Codex, Google Stitch, and Figma AI accelerated prototyping, implementation, and experimentation — shortening the feedback loop between hypothesis and validation, rather than replacing design thinking.",
      ],
    },
    {
      kind: "media",
      variant: "wide",
      labels: ["AI-assisted product development — hypothesis → prototype → validate → iterate"],
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
        "Is the clipboard the right primitive — or is context itself the primitive?",
        "When does automation become invisible enough to feel natural?",
        "How should AI balance initiative with user control?",
      ],
    },
    {
      kind: "banner",
      id: "reflection",
      eyebrow: "Reflection",
      text: "Designing AI products is rarely about designing better AI. It's about designing better systems for people to capture, preserve, retrieve, and reuse context.",
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
    "Transformed Pareto Intelligence's data platform into a user-centered " +
    "product through a full portal redesign and a scalable design system.",
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
    alt: "Pareto Intelligence — the redesigned analytics portal on macOS",
  },
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
        "Pareto Intelligence builds data-driven products for some of the largest healthcare payers in the U.S. — including Cigna, Blue Cross Blue Shield, and Humana — helping organizations reconcile millions in financial discrepancies, analyze complex claims data, and improve operational performance.",
        "When I joined, the underlying analytics were strong, but the UX foundation was fragmented: dashboards lacked consistency, workflows were unclear, and dense datasets made it hard for analysts to quickly interpret and act on insights. My role was to bring structure, clarity, and usability to an ecosystem of enterprise tools navigating large volumes of sensitive financial and clinical data.",
      ],
    },
    {
      kind: "section",
      title: "The Challenge",
      body: [
        "The organization lacked a unified design system, so teams built components in isolation and the same UI elements behaved differently across products. Inconsistencies in color, spacing, typography, and interaction created significant design and engineering debt, slowed onboarding, increased the risk of error in financial workflows, and raised long-term maintenance costs.",
        "At the same time, the platform needed to support dense healthcare data — claims, diagnoses, risk scoring, audits, payments, RAF charts, and compliance triggers — but weak information architecture made it difficult to identify anomalies, prioritize remediation, and compare trends. The experience leaned heavily on Tableau dashboards that were functional but not scalable, lacking clear hierarchy, efficient cross-filtering, and support for user-specific workflows.",
        "The company planned a migration to Looker and needed a UX lead to architect that transition — while also addressing a broader problem: fragmented product experiences where navigation, filtering, and insight patterns varied by tool, forcing analysts to constantly re-learn how to work across the system.",
      ],
    },
    {
      kind: "section",
      title: "Research & Insights",
      kicker: "Users weren't asking for more data — they wanted clarity and confidence in what they were seeing.",
      body: [
        "I led a comprehensive UX audit — heuristic evaluations, cognitive-load and task-time analysis, error reviews with subject-matter experts, accessibility checks, and cross-product coherence audits. It surfaced recurring issues: poor insight prioritization, inconsistent filtering, overbuilt data tables, excessive clicks to reach critical details, buried metrics, and visual noise that obscured trends. In parallel, I ran interviews and contextual inquiries with analysts, claims auditors, actuarial teams, operations leaders, executives, and compliance partners.",
        "Using that, I restructured the IA around a clear narrative flow — insight → context → action → audit — standardized filtering, simplified navigation, and introduced reusable data grouping and priority-based layouts for high-value metrics. I designed and built Pareto's first design system, then led the UX vision for migrating dozens of Tableau dashboards into Looker: rebuilding complex visuals with standardized logic, clearer drill paths, global visualization rules, improved comparison views, and better performance at scale — validated through interactive Figma prototypes tested with analysts across teams.",
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
          alt: "Design Jam — auditing every dashboard's charts, downloads, and insight naming across markets",
        },
      ],
    },
    {
      kind: "section",
      title: "System Design & Architecture",
      kicker: "The biggest breakthrough came from a scalable design system built for enterprise healthcare analytics.",
      body: [
        "I built a unified design system adopted across the entire product ecosystem — standardizing typography hierarchy; color coding for statuses, risk states, and data confidence; and reusable dashboard components like cards, KPIs, comparison tables, and filters. It also defined navigation patterns, padding, grids, composition rules, and interactive behaviors including hover, expand, drilldown, sort, and compare.",
        "The framework solved our biggest internal bottlenecks: faster, clearer specs for engineering, consistent layouts for analysts, predictability for leadership in new-feature development, and designs that were easier to maintain and scale. It became the visual and functional foundation for every product update over the following two years.",
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
          alt: "Pareto's design system — typography, color scales, components, buttons, and badges",
        },
      ],
    },
    {
      kind: "section",
      title: "Dashboard Redesigns",
      kicker: "From cluttered screens to intuitive analytics.",
      body: [
        "I redesigned several key dashboards to transform fragmented data into actionable insights. The redesigned dashboards weren't just prettier — they were measurably faster, clearer, and more aligned with the way analysts think, enabling smarter, more efficient business decisions.",
      ],
    },
    {
      kind: "banner",
      eyebrow: "Reconciliation dashboards",
      text: "Improve the accuracy and speed with which teams identify discrepancies — leading directly to millions in recovered revenue.",
    },
    {
      kind: "media",
      variant: "wide",
      labels: [
        "The redesigned reconciliation dashboard — discrepancies and recovered-revenue signals surfaced at a glance",
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
        "The redesigned portal and design system measurably improved the analyst experience — a 25% reduction in task-completion time, a 30% drop in user error rates, and a 20% increase in new subscriptions — while giving engineering a consistent foundation for every release that followed.",
      ],
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
