import { z } from "zod/v4";

export const createNewsSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(500, "Title cannot exceed 500 characters")
    .trim(),
  slug: z.string().trim().optional(),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  author: z
    .string()
    .min(1, "Author is required")
    .trim(),
  imageUrl: z.string().optional(),
  sector: z.enum(["finance", "governance", "tech", "energy", "leadership"]).optional(),
  readingTime: z.string().optional(),
  published: z.boolean().optional(),
  publishedAt: z.string().nullable().optional(),
});

export const updateNewsSchema = createNewsSchema.partial();

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
