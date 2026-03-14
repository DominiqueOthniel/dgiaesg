import { Router } from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notification.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get current user's notifications
 *     tags: [Notifications]
 *     security: [{bearerAuth: []}]
 */
router.get("/", protect, getNotifications);

/**
 * @swagger
 * /notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security: [{bearerAuth: []}]
 */
router.put("/read-all", protect, markAllAsRead);

/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security: [{bearerAuth: []}]
 */
router.put("/:id/read", protect, markAsRead);

export default router;
