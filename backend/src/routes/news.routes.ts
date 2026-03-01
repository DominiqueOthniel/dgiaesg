import { Router } from "express";
import {
  getNews,
  getNewsById,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  restoreNews,
} from "../controllers/news.controller";
import validate from "../middleware/validate";
import {
  createNewsSchema,
  updateNewsSchema,
} from "../validators/news.validator";

import { protect, optionalProtect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

/**
 * @swagger
 * /news:
 *   get:
 *     summary: List all news
 *     tags: [News]
 *     responses:
 *       200: {description: Success}
 *   post:
 *     summary: Create news article
 *     tags: [News]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       201: {description: Created}
 */
router.get("/", optionalProtect, getNews);
router.post("/", protect, authorize("admin", "editor"), validate(createNewsSchema), createNews);

/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: Get news by ID
 *     tags: [News]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Success}
 *   put:
 *     summary: Update news
 *     tags: [News]
 *     security: [{bearerAuth: []}]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Updated}
 *   delete:
 *     summary: Delete news
 *     tags: [News]
 *     security: [{bearerAuth: []}]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Deleted}
 */
router.get("/:id", optionalProtect, getNewsById);
router.put("/:id", protect, authorize("admin", "editor"), validate(updateNewsSchema), updateNews);
router.delete("/:id", protect, authorize("admin"), deleteNews);

router.get("/slug/:slug", getNewsBySlug);

/**
 * @swagger
 * /news/{id}/restore:
 *   put:
 *     summary: Restore deleted news
 *     tags: [News]
 *     security: [{bearerAuth: []}]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Restored}
 */
router.put("/:id/restore", protect, authorize("admin"), restoreNews);

export default router;
