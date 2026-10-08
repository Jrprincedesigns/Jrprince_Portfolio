# Datacenter / Bot Filtering for Analytics Digests

**Date:** 2026-10-07
**Status:** Approved design, pending implementation plan

## Problem

The portfolio posts visit and end-of-session digests to Slack (`💨 Quick bounce`,
`👀 New visitor`, `🎯 Engaged session`, `🔥 Deep read`, `✉️ Reached out`). A large
share of these — especially Quick bounces — come from **cloud/datacenter crawlers**,
not real people. Over the first ~3 weeks of data, ~13 of 41 Quick bounces traced to a
single Google Cloud region (Council Bluffs / Des Moines, IA); others came from Azure
(Boydton, VA) and AWS (Ashburn / Dulles, VA).

These crawlers:
- present real-looking Chrome/Windows user-agents, so the existing `isBot(userAgent)`
  check in `src/lib/visitor.ts` (a UA regex) does not catch them;
- execute JavaScript — they fire the end-of-session beacon, which is why they generate
  full Quick bounce digests;
- originate from published cloud-provider IP ranges.

The result: the "Quick bounce" count (and the feed generally) overstates real human
traffic, making it hard to judge how the site actually performs.

## Goals

- Flag traffic originating from major cloud/datacenter IP ranges so the human signal is
  separable from the bot noise.
- Preserve full visibility: never drop a flagged visit — **tag it**, so a misflag can't
  hide a real lead, and a bot that genuinely engages is still surfaced.
- Keep the request path fast, dependency-free at runtime, and non-throwing.
- Preserve the current privacy posture: the IP is used transiently and never logged or
  sent to Slack.

## Non-goals

- Blocking or rate-limiting bot traffic (this is a labeling feature, not a firewall).
- IPv6 coverage in v1 (see Scope decisions).
- Detecting bots by behavioral heuristics, headless-browser fingerprints, or UA beyond
  the existing `isBot()` check.
- Changing how the Quick bounce / engagement labels themselves are computed.

## Scope decisions (both reversible)

1. **IPv4 only for v1.** The observed datacenter crawlers are all IPv4. A real IPv6
   visitor is simply never flagged (no false tags); IPv6 bot ranges can be added later.
   This keeps the dataset small and the lookup fast.
2. **Tag, don't suppress.** Flagged traffic still posts to Slack with a `🤖` marker and a
   provider name. Suppression was rejected because a misflagged human would become
   invisible and a bot that converts would be missed.

## Decision: detection method

Check the visitor's IP against **published cloud-provider CIDR ranges** (AWS, Google
Cloud, Azure, Oracle), sourced via a **build-time generator** that commits a compact
dataset; runtime does a pure binary search. Chosen over runtime fetch+cache (adds a
network dependency and failure modes to the hot path) and third-party dataset packages
(inherited update cadence + dependency trust). Authoritative data, zero runtime cost,
and explainable tags that can name the provider ("Google Cloud").

## Architecture

Four units, each with a single responsibility:

### 1. `scripts/update-ip-ranges.mjs` (build-time, run manually)

- Invoked via `npm run update-ip-ranges`.
- Fetches official provider range files:
  - AWS — `https://ip-ranges.amazonaws.com/ip-ranges.json` (`prefixes[].ip_prefix`)
  - Google Cloud — `https://www.gstatic.com/ipranges/cloud.json` (`prefixes[].ipv4Prefix`)
  - Oracle — `https://docs.oracle.com/iaas/tools/public_ip_ranges.json`
    (`regions[].cidrs[].cidr`)
  - Azure — ServiceTags JSON (`values[].properties.addressPrefixes`). The URL carries a
    date and sits behind a download page; the script resolves the current file link and
    **fails loudly** if the page/format changes, leaving the last committed dataset intact.
- For each source: extract IPv4 CIDRs, convert each CIDR to an inclusive
  `[startInt, endInt]` uint32 pair, tag with its provider.
- Sort all ranges by `startInt`; merge contiguous/overlapping ranges **within the same
  provider** to shrink the table.
- Emit `src/lib/datacenterRanges.generated.ts`.
- Print a per-provider count summary, total range count, and generated file size.
- A failed fetch for any single provider aborts the run without overwriting the committed
  dataset (all-or-nothing), so a partial/broken dataset is never committed.

### 2. `src/lib/datacenterRanges.generated.ts` (committed data)

Exports:
- `PROVIDERS: string[]` — e.g. `["AWS", "Google Cloud", "Azure", "Oracle"]`.
- `STARTS: number[]`, `ENDS: number[]`, `PROVIDER_IDX: number[]` — parallel arrays sorted
  ascending by `STARTS`; `ENDS[i]` is the inclusive end of range `i`; `PROVIDER_IDX[i]`
  indexes into `PROVIDERS`.
