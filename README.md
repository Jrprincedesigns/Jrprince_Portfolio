# jrprince — Product Design Portfolio

A product design portfolio focused on **interaction & motion design**, built to
showcase four in-depth case studies, with a **Gemini-powered assistant** that
lets visitors ask questions about the work.

## Stack

| Concern        | Choice                                             |
| -------------- | -------------------------------------------------- |
| Framework      | [Next.js 15](https://nextjs.org) (App Router)      |
| Language       | TypeScript                                         |
| Styling        | CSS Modules + design tokens (`src/app/globals.css`)|
| Motion         | [Framer Motion](https://www.framer.com/motion/)    |
| AI assistant   | [Google Gemini](https://ai.google.dev) via `@google/genai` |
| Hosting        | [Vercel](https://vercel.com)                       |

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then add your Gemini API key
npm run dev                        # http://localhost:3000
```

Get a Gemini API key at <https://aistudio.google.com/apikey>.

Other scripts:

```bash
npm run build      # production build
npm run start      # run the production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

## Project structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout: fonts, metadata, Nav/Footer/ChatWidget
│   ├── globals.css           # Design tokens (color, type, spacing, motion) + reset
│   ├── page.tsx              # Home: hero + work grid + about teaser
│   ├── _home/                # Home-only client pieces (animated Hero)
│   ├── work/[slug]/          # Case-study detail pages (statically generated)
│   ├── about/                # About page
│   ├── not-found.tsx         # 404
│   └── api/chat/route.ts     # POST endpoint that talks to Gemini
├── components/
│   ├── Nav/                  # Sticky, scroll-condensing navigation
│   ├── Footer/               # Contact + socials
│   ├── CaseStudyCard/        # Work-grid card with cursor-tilt interaction
│   ├── ChatWidget/           # Floating Gemini assistant
│   └── motion/               # Shared motion vocabulary + <Reveal> primitive
├── data/
│   ├── site.ts               # Identity, nav, socials — edit me first
│   └── caseStudies.ts        # The 4 case studies as typed objects
└── lib/
    └── gemini.ts             # Server-only Gemini client + grounding prompt
```

## Editing content

- **Your details:** `src/data/site.ts` (name, role, email, socials, nav).
- **Case studies:** `src/data/caseStudies.ts`. Each entry is fully typed —
  add sections, metrics, and disciplines, then drop images under
  `public/work/<slug>/` and reference them with `next/image`.
- **The assistant** automatically knows about whatever is in `caseStudies.ts`
  (see `buildSystemInstruction` in `src/lib/gemini.ts`) — no separate content
  to maintain.

## The Gemini assistant

`POST /api/chat` receives the conversation and returns a grounded reply. The
system instruction is assembled from your published case studies, so the
assistant only speaks to work that actually exists on the site. It's
non-streaming for simplicity — to stream, switch to `generateContentStream`
in `src/app/api/chat/route.ts`.

## Slack visitor notifications

A Slack message lands whenever someone new visits the site.

**How it works.** `VisitPing` (mounted in `src/app/layout.tsx`) posts once per
browser session to `POST /api/visit`. That route reads Vercel's edge geo
headers, formats a Block Kit message in `src/lib/visitor.ts`, and sends it via
`src/lib/slack.ts`. Each notification carries the page, referrer source,
city/region/country, device, any UTM params, and whether the visitor is new or
returning.

**Setup.**

1. Create a Slack app at <https://api.slack.com/apps> → *Incoming Webhooks* →
   *Add New Webhook to Workspace*, and pick the channel you want pinged.
2. Copy the `https://hooks.slack.com/services/...` URL.
3. Add it in Vercel → Project Settings → Environment Variables as
   **`SLACK_WEBHOOK_URL`**, scoped to **Production** only so preview deploys
   stay quiet. Optionally add `VISIT_HASH_SALT` (any random string).
4. Redeploy.

**Controls.**

- **Mute your own devices** — visit any page once with `?nonotify=1`
  (e.g. `https://www.jrprince.design/?nonotify=1`). That browser never pings
  again. Clear site data to undo.
- **Volume** — one ping per visitor session, not per page view. The route also
  drops known bots, dedupes the same visitor for 30 minutes, and caps
  notifications at 60/hour.
- **Turn it off** — remove `SLACK_WEBHOOK_URL`. The route no-ops without it.

**Privacy.** No cookies and no third-party tracker. The visitor's IP is hashed
in memory purely for rate limiting — it is never stored, logged, or sent to
Slack.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at <https://vercel.com/new>.
3. Add an Environment Variable **`GEMINI_API_KEY`** (and optionally
   `GEMINI_MODEL`) in the project settings. Add **`SLACK_WEBHOOK_URL`** too if
   you want visitor notifications — see above.
4. Deploy. Every push to the default branch ships automatically.

## Accessibility & motion

All motion respects `prefers-reduced-motion` (neutralized globally in
`globals.css`), and interactive elements have visible focus states. Keep this in
mind as you add new animations.
