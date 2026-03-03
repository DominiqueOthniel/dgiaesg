import { Router } from "express";
import {
    getMultimedia,
    getMultimediaById,
    createMultimedia,
    updateMultimedia,
    deleteMultimedia,
} from "../controllers/multimedia.controller";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

/**
 * @swagger
 * /multimedia:
 *   get:
 *     summary: List multimedia items
 *     tags: [Multimedia]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: {type: string, enum: [video, audio]}
 *       - in: query
 *         name: sector
 *         schema: {type: string}
 *       - in: query
 *         name: featured
 *         schema: {type: boolean}
 *       - in: query
 *         name: published
 *         schema: {type: string, enum: ["true", "false", "all"]}
 *     responses:
 *       200: {description: Success}
 *   post:
 *     summary: Create multimedia item
 *     tags: [Multimedia]
 *     security: [{bearerAuth: []}]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, type, url, sector]
 *             properties:
 *               title: {type: string}
 *               type: {type: string, enum: [video, audio]}
 *               url: {type: string}
 *               sector: {type: string}
 *               coverImageUrl: {type: string}
 *               description: {type: string}
 *               featured: {type: boolean}
 *               published: {type: boolean}
 *     responses:
 *       201: {description: Created}
 */
router
    .route("/")
    .get(getMultimedia)
    .post(protect, authorize("admin"), createMultimedia);

/**
 * @swagger
 * /multimedia/{id}:
 *   get:
 *     summary: Get multimedia item by ID
 *     tags: [Multimedia]
 *     parameters: [{in: path, name: id, required: true}]
 *     responses:
 *       200: {description: Success}
 *   patch:
 *     summary: Update multimedia item
 *     tags: [Multimedia]
 *     security: [{bearerAuth: []}]
 *     parameters: [{in: path, name: id, required: true}]
 *     responses:
 *       200: {description: Updated}
 *   delete:
 *     summary: Delete multimedia item
 *     tags: [Multimedia]
 *     security: [{bearerAuth: []}]
 *     parameters: [{in: path, name: id, required: true}]
 *     responses:
 *       204: {description: Deleted}
 */
router
    .route("/:id")
    .get(getMultimediaById)
    .patch(protect, authorize("admin"), updateMultimedia)
    .delete(protect, authorize("admin"), deleteMultimedia);

export default router;
