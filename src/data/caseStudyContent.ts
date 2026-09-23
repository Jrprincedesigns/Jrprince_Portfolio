/**
 * Full content for the case-study detail pages (/work/[slug]).
 *
 * This is also what grounds the Gemini assistant (see `lib/gemini.ts`).
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

/**
 * Content width a block can ask for. Blocks default to the width their kind
 * has always used; declaring one overrides it. `bleed` runs edge to edge.
 */
export type CaseWidth = "reading" | "medium" | "wide" | "bleed";

export type CaseBlock = (
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
      /** Cap the figure's rendered width in px, overriding the container width.
       *  Use when a composition reads too large at the block's default measure. */
      maxWidth?: number;
    }
  | { kind: "embed"; embed: string; caption?: string }
  | { kind: "reveal"; name: string; caption?: string }
  | {
      /**
       * A titled group: a category label (and optional pinned visual) in a
       * left column, with its child blocks flowing in a wider right column.
       * Mirrors the Figma's section structure. The label is the chapter-rail
       * entry, so `id` anchors the rail. Child sections render compact (heading
       * + body, no inner two-column split) since the group already provides it.
       */
      kind: "group";
      label: string;
      id?: string;
      /** Visual pinned in the left column beneath the label (e.g. a phone). */
      media?: CaseImage;
      blocks: CaseBlock[];
    }
) & { width?: CaseWidth };

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
  /**
   * Headline results, rendered in the hero so the outcome opens the case study
   * instead of closing it. Values are the study's own measured numbers; a study
   * with nothing measured omits this and the hero renders no result row.
   */
  outcomes?: CaseStat[];
  /** The shipped product. Renders the hero's "View site" link when present. */
  liveUrl?: string;
  /** Label for that link; defaults to "View site". */
  liveLabel?: string;
  focusAreas?: string[];
  heroImage?: CaseImage;
  /** Render the hero on a white field, scaled to 93% — for laptop/device
   *  mockups that read too large edge-to-edge. Keeps the full-bleed footprint. */
  heroFramed?: boolean;
  heroLabel?: string;
  /**
   * Product-showcase hero: a framed screenshot floating on a brand-coloured
   * band, rising into place at the very top of the study. Distinct from
   * `heroImage` (a full-bleed shot). When set, the big hero heading becomes the
   * project name and the descriptive title moves into the overview row.
   */
  heroShowcase?: {
    image: CaseImage;
    /** Faded wordmark behind the card (defaults to `project`). */
    wordmark?: string;
    /** Brand-colour band behind the card (defaults to Doorvest green). */
    band?: string;
    /** Cap the floating card's width in px (defaults to 560). Use a smaller
     *  value for tall/portrait mockups (e.g. a phone) so they don't dominate. */
    cardMaxWidth?: number;
    /** Keep the study's warm default palette instead of the near-white showcase
     *  field. Use when a study wants the Doorvest-style showcase hero + grouped
     *  layout but its own original colours (e.g. Ambasdr's beige). */
    warmField?: boolean;
  };
  /**
   * Page colour theme. "dark" flips the study onto a dark field (light text,
   * dark cards, light chapter rail); default keeps the showcase/beige logic.
   */
  theme?: "light" | "dark";
  /** Accent colour for metric values etc. (defaults to Doorvest green). */
  accent?: string;
  /**
   * Colour of the study's dark fields — the full-bleed statement banner and the
   * page footer. Defaults to near-black (`#111`); set it to a brand colour when
   * a study's palette carries its own dark tone.
   */
  darkField?: string;
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
  "digital-identity": "Ambasdr",
  "healthcare-data": "Pareto Intel",
};

