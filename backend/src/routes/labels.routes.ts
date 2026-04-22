import { Router } from "express";
import {
  getLabels,
  getLabelById,
  createLabel,
  updateLabel,
  deleteLabel,
  restoreLabel,
} from "../controllers/label.controller";
import validate from "../middleware/validate";
import {
  createLabelSchema,
  updateLabelSchema,
} from "../validators/label.validator";

import { protect, optionalProtect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

/**
 * @swagger
 * /labels:
 *   get:
 *     summary: List all labels
 *     tags: [Labels]
 *     responses:
 *       200: {description: Success}
 *   post:
 *     summary: Create label
 *     tags: [Labels]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       201: {description: Created}
 */
router.get("/", optionalProtect, getLabels);
router.post("/", protect, authorize("admin", "editor"), validate(createLabelSchema), createLabel);

/**
 * @swagger
 * /labels/{id}:
 *   get:
 *     summary: Get label detail
 *     tags: [Labels]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Success}
 *   put:
 *     summary: Update label
 *     tags: [Labels]
 *     security: [{bearerAuth: []}]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Updated}
 *   delete:
 *     summary: Delete label
 *     tags: [Labels]
 *     security: [{bearerAuth: []}]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Deleted}
 */
router.get("/:id", optionalProtect, getLabelById);
router.put("/:id", protect, authorize("admin", "editor"), validate(updateLabelSchema), updateLabel);
router.delete("/:id", protect, authorize("admin"), deleteLabel);

/**
 * @swagger
 * /labels/{id}/restore:
 *   put:
 *     summary: Restore deleted label
 *     tags: [Labels]
 *     security: [{bearerAuth: []}]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Restored}
 */
router.put("/:id/restore", protect, authorize("admin"), restoreLabel);

export default router;
