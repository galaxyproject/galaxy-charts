import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const docs = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.coerce.date().optional(),
        authors: z.array(z.union([z.string(), z.object({ name: z.string(), href: z.string().optional() })])).optional(),
        tags: z.array(z.string()).optional(),
        autotoc: z.boolean().optional(),
    }),
});

export const collections = { docs };
