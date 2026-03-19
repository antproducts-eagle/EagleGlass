import { defineType, defineField } from "sanity";

export default defineType({
  name: "variations",
  title: "Variations Section",
  type: "document",
  fields: [
    defineField({ name: "language", title: "Language", type: "string", options: { list: ["en", "nl", "fr", "de"] } }),
    defineField({ name: "label", title: "Section Label", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "name", title: "Product Name", type: "string" }),
          defineField({ name: "description", title: "Description", type: "text" }),
          defineField({ name: "image", title: "Image", type: "string" }),
        ],
      }],
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "language" },
  },
});
