import { describe, it, expect } from "vitest";
import {
  ipToInt,
  normalizeIp,
  findProviderIn,
  lookupDatacenter,
  type RangeTable,
} from "./datacenter";

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
