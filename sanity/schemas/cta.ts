import { defineType, defineField } from "sanity";

export default defineType({
  name: "cta",
  title: "CTA Section",
  type: "document",
  fields: [
    defineField({ name: "language", title: "Language", type: "string", options: { list: ["en", "nl", "fr", "de"] } }),
    defineField({ name: "label", title: "Section Label", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "ctaText", title: "CTA Button Text", type: "string" }),
    defineField({ name: "image", title: "Product Image", type: "string" }),
  ],
  preview: {
    select: { title: "heading", subtitle: "language" },
  },
});
