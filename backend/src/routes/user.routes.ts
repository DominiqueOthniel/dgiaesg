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

export default router;
