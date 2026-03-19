import { defineType, defineField } from "sanity";

export default defineType({
  name: "hero",
  title: "Hero Section",
  type: "document",
  fields: [
    defineField({ name: "language", title: "Language", type: "string", options: { list: ["en", "nl", "fr", "de"] } }),
    defineField({ name: "headline", title: "Headline", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "ctaText", title: "CTA Button Text", type: "string" }),
    defineField({ name: "rating", title: "Rating Score", type: "string" }),
    defineField({ name: "ratingText", title: "Rating Label", type: "string" }),
    defineField({ name: "tags", title: "Feature Tags", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "productImage", title: "Product Image", type: "string" }),
  ],
  preview: {
    select: { title: "headline", subtitle: "language" },
  },
});
