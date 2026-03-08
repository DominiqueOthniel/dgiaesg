import { Router } from "express";
import { getRandomAd, trackAdClick, getAds, createAd, updateAd, deleteAd } from "../controllers/ad.controller";
import { protect, authorize } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Ads
 *   description: Advertising management (Régie Publicitaire)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Ad:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *           example: "Campagne RSE Afrique 2026"
 *         imageUrl:
 *           type: string
 *           example: "/uploads/ads/banner.jpg"
 *         targetUrl:
 *           type: string
 *           example: "https://partenaire.com/offre"
 *         position:
 *           type: string
 *           enum: [sidebar, top, inline]
 *           example: "sidebar"
 *         active:
 *           type: boolean
 *           example: true
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         impressions:
 *           type: number
 *           example: 1520
 *         clicks:
 *           type: number
 *           example: 87
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// ── Public ──────────────────────────────────────────────────

/**
 * @swagger
 * /ads/random:
 *   get:
 *     summary: Get a random active ad for a given position
 *     tags: [Ads]
 *     parameters:
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *           enum: [sidebar, top, inline]
 *         description: Filter by ad placement slot
 *     responses:
 *       200:
 *         description: A single random ad or null
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Ad'
 */
router.get("/random", getRandomAd);

/**
 * @swagger
 * /ads/{id}/click:
 *   post:
 *     summary: Track a click on an ad
 *     tags: [Ads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ad ID
 *     responses:
 *       200:
 *         description: Click tracked
 *       400:
 *         description: Invalid Ad ID
 *       404:
 *         description: Ad not found
 */
router.post("/:id/click", trackAdClick);

// ── Admin ───────────────────────────────────────────────────

router.use(protect);
router.use(authorize("admin"));

/**
 * @swagger
 * /ads:
 *   get:
 *     summary: List all ad campaigns (Admin)
 *     tags: [Ads]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       200:
 *         description: Array of all ads
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ad'
 */
router.get("/", getAds);

/**
 * @swagger
 * /ads:
 *   post:
 *     summary: Create a new ad campaign (Admin)
 *     tags: [Ads]
 *     security: [{bearerAuth: []}]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, imageUrl, targetUrl]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Campagne RSE Afrique 2026"
 *               imageUrl:
 *                 type: string
 *                 example: "/uploads/ads/banner.jpg"
 *               targetUrl:
 *                 type: string
 *                 example: "https://partenaire.com/offre"
 *               position:
 *                 type: string
 *                 enum: [sidebar, top, inline]
 *               active:
 *                 type: boolean
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Ad created
 *       400:
 *         description: Validation error
 */
router.post("/", createAd);

/**
 * @swagger
 * /ads/{id}:
 *   put:
 *     summary: Update an ad campaign (Admin)
 *     tags: [Ads]
 *     security: [{bearerAuth: []}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               targetUrl:
 *                 type: string
 *               position:
 *                 type: string
 *                 enum: [sidebar, top, inline]
 *               active:
 *                 type: boolean
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Ad updated
 *       404:
 *         description: Ad not found
 */
router.put("/:id", updateAd);

/**
 * @swagger
 * /ads/{id}:
 *   delete:
 *     summary: Delete an ad campaign (Admin)
 *     tags: [Ads]
 *     security: [{bearerAuth: []}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ad deleted
 *       404:
 *         description: Ad not found
 */
router.delete("/:id", deleteAd);

export default router;
