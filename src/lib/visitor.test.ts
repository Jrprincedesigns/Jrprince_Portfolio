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
