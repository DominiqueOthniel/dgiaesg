import { Router } from "express";
import {
    getActiveBreakingNews,
    getAllBreakingNews,
    createBreakingNews,
    updateBreakingNews,
    deleteBreakingNews
} from "../controllers/breakingNews.controller";
import { protect, authorize } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/breaking-news:
 *   get:
 *     summary: Get active breaking news for the ticker
 *     tags: [BreakingNews]
 */
router.get("/", getActiveBreakingNews);

/**
 * @swagger
 * /api/breaking-news/all:
 *   get:
 *     summary: Get all breaking news (Admin only)
 *     tags: [BreakingNews]
 */
router.get("/all", protect, authorize("admin"), getAllBreakingNews);

/**
 * @swagger
 * /api/breaking-news:
 *   post:
 *     summary: Create breaking news item (Admin only)
 *     tags: [BreakingNews]
 */
router.post("/", protect, authorize("admin"), createBreakingNews);

/**
 * @swagger
 * /api/breaking-news/{id}:
 *   put:
 *     summary: Update breaking news item (Admin only)
 *     tags: [BreakingNews]
 */
router.put("/:id", protect, authorize("admin"), updateBreakingNews);

/**
 * @swagger
 * /api/breaking-news/{id}:
 *   delete:
 *     summary: Delete breaking news item (Admin only)
 *     tags: [BreakingNews]
 */
router.delete("/:id", protect, authorize("admin"), deleteBreakingNews);

export default router;
