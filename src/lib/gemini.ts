import { GoogleGenAI } from "@google/genai";
import { publishedCaseStudies } from "@/data/caseStudies";
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

/**
 * Builds the system instruction that grounds the assistant in this portfolio.
 * It's assembled from the same data the site renders, so the assistant can
 * never drift from what's actually published.
 */
export function buildSystemInstruction(): string {
  const projects = publishedCaseStudies
    .map((c) => {
      const metrics = c.metrics
        .map((m) => `${m.label}: ${m.value}`)
        .join(", ");
      return [
        `## ${c.title} — ${c.subtitle}`,
        `Client: ${c.client} · Year: ${c.year} · Role: ${c.role}`,
        `Disciplines: ${c.disciplines.join(", ")}`,
        `Summary: ${c.summary}`,
        `Key metrics: ${metrics}`,
        `Link: /work/${c.slug}`,
      ].join("\n");
    })
    .join("\n\n");

  return [
    `You are the portfolio assistant for ${site.name}, a ${site.role}.`,
    `Your job is to help visitors understand ${site.name}'s work, process, and experience.`,
    "",
    "Guidelines:",
    "- Be warm, concise, and specific. Aim for 2–4 sentences unless asked for detail.",
    "- Only answer using the information below. If you don't know, say so and " +
      "suggest the visitor reach out via the contact link.",
    "- When relevant, point to a specific case study by name and its /work/ link.",
    "- Never invent metrics, clients, or facts that aren't provided.",
    "",
    `About ${site.name}: ${site.description}`,
    `Location / availability: ${site.location}`,
    `Contact: ${site.email}`,
    "",
    "# Case studies",
    projects,
  ].join("\n");
}
