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
