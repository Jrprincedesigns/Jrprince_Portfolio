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

## Visitor insight

Two layers, answering different questions:

| Layer | Answers |
| ----- | ------- |
| Slack notifications (custom) | Who is on the site *right now*, and what did this particular visitor do? |
| Microsoft Clarity (hosted) | Across everyone: where do people drop off, what do they rage-click, what does a session look like? |

### Slack notifications

Two messages per visitor, both optional via `VISIT_NOTIFY_MODE`:

1. **Arrival** — `VisitPing` posts once per browser session to `POST /api/visit`.
   Page, referrer source, location, device, UTM params, new vs. returning.
2. **Session digest** — `SessionTracker` accumulates the whole visit and flushes
   it to `POST /api/session` via `sendBeacon` on departure.

The digest carries what a recruiter actually did:

- **Engaged time** — ticks only while the tab is visible, so a backgrounded tab
  doesn't turn a four-second visit into forty minutes.
- **Scroll depth per page**, drawn as a bar.
- **Time per chapter** on case studies, read straight from the chapter rail
  `ChapterNav` already renders — so it stays in sync with your content for free.
- **Rage clicks**, labelled by chapter (`The problem space · img.shot`) rather
  than a meaningless class name.
- **Clicks on visuals that do nothing** — someone trying to enlarge a mockup.
  High-signal for a portfolio.
- **Contact and outbound clicks**, in order, timed, and attributed to the page
  that earned them: *Email — 4m12s in, from real-estate-investing*. A session
  with a contact click is headed ✉️ Reached out, so the phone notification
  alone tells you someone wants to talk.
- **Entry and exit path**, click count, screen size.

CTAs are classified by delegation, so a new `mailto:` or social link anywhere
on the site is tracked the moment it ships — nothing to register. Anything that
isn't a link (the chat composer is a `<button>`) carries `data-cta="..."`;
that's the only hook to add when you build a new CTA.

A session is tagged ✉️ Reached out, 🔥 Deep read, 🎯 Engaged session,
💨 Quick bounce or 👋 Session ended, so the notification preview alone tells
you whether to look.

One visit sends one digest. Clicking an internal link is treated as
continuation rather than departure (the nav uses plain anchors, so those are
full page loads), and the session is rebuilt from `sessionStorage` on the next
page. A visitor who tabs away and comes back to do something new gets a
follow-up marked *(cont.)* rather than losing the later activity — capped at
three per session, and only ever sent when a new page, click or contact click
actually happened.

### Microsoft Clarity

Set `NEXT_PUBLIC_CLARITY_ID` to enable session replay, scroll and click
heatmaps, and native rage/dead-click detection. Free, unsampled, no traffic cap.
This is where aggregate drop-off lives — the Slack digest is per-session, so
Clarity's scroll heatmap is what tells you *where most people stop reading*.

### Setup

1. Create a Slack app at <https://api.slack.com/apps> → *Incoming Webhooks* →
   *Add New Webhook to Workspace*, and pick the channel you want pinged.
2. Copy the `https://hooks.slack.com/services/...` URL.
3. Add it in Vercel → Project Settings → Environment Variables as
   **`SLACK_WEBHOOK_URL`**, scoped to **Production** only so preview deploys
   stay quiet. Optionally add `VISIT_HASH_SALT` (any random string).
4. For Clarity, create a project at <https://clarity.microsoft.com>, copy the
   project ID, and add it as **`NEXT_PUBLIC_CLARITY_ID`** — Production only.
5. Redeploy.

### Controls

- **Mute your own devices** — visit any page once with `?nonotify=1`
  (e.g. `https://www.jrprince.design/?nonotify=1`). That browser stops pinging
  Slack *and* stops loading Clarity, so it contributes no session, replay or
  heatmap data either. Clear site data to undo. Do this first, or you'll be
  half your own dataset.
- **Recordings made before you muted** stay in Clarity. Delete them there, or
  add your IP under Clarity → Settings → IP blocking for a second layer that
  does not depend on browser storage.
- **Volume** — one arrival ping and one digest per visitor *session*, not per
  page view. Set `VISIT_NOTIFY_MODE=digest` to halve it. The routes drop known
  bots, dedupe a visitor for 30 minutes, and cap arrivals at 60/hour.
- **Turn it off** — remove `SLACK_WEBHOOK_URL` (notifications) or
  `NEXT_PUBLIC_CLARITY_ID` (Clarity). Both no-op when unset.

### Privacy

The Slack layer sets no cookies and loads no third-party script. The visitor's
IP is hashed in memory purely for rate limiting — never stored, logged, or sent
to Slack. Clarity is a hosted service, so enabling it does send session data to
Microsoft; skip `NEXT_PUBLIC_CLARITY_ID` if you'd rather it didn't.

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
