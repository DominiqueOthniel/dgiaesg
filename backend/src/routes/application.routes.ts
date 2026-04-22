import { Router } from "express";
import {
    getApplications,
    getMyApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    assignAuditor,
    reviewApplication,
} from "../controllers/application.controller";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

router.get("/test", (_req, res) => {
    res.json({ success: true, message: "Applications API is reachable" });
});

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: List all applications (Admin/Auditor)
 *     tags: [Applications]
 *     security: [{bearerAuth: []}]
 */
router.get("/", protect, authorize("admin", "auditor"), getApplications);

/**
 * @swagger
 * /applications/my:
 *   get:
 *     summary: Get current user's applications
 *     tags: [Applications]
 *     security: [{bearerAuth: []}]
 */
router.get("/my", protect, getMyApplications);

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Get application detail
 *     tags: [Applications]
 */
router.get("/:id", protect, getApplicationById);

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Create new application (Draft)
 *     tags: [Applications]
 */
router.post("/", protect, createApplication);

/**
 * @swagger
 * /applications/{id}:
 *   put:
 *     summary: Update application (Save/Submit)
 *     tags: [Applications]
 */
router.put("/:id", protect, updateApplication);

/**
 * @swagger
 * /applications/{id}/assign:
 *   put:
 *     summary: Assign an auditor to an application (Admin only)
 *     tags: [Applications]
 *     security: [{bearerAuth: []}]
 */
router.put("/:id/assign", protect, authorize("admin"), assignAuditor);

/**
 * @swagger
 * /applications/{id}/review:
 *   put:
 *     summary: Review/decide on an application (Admin or assigned Auditor)
 *     tags: [Applications]
 *     security: [{bearerAuth: []}]
 */
router.put("/:id/review", protect, authorize("admin", "auditor"), reviewApplication);

export default router;
