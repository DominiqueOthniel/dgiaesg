import { Router } from "express";
import { unifiedSearch } from "../controllers/search.controller";
import { optionalProtect } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Unified search across labels, companies, news, and multimedia
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: {type: string}
 *         required: true
 *         description: Search query
 *       - in: query
 *         name: sector
 *         schema: {type: string}
 *         description: Filter by sector (e.g., finance, tech)
 *       - in: query
 *         name: dateFrom
 *         schema: {type: string, format: date}
 *         description: Filter results from this date
 *       - in: query
 *         name: dateTo
 *         schema: {type: string, format: date}
 *         description: Filter results to this date
 *     responses:
 *       200: {description: Search results including multimedia}
 */
router.get("/", optionalProtect, unifiedSearch);

export default router;
