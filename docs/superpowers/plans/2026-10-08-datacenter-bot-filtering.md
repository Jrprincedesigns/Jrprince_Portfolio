# Datacenter / Bot Filtering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tag Slack visit/session digests whose client IP falls in a major cloud provider's range (AWS/GCP/Azure/Oracle), so Quick bounce counts reflect real humans.

**Architecture:** A build-time Node script fetches official provider CIDR lists and emits a committed, sorted IPv4 range table. A pure runtime module (`datacenter.ts`) binary-searches that table to turn an IP into a provider name. The visit and session routes call it and thread a `🤖 <provider>` tag into the existing Slack message builders. Tag-don't-suppress; IPv4-only; never throws in the request path.

**Tech Stack:** Next.js 15 (App Router, Node runtime), TypeScript, Node 18+ `fetch`, vitest (new, dev-only).

**Working directory:** `/Users/jrprince/Jrprince_Portfolio/Jrprince_Portfolio` (all paths below are relative to it). Branch: `feat/datacenter-bot-filtering`.

**Spec:** `docs/superpowers/specs/2026-10-07-datacenter-bot-filtering-design.md`

---

## File structure

| File | Responsibility | Task |
|---|---|---|
| `vitest.config.ts` | Test runner config (node env, `@` alias) | 1 |
| `src/lib/datacenterRanges.generated.ts` | Committed data: `PROVIDERS` + sorted `STARTS`/`ENDS`/`PROVIDER_IDX` | 2 (stub), 7 (real) |
| `src/lib/datacenter.ts` | Pure IP→provider lookup: `ipToInt`, `normalizeIp`, `findProviderIn`, `findProvider`, `lookupDatacenter` | 3–6 |
| `src/lib/datacenter.test.ts` | Unit tests for the pure IP logic | 3–6 |
| `scripts/update-ip-ranges.mjs` | Build-time range generator | 7 |
| `src/lib/visitor.ts` | `VisitInfo.datacenter` + tag in `buildVisitMessage` | 8 |
| `src/app/api/visit/route.ts` | Lookup + set `info.datacenter` | 8 |
| `src/lib/sessionDigest.ts` | `SessionSummary.datacenter` + tag in `buildDigestMessage` | 9 |
| `src/app/api/session/route.ts` | Extract IP + set `summary.datacenter` | 9 |
| `package.json` | `test` + `update-ip-ranges` scripts, `vitest` devDep | 1, 7 |

---

## Task 1: Set up vitest

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Install vitest (dev-only)**

Run: `npm install -D vitest`
Expected: `package.json` gains `vitest` under `devDependencies`; `package-lock.json` updates.

- [ ] **Step 2: Add the `test` script**

Edit `package.json` `"scripts"` — add the `test` line (keep existing scripts):

```json
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    passWithNoTests: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
```

- [ ] **Step 4: Verify the runner works with no tests yet**

Run: `npm test`
Expected: PASS — exits 0 with "No test files found" tolerated by `passWithNoTests`.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "Add vitest for unit testing"
```

---

## Task 2: Stub the generated range module

Create an empty, correctly-shaped data module so `datacenter.ts` compiles and tests run before the real dataset exists (Task 7 overwrites it).

**Files:**
- Create: `src/lib/datacenterRanges.generated.ts`

- [ ] **Step 1: Create the stub**

```ts
// GENERATED FILE — do not edit by hand.
// Produced by scripts/update-ip-ranges.mjs (npm run update-ip-ranges).
// Sources: AWS, Google Cloud, Azure, Oracle published IPv4 ranges.
// This is an empty stub until the generator is run.

/** Provider display names, indexed by PROVIDER_IDX. */
export const PROVIDERS: string[] = [];

/** Inclusive IPv4 range starts (uint32), sorted ascending. */
export const STARTS: number[] = [];

/** Inclusive IPv4 range ends (uint32), parallel to STARTS. */
export const ENDS: number[] = [];

