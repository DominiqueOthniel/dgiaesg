import { Router } from "express";
import { unifiedSearch } from "../controllers/search.controller";
import { optionalProtect } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Unified search across labels, companies, and news
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: {type: string}
 *         description: Search query
 *     responses:
 *       200: {description: Search results}
 */
router.get("/", optionalProtect, unifiedSearch);

export default router;
