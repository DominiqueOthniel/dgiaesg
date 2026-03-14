import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/message.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /messages/{applicationId}:
 *   get:
 *     summary: Get messages for an application thread
 *     tags: [Messages]
 *     security: [{bearerAuth: []}]
 */
router.get("/:applicationId", protect, getMessages);

/**
 * @swagger
 * /messages/{applicationId}:
 *   post:
 *     summary: Send a message in an application thread
 *     tags: [Messages]
 *     security: [{bearerAuth: []}]
 */
router.post("/:applicationId", protect, sendMessage);

export default router;
