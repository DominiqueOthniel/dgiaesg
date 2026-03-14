import { z } from "zod/v4";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .trim()
    .toLowerCase(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Must be a valid email")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "editor", "viewer"]).optional(),
});

export const loginUserSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or Username is required")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .trim()
    .optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .trim()
    .toLowerCase()
    .optional(),
  email: z.string().email().trim().toLowerCase().optional(),
  password: z.string().min(6).optional(),
  avatar: z.string().url().or(z.string().length(0)).optional(),
  role: z.enum(["admin", "editor", "viewer"]).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
