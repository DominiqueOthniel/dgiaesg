import { Router } from "express";
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  restoreCompany,
  exportCompanies,
  getMyOrganization,
} from "../controllers/company.controller";
import validate from "../middleware/validate";
import {
  createCompanySchema,
  updateCompanySchema,
} from "../validators/company.validator";

import { protect, optionalProtect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: List all companies
 *     tags: [Companies]
 *     responses:
 *       200: {description: Success}
 *   post:
 *     summary: Create company
 *     tags: [Companies]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       201: {description: Created}
 */
router.get("/", optionalProtect, getCompanies);
router.post("/", protect, validate(createCompanySchema), createCompany);

/**
 * @swagger
 * /companies/export/csv:
 *   get:
 *     summary: Export companies to CSV
 *     tags: [Companies]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       200: {description: CSV file}
 */
router.get("/export/csv", protect, authorize("admin"), exportCompanies);

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get company detail
 *     tags: [Companies]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Success}
 *   put:
 *     summary: Update company
 *     tags: [Companies]
 *     security: [{bearerAuth: []}]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Updated}
 *   delete:
 *     summary: Delete company
 *     tags: [Companies]
 *     security: [{bearerAuth: []}]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Deleted}
 */
router.get("/my-org", protect, getMyOrganization);
router.get("/:id", optionalProtect, getCompanyById);
router.put("/:id", protect, validate(updateCompanySchema), updateCompany);
router.delete("/:id", protect, authorize("admin"), deleteCompany);

/**
 * @swagger
 * /companies/{id}/restore:
 *   put:
 *     summary: Restore deleted company
 *     tags: [Companies]
 *     security: [{bearerAuth: []}]
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses:
 *       200: {description: Restored}
 */
router.put("/:id/restore", protect, authorize("admin"), restoreCompany);

export default router;
