import { Router } from "express";
import {
  getCriteria,
  getCriteriaById,
  createCriteria,
  updateCriteria,
  deleteCriteria,
} from "../controllers/criteria.controller";
import validate from "../middleware/validate";
import {
  createCriteriaSchema,
  updateCriteriaSchema,
} from "../validators/criteria.validator";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

/**
 * @swagger
 * /criteria:
 *   get:
 *     summary: List all criteria
 *     tags: [Criteria]
 *     responses:
 *       200: {description: Success}
 *   post:
 *     summary: Create criterion
 *     tags: [Criteria]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       201: {description: Created}
 */
router.get("/", getCriteria);
router.post("/", protect, authorize("admin", "editor"), validate(createCriteriaSchema), createCriteria);

/**
 * @swagger
 * /criteria/{id}:
 *   get:
 *     summary: Get criterion detail
 *     tags: [Criteria]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Success}
 *   put:
 *     summary: Update criterion
 *     tags: [Criteria]
 *     security: [{bearerAuth: []}]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Updated}
 *   delete:
 *     summary: Delete criterion
 *     tags: [Criteria]
 *     security: [{bearerAuth: []}]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Deleted}
 */
router.get("/:id", getCriteriaById);
router.put("/:id", protect, authorize("admin", "editor"), validate(updateCriteriaSchema), updateCriteria);
router.delete("/:id", protect, authorize("admin"), deleteCriteria);

export default router;
