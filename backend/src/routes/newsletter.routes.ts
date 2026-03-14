import { Router } from "express";
import {
    getNewsletters,
    getLatestNewsletter,
    getAllNewsletters,
    getNewsletterById,
    createNewsletter,
    updateNewsletter,
    deleteNewsletter,
} from "../controllers/newsletter.controller";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

// Public routes
router.get("/", getNewsletters);
router.get("/latest", getLatestNewsletter);

// Admin routes
router.get("/all", protect, authorize("admin"), getAllNewsletters);
router.get("/:id", getNewsletterById);
router.post("/", protect, authorize("admin"), createNewsletter);
router.put("/:id", protect, authorize("admin"), updateNewsletter);
router.delete("/:id", protect, authorize("admin"), deleteNewsletter);

export default router;
