import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Colección de posts del blog. Validación en build: si un markdown falta un
// campo obligatorio o tiene un tipo incorrecto, `astro build` falla.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
