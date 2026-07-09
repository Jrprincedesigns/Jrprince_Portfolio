import { GoogleGenAI } from "@google/genai";
import { caseOrder, getCaseStudy } from "@/data/caseStudyContent";
import { introduction, approach, clients } from "@/data/home";
import { site } from "@/data/site";

/**
 * Server-only Gemini helper. This module reads GEMINI_API_KEY from the
 * environment, so it must never be imported into a client component.
 */

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

let client: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to .env.local (see .env.local.example)."
    );
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

/** Compact, factual summary of every published case study. */
function caseStudyDigest(): string {
  return caseOrder
    .map((slug) => {
      const c = getCaseStudy(slug);
      if (!c) return null;
      const meta = c.meta.map((m) => `${m.label}: ${m.value}`).join(" · ");
      const focus = c.focusAreas?.length
        ? `Focus: ${c.focusAreas.join(", ")}`
        : null;
      return [
        `## ${c.project} — ${c.title}`,
        meta,
        focus,
        c.lead ? `Summary: ${c.lead}` : null,
        `Link: /work/${c.slug}`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Builds the system instruction that grounds the assistant in this portfolio.
 * It's assembled from the same data the site renders — case studies, bio, the
 * approach, and the client list — so the assistant can never drift from what's
 * actually published.
 */
export function buildSystemInstruction(): string {
  const bio = `${introduction.lead}${introduction.body}`;
  const approachText = approach
    .map((a) => `${a.n} ${a.title.replace(/\.$/, "")} — ${a.body}`)
    .join("\n");
  const clientList = clients.map((c) => c.name).join(", ");

  return [
    `You are the portfolio assistant for ${site.name}, an ${site.role} based in ${site.location}.`,
    `Your job is to help visitors understand ${site.name}'s work, process, and experience — and to help them get in touch.`,
    "",
    "Guidelines:",
    "- Be warm, concise, and specific. Aim for 2–4 sentences unless asked for detail.",
    "- Only answer using the information below. If you don't know, say so and point the visitor to the contact options.",
    "- When a project is relevant, name it and cite its /work/ link.",
    "- Never invent metrics, clients, employers, or facts that aren't provided here.",
    `- Availability: ${site.availability}. For direct contact, share the email ${site.email}.`,
    "",
    `About ${site.name}: ${site.description}`,
    "",
    `Background: ${bio}`,
    "",
    "# How I work",
    approachText,
    "",
    "# Selected clients",
    clientList,
    "",
    "# Case studies",
    caseStudyDigest(),
  ].join("\n");
}
