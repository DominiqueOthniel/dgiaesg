import { z } from "zod/v4";

export const createLabelSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name cannot exceed 200 characters")
    .trim(),
  description: z
    .string()
    .min(1, "Description is required")
    .trim(),
  logoUrl: z.string().optional(),
  sector: z
    .string()
    .min(1, "Sector is required")
    .trim(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const updateLabelSchema = createLabelSchema.partial();

export type CreateLabelInput = z.infer<typeof createLabelSchema>;
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>;
