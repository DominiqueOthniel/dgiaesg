import { Router } from "express";
import { toggleSaveArticle, getSavedArticles } from "../controllers/user.controller";
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
 * /users/saved-articles:
 *   get:
 *     summary: Get all saved articles for the current user
 *     tags: [Users]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       200: {description: Success}
 */
router.get("/saved-articles", getSavedArticles);

export default router;
