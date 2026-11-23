import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Learning content lives outside the Astro root: content/<technology>/...
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
  }),
});

export const collections = { goExamples };
