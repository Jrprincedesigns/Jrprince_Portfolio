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
