import { defineType, defineField } from "sanity";

export default defineType({
  name: "navbar",
  title: "Navbar",
  type: "document",
  fields: [
    defineField({ name: "language", title: "Language", type: "string", options: { list: ["en", "nl", "fr", "de"] } }),
    defineField({
      name: "links",
      title: "Navigation Links",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "label", title: "Link Text", type: "string" }),
          defineField({ name: "href", title: "URL", type: "string" }),
        ],
      }],
    }),
    defineField({ name: "ctaText", title: "CTA Button Text", type: "string" }),
  ],
  preview: {
    select: { subtitle: "language" },
    prepare: ({ subtitle }) => ({ title: "Navbar", subtitle }),
  },
});
