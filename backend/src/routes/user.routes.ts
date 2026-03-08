import { Router } from "express";
import { toggleSaveArticle, toggleSaveLabel, getSavedItems } from "../controllers/user.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.use(protect);

/**
 * @swagger
 * /users/save-article:
 *   post:
 *     summary: Toggle save status of an article for the current user
 *     tags: [Users]
 *     security: [{bearerAuth: []}]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [articleId]
 *             properties:
 *               articleId: {type: string}
 *     responses:
 *       200: {description: Article saved/unsaved}
 */
router.post("/save-article", toggleSaveArticle);

/**
 * @swagger
 * /users/save-label:
 *   post:
 *     summary: Toggle save status of a label for the current user
 *     tags: [Users]
 *     security: [{bearerAuth: []}]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [labelId]
 *             properties:
 *               labelId: {type: string}
 *     responses:
 *       200: {description: Label saved/unsaved}
 */
router.post("/save-label", toggleSaveLabel);

/**
 * @swagger
 * /users/saved-items:
 *   get:
 *     summary: Get all saved items (articles and labels) for the current user
 *     tags: [Users]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       200: {description: Success}
 */
router.get("/saved-items", getSavedItems);

// Keep old route for compatibility if frontend uses it
router.get("/saved-articles", getSavedItems);

// Admin Routes
import { authorize } from "../middleware/authMiddleware";
import { getUsers, updateUserSubscription } from "../controllers/user.controller";

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all registered users (Admin only)
 *     tags: [Users]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       200:
 *         description: Array of user objects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                         enum: [user, admin]
 *                       isPro:
 *                         type: boolean
 *                       subscriptionPlan:
 *                         type: string
 *                         enum: [free, starter, professional, enterprise]
 *                       subscriptionExpiry:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (admin only)
 */
router.get("/", authorize("admin"), getUsers);

/**
 * @swagger
 * /users/{id}/subscription:
 *   put:
 *     summary: Update a user's subscription plan (Admin only)
 *     tags: [Users]
 *     security: [{bearerAuth: []}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPro:
 *                 type: boolean
 *                 description: PRO status toggle
 *               subscriptionPlan:
 *                 type: string
 *                 enum: [free, starter, professional, enterprise]
 *               subscriptionExpiry:
 *                 type: string
 *                 format: date-time
 *                 description: When the subscription expires
 *     responses:
 *       200:
 *         description: Subscription updated
 *       404:
 *         description: User not found
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (admin only)
 */
router.put("/:id/subscription", authorize("admin"), updateUserSubscription);

export default router;
