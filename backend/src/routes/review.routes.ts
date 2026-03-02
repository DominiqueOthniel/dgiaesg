import { Router } from "express";
import {
    getMonthlyReviews,
    getLatestReview,
    createReview,
    updateReview,
    deleteReview,
} from "../controllers/review.controller";
import { protect, authorize } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getMonthlyReviews);
router.get("/latest", getLatestReview);

// Admin routes
router.post("/", protect, authorize("admin"), createReview);
router.put("/:id", protect, authorize("admin"), updateReview);
router.delete("/:id", protect, authorize("admin"), deleteReview);

export default router;
