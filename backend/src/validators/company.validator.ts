import { z } from "zod/v4";

export const createCompanySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(300, "Name cannot exceed 300 characters")
    .trim(),
  description: z
    .string()
    .min(1, "Description is required")
    .trim(),
  sector: z
    .string()
    .min(1, "Sector is required")
    .trim(),
  region: z
    .string()
    .min(1, "Region is required")
    .trim(),
  logoUrl: z.string().optional(),
  website: z.string().optional(),
  labelId: z.string().min(1, "Label reference is required"),
  certificationDate: z.string().min(1, "Certification date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  score: z.number().min(0).max(200).nullable().optional(),
  socialScore: z.number().min(0).max(100).optional(),
  governanceScore: z.number().min(0).max(100).optional(),
  status: z.enum(["certified", "pending", "expired"]).optional(),
  ownerId: z.string().nullable().optional(),
});

export const updateCompanySchema = createCompanySchema.partial();

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
