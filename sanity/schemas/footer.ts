import { defineType, defineField } from "sanity";

export default defineType({
  name: "footer",
  title: "Footer",
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
    defineField({ name: "copyright", title: "Copyright Text", type: "string" }),
    defineField({
      name: "legal",
      title: "Legal Links",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "label", title: "Link Text", type: "string" }),
          defineField({ name: "href", title: "URL", type: "string" }),
        ],
      }],
    }),
  ],
  preview: {
    select: { subtitle: "language" },
    prepare: ({ subtitle }) => ({ title: "Footer", subtitle }),
  },
});