/** Index into PROVIDERS for each range, parallel to STARTS. */
export const PROVIDER_IDX: number[] = [];
```

- [ ] **Step 2: Verify it typechecks**

Run: `npm run typecheck`
Expected: PASS (exit 0).

- [ ] **Step 3: Commit**

```bash
git add src/lib/datacenterRanges.generated.ts
git commit -m "Add stub generated datacenter range module"
```

---

## Task 3: `ipToInt`

**Files:**
- Create: `src/lib/datacenter.test.ts`
- Create: `src/lib/datacenter.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/datacenter.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { ipToInt } from "./datacenter";

describe("ipToInt", () => {
  it("parses a dotted quad to uint32", () => {
    expect(ipToInt("0.0.0.0")).toBe(0);
    expect(ipToInt("255.255.255.255")).toBe(4294967295);
    expect(ipToInt("1.2.3.4")).toBe(16909060);
  });

  it("rejects malformed input with null", () => {
    expect(ipToInt("256.0.0.1")).toBeNull();
    expect(ipToInt("1.2.3")).toBeNull();
    expect(ipToInt("1.2.3.4.5")).toBeNull();
    expect(ipToInt("a.b.c.d")).toBeNull();
    expect(ipToInt("")).toBeNull();
    expect(ipToInt("2001:db8::1")).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/datacenter.test.ts`
Expected: FAIL — cannot resolve `ipToInt` / module `./datacenter`.

- [ ] **Step 3: Create `src/lib/datacenter.ts` with `ipToInt`**

```ts
/**
 * Pure IPv4 → cloud-provider lookup. Used to tag datacenter/bot traffic in
 * Slack digests. Never throws: any unparseable input yields null (no tag).
 *
 * IPv4 only by design — a real IPv6 visitor is simply never tagged.
 */

import { PROVIDERS, STARTS, ENDS, PROVIDER_IDX } from "./datacenterRanges.generated";

/** Parse a dotted-quad IPv4 string to a uint32, or null if not valid IPv4. */
export function ipToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const octet = Number(part);
    if (octet > 255) return null;
    n = n * 256 + octet;
  }
  return n >>> 0;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/datacenter.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/datacenter.ts src/lib/datacenter.test.ts
git commit -m "Add ipToInt IPv4 parser"
```

---

## Task 4: `normalizeIp`

**Files:**
- Modify: `src/lib/datacenter.test.ts`
- Modify: `src/lib/datacenter.ts`

- [ ] **Step 1: Add the failing test**

Append to `src/lib/datacenter.test.ts`:

```ts
import { normalizeIp } from "./datacenter";

describe("normalizeIp", () => {
  it("trims whitespace", () => {
    expect(normalizeIp("  1.2.3.4  ")).toBe("1.2.3.4");
  });

  it("strips an IPv6-mapped IPv4 prefix", () => {
    expect(normalizeIp("::ffff:1.2.3.4")).toBe("1.2.3.4");
  });

  it("strips a trailing port from an IPv4 address", () => {
    expect(normalizeIp("1.2.3.4:5678")).toBe("1.2.3.4");
  });

  it("leaves a plain IPv6 address untouched", () => {
    expect(normalizeIp("2001:db8::1")).toBe("2001:db8::1");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/datacenter.test.ts`
Expected: FAIL — `normalizeIp` not exported.

- [ ] **Step 3: Add `normalizeIp` to `src/lib/datacenter.ts`**

Add below `ipToInt`:

```ts
/**
 * Normalize a raw IP header value for IPv4 parsing: trim, strip an
 * `::ffff:` IPv6-mapped-IPv4 prefix, and strip a trailing `:port`.
 * A genuine IPv6 address (no embedded dot) is returned unchanged.
 */
export function normalizeIp(ip: string): string {
  let s = ip.trim();
  if (s.startsWith("::ffff:")) s = s.slice("::ffff:".length);
  if (s.includes(".") && s.includes(":")) s = s.split(":")[0];
  return s;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/datacenter.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/datacenter.ts src/lib/datacenter.test.ts
git commit -m "Add normalizeIp"
```

---

## Task 5: `findProviderIn` + `findProvider`

**Files:**
- Modify: `src/lib/datacenter.test.ts`
- Modify: `src/lib/datacenter.ts`

- [ ] **Step 1: Add the failing test (binary search over a fixture table)**

Append to `src/lib/datacenter.test.ts`:

```ts
import { findProviderIn, type RangeTable } from "./datacenter";

const FIXTURE: RangeTable = {
  providers: ["AWS", "Google Cloud"],
  // ranges: [10..20] AWS, [100..100] Google Cloud, [200..300] AWS
  starts: [10, 100, 200],
  ends: [20, 100, 300],
  providerIdx: [0, 1, 0],
};

describe("findProviderIn", () => {
  it("matches inside a range", () => {
    expect(findProviderIn(FIXTURE, 15)).toBe("AWS");
    expect(findProviderIn(FIXTURE, 250)).toBe("AWS");
  });

  it("is inclusive at both bounds", () => {
    expect(findProviderIn(FIXTURE, 10)).toBe("AWS");
    expect(findProviderIn(FIXTURE, 20)).toBe("AWS");
    expect(findProviderIn(FIXTURE, 100)).toBe("Google Cloud");
  });

  it("returns null in gaps and outside all ranges", () => {
    expect(findProviderIn(FIXTURE, 9)).toBeNull();
    expect(findProviderIn(FIXTURE, 50)).toBeNull();
    expect(findProviderIn(FIXTURE, 301)).toBeNull();
  });

  it("returns null for an empty table", () => {
    expect(
      findProviderIn({ providers: [], starts: [], ends: [], providerIdx: [] }, 15)
    ).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/datacenter.test.ts`
Expected: FAIL — `findProviderIn` / `RangeTable` not exported.

- [ ] **Step 3: Add the binary search to `src/lib/datacenter.ts`**

Add below `normalizeIp`:

```ts
export interface RangeTable {
  providers: string[];
  starts: number[];
  ends: number[];
  providerIdx: number[];
}

/**
 * Binary-search a sorted range table for the IPv4 integer. Finds the range
 * with the greatest start <= ip and returns its provider if ip is within the
 * inclusive end; otherwise null. Assumes ranges do not overlap across
 * providers (true for published cloud ranges).
 */
export function findProviderIn(table: RangeTable, ip: number): string | null {
  const { starts, ends, providerIdx, providers } = table;
  let lo = 0;
  let hi = starts.length - 1;
  let ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (starts[mid] <= ip) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  if (ans >= 0 && ip <= ends[ans]) return providers[providerIdx[ans]];
  return null;
}

const GENERATED_TABLE: RangeTable = {
  providers: PROVIDERS,
  starts: STARTS,
  ends: ENDS,
  providerIdx: PROVIDER_IDX,
};

/** Look up a provider for an already-parsed IPv4 integer in the generated table. */
export function findProvider(ip: number): string | null {
  return findProviderIn(GENERATED_TABLE, ip);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/datacenter.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/datacenter.ts src/lib/datacenter.test.ts
git commit -m "Add binary-search range lookup"
```

---

## Task 6: `lookupDatacenter`

**Files:**
- Modify: `src/lib/datacenter.test.ts`
- Modify: `src/lib/datacenter.ts`

- [ ] **Step 1: Add the failing test**

Append to `src/lib/datacenter.test.ts`:

```ts
import { lookupDatacenter } from "./datacenter";

describe("lookupDatacenter", () => {
  it("returns null for bad / empty / IPv6 / private input without throwing", () => {
    expect(lookupDatacenter("")).toBeNull();
    expect(lookupDatacenter("unknown")).toBeNull();
    expect(lookupDatacenter("2001:db8::1")).toBeNull();
    // Private/residential IP: never in the generated cloud table.
    expect(lookupDatacenter("192.168.1.10")).toBeNull();
  });

  it("normalizes before lookup (no throw on port / mapped forms)", () => {
    expect(() => lookupDatacenter("1.2.3.4:5678")).not.toThrow();
    expect(() => lookupDatacenter("::ffff:1.2.3.4")).not.toThrow();
  });
});
```

Note: these assert null / no-throw against the generated table (empty stub now, real data after Task 7). They must stay true either way — do not assert a specific provider here, since the dataset changes on refresh.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/datacenter.test.ts`
Expected: FAIL — `lookupDatacenter` not exported.

- [ ] **Step 3: Add `lookupDatacenter` to `src/lib/datacenter.ts`**

Add at the end:

```ts
/**
 * Resolve a raw IP header value to a cloud-provider name, or null if it isn't
 * in a known datacenter range (or isn't parseable IPv4). Never throws.
 */
export function lookupDatacenter(ip: string): string | null {
  if (!ip) return null;
  const n = ipToInt(normalizeIp(ip));
  if (n === null) return null;
  return findProvider(n);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/datacenter.test.ts`
Expected: PASS (all datacenter tests green).

- [ ] **Step 5: Commit**

```bash
git add src/lib/datacenter.ts src/lib/datacenter.test.ts
git commit -m "Add lookupDatacenter entry point"
```

---

## Task 7: Range generator script + real dataset

**Files:**
- Create: `scripts/update-ip-ranges.mjs`
- Modify: `package.json`
- Regenerate: `src/lib/datacenterRanges.generated.ts`

- [ ] **Step 1: Create `scripts/update-ip-ranges.mjs`**

```js
// Regenerates src/lib/datacenterRanges.generated.ts from published cloud
// provider IPv4 ranges. Run: npm run update-ip-ranges
// All-or-nothing: if any provider fetch/parse fails, nothing is written.

import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "src", "lib", "datacenterRanges.generated.ts");

const AZURE_PAGE = "https://www.microsoft.com/en-us/download/details.aspx?id=56519";

/** Parse a dotted-quad IPv4 to uint32, or null. */
function ipToInt(ip) {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const octet = Number(part);
    if (octet > 255) return null;
    n = n * 256 + octet;
  }
  return n >>> 0;
}

/** CIDR "a.b.c.d/nn" -> [start,end] uint32, or null for non-IPv4. */
function cidrToRange(cidr) {
  const [ip, bitsStr] = cidr.split("/");
  const start = ipToInt(ip);
  if (start === null) return null;
  const bits = Number(bitsStr);
  if (!Number.isInteger(bits) || bits < 0 || bits > 32) return null;
  const size = 2 ** (32 - bits);
  const network = start - (start % size);
  return [network, network + size - 1];
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "user-agent": "jrprince-portfolio-ip-updater" } });
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`);
  return res.json();
}

async function awsRanges() {
  const data = await fetchJson("https://ip-ranges.amazonaws.com/ip-ranges.json");
  return (data.prefixes ?? []).map((p) => p.ip_prefix).filter(Boolean);
}

async function gcpRanges() {
  const data = await fetchJson("https://www.gstatic.com/ipranges/cloud.json");
  return (data.prefixes ?? []).map((p) => p.ipv4Prefix).filter(Boolean);
}

async function oracleRanges() {
  const data = await fetchJson("https://docs.oracle.com/iaas/tools/public_ip_ranges.json");
  const out = [];
  for (const region of data.regions ?? []) {
    for (const c of region.cidrs ?? []) {
      if (c.cidr) out.push(c.cidr);
    }
  }
  return out;
}

async function azureRanges() {
  // Resolve the dated ServiceTags file from the download page, then fetch it.
  const page = await (await fetch(AZURE_PAGE, {
    headers: { "user-agent": "jrprince-portfolio-ip-updater" },
  })).text();
  const match = page.match(
    /https:\/\/download\.microsoft\.com\/download\/[^"']+ServiceTags_Public_\d+\.json/
  );
  if (!match) throw new Error("Azure: could not resolve ServiceTags JSON URL from download page");
  const data = await fetchJson(match[0]);
  const out = [];
  for (const v of data.values ?? []) {
    for (const prefix of v.properties?.addressPrefixes ?? []) {
      if (!prefix.includes(":")) out.push(prefix); // IPv4 only
    }
  }
  return out;
}

/** Sort + merge contiguous/overlapping ranges within one provider. */
function mergeRanges(ranges) {
  const sorted = ranges.slice().sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [s, e] of sorted) {
    const last = merged[merged.length - 1];
    if (last && s <= last[1] + 1) {
      last[1] = Math.max(last[1], e);
    } else {
      merged.push([s, e]);
    }
  }
  return merged;
}

async function main() {
  const PROVIDERS = ["AWS", "Google Cloud", "Azure", "Oracle"];
  const fetchers = [awsRanges, gcpRanges, azureRanges, oracleRanges];

  // All-or-nothing: fetch every provider before writing anything.
  const perProvider = [];
  for (let i = 0; i < PROVIDERS.length; i++) {
    const cidrs = await fetchers[i]();
    const ranges = [];
    for (const cidr of cidrs) {
      const r = cidrToRange(cidr);
      if (r) ranges.push(r);
    }
    const merged = mergeRanges(ranges);
    perProvider.push(merged);
    console.log(`${PROVIDERS[i]}: ${cidrs.length} CIDRs -> ${merged.length} merged ranges`);
  }

  // Flatten to parallel arrays, sorted by start across all providers.
  const all = [];
  perProvider.forEach((ranges, idx) => {
    for (const [s, e] of ranges) all.push([s, e, idx]);
  });
  all.sort((a, b) => a[0] - b[0]);

  const starts = all.map((r) => r[0]);
  const ends = all.map((r) => r[1]);
  const providerIdx = all.map((r) => r[2]);

  const stamp = new Date().toISOString().slice(0, 10);
  const body = `// GENERATED FILE — do not edit by hand.
// Produced by scripts/update-ip-ranges.mjs (npm run update-ip-ranges).
// Sources: AWS, Google Cloud, Azure, Oracle published IPv4 ranges.
// Generated: ${stamp}

/** Provider display names, indexed by PROVIDER_IDX. */
export const PROVIDERS: string[] = ${JSON.stringify(PROVIDERS)};

/** Inclusive IPv4 range starts (uint32), sorted ascending. */
export const STARTS: number[] = ${JSON.stringify(starts)};

/** Inclusive IPv4 range ends (uint32), parallel to STARTS. */
export const ENDS: number[] = ${JSON.stringify(ends)};

/** Index into PROVIDERS for each range, parallel to STARTS. */
export const PROVIDER_IDX: number[] = ${JSON.stringify(providerIdx)};
`;

  writeFileSync(OUT, body);
  console.log(`\nWrote ${all.length} total ranges to ${OUT}`);
}

main().catch((err) => {
  console.error("update-ip-ranges failed; generated file left unchanged.");
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Add the `update-ip-ranges` script to `package.json`**

In `"scripts"`, add:

```json
    "test": "vitest run",
    "update-ip-ranges": "node scripts/update-ip-ranges.mjs"
```

- [ ] **Step 3: Run the generator**

Run: `npm run update-ip-ranges`
Expected: per-provider "N CIDRs -> M merged ranges" lines for AWS/Google Cloud/Azure/Oracle, then "Wrote <total> total ranges". `src/lib/datacenterRanges.generated.ts` now contains populated arrays.
If it exits non-zero (e.g. Azure URL resolution failed), the generated file is unchanged — investigate the printed error before continuing.

- [ ] **Step 4: Verify tests and types still pass against real data**

Run: `npm test`
Expected: PASS (datacenter tests still green — private/IPv6/bad inputs still null).

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Confirm the dataset is non-empty**

Run: `grep -c "" src/lib/datacenterRanges.generated.ts` and visually confirm `STARTS`/`ENDS`/`PROVIDER_IDX` are populated (not `[]`).
Expected: the file is large (tens of thousands of numbers). A real datacenter-IP spot-check happens on a deployed digest in Rollout; the lookup logic itself is already covered by the Task 3–6 tests.

- [ ] **Step 6: Commit**

```bash
git add scripts/update-ip-ranges.mjs package.json src/lib/datacenterRanges.generated.ts
git commit -m "Add cloud IP range generator and initial dataset"
```

---

## Task 8: Tag visit digests

**Files:**
- Modify: `src/lib/visitor.ts` (interface `VisitInfo` ~line 11; `buildVisitMessage` ~line 132)
- Modify: `src/app/api/visit/route.ts` (~line 101)
- Modify: `src/lib/visitor.test.ts` (create)

- [ ] **Step 1: Write the failing test**

Create `src/lib/visitor.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildVisitMessage, type VisitInfo } from "./visitor";

const base: VisitInfo = {
  path: "/",
  title: "Home",
  referrer: "",
  utm: {},
  city: "Council Bluffs",
  region: "IA",
  country: "US",
  browser: "Chrome",
  os: "Windows",
  device: "Desktop",
  returning: false,
  screen: "1920×1080",
};

describe("buildVisitMessage datacenter tag", () => {
  it("adds a Network field and 🤖 to the fallback when datacenter is set", () => {
    const msg = buildVisitMessage({ ...base, datacenter: "Google Cloud" });
    expect(msg.text).toContain("🤖");
    expect(msg.text).toContain("Google Cloud");
    const hasNetworkField = JSON.stringify(msg.blocks).includes("Google Cloud (datacenter)");
    expect(hasNetworkField).toBe(true);
  });

  it("omits the tag when datacenter is unset", () => {
    const msg = buildVisitMessage(base);
    expect(msg.text).not.toContain("🤖");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/visitor.test.ts`
Expected: FAIL — `datacenter` not on `VisitInfo` (TS) / tag not present.

- [ ] **Step 3: Add `datacenter` to `VisitInfo`**

In `src/lib/visitor.ts`, add the field to the interface (after `screen: string;`):

```ts
  screen: string;
  /** Cloud provider name when the IP is in a datacenter range, else undefined. */
  datacenter?: string;
}
```

- [ ] **Step 4: Render the tag in `buildVisitMessage`**

In `buildVisitMessage`, after the `campaign`/`screen` field pushes and before the `when` computation, add the Network field:

```ts
  if (info.datacenter) {
    fields.push({ type: "mrkdwn", text: `*Network*\n🤖 ${info.datacenter} (datacenter)` });
  }
```

Then change the returned `text` (fallback) line from:

```ts
    text: `${emoji} ${label} on ${info.path} — ${location}, via ${source}`,
```

to:

```ts
    text: `${info.datacenter ? "🤖 " : ""}${emoji} ${label}${
      info.datacenter ? ` (${info.datacenter})` : ""
    } on ${info.path} — ${location}, via ${source}`,
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/lib/visitor.test.ts`
Expected: PASS.

- [ ] **Step 6: Wire the lookup into the visit route**

In `src/app/api/visit/route.ts`, add the import near the other `@/lib/visitor` import:

```ts
import { lookupDatacenter } from "@/lib/datacenter";
```

Then in the `info` object literal (the `const info: VisitInfo = { ... }`), add:

```ts
    ...parseUserAgent(userAgent),
    datacenter: lookupDatacenter(ip) ?? undefined,
  };
```

- [ ] **Step 7: Verify types and full test suite**

Run: `npm run typecheck`
Expected: PASS.

Run: `npm test`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/lib/visitor.ts src/lib/visitor.test.ts src/app/api/visit/route.ts
git commit -m "Tag visit digests with datacenter provider"
```

---

## Task 9: Tag session digests

**Files:**
- Modify: `src/lib/sessionDigest.ts` (interface `SessionSummary` ~line 31; `buildDigestMessage` ~line 153)
- Modify: `src/app/api/session/route.ts` (~line 46 and the `summary` literal ~line 103)
- Modify: `src/lib/sessionDigest.test.ts` (create)

- [ ] **Step 1: Write the failing test**

Create `src/lib/sessionDigest.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildDigestMessage, type SessionSummary } from "./sessionDigest";

const base: SessionSummary = {
  durationMs: 21000,
  entryPath: "/",
  exitPath: "/",
  referrer: "",
  utm: {},
  screen: "1920×1080",
  returning: false,
  clicks: 0,
  pages: [{ path: "/", title: "Home", engagedMs: 21000, maxScroll: 5 }],
  chapters: [],
  rage: {},
  deadVisual: {},
  conversions: [],
  continued: false,
  geo: { city: "Boydton", region: "VA", country: "US" },
  device: { browser: "Chrome", os: "Windows", device: "Desktop" },
};

describe("buildDigestMessage datacenter tag", () => {
  it("prefixes header + fallback and adds provider to context when set", () => {
    const msg = buildDigestMessage({ ...base, datacenter: "Azure" });
    expect(msg.text.startsWith("🤖")).toBe(true);
    const json = JSON.stringify(msg.blocks);
    expect(json).toContain("🤖 Azure"); // context line
    const header = msg.blocks[0] as { text: { text: string } };
    expect(header.text.text.startsWith("🤖")).toBe(true);
  });

  it("omits the tag when datacenter is unset", () => {
    const msg = buildDigestMessage(base);
    expect(msg.text.startsWith("🤖")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/sessionDigest.test.ts`
Expected: FAIL — `datacenter` not on `SessionSummary` / tag absent.

- [ ] **Step 3: Add `datacenter` to `SessionSummary`**

In `src/lib/sessionDigest.ts`, add to the interface (after `device: Pick<...>;`):

```ts
  device: Pick<VisitInfo, "browser" | "os" | "device">;
  /** Cloud provider name when the IP is in a datacenter range, else undefined. */
  datacenter?: string;
}
```

- [ ] **Step 4: Render the tag in `buildDigestMessage`**

4a. Header — change the first block's text from:

```ts
      text: { type: "plain_text", text: `${emoji} ${label} — ${duration}`, emoji: true },
```

to:

```ts
      text: {
        type: "plain_text",
        text: `${summary.datacenter ? "🤖 " : ""}${emoji} ${label} — ${duration}`,
        emoji: true,
      },
```

4b. Context line — the final `blocks.push({ type: "context", ... })` builds an array passed to `.join(" · ")`. Add the datacenter entry to that array (alongside `visitorKind` etc.):

```ts
          `${visitorKind} visitor`,
          `entry \`${summary.entryPath}\``,
          `exit \`${summary.exitPath}\``,
          summary.screen,
          campaign,
          summary.datacenter ? `🤖 ${summary.datacenter}` : "",
```

(The existing `.filter(Boolean)` drops it when empty.)

4c. Fallback text — change:

```ts
    text: `${emoji} ${label} — ${duration} · ${headline} · ${location} via ${source}`,
```

to:

```ts
    text: `${summary.datacenter ? "🤖 " : ""}${emoji} ${label} — ${duration} · ${headline} · ${location} via ${source}`,
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/lib/sessionDigest.test.ts`
Expected: PASS.

- [ ] **Step 6: Wire the lookup into the session route**

In `src/app/api/session/route.ts`, add the import:

```ts
import { lookupDatacenter } from "@/lib/datacenter";
```

Immediately before `const summary: SessionSummary = {`, add IP extraction (mirrors the visit route):

```ts
  const ip =
    req.headers.get("x-vercel-forwarded-for") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

```

Then add to the `summary` object literal (after `device: parseUserAgent(userAgent),`):

```ts
    device: parseUserAgent(userAgent),
    datacenter: lookupDatacenter(ip) ?? undefined,
  };
```

- [ ] **Step 7: Verify types and full test suite**

Run: `npm run typecheck`
Expected: PASS.

Run: `npm test`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/lib/sessionDigest.ts src/lib/sessionDigest.test.ts src/app/api/session/route.ts
git commit -m "Tag session digests with datacenter provider"
```

---

## Task 10: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Full typecheck, tests, lint, build**

Run: `npm run typecheck && npm test && npm run lint && npm run build`
Expected: all PASS (build completes without errors).

- [ ] **Step 2: Confirm clean tree**

Run: `git status --short`
Expected: no uncommitted changes from this feature (the pre-existing chat-feature changes in `src/app/api/chat/route.ts` and `src/lib/chatNotify.ts` may remain — they are out of scope for this plan).

---

## Rollout (post-merge)

1. Deploy the branch.
2. Watch #general for a visit from a known datacenter city (e.g. Boydton VA / Council Bluffs IA) and confirm the `🤖 <provider>` tag renders on both the arrival ping and the session digest.
3. Re-run `npm run update-ip-ranges` roughly monthly to refresh ranges; commit the regenerated file.
