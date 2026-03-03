import { Router } from "express";

const router = Router();

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
import NewsletterSubscription from "../models/NewsletterSubscription";
import asyncHandler from "../middleware/asyncHandler";

/**
 * @swagger
 * /newsletter/subscribe:
 *   post:
 *     summary: Subscribe to the newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: {type: string, format: email}
 *               interests: {type: array, items: {type: string}}
 *     responses:
 *       200: {description: Subscribed successfully}
 *       400: {description: Email is required}
 */
router.post("/subscribe", asyncHandler(async (req, res, _next) => {
    const { email, interests } = req.body;

    if (!email) {
        res.status(400).json({
            success: false,
            message: "Email is required",
        });
        return;
    }

    // Upsert the subscription (if already exists, update interests)
    const subscription = await NewsletterSubscription.findOneAndUpdate(
        { email: email.toLowerCase() },
        {
            $set: { status: "active" },
            $addToSet: { interests: { $each: interests || [] } }
        },
        { upsert: true, new: true }
    );

    console.log(`Newsletter subscription updated: ${email} with interests: ${interests}`);

    res.json({
        success: true,
        data: subscription,
        message: "Thank you for subscribing to our newsletter!",
    });
}));

export default router;
