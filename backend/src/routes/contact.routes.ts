import { Router } from "express";
import { submitContact } from "../controllers/contact.controller";

const router = Router();

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Submit a public contact form message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, service, subject, message]
 *             properties:
 *               name:    { type: string, minLength: 2, maxLength: 100 }
 *               email:   { type: string, format: email }
 *               service: { type: string, enum: [general, press, partner, certification] }
 *               subject: { type: string, minLength: 3, maxLength: 200 }
 *               message: { type: string, minLength: 10, maxLength: 2000 }
 *     responses:
 *       201: { description: Message accepted }
 *       400: { description: Validation error }
 *       429: { description: Rate limited }
 */
router.post("/", submitContact);

export default router;
