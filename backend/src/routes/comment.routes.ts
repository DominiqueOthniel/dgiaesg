import { Router } from "express";
import { getComments, createComment, deleteComment } from "../controllers/comment.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get comments for a target (news, review)
 *     tags: [Comments]
 */
router.get("/", getComments);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a comment
 *     tags: [Comments]
 *     security: [{bearerAuth: []}]
 */
router.post("/", protect, createComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete/hide a comment (Admin or Author)
 *     tags: [Comments]
 *     security: [{bearerAuth: []}]
 */
router.delete("/:id", protect, deleteComment);

export default router;
