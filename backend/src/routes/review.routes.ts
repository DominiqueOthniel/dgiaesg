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

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: List all monthly reviews
 *     tags: [Reviews]
 *     responses:
 *       200: {description: Success}
 */
router.get("/", getMonthlyReviews);

/**
 * @swagger
 * /reviews/latest:
 *   get:
 *     summary: Get the latest monthly review
 *     tags: [Reviews]
 *     responses:
 *       200: {description: Success}
 */
router.get("/latest", getLatestReview);

// Admin routes
/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new monthly review
 *     tags: [Reviews]
 *     security: [{bearerAuth: []}]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, coverImageUrl, pdfUrl, publishDate]
 *             properties:
 *               title: {type: string}
 *               coverImageUrl: {type: string}
 *               pdfUrl: {type: string}
 *               publishDate: {type: string, format: date-time}
 *               featured: {type: boolean}
 *     responses:
 *       201: {description: Created}
 */
router.post("/", protect, authorize("admin"), createReview);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a monthly review
 *     tags: [Reviews]
 *     security: [{bearerAuth: []}]
 *     parameters: [{in: path, name: id, required: true}]
 *     responses:
 *       200: {description: Updated}
 *   delete:
 *     summary: Delete a monthly review
 *     tags: [Reviews]
 *     security: [{bearerAuth: []}]
 *     parameters: [{in: path, name: id, required: true}]
 *     responses:
 *       200: {description: Deleted}
 */
router.put("/:id", protect, authorize("admin"), updateReview);
router.delete("/:id", protect, authorize("admin"), deleteReview);

export default router;
