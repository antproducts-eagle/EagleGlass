import { createClient, type SanityClient } from "@sanity/client";
import type { Locale } from "../i18n/config";

let _client: SanityClient | null = null;

function getClient(): SanityClient | null {
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  if (!projectId || projectId === "YOUR_PROJECT_ID") return null;

  if (!_client) {
    _client = createClient({
      projectId,
      dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2024-01-01",
      useCdn: true,
    });
  }
  return _client;
}

// Section document types that have a language field
const sectionTypes = [
  "hero",
  "about",
  "productViewer",
  "benefits",
  "glassLayers",
  "insideBox",
  "variations",
  "carousel",
  "cta",
  "faq",
  "footer",
  "navbar",
  "privacy",
] as const;

type SectionType = (typeof sectionTypes)[number];

/**
 * Fetch a single section document by type and language.
 * Returns null if not found.
 */
async function fetchSection(type: SectionType, language: string) {
  const client = getClient();
  if (!client) return null;
  const result = await client.fetch(
    `*[_type == $type && language == $language][0]`,
    { type, language }
  );
  return result ?? null;
}

/**
 * Fetch all section content for a given locale from Sanity.
 * Falls back to local JSON files if Sanity is not configured or returns empty.
 */
export async function getSanityContent(lang: Locale) {
  // If Sanity is not configured, fall back to JSON
  if (!getClient()) {
    const { getContent } = await import("../i18n/content");
    return getContent(lang);
  }

  try {
    const results = await Promise.all(
      sectionTypes.map((type) => fetchSection(type, lang))
    );

    const content: Record<string, any> = {};
    for (let i = 0; i < sectionTypes.length; i++) {
      content[sectionTypes[i]] = results[i];
    }

    // Check if we got data — if any core section is missing, fall back
    if (!content.hero || !content.navbar) {
      const { getContent } = await import("../i18n/content");
      return getContent(lang);
    }

    return content;
  } catch (error) {
    console.error("Sanity fetch failed, falling back to JSON:", error);
    const { getContent } = await import("../i18n/content");
    return getContent(lang);
  }
}

/**
 * Fetch site settings (contactEmail, modal texts, etc.)
 */
export async function getSiteSettings() {
  const client = getClient();
  if (!client) return null;

  try {
    return await client.fetch(
      `*[_type == "siteSettings" && _id == "siteSettings"][0]`
    );
  } catch {
    return null;
  }
}