- A header comment recording generation date and source URLs.

Parallel numeric arrays keep the file compact and parse fast on cold start. (If size ever
becomes a concern it can be packed into a string later — out of scope now.)

### 3. `src/lib/datacenter.ts` (runtime, pure)

- `ipToInt(ip: string): number | null` — parse a dotted-quad IPv4 to a uint32; return
  `null` for IPv6, malformed, or out-of-range input.
- `findProvider(ipInt: number): string | null` — binary-search the generated table;
  return the provider name or `null`. Range match is inclusive of both bounds.
- `lookupDatacenter(ip: string): string | null` — normalize the input (strip a trailing
  `:port`, strip an `::ffff:` IPv6-mapped-IPv4 prefix, trim), then `ipToInt` +
  `findProvider`. Never throws; any unparseable input yields `null`.

`findProvider` takes the integer (not the raw string) and the binary search runs over the
module arrays; for tests, the search logic is exercised against a small injected fixture
table (see Testing) so it doesn't depend on the full generated data.

### 4. Integration into builders and routes

- `src/lib/visitor.ts`
  - Add optional `datacenter?: string` to `VisitInfo`.
  - `buildVisitMessage`: when `info.datacenter` is set, prefix the fallback text with `🤖`
    and include the provider in it (e.g. `🤖 New visitor (Google Cloud) on / — …`), and
    add a field `*Network*\n🤖 ${datacenter} (datacenter)`.
- `src/app/api/visit/route.ts`
  - After computing `ip`, call `lookupDatacenter(ip)` and set `info.datacenter`.
- `src/lib/sessionDigest.ts`
  - Add optional `datacenter?: string` to `SessionSummary`.
  - `buildDigestMessage`: when set, prefix the header text with `🤖 ` (e.g.
    `🤖 💨 Quick bounce — 21s`), append `· 🤖 ${datacenter}` to the context line, and
    prefix the fallback text with `🤖`. The engagement label is unchanged, so a tagged
    `✉️ Reached out` still reads as a lead.
- `src/app/api/session/route.ts`
  - Add IP extraction mirroring the visit route
    (`x-vercel-forwarded-for` → `x-forwarded-for`[0] → `"unknown"`), call
    `lookupDatacenter(ip)`, and set `summary.datacenter`.

The chat-exchange notifier (`src/lib/chatNotify.ts`) is intentionally **out of scope** —
bots don't use the chat.

### `package.json`

- Add `"update-ip-ranges": "node scripts/update-ip-ranges.mjs"`.
- Add `"test": "vitest run"` and `vitest` as a devDependency (see Testing).

## Data flow

```
request → route reads client IP (x-vercel-forwarded-for → x-forwarded-for[0])
        → lookupDatacenter(ip) → provider string | null
        → VisitInfo.datacenter / SessionSummary.datacenter
        → buildVisitMessage / buildDigestMessage renders the 🤖 tag
        → postToSlack
```

## Error handling

- `lookupDatacenter` never throws; all bad input (`"unknown"`, empty, IPv6, malformed,
  port-suffixed, IPv6-mapped) resolves to `null` → no tag.
- A missing or empty generated table yields `null` for every lookup (feature simply
  no-ops) and must not break the build or a request.
- The request path gains no new failure modes: a lookup is pure in-memory work.
- The updater script's network/parse failures are confined to build time and never
  overwrite a good committed dataset.

## Testing

No test runner exists in the repo today. Add **vitest** (dev-only) + a `test` script, and
cover the pure IP logic in `src/lib/datacenter.ts` against a small fixture range table:

- `ipToInt`: valid dotted quad; boundaries `0.0.0.0` (0) and `255.255.255.255`
  (4294967295); reject `>255` octets, wrong segment count, non-numeric, empty.
- IPv6 input → `null`; `::ffff:1.2.3.4` normalized to the embedded IPv4; `1.2.3.4:5678`
  strips the port.
- `findProvider` / lookup: IP inside a fixture range → correct provider; inclusive at
  range start and end; IP in a gap between ranges → `null`; IP below the first / above the
  last range → `null`; empty table → `null`.

The generated dataset itself is not asserted (it changes with each refresh); the updater
script is validated manually via its printed summary.

## Rollout

1. Land the code with an initial committed dataset generated by the script.
2. Deploy; confirm a few live digests render tags correctly for known datacenter cities.
3. Re-run `npm run update-ip-ranges` periodically (≈ monthly) to refresh ranges.

## Future work (not now)

- IPv6 range coverage.
- A scheduled refresh (e.g. Vercel cron) instead of manual runs.
- Optionally extend tagging to suppression or filtering once confidence is established.
