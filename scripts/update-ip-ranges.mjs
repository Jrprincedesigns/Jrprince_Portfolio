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
