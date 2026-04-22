import { z } from "zod/v4";

export const createCriteriaSchema = z.object({
  labelId: z.string().min(1, "Label reference is required"),
  category: z.enum(
    ["governance", "environment", "social", "economic", "quality"],
    { message: "Invalid category" }
  ),
  title: z
    .string()
    .min(1, "Title is required")
    .max(300, "Title cannot exceed 300 characters")
    .trim(),
  description: z
    .string()
    .min(1, "Description is required")
    .trim(),
  weight: z
    .number()
    .min(0, "Weight cannot be negative")
    .max(100, "Weight cannot exceed 100")
    .optional(),
});

export const updateCriteriaSchema = createCriteriaSchema.partial();

export type CreateCriteriaInput = z.infer<typeof createCriteriaSchema>;
export type UpdateCriteriaInput = z.infer<typeof updateCriteriaSchema>;