/* ------------------------------------------------------- Doorvest (full) --- */
const doorvest: CaseStudyContent = {
  slug: "real-estate-investing",
  project: "Doorvest",
    liveUrl: "https://www.doorvest.com",
    liveLabel: "View site",
  heroShowcase: {
    image: {
      src: "/img/cases/doorvest/hero-home.png",
      w: 1531,
      h: 887,
      alt: "The Doorvest marketplace homepage: buy, manage and sell investment properties in one place",
    },
  },
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
  outcomes: [
    { value: "+13.8%", label: "Visitor → active-investor conversion, post-launch" },
    { value: "+40%", label: "Home reservations vs. the prior funnel" },
    { value: "~80%", label: "Engagement & retention after marketplace launch" },
  ],
  blocks: [
    {
      kind: "group",
      label: "The Problem Space",
      id: "the-problem-space",
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
          kind: "cards",
          label: "Where it broke down",
          items: [
            { title: "Buying sight unseen", body: "People were wiring a large sum toward a house they had only ever seen in photos." },
            { title: "No grasp of the numbers", body: "Cash flow, appreciation and reserve costs were unfamiliar, so first-time investors could not judge whether a home was a good deal." },
            { title: "Renovation work was invisible", body: "Before committing, people wanted to see the work done on a home and understand how it was underwritten. Neither was visible to them." },
            { title: "A funnel built for control", body: "Every manual handoff added another delay, and another reason to hesitate." },
            { title: "Alerts that arrived too late", body: "Time-sensitive emails were missed, and the homes that did surface often had nothing to do with what someone had asked for." },
            { title: "Held together by hand", body: "Emails, spreadsheets and sales calls meant nobody could move on their own. Things stalled exactly when people started to feel ready." },
          ],
        },
      ],
    },
    {
      kind: "reveal",
      name: "doorvest-panels",
    },
    {
      kind: "group",
      label: "Live user research",
      id: "live-user-research",
      blocks: [
        {
          kind: "section",
          title: "Live user research",
          body: [
            "Between support threads and session data, how long people stayed and where they dropped off, the frustration was hard to miss. People were missing time-sensitive email alerts, and when they did show up, they were often looking at homes that had nothing to do with what they'd asked for.",
            "The problem wasn't one broken screen. The whole experience was held together by emails, spreadsheets, and sales calls, so people couldn't move on their own. Things stalled at exactly the moment they were starting to feel ready.",
          ],
        },
      ],
    },
    {
      kind: "reveal",
      name: "live-research-stickies",
    },
    {
      kind: "group",
      label: "Core Product Insight",
      id: "core-product-insight",
      blocks: [
        {
          kind: "section",
          title: "Core product insight",
          body: [
            "One pattern cut through everything: people weren't all using Doorvest the same way. Newer investors needed education and reassurance before they'd act. Experienced investors wanted the opposite: fast access to the numbers and sharper filters so they could move quickly.",
            "That split changed how I approached the work. One linear funnel was never going to fit both. The product had to flex to how confident and how decisive each person was in the moment.",
          ],
        },
        {
          kind: "decisionLog",
          id: "one-funnel",
          title: "One funnel was never going to fit both",
          rows: [
            { label: "New investors", text: "Needed education and reassurance before they would act." },
            { label: "Experienced investors", text: "Wanted the opposite: fast access to the numbers, and sharper filters so they could move quickly." },
            { label: "The call", text: "The product flexes to how confident and how decisive someone is in the moment, rather than walking everyone through one fixed sequence." },
          ],
        },
        {
          kind: "quote",
          text: "Investors weren't all using Doorvest the same way. Some needed to be taught. Others just needed to be trusted to move fast.",
        },
      ],
    },
    {
      kind: "media",
      width: "bleed",
      variant: "wide",
      images: [
        { src: "/img/cases/doorvest/marketplace-board.png", w: 2880, h: 1620, alt: "The Doorvest marketplace: investment portfolios above the browsable in-app home inventory" },
      ],
    },
    {
      kind: "group",
      label: "Features",
      id: "features",
      media: { src: "/img/cases/doorvest/features-phone.png", w: 912, h: 1584, alt: "The Doorvest portfolios experience on mobile" },
      blocks: [
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
          kind: "quote",
          text: "Doormatch helped people find a “yes” faster. An internal analysis showed a noticeable uptick in Letters of Intent after it launched. Even when someone didn't buy right away, they browsed more once the options felt tailored to them.",
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
          kind: "section",
          title: "Streamlined purchase flow",
          kicker: "The blocker was never intent. It was effort.",
          body: [
            "I cut the reservation flow down to a few clicks by removing unnecessary fields and reusing what we already knew from someone's profile. Instant feedback, a clear confirmation screen, and a follow-up email made committing feel quick and reassuring instead of daunting.",
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
      kind: "group",
      label: "Impact",
      id: "operational-impact",
      blocks: [
        {
          kind: "section",
          // Title matches the group label so no redundant heading renders — the
          // "Impact" left label serves as the header, like the other sections.
          title: "Impact",
          body: [
            "The platform took friction out for investors and internal teams at once. Bringing discovery, evaluation, and reservation into one place removed the manual coordination that had bottlenecked the sales team. It also gave everyone a shared view across investor demand, acquisitions, and operations.",
            "The clearest signal was engagement. Before, plenty of people finished onboarding without ever creating an account and drifted off. Once discovery and reservation lived in the product, they had a reason to stay and keep browsing. That shift, a design and product call the Head of Product and I made together and defended to the CEO and CTO, is where the lift in engagement and retention came from.",
          ],
        },
      ],
    },
    {
      kind: "embed",
      embed: "doorvest-system-map",
    },
    {
      kind: "group",
      label: "Reflection",
      id: "reflection",
      blocks: [
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
    },
  ],
};

/* ------------------------------------------------------ Superfile (full) --- */
const superfile: CaseStudyContent = {
  slug: "secure-file-sharing",
  project: "Superfile",
  heroShowcase: {
    // The designed header (Figma node 4126:42230): the payment + entitlement UI
    // states — a pay card, the Access granted / Access Denied / Pay-to-unlock
    // indicators, the confirm-payment card, and the card-number field. Exported
    // from Figma at 4× and used as the product-state header for the study.
    image: {
      src: "/img/cases/superfile/pay-states.png",
      w: 1704,
      h: 1544,
      alt: "Superfile's paid-access interface states: a cardholder pay card, the Access granted and Access Denied indicators, a Pay-to-unlock action, a confirm-payment card priced at $25.00 for a named recipient, and a masked card-number field with a Visa mark.",
    },
    band: "#1f1f1f",
  },
  theme: "dark",
  accent: "#d0f010",
  title: "Designing secure monetization for a zero-trust file platform.",
  lead:
    "Directors, artists, and content creators needed to deliver valuable files " +
    "without losing control of them the moment someone received access. Buyers " +
    "expected the opposite: after paying, the file should open immediately. As " +
    "founding product designer at Superfile, a venture-backed cybersecurity " +
    "startup building files that stay under their creator's control after they're " +
    "shared, I designed the system between those two expectations: an experience " +
    "that felt instant to the buyer while preserving the owner's ability to " +
    "monitor, limit, and revoke access, across macOS and web.",
  meta: [
    { label: "Role", value: "Founding Product Designer" },
    { label: "Industry", value: "Cybersecurity · Fintech · B2C" },
    { label: "Team", value: "CEO, CTO, PM · 7 engineers" },
    { label: "Timeline", value: "2024 – 2025" },
  ],
  outcomes: [
    { value: "$14M+", label: "Raised during Superfile's 0→1 period; investors operated the working flow themselves" },
    { value: "0 → 1", label: "First working pay-to-unlock flow, shipped end to end" },
    { value: "1 flow", label: "One Stripe + entitlement model across macOS and web" },
  ],
  // Chapter rail derives from the group labels below (Doorvest-style layout).
  blocks: [
    // Primary architectural visual: the entitlement lifecycle opens the study so
    // it reads as being about access architecture, not the design of a pay form.
    {
      kind: "reveal",
      name: "superfile-lifecycle",
      width: "wide",
    },
    {
      kind: "group",
      label: "Selling access without surrendering control",
      id: "the-problem-space",
      blocks: [
        {
          kind: "section",
          title: "Selling access without surrendering control",
          body: [
            "With normal file sharing, you lose control the moment someone downloads a copy. Ownership, rights, and access are gone. For the people Superfile was built for (directors, artists, content creators, and anyone responsible for delivering a valuable file), the value isn't only in the file itself. It's in what happens afterward: who has it, how it's used, and whether it stays protected.",
            "Superfile keeps that control. You upload a file, grant access, watch how it's used, adjust permissions, and revoke access whenever you want, all while keeping ownership. My job was to let people charge for access to those files without weakening any of that, and without making the buyer wait to open what they'd just paid for.",
          ],
        },
        {
          kind: "cards",
          label: "Two sides of the same file",
          items: [
            {
              title: "The file owner",
              body: "Delivers a protected file, sees who can view it, monitors access and attempted sharing, sets temporary or lasting access, and revokes it without giving up ownership.",
            },
            {
              title: "The recipient",
              body: "Encounters a protected file, pays for access, and moves straight into the viewer once the charge is confirmed, without ever receiving an unrestricted copy.",
            },
          ],
        },
      ],
    },
    // Supporting diagram #1: who the system served and where authority lived.
    {
      kind: "reveal",
      name: "superfile-actor-map",
    },
    {
      kind: "reveal",
      name: "superfile-hero-video",
      caption:
        "Context: the Superfile product I was designing monetization into, with one identity and one set of guarantees across every audience.",
    },
    {
      kind: "group",
      label: "How the pieces relate",
      id: "the-product-ecosystem",
      blocks: [
        {
          kind: "section",
          title: "How the pieces relate",
          body: [
            "Changing how ownership works meant designing around permissions and durable access control. Rather than treating a file as infinitely copyable, Superfile tracks where it came from, verifies who's opening it, and adjusts what each viewer can do. Control flows from the creator into the file, and each viewer gets their own permissions, a little like enterprise access controls applied to creative rights.",
            "That model spans a macOS app, a web platform, secure viewers, payments, permissioning, ownership verification, accounts, and usage tracking. The map below lays out how the pieces relate and where value moves between them, so the system stays legible whether you're an engineer or an investor.",
          ],
        },
      ],
    },
    {
      kind: "reveal",
      name: "superfile-ecosystem",
    },
    {
      kind: "banner",
      eyebrow: "The line the whole system turned on",
      text: "A successful payment could grant access. It could never grant ownership. Every screen, state, and Stripe event had to hold that line.",
    },
    {
      kind: "group",
      label: "Payment is not permission",
      id: "building-with-stripe",
      blocks: [
        {
          kind: "section",
          title: "Payment is not permission",
          kicker: "The CEO wanted access to feel instant. The work was making it instant without letting the charge become the authority.",
          body: [
            "The push to monetize came straight from leadership, and the CEO wanted access to feel immediate: pay, and the file opens. Anything slower would make the purchase feel broken. That constraint didn't loosen security. It just meant the buyer could never be the one left waiting.",
            "So we used Stripe for payments instead of building our own, and the real work wasn't dropping in a checkout form. It was deciding what a successful charge was allowed to mean. The obvious version, unlocking the instant the charge succeeds, was the one we rejected: a charge can succeed and still be wrong, from fraud to a mismatched recipient to a refund seconds later. Access was released only after the payment was confirmed and matched to the right file and the right recipient. To the buyer it still felt immediate; underneath, Superfile, not Stripe, stayed the authority over access.",
            "I led how Stripe's events connected to Superfile's entitlement model, in both design and implementation. The map became a shared contract between design and engineering: it drew who owned what, and separated the states that were technically impossible from the ones we simply chose not to allow.",
          ],
        },
      ],
    },
    {
      kind: "evolution",
      label: "From the obvious model to the one we shipped",
      beforeLabel: "Initial assumption",
      afterLabel: "Designed model",
      rows: [
        { before: "Successful Stripe charge → file unlocks", after: "Payment intent → charge confirmed → recipient and file matched → entitlement granted → viewer opens" },
        { before: "Stripe is the source of truth for access", after: "Superfile owns the entitlement; Stripe only reports the charge" },
        { before: "A refund or wrong recipient has already leaked the file", after: "Refund, mismatch, expiry, and attempted sharing stay addressable states" },
        { before: "Access is a one-time unlock", after: "Access is a verified entitlement the owner can monitor and revoke" },
      ],
    },
    {
      kind: "group",
      label: "Designing the entitlement boundary",
      id: "designing-the-access-model",
      blocks: [
        {
          kind: "section",
          title: "Designing the entitlement boundary",
          body: [
            "I mapped how payment, identity, and entitlement had to work together before a file could open, and, just as important, every way that could fail. The model carried the states the system actually needed: denied, paying, confirmed, granted, refunded, revoked, expired, mismatched, and attempted-sharing. Each one had an owner and a defined next step, so design and engineering could agree on what was technically impossible versus what we simply chose not to allow.",
            "The interactive map below is that model: the same contract I documented in Figma and Notion for the team. Follow the primary journey, or open any node for what it does, who owns it, and where a policy was still undecided.",
            "Once a transaction was confirmed, the interface itself needed only a small visible change: an indicator that the buyer could now view the file. The screen update was minor. The transition behind it, from requesting access to holding a verified entitlement, was the substantial work.",
          ],
        },
      ],
    },
    // Supporting diagram #2: the linear pay-to-access sequence — immediate in the
    // interface, verified underneath — before the deep interactive model.
    {
      kind: "reveal",
      name: "superfile-sequence",
    },
    {
      kind: "reveal",
      name: "superfile-system-map",
      width: "wide",
    },
    {
      kind: "group",
      label: "Collecting payment without leaking authority",
      id: "a-controlled-payment-surface",
      blocks: [
        {
          kind: "section",
          title: "Collecting payment without leaking authority",
          kicker: "Monetization had to live inside the product without weakening its security.",
          body: [
            "Instead of Stripe's default checkout, I designed a custom pay card that lived natively inside Superfile. It captured transaction intent (the intended recipient, the unlock price, and the payment inputs behind a single Pay to unlock action) and nothing more. The authority to grant or keep access was deliberately kept out of the card itself.",
            "The surface is built in layers that separate the intent to pay from the authority to grant access. As you move up the stack, the product takes on more of the decision and the user controls less of the outcome: from basic inputs like card number and cardholder name, through the transaction-intent layer, up to the container that finally releases access.",
          ],
        },
        {
          kind: "section",
          title: "Keeping one payment model across macOS and web",
          body: [
            "One big call was whether to build separate payment logic for macOS and web. Going fully native on each was tempting, but over time the two would drift apart in how they handled payments, webhooks, and security. I proposed embedding a lightweight web view inside the macOS app so both platforms ran the same Stripe flow and the same backend logic, leaving fewer places for bugs or security gaps to creep in.",
          ],
        },
      ],
    },
    {
      kind: "reveal",
      name: "superfile-paycard",
      caption:
        "The payment surface captured transaction intent, not access authority: it established the recipient, price, and payment details before Superfile matched the confirmed charge to the correct file and entitlement.",
    },
    {
      kind: "group",
      label: "Access is not ownership",
      id: "access-vs-ownership",
      blocks: [
        {
          kind: "section",
          title: "Access is not ownership",
          body: [
            "The payment surface stopped at intent; the entitlement carried authority. The clearest way to see the difference is to lay every capability against every actor. What a buyer received was a scoped, revocable right to view, not the owner's standing control, and never anything Stripe could touch.",
          ],
        },
      ],
    },
    // Supporting diagram #3: the capability/actor matrix — a different consequence
    // of "payment is not ownership" than the pay card shows.
    {
      kind: "reveal",
      name: "superfile-permissions",
      width: "medium",
    },
    {
      kind: "group",
      label: "Turning infrastructure into a story investors could operate",
      id: "investor-storytelling",
      blocks: [
        {
          kind: "section",
          title: "Turning infrastructure into a story investors could operate",
          body: [
            "Complex technology only matters if people get it. Early on, investors were handed technical diagrams. Later, they followed a story instead: the problem, ownership, how it makes money, control, and the market. Making it legible visually, and operable in their own hands, turned out to be the bridge between technical depth and business value.",
          ],
        },
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
      kind: "group",
      label: "What we proved, and what remained unproven",
      id: "what-shipped",
      blocks: [
        {
          kind: "section",
          title: "What we proved, and what remained unproven",
          kicker: "A working pay-to-unlock flow, operated end to end before it ever went public.",
          body: [
            "The feature launched internally first. From invite-only accounts, investors ran the full flow themselves: they purchased access, opened the protected file immediately, monitored who had access, saw an attempted share, and revoked access live, completing real tasks instead of reading a diagram.",
            "That validated the model's clarity and technical viability. It was not creator adoption or behavioral validation. The work happened before Superfile had an active creator cohort, so the flow couldn't yet be tested against real seller behavior; I pressure-tested it against payment and entitlement failures instead, then used the live investor walkthroughs to confirm the system was understandable and operable. Creator validation remained the next step.",
            "Because the feature kept changing while the company pivoted, I documented every flow, state, and security boundary in Figma and Notion, the same contract shown in the map above. On a security-sensitive surface those weren't deliverables; they were how design and engineering stayed aligned on what was impossible versus what we chose not to allow.",
          ],
        },
      ],
    },
    // Outcome / demo sequence: the control loop investors operated themselves,
    // with an explicit validated / not-yet-validated boundary beneath it.
    {
      kind: "reveal",
      name: "superfile-investor-loop",
    },
    // A small conceptual before/after that earns the "states before screens"
    // lesson — no fabricated product screens, just the shift in the model.
    {
      kind: "reveal",
      name: "superfile-reflection",
      width: "medium",
    },
    {
      kind: "group",
      label: "States before screens",
      id: "reflection",
      blocks: [
        {
          kind: "section",
          title: "States before screens",
          body: [
            "The hardest part of this project was never the interface. It was holding one line steady, that a payment can unlock access without ever transferring ownership, across product, design, and engineering while the rest of the product kept moving underneath it.",
            "If I did it again, I'd draw the state diagram before the first screen, not after. My early screens treated access as a simple visual condition: paid, so unlocked. Once the state model settled, that same indicator turned out to represent a verified entitlement, something the owner could still monitor and revoke, and the screens I'd made had to be redrawn around it. On a product where the states are the thing you're selling, the interface is downstream of getting those boundaries right.",
            "It taught me that on infrastructure this abstract, the design work is as much about making the system legible to engineers, investors, and users as it is about the screens themselves.",
          ],
        },
        {
          kind: "quote",
          text: "The hard part was never secure file sharing. It was designing for confidence and control in a place where ownership usually feels temporary.",
        },
      ],
    },
  ],
};

/* ------------------------------------------------------- Synctera (full) --- */
const synctera: CaseStudyContent = {
  slug: "trust-at-scale",
  project: "Synctera",
  heroShowcase: {
    image: {
      src: "/img/cases/synctera/hero-cases.png",
      w: 1800,
      h: 1280,
      alt: "Synctera fraud operations: the redesigned Cases dashboard, with priority, ownership and blocked work visible at a glance",
    },
    // Synctera's product indigo, at band weight.
    band: "#1b2470",
  },
  accent: "#3c50e0",
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
  outcomes: [
    { value: "20%", label: "Fewer wrongful transaction blocks, before vs. after" },
    { value: "3→1", label: "Fragmented tools unified into one in-context flow" },
    { value: "1", label: "Source of truth for every case decision" },
  ],
  // Chapter rail derives from the group labels below (Doorvest-style layout).
  blocks: [
    {
      kind: "group",
      label: "The Problem Space",
      id: "the-problem-space",
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
      kind: "group",
      label: "How I Changed the System",
      id: "how-i-changed-the-system",
      blocks: [
        {
          kind: "section",
          title: "How I Changed the System",
          kicker:
            "The system must always reflect the current truth of work, even when progress is blocked.",
          body: [
            "I anchored the redesign to one principle: the record should always reflect the current truth of the work. From there I focused on three moves: pulling the scattered tools together, cutting the coordination noise, and making case visibility hold up as volume grew.",
          ],
        },
      ],
    },
    {
      kind: "group",
      label: "The harder problem: adoption",
      id: "the-harder-problem-adoption",
      blocks: [
        {
          kind: "section",
          title: "The harder problem: adoption",
          kicker: "The risk wasn't the interface. It was whether a trained team would trust a new way of working.",
          body: [
            "Analysts were fluent in Hawk AI, Onfido, and Dotfile and trained on specific patterns. Pulling everything into one flow, on a tight timeline, made some of them wary that consolidation would complicate their work rather than simplify it. They were open to working better, but nervous about a system they hadn't used and didn't yet fully understand.",
            "So the goal wasn't only a cleaner workflow. It was a change that felt like less risk to the people doing the work, which is exactly what shaped how I approached consolidation next.",
          ],
        },
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
      kind: "group",
      label: "The System",
      id: "the-system",
      blocks: [
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
      ],
    },
    {
      kind: "evolution",
      label: "What changed for an analyst",
      beforeLabel: "Before",
      afterLabel: "After",
      rows: [
        { before: "Status only advanced by marking a case complete", after: "A case state that stays true while work is blocked" },
        { before: "No reliable signal of who owned a case", after: "Ownership and blocked state visible on the record" },
        { before: "Blocked work resolved over Slack, email and calls", after: "Coordination pulled back into the case record" },
        { before: "Urgency guessed from a case's age", after: "Priority ranked by risk signals and assignment" },
      ],
    },
    {
      kind: "group",
      label: "Impact & Validation",
      id: "impact-validation",
      blocks: [
        {
          kind: "section",
          title: "Impact & Validation",
          body: [
            "I measured impact by watching how cases moved before and after launch, mainly the time spent in active investigation and the drop in stalled or prematurely closed cases. Working closely with Operations and interviewing analysts afterward confirmed the gains were real changes in how people worked, even as case volume climbed.",
          ],
        },
      ],
    },
    {
      kind: "group",
      label: "What I'd Protect Going Forward",
      id: "what-id-protect-going-forward",
      blocks: [
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
    },
  ],
};

/* -------------------------------------------------------- Ambasdr (full) --- */
const ambasdr: CaseStudyContent = {
  slug: "digital-identity",
  project: "Ambasdr",
  liveUrl: "https://www.ambasdr.com",
  liveLabel: "Visit ambasdr",
  title: "Designing the identity layer between people and AI.",
  lead:
    "An AI-powered identity layer for professionals, creators, and founders. One " +
    "place that explains who someone is, what they do, and why it matters, and can " +
    "answer for them even when they're not in the room.",
  meta: [
    { label: "Role", value: "Co-founder · Product Lead · AI Product Architecture" },
    { label: "Timeline", value: "~1 year · early-stage, in refinement toward launch" },
    { label: "Team", value: "3-person founding team" },
    { label: "Platforms", value: "Web · iOS · Android" },
  ],
  heroShowcase: {
    image: {
      src: "/img/cases/ambasdr/identity-card.png",
      w: 436,
      h: 1012,
      alt: "An Ambasdr profile: a person's photo, name, and roles above a conversational “Ask my ambasdr” interface with suggested questions.",
    },
    band: "#1c1c1a",
    // A tall phone mockup: render it at phone width so it doesn't dominate.
    cardMaxWidth: 300,
    // Keep Ambasdr's original warm beige palette, not the near-white field.
    warmField: true,
  },
  outcomes: [
    { value: "0 → 1", label: "A working product built across web, iOS, and Android by a 3-person founding team" },
    { value: "500", label: "Waitlist signups ahead of launch" },
    { value: "450+", label: "Research and validation conversations" },
  ],
  // Chapter rail derives from the group labels below (Doorvest-style layout).
  blocks: [
    {
      kind: "group",
      label: "First principles",
      id: "first-principles",
      blocks: [
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
      ],
    },
    {
      kind: "reveal",
      name: "ambasdr-hero",
      caption: "The public Ambasdr profile beside the AI conversation interface",
    },
    {
      kind: "quote",
      text: "Don't replace the places people already use to represent themselves. Create the layer that explains how those places connect.",
    },
    {
      kind: "media",
      variant: "wide",
      images: [
        {
          src: "/img/cases/ambasdr/home-hero.png",
          w: 2880,
          h: 1800,
          alt: "The live Ambasdr landing page, headline “Your work already speaks, now it can respond,” beside a phone showing a context-aware profile that answers a visitor's questions about its owner in real time.",
        },
      ],
    },
    {
      kind: "group",
      label: "Research & validation",
      id: "research-validation",
      blocks: [
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
          body: "People get to know each other by asking questions. So Ambasdr makes discovery happen through conversation, rather than asking a visitor to scroll and interpret a static page.",
        },
        {
          title: "Users remain the source of truth",
          body: "The model never owns the user's identity. The owner defines what's accurate, what matters, the tone, and what's public.",
        },
      ],
    },
      ],
    },
    {
      kind: "group",
      label: "The product model",
      id: "the-product-model",
      blocks: [
        {
          kind: "section",
          title: "From static identity to conversational identity",
          kicker: "The design problem wasn't a chatbot on a profile. It was an identity system.",
          body: [
            "A résumé summarizes, a portfolio displays, a link-in-bio organizes, but each still leaves the visitor to interpret the person manually: open links, read documents, decide what matters. Ambasdr's job was to make an approved version of that information explorable through conversation.",
            "That meant separating three things cleanly: the structured identity that establishes who someone is, the approved knowledge that gives the AI something real to represent, and the conversation through which a visitor explores it. Keeping those layers distinct is what let one product stay coherent across responsive web, iOS, and Android.",
          ],
        },
      ],
    },
    {
      kind: "reveal",
      name: "ambasdr-three-layers",
    },
    {
      kind: "group",
      label: "Designing the AI",
      id: "designing-an-ai-that-represents-people",
      blocks: [
    {
      kind: "section",
      title: "Designing an AI that represents people",
      kicker: "The hard part wasn't answering questions. It was speaking for someone.",
      body: [
        "Most AI interfaces just answer prompts. Ambasdr had a touchier job: it was speaking for a real person, which raised the stakes on trust. Visitors had to trust the answers were useful. Owners had to trust the AI wasn't putting words in their mouth. And the product had to make clear the person always had the final say.",
        "Every major feature traces back to four questions: Can the AI represent me accurately? Can I control what it knows? Can visitors trust the answers? Can I keep improving how I come across?",
        "The hardest part was never model selection. It was defining what the system should know and how it should ground an answer: ingest the identity, résumé, portfolio, files, and links; keep that source material attached to the right person; separate public from private; then answer from the owner's actual material, surfacing the supporting file, link, or highlight, rather than from generic model knowledge. I treated prompts, identity fields, content structure, retrieval surfaces, and response behavior as one product architecture, and directed the implementation through that spec.",
      ],
    },
        {
          kind: "decisionLog",
          id: "designing-decisions",
          title: "Key decisions",
          rows: [
            { label: "Public identity ≠ conversational identity", text: "The interface shows the chosen username (@jrprince); the AI refers to the person by full name or company inside an answer (“Lennox Prince specializes in…”). A small interface rule with broad reach: it touches data modeling, components, profile rendering, and AI context." },
            { label: "Answer from the user's material, or not at all", text: "Responses had to draw on the owner's approved source material and surface the supporting file, link, or highlight, not generic model knowledge. Grounding, not fluency, was the bar." },
            { label: "Admit uncertainty, gracefully", text: "In most AI products, an unanswered question feels like failure. For Ambasdr, a wrong answer was much worse. When it doesn't know, it says so, and nudges the owner to fill the gap, and empty states teach a visitor what the AI knows instead of dead-ending." },
            { label: "Every file needs context", text: "Uploading isn't where the intelligence happens. One project might show leadership, taste, technical depth, or community pull; without context the AI summarizes a file without grasping what it means. So each resource carries a label, an intent, and a link to the person's identity." },
            { label: "Mobile is the authoring tool", text: "Managing your Ambasdr should be as quick as sending a text. Mobile stopped being a companion app and became the fastest place to update information, manage resources, and tune how the AI represents you." },
          ],
        },
      ],
    },
    {
      kind: "reveal",
      name: "ambasdr-trust-model",
    },
    {
      kind: "group",
      label: "How the AI learns & improves",
      id: "how-the-ai-learns",
      blocks: [
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
          kind: "section",
          title: "A living knowledge system",
          kicker: "Not a static page, but a system that improves the more it's used.",
          body: [
            "The toughest problem was working out how all these documents relate, and how each should shape the AI behind the scenes. Ambasdr ties together profile data, files, links, resource context, instructions, tone, visitor questions, AI responses, conversation summaries, and signals about what's missing.",
            "A visitor asks a question. The AI answers if it has enough to go on. If it doesn't, that gap becomes feedback. The owner adds context, uploads a resource, or updates instructions, and the profile gets better the more it's used.",
          ],
        },
        {
          kind: "section",
          title: "Conversation intelligence",
          kicker: "Visitor questions became product feedback.",
          body: [
            "Those conversations are designed to run both ways. The most important product evolution was realizing conversations weren't only a visitor experience; they were owner intelligence. When visitors ask questions, they reveal what people want to know.",
            "The same question asked repeatedly becomes a signal. A question the AI can't answer becomes a knowledge gap. Questions about collaboration, booking, hiring, press, or pricing become intent. Designed this way, the profile can tell its owner how they're being perceived and what context their audience needs most, a capability the model supports, not yet a loop proven at scale.",
          ],
        },
      ],
    },
    {
      kind: "reveal",
      name: "ambasdr-onboarding",
    },
    {
      kind: "media",
      variant: "wide",
      images: [
        {
          src: "/img/cases/ambasdr/onboarding-step.png",
          w: 2880,
          h: 1800,
          alt: "The onboarding “Teach Your Ambasdr” flow, step one of five, with a live iPhone preview updating as the owner types, teaching the AI, not just filling out a form.",
        },
      ],
    },
    {
      kind: "reveal",
      name: "ambasdr-knowledge",
    },
    {
      kind: "group",
      label: "Public profile",
      id: "public-profile",
      blocks: [
        {
          kind: "section",
          title: "Public profile and conversational identity",
          kicker: "The profile had to balance familiarity with intelligence.",
          body: [
            "A surprising beta insight was that people still valued familiar, link-based behavior. They wanted to connect the platforms they'd already built, such as social profiles, a store, a channel, or a portfolio, so Ambasdr didn't reject that. It added context around it.",
            "So the public profile carried two layers: a familiar surface of identity, links, and proof, and a conversational layer that helps a visitor understand what any of it means. Rather than search a resume, open five links, and guess, a visitor can just ask. Questions became the interface.",
            "Chat couldn't become the entire product, though. Four modes (Chat, Highlights, Files, and Links) each serve a different visitor, and all four stay inside the same profile: selecting Files or Links switches the content beneath the tabs rather than throwing the visitor into an unrelated page.",
          ],
        },
        {
          kind: "cards",
          label: "One profile, four ways to explore it",
          items: [
            { title: "Chat", body: "For visitors who arrive with a specific question." },
            { title: "Highlights", body: "A curated overview of the person's most important work." },
            { title: "Files", body: "Concrete artifacts: résumés, case studies, documents." },
            { title: "Links", body: "Onward to external destinations, with context around them." },
          ],
        },
      ],
    },
    {
      kind: "media",
      variant: "wide",
      images: [
        {
          src: "/img/cases/ambasdr/profile-chat.png",
          w: 2560,
          h: 1680,
          alt: "An Ambasdr public profile (sample profile · demo data): a founder's identity, highlights, and featured work on the left, beside a live “Talk to my Ambasdr” chat panel where visitors ask questions and get context-aware answers.",
        },
      ],
    },
    {
      kind: "group",
      label: "Mobile & motion",
      id: "mobile-and-motion",
      blocks: [
        {
          kind: "section",
          title: "Refining the mobile experience",
          kicker: "The senior move was often deciding what not to build.",
          body: [
            "The mobile redesign spanned two technically distinct surfaces: the native iOS and Android app, and the responsive public-profile website opened from a shared URL. Treating them as related but different mattered. A responsive site has different constraints from a native screen, even when the final feel should be cohesive.",
            "Rather than treat every request as a new component, I ran an audit first: existing code, Storybook, the design system, Figma direction, and engineering conventions, to identify the approved source of truth, then reuse, restyle, or repair. For the main cards, the updated web app was the source of truth; the mobile task was parity, not a second design language. Work was prioritized by product risk: functional and identity integrity first, consistency next, polish last.",
          ],
        },
        {
          kind: "decisionLog",
          id: "mobile-decisions",
          title: "Refinement decisions",
          rows: [
            { label: "Repair navigation, don't add routes", text: "Links and Files switched the content beneath the tabs while preserving the visitor's profile context, a fix to existing navigation, not a new page." },
            { label: "Decode filenames in the presentation layer", text: "Uploads showing “Lennox%20Prince%20Jr%20Resume” were rendered as “Lennox Prince Jr Resume” without touching storage keys or URLs, so infrastructure details stay out of the interface." },
            { label: "Compact success, prominent action", text: "An oversized “Profile up to date” banner shrank to a quiet check; a large card is reserved for something the user must actually address." },
            { label: "Reuse the approved subscription & card system", text: "The Pro card and account status were brought back into parity with the approved components instead of duplicated, and stopped selling a plan the user already owned." },
          ],
        },
      ],
    },
    {
      kind: "reveal",
      name: "ambasdr-motion",
    },
    {
      kind: "group",
      label: "Commercial strategy",
      id: "commercial-strategy",
      blocks: [
        {
          kind: "section",
          title: "Positioning and business model",
          kicker: "Calling it an “AI business card” would shrink it. It's an identity and knowledge layer.",
          body: [
            "The most important strategic call was how to describe the product. Framed as an AI business card, Ambasdr competes with NFC-card and link apps. Framed as an AI identity and knowledge layer that turns a static profile into an interactive representation of a person, it becomes infrastructure, a partner to distribution platforms rather than a competitor, with several routes to market.",
            "Pricing followed the same logic. The product had to stay accessible for individuals while being valuable enough for creators, professionals, and founders building a serious personal brand. We explored Free, Pro, and Premium tiers with a trial, so people could experience being represented before paying for depth.",
            "The architecture call mattered as much as the price: keep plan management primarily on the web to sidestep App Store and Play Store payment cuts. Where money changed hands shaped where parts of the product could live.",
          ],
        },
        {
          kind: "cards",
          label: "What shaped the model",
          items: [
            { title: "Accessible, but valuable", body: "Free enough for individuals to be represented; valuable enough for people building a serious brand." },
            { title: "Free, Pro, Premium + trial", body: "Three tiers with a trial, so value came before payment, not the other way around." },
          ],
        },
      ],
    },
    {
      kind: "group",
      label: "Building with AI",
      id: "building-with-ai",
      blocks: [
        {
          kind: "section",
          title: "Building with AI",
          kicker: "Designing Ambasdr also changed how it got built.",
          body: [
            "Ambasdr wasn't only an AI product. It was designed and prototyped through an AI-assisted workflow. Across web and mobile I moved between Figma and Figma Make for design; v0, Claude Code, Codex, and Cursor for prototyping and implementation; and React Native with Expo/EAS for mobile, letting a three-person team explore more directions and ship across platforms faster than a team that size normally could.",
            "The operating model mattered more than any single tool: prototype quickly, validate direction, translate patterns into implementation, and keep learning. We even ran automated flow walkthroughs (Playwright-style click-throughs of real product flows) to catch broken states during rapid iteration.",
          ],
        },
      ],
    },
    {
      kind: "group",
      label: "Role & ownership",
      id: "role-ownership",
      blocks: [
    {
      kind: "section",
      title: "Role & ownership",
      kicker: "From product design into founder-level product ownership.",
      body: [
        "As a co-founder on a three-person team, I became the connective layer between the business idea, the product experience, and the team's ability to ship, carrying work usually split across a product, design, and technology lead. Engineering was a shared, founding-team effort; my lane was the product model, the AI's behavior spec, and cross-platform UX, which I drove into implementation through detailed technical and design specs and by auditing what already existed before proposing anything new, while sharing strategy, pricing, and go-to-market with my co-founders.",
        "The defining founder skill wasn't producing more screens. It was repeatedly reducing ambiguity so design, engineering, and business decisions could move in the same direction, and, often, deciding what not to build. The clearest example was voice: users liked it, but a structured profile proved more useful day to day, so we pulled voice back from a core interaction to an enhancement instead of building the product around it.",
      ],
    },
      ],
    },
    {
      kind: "group",
      label: "Outcome",
      id: "outcome",
      blocks: [
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
          kind: "cards",
          label: "The honest read",
          items: [
            { title: "What's real", body: "A coherent product model and a working cross-platform experience, with early demand: 500 waitlist, 450+ research conversations, ~20 beta users, and 15 onboarding iterations." },
            { title: "What isn't proven yet", body: "Conversion, retention, paid uptake, response accuracy, and partnership adoption. The record doesn't establish those numbers, so this study doesn't claim them." },
            { title: "What we'd measure next", body: "A visitor funnel (viewed → question → answer → supporting action → return), an owner funnel (created → published → first conversation → retained), and AI quality (source coverage, unsupported-answer rate, latency)." },
          ],
        },
      ],
    },
    {
      kind: "group",
      label: "Reflection",
      id: "reflection",
      blocks: [
        {
          kind: "section",
          title: "Reflection",
          body: [
            "The hardest part of Ambasdr wasn't getting the AI to respond. It was making sure each response felt accurate, controlled, and true to the person behind it. AI usually gets talked about in terms of speed and automation. But once it's speaking for someone, the real question is trust.",
            "If Ambasdr works ten years from now, the proof won't be that everyone uses AI. It'll be that people can show up as their full professional, creative, and entrepreneurial selves in one place, instead of being boxed in by LinkedIn, Linktree, resumes, portfolios, or a pile of context-free links.",
            "The bigger lesson: AI product design isn't primarily about adding a chat interface. It's about defining what the system knows, where that knowledge comes from, who controls it, how identity is represented, and how one product stays coherent across platforms. My job was to connect those decisions across strategy, architecture, interface, and implementation, because the product couldn't be solved inside a single discipline.",
          ],
        },
        {
          kind: "quote",
          text: "A profile lists what you've done. Presence answers for you when you're not in the room. Ambasdr was built to close that gap.",
        },
      ],
    },
  ],
};

