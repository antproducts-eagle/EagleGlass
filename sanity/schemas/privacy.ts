import { defineType, defineField } from "sanity";

export default defineType({
  name: "privacy",
  title: "Privacy Policy",
  type: "document",
  fields: [
    defineField({ name: "language", title: "Language", type: "string", options: { list: ["en", "nl", "fr", "de"] } }),
    defineField({ name: "title", title: "Page Title", type: "string" }),
    defineField({ name: "lastUpdated", title: "Last Updated", type: "string" }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "heading", title: "Heading", type: "string" }),
          defineField({ name: "content", title: "Content", type: "text" }),
        ],
      }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "language" },
  },
});
