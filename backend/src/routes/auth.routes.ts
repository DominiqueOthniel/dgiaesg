import { Router } from "express";
import {
    register,
    login,
    getMe,
    updateMe,
} from "../controllers/auth.controller";
import validate from "../middleware/validate";
import {
    createUserSchema,
    loginUserSchema,
    updateUserSchema,
} from "../validators/user.validator";
import { protect } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: {type: string}
 *               email: {type: string}
 *               password: {type: string}
 *     responses:
 *       201: {description: User registered successfully}
 */
router.post("/register", validate(createUserSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to the platform
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: {type: string}
 *               password: {type: string}
 *     responses:
 *       200: {description: Login successful}
 */
router.post("/login", validate(loginUserSchema), login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       200: {description: Profile retrieved}
 *   put:
 *     summary: Update profile
 *     tags: [Auth]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       200: {description: Profile updated}
 */
router.get("/me", protect, getMe);
router.put("/me", protect, validate(updateUserSchema), updateMe);

export default router;
