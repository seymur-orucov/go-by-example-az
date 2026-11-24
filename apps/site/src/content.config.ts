import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

// Learning content lives outside the Astro root: content/<technology>/...
const goSections = defineCollection({
  loader: file("../../content/go/sections.yaml"),
  schema: z.object({
    title: z.string(),
    order: z.number().int().positive(),
    icon: z.string(),
    color: z.string(),
    description: z.string(),
  }),
});

const goExamples = defineCollection({
  loader: glob({
    base: "../../content/go/examples",
    pattern: "*/meta.yaml",
    // "hello-world/meta.yaml" -> "hello-world"
    generateId: ({ entry }) => entry.split("/")[0]!,
  }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    section: z.string(),
    order: z.number().int().positive(),
    status: z.enum(["ready", "planned"]),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    duration: z.number().int().positive().optional(),
    /** Ready lessons: "original" (written from scratch) or "adapted" (from Go by Example, CC BY 3.0). */
    source: z.enum(["original", "adapted"]).optional(),
  }),
});

export const collections = { goSections, goExamples };
