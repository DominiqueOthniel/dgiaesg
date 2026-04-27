import type { Request, Response } from "express";
import { z } from "zod";
import asyncHandler from "../middleware/asyncHandler";
import { AppError } from "../middleware/errorHandler";

/**
 * Public contact form submission.
 *
 * Recommended next steps (choose one):
 *   1. Persist to a Mongo collection `ContactMessage` (create the model in
 *      backend/src/models/ContactMessage.ts).
 *   2. Forward via SMTP / SendGrid / Resend to contact@dgiaesg.org.
 *   3. Forward to a Slack / Discord webhook for the partnerships team.
 *
 * The handler below validates input, applies a basic in-memory rate limit
 * (one submission per IP every 30s — replace with Redis in production),
 * and returns a normalised JSON response.
 */

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255).toLowerCase(),
  service: z.enum(["general", "press", "partner", "certification"]),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10).max(2000),
});

const recentSubmissions = new Map<string, number>();
const RATE_LIMIT_MS = 30_000;

export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(
      "Données invalides : " +
        parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", "),
      400
    );
  }

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
  const last = recentSubmissions.get(ip);
  if (last && Date.now() - last < RATE_LIMIT_MS) {
    throw new AppError("Veuillez patienter avant de renvoyer un message.", 429);
  }
  recentSubmissions.set(ip, Date.now());

  const data = parsed.data;

  // TODO: Replace this block with your delivery mechanism
  // Example (Mongo persist):
  //   await ContactMessage.create({ ...data, ip, createdAt: new Date() });
  // Example (SendGrid):
  //   await sgMail.send({ to: 'contact@dgiaesg.org', from: 'no-reply@dgiaesg.org',
  //                       subject: `[${data.service}] ${data.subject}`,
  //                       text: `${data.name} <${data.email}>\n\n${data.message}` });

  // eslint-disable-next-line no-console
  console.log("[contact] new submission", { service: data.service, email: data.email, ip });

  res.status(201).json({
    success: true,
    message: "Votre message a bien été reçu. Notre équipe vous répondra sous 48h ouvrées.",
  });
});
