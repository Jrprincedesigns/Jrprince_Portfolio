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
