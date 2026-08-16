# LENXPRINCE DESIGN — Product Design Portfolio

The personal portfolio of **Lennox Prince**, AI Product Designer. A
scroll-choreographed single-page home, five long-form case studies, and a
**Gemini-powered assistant** — grounded in the site's own content — that lets
visitors ask about the work.

Live at <https://www.jrprince.design>.

## Stack

| Concern       | Choice                                                     |
| ------------- | ---------------------------------------------------------- |
| Framework     | [Next.js 15](https://nextjs.org) (App Router)              |
| Language      | TypeScript                                                 |
| Styling       | CSS Modules + design tokens (`src/app/globals.css`)        |
| Motion        | [Framer Motion](https://www.framer.com/motion/)            |
| AI assistant  | [Google Gemini](https://ai.google.dev) via `@google/genai` |
| Analytics     | `@vercel/analytics`                                        |
| Hosting       | [Vercel](https://vercel.com)                               |

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then add your Gemini API key
npm run dev                        # http://localhost:3000
```

Get a Gemini API key at <https://aistudio.google.com/apikey>. Without one the
site runs fine — only the Contact-section assistant returns an error.

Other scripts:

```bash
npm run build      # production build
npm run start      # run the production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

There is no test suite; `typecheck` and `lint` are the quality gates.

## Project structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout: fonts, metadata, <Nav>, <Analytics>
│   ├── globals.css           # Design tokens (color, type, spacing, motion) + reset
│   ├── page.tsx              # Home: the scroll sequence, section by section
│   ├── about/                # Standalone About page
│   ├── work/[slug]/          # Case-study detail pages (statically generated)
│   ├── api/chat/route.ts     # POST endpoint that talks to Gemini
│   ├── sitemap.ts            # Home + /about + every case study
│   ├── robots.ts
│   └── not-found.tsx         # 404
├── components/
│   ├── Nav/                  # Sticky, scroll-condensing navigation
│   ├── sections/             # The home sections (see below)
│   ├── casestudy/            # Case-study renderer: view, chapter rail,
│   │                         #   sandboxed embeds, per-project reveals
│   ├── scrollvideo/          # Reusable canvas frame-scrubber
│   ├── motion/               # Shared motion vocabulary + <Reveal> primitive
│   └── ui/                   # Small bits (Crown mark)
├── data/
│   ├── site.ts               # Identity, nav, socials — edit me first
│   ├── home.ts               # All home-page copy + hero scrub config
│   └── caseStudyContent.ts   # The case studies as typed content blocks
├── fonts/                    # Satoshi (self-hosted, 5 weights)
└── lib/
    └── gemini.ts             # Server-only Gemini client + grounding prompt
```

## The home page

`src/app/page.tsx` is one continuous scroll sequence:

1. **`HeroSequence`** — a pinned canvas that preloads 122 JPEG frames from
   `public/frames/hero/` and scrubs them against scroll progress: splash titles
   hold and fade → white curtains part → the composition fades in → the portrait
   head-turn scrubs. The choreography checkpoints are named constants at the top
   of `HeroSequence.tsx` — tune the animation there, and the pin length via
   `scrollVideo.scrollHeight` in `data/home.ts`.
2. **`IntroFill`** — introduction copy that fills to ink as you scroll.
3. **`CaseStudies`** — the work grid, themed cards read from `data/home.ts`.
4. **`Approach` · `Clients` · `Contact`** — the closing block. The assistant
   lives in `Contact`, not in a floating widget.

## Editing content

- **Your details:** `src/data/site.ts` (name, wordmark, role, email, socials, nav).
- **Home copy:** `src/data/home.ts` — one export per section (`hero`,
  `introduction`, `caseStudies`, `approach`, `clients`, `contact`), plus the
  `scrollVideo` frame config.
- **Case studies:** `src/data/caseStudyContent.ts`. Each study is a list of
  typed `CaseBlock`s — `section`, `quote`, `stats`, `cards`, `timeline`,
  `decisionLog`, `evolution`, `questions`, `media`, `embed`, `reveal` — that
  `CaseStudyView` renders onto a four-tier editorial grid (reading 760, medium
  1040, wide 1280, full-bleed). Drop images under `public/img/cases/<project>/`.
- **The order of the work grid drives everything else.** `caseOrder` is derived
  from `home.ts`, so it also controls the pre-rendered routes, prev/next links,
  and the sitemap.
- **Drafts:** a slug with no full write-up falls back to `draftFor()`, which
  generates a stub page from the home card's copy and flags it `draft: true`.
- **The assistant** reads whatever is published — no separate content to
  maintain.

### Richer case-study blocks

Two block kinds escape the standard renderer:

- **`embed`** — a self-contained HTML document rendered in a sandboxed iframe
  that reports its own height (see `casestudy/EmbedFrame.tsx`; embeds are
  registered in `casestudy/embeds/`).
- **`reveal`** — a named bespoke React component for one project's signature
  moment, e.g. the Ambasdr hero and its scroll-triggered identity video
  (`casestudy/reveals/`).

## The Gemini assistant

`POST /api/chat` receives the conversation and returns a grounded reply. The
system instruction is assembled by `buildSystemInstruction()` in
`src/lib/gemini.ts` from the same data the site renders — bio, approach, client
list, and a digest of every case study — so the assistant can't speak to work
that isn't published. History is capped at 20 messages and 4,000 characters
each. It's non-streaming for simplicity; to stream, switch to
`generateContentStream` in `src/app/api/chat/route.ts`.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at <https://vercel.com/new>.
3. Add an Environment Variable **`GEMINI_API_KEY`** (and optionally
   `GEMINI_MODEL`, default `gemini-2.5-flash`) in the project settings.
4. Deploy. Every push to the default branch ships automatically.

`next.config.mjs` pins `outputFileTracingRoot` to the repo — a stray lockfile
above the project directory otherwise makes Next infer the wrong root and breaks
output tracing on Vercel.

## Accessibility & motion

All motion respects `prefers-reduced-motion` — neutralized globally in
`globals.css` and checked per-component with Framer Motion's
`useReducedMotion()`. Interactive elements have visible focus states. Keep both
in mind as you add new animations.

## Claude Code skill

`.claude/skills/case-study-critic/` holds a project skill that audits a case
study as a hiring-decision argument rather than a screen archive. Invoke it
before rewriting or restructuring a study.