/* -------------------------------------------------------- Pareto (full) --- */
const pareto: CaseStudyContent = {
  slug: "healthcare-data",
  project: "Pareto Intelligence",
  heroShowcase: {
    image: {
      src: "/img/cases/pareto/hero-dashboard.png",
      w: 1800,
      h: 1012,
      alt: "Pareto Intelligence: the redesigned analytics portal, with reconciliation KPIs and claims detail on one screen",
    },
    // Secondary 900 from Pareto's own colour scale.
    band: "#003f6b",
    // "Pareto Intelligence" is too long for the oversized wordmark; the
    // short form is how the product is referred to internally anyway.
    wordmark: "Pareto",
  },
  accent: "#4e61f6",
  // Banner + footer carry the brand navy instead of near-black.
  darkField: "#003f6b",
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
  outcomes: [
    { value: "25%", label: "Reduction in task completion time" },
    { value: "30%", label: "Decrease in user error rates" },
    { value: "20%", label: "Increase in new subscriptions" },
  ],
  // Chapter rail derives from the group labels below (Doorvest-style layout).
  blocks: [
    {
      kind: "group",
      label: "The Problem Space",
      id: "the-problem-space",
      blocks: [
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
          kind: "cards",
          label: "Where it broke down",
          items: [
            { title: "No shared system", body: "Every team built its own components, so the same UI element behaved differently from one product to the next." },
            { title: "Debt on both sides", body: "Mismatched color, spacing, type and interaction piled up design and engineering debt, and pushed maintenance cost up over time." },
            { title: "Data without structure", body: "Claims, risk scoring, audits and compliance triggers had no clear hierarchy, so anomalies were hard to spot and trends hard to compare." },
            { title: "Dashboards that didn't scale", body: "Tableau worked, but with clumsy cross-filtering and little support for how specific people actually worked." },
            { title: "Relearning the tools", body: "Navigation, filtering and insight patterns changed between products, so analysts re-learned how to work every time they switched." },
            { title: "A migration with no owner", body: "The company was moving to Looker and needed someone to shape the transition, not just restyle it." },
          ],
        },
      ],
    },
    {
      kind: "group",
      label: "Research & Insights",
      id: "research-insights",
      blocks: [
        {
          kind: "section",
          title: "Research & Insights",
          kicker: "Users weren't asking for more data. They wanted to trust what they were already looking at.",
          body: [
            "I audited the portal end to end, pairing heuristic and task-time analysis with interviews and shadowing across analysts, claims auditors, actuarial teams, and compliance partners. The same issues surfaced everywhere: insights weren't prioritized, filtering was inconsistent, tables were overbuilt, too many clicks stood between analysts and the detail they needed, and visual noise buried the metrics that mattered.",
            "From there, I restructured the information around a simple flow: insight, then context, then action, then audit. I standardized filtering, simplified navigation, and added reusable data groupings and priority-based layouts for the metrics that mattered most. I validated it with interactive Figma prototypes tested with analysts across teams.",
          ],
        },
      ],
    },
    {
      kind: "media",
      variant: "wide",
      images: [
        {
          src: "/img/cases/pareto/research-board.png",
          w: 1600,
          h: 1435,
          alt: "Design Jam: auditing every dashboard's charts, downloads, and insight naming across markets",
        },
      ],
    },
    {
      kind: "group",
      label: "System Design & Architecture",
      id: "system-design-architecture",
      blocks: [
        {
          kind: "section",
          title: "System Design & Architecture",
          kicker: "The real breakthrough was a design system that could scale across enterprise healthcare analytics.",
          body: [
            "I built a single design system that every product adopted. It standardized the type hierarchy; color coding for statuses, risk states, and data confidence; and reusable dashboard pieces like cards, KPIs, comparison tables, and filters. It also set navigation patterns, spacing, grids, composition rules, and interaction behaviors like hover, expand, drilldown, sort, and compare.",
            "It cleared our worst internal bottlenecks: quicker, clearer specs for engineering, consistent layouts for analysts, and more predictable timelines for leadership on new features. It was easier to maintain too, and it became the foundation for every product update over the next two years.",
          ],
        },
      ],
    },
    {
      kind: "media",
      variant: "wide",
      // 704px = 55% of the 1280px wide measure: the sheet is a tall portrait
      // composition and reads better small than blown up past its native width.
      maxWidth: 704,
      images: [
        {
          src: "/img/cases/pareto/design-system.png",
          w: 940,
          h: 1217,
          alt: "Pareto's design system: typography, color scales, components, buttons, and badges",
        },
      ],
    },
    {
      kind: "group",
      label: "Dashboard Redesigns",
      id: "dashboard-redesigns",
      blocks: [
        {
          kind: "section",
          title: "Dashboard Redesigns",
          kicker: "From cluttered screens to intuitive analytics.",
          body: [
            "I redesigned several of the key dashboards so scattered data turned into something people could act on. They didn't just look better. They were measurably faster to use, easier to read, and closer to how analysts actually think, which led to sharper decisions.",
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
      ],
    },
    {
      kind: "banner",
      eyebrow: "Reconciliation dashboards",
      text: "Helping teams catch discrepancies faster and more accurately: the reconciliation work that recovers millions for payers.",
    },
    {
      kind: "group",
      label: "The Migration Reality",
      id: "the-migration-reality",
      blocks: [
        {
          kind: "section",
          title: "The migration reality",
          kicker: "Moving to Looker was less a redesign than a careful transplant.",
          body: [
            "I led the vision for moving dozens of Tableau dashboards into Looker: rebuilding the visuals with consistent logic, clearer drill paths, shared charting rules, better comparison views, and stronger performance under load.",
            "Two things made this harder than a visual refresh. Legacy data didn't map cleanly from Tableau to Looker, so reaching parity took careful reconciliation before anything could be made better. And analysts fluent in the old dashboards had to adopt new patterns, so the work had to earn trust, not just ship. The design system and prototype testing carried much of that weight, keeping the transition legible and giving people something concrete to react to before it went live.",
          ],
        },
      ],
    },
    {
      kind: "evolution",
      label: "What changed in the move",
      beforeLabel: "Tableau",
      afterLabel: "Looker",
      rows: [
        { before: "Each dashboard styled on its own", after: "Shared charting rules across every product" },
        { before: "Cross-filtering that fought the analyst", after: "Clear drill paths from insight to detail" },
        { before: "No hierarchy between metrics", after: "Priority-based layouts for what mattered most" },
        { before: "Slow under load", after: "Rebuilt for performance at enterprise data volume" },
      ],
    },
    {
      kind: "group",
      label: "Impact & Reflection",
      id: "impact-reflection",
      blocks: [
        {
          kind: "section",
          title: "Impact",
          body: [
            "Measured in usability testing and product analytics, the redesign cut task-completion time by 25% and error rates by 30%. New subscriptions rose 20% over the two years that followed; design was one contributor there, alongside sales, pricing, and product changes, not the sole cause.",
            "Just as important operationally, the design system gave engineering a single, consistent foundation for every release that came after.",
          ],
        },
        {
          kind: "section",
          title: "Reflection",
          body: [
            "The lasting lesson wasn't about any one dashboard. It was that in enterprise analytics the interface is only as trustworthy as the system beneath it, and a design system is what makes that trust repeatable across products, teams, and years.",
            "If I ran it again, I'd bring analysts into the migration earlier. The redesign landed, but adoption is its own design problem, and the people living in the old dashboards needed more runway to trust the new ones.",
          ],
        },
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
