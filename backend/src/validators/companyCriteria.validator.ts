import { z } from "zod/v4";

export const createCompanyCriteriaSchema = z.object({
  companyId: z.string().min(1, "Company reference is required"),
  criteriaId: z.string().min(1, "Criteria reference is required"),
  score: z
    .number()
    .min(0, "Score cannot be negative")
    .max(100, "Score cannot exceed 100"),
  notes: z.string().optional().or(z.literal("")),
});

export const updateCompanyCriteriaSchema = z.object({
  score: z
    .number()
    .min(0, "Score cannot be negative")
    .max(100, "Score cannot exceed 100")
    .optional(),
  notes: z.string().optional(),
});

export type CreateCompanyCriteriaInput = z.infer<typeof createCompanyCriteriaSchema>;
export type UpdateCompanyCriteriaInput = z.infer<typeof updateCompanyCriteriaSchema>;
