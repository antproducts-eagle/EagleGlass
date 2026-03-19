/**
 * Migration script: imports all JSON content into Sanity.
 *
 * Usage:
 *   PUBLIC_SANITY_PROJECT_ID=xxx SANITY_API_TOKEN=yyy npx tsx scripts/migrate-to-sanity.ts
 */
import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN;
const dataset = process.env.PUBLIC_SANITY_DATASET || "production";

if (!projectId || !token) {
  console.error("Set PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN env vars");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const locales = ["en", "nl", "fr", "de"];

// Map filename (without .json) to Sanity document type
const fileToType: Record<string, string> = {
  hero: "hero",
  about: "about",
  "product-viewer": "productViewer",
  benefits: "benefits",
  "glass-layers": "glassLayers",
  "inside-box": "insideBox",
  variations: "variations",
  carousel: "carousel",
  cta: "cta",
  faq: "faq",
  footer: "footer",
  navbar: "navbar",
  privacy: "privacy",
};

async function migrate() {
  const contentDir = path.resolve(__dirname, "../src/content");
  const transaction = client.transaction();

  for (const locale of locales) {
    const localeDir = path.join(contentDir, locale);
    if (!fs.existsSync(localeDir)) {
      console.warn(`Skipping missing locale dir: ${localeDir}`);
      continue;
    }

    for (const [filename, docType] of Object.entries(fileToType)) {
      const filePath = path.join(localeDir, `${filename}.json`);
      if (!fs.existsSync(filePath)) {
        console.warn(`Skipping missing file: ${filePath}`);
        continue;
      }

      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const docId = `${docType}-${locale}`;

      transaction.createOrReplace({
        _id: docId,
        _type: docType,
        language: locale,
        ...data,
      });

      console.log(`Prepared: ${docId}`);
    }
  }

  // Create default site settings
  transaction.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    contactEmail: "Info@antproducts.nl",
    popupModal: {
      title_en: "Request Pricing",
      title_de: "Preisanfrage",
      title_fr: "Demander un devis",
      title_nl: "Prijsaanvraag",
      description_en: "Get a custom quote tailored to your business needs.",
      description_de: "Erhalten Sie ein maßgeschneidertes Angebot für Ihr Unternehmen.",
      description_fr: "Obtenez un devis personnalisé adapté à vos besoins.",
      description_nl: "Ontvang een offerte op maat voor uw bedrijf.",
      namePlaceholder_en: "Your name",
      namePlaceholder_de: "Ihr Name",
      namePlaceholder_fr: "Votre nom",
      namePlaceholder_nl: "Uw naam",
      emailPlaceholder_en: "Email address",
      emailPlaceholder_de: "E-Mail-Adresse",
      emailPlaceholder_fr: "Adresse e-mail",
      emailPlaceholder_nl: "E-mailadres",
      messagePlaceholder_en: "Tell us about your store...",
      messagePlaceholder_de: "Erzählen Sie uns von Ihrem Geschäft...",
      messagePlaceholder_fr: "Parlez-nous de votre magasin...",
      messagePlaceholder_nl: "Vertel ons over uw winkel...",
      submitText_en: "Send Request",
      submitText_de: "Anfrage senden",
      submitText_fr: "Envoyer la demande",
      submitText_nl: "Verzoek verzenden",
    },
  });

  console.log("\nCommitting transaction...");
  await transaction.commit();
  console.log("Migration complete!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
