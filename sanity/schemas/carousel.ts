import { defineType, defineField } from "sanity";

export default defineType({
  name: "carousel",
  title: "Carousel Section",
  type: "document",
  fields: [
    defineField({ name: "language", title: "Language", type: "string", options: { list: ["en", "nl", "fr", "de"] } }),
    defineField({ name: "label", title: "Section Label", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "ctaText", title: "CTA Button Text", type: "string" }),
    defineField({
      name: "slides",
      title: "Slides",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Title", type: "string" }),
          defineField({ name: "stat", title: "Statistic", type: "string" }),
          defineField({ name: "backgroundColor", title: "Background Color", type: "string" }),
          defineField({ name: "textColor", title: "Text Color", type: "string", options: { list: ["dark", "light"] } }),
        ],
      }],
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "language" },
  },
});
