import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";
import {
    generateCertificate,
    downloadCertificate,
    getCertificationHistory,
    getDigitalBadge,
} from "../controllers/certificate.controller";

const router = Router();

// Public: get digital badge SVG for a company
router.get("/badge/:companyId", getDigitalBadge);

// Protected: download certificate PDF
router.get("/:applicationId/download", protect, downloadCertificate);

// Protected: get certification history for a company
router.get("/history/:companyId", protect, getCertificationHistory);

// Admin only: generate certificate
router.post("/:applicationId/generate", protect, authorize("admin"), generateCertificate);

export default router;
