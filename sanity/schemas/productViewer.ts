import { defineType, defineField } from "sanity";

export default defineType({
  name: "productViewer",
  title: "Product Viewer Section",
  type: "document",
  fields: [
    defineField({ name: "language", title: "Language", type: "string", options: { list: ["en", "nl", "fr", "de"] } }),
    defineField({ name: "label", title: "Section Label", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Title", type: "string" }),
          defineField({ name: "description", title: "Description", type: "text" }),
        ],
      }],
    }),
    defineField({ name: "productImage", title: "Product Image", type: "string" }),
    defineField({ name: "modelSrc", title: "3D Model Source", type: "string" }),
  ],
  preview: {
    select: { title: "heading", subtitle: "language" },
  },
});
