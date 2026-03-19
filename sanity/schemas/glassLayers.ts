import { defineType, defineField } from "sanity";

export default defineType({
  name: "glassLayers",
  title: "Glass Layers Section",
  type: "document",
  fields: [
    defineField({ name: "language", title: "Language", type: "string", options: { list: ["en", "nl", "fr", "de"] } }),
    defineField({ name: "label", title: "Section Label", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({
      name: "layers",
      title: "Glass Layers",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "id", title: "Layer ID", type: "string" }),
          defineField({ name: "name", title: "Layer Name", type: "string" }),
          defineField({ name: "description", title: "Description", type: "text" }),
          defineField({
            name: "position",
            title: "Tooltip Position",
            type: "object",
            fields: [
              defineField({ name: "top", title: "Top", type: "string" }),
              defineField({ name: "left", title: "Left", type: "string" }),
            ],
          }),
        ],
      }],
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "value", title: "Value", type: "string" }),
          defineField({ name: "unit", title: "Unit", type: "string" }),
          defineField({ name: "label", title: "Label", type: "string" }),
        ],
      }],
    }),
    defineField({ name: "bulletPoints", title: "Bullet Points", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "layersImage", title: "Layers Image", type: "string" }),
  ],
  preview: {
    select: { title: "heading", subtitle: "language" },
  },
});
