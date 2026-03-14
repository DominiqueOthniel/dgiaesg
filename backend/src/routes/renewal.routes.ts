import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";
import {
    checkExpiries,
    initiateRenewal,
} from "../controllers/renewal.controller";

const router = Router();

// Admin only: trigger expiry check (MUST be before /:applicationId to avoid conflict)
router.post("/check-expiries", protect, authorize("admin"), checkExpiries);

// Protected: initiate a renewal for an application
router.post("/:applicationId", protect, initiateRenewal);

export default router;
