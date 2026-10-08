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
