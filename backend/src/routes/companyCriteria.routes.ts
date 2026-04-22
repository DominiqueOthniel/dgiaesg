import { Router } from "express";
import {
  getCompanyCriteria,
  getCompanyCriteriaById,
  createCompanyCriteria,
  updateCompanyCriteria,
  deleteCompanyCriteria,
} from "../controllers/companyCriteria.controller";
import validate from "../middleware/validate";
import {
  createCompanyCriteriaSchema,
  updateCompanyCriteriaSchema,
} from "../validators/companyCriteria.validator";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

/**
 * @swagger
 * /company-criteria:
 *   get:
 *     summary: List all company-criteria mappings
 *     tags: [CompanyCriteria]
 *     responses:
 *       200: {description: Success}
 *   post:
 *     summary: Create company-criterion mapping
 *     tags: [CompanyCriteria]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       210: {description: Created}
 */
router.get("/", getCompanyCriteria);
router.post("/", protect, authorize("admin", "editor"), validate(createCompanyCriteriaSchema), createCompanyCriteria);

/**
 * @swagger
 * /company-criteria/{id}:
 *   get:
 *     summary: Get company-criterion mapping detail
 *     tags: [CompanyCriteria]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Success}
 *   put:
 *     summary: Update company-criterion mapping
 *     tags: [CompanyCriteria]
 *     security: [{bearerAuth: []}]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Updated}
 *   delete:
 *     summary: Delete company-criterion mapping
 *     tags: [CompanyCriteria]
 *     security: [{bearerAuth: []}]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Deleted}
 */
router.get("/:id", getCompanyCriteriaById);
router.put("/:id", protect, authorize("admin", "editor"), validate(updateCompanyCriteriaSchema), updateCompanyCriteria);
router.delete("/:id", protect, authorize("admin"), deleteCompanyCriteria);

export default router;
