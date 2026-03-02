import { Router } from "express";

const router = Router();

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
router.post("/subscribe", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required",
        });
    }

    // TODO: Integrate with real newsletter service (Mailchimp, SendGrid, etc.)
    console.log(`Newsletter subscription received: ${email}`);

    res.json({
        success: true,
        message: "Thank you for subscribing to our newsletter!",
    });
});

export default router;
