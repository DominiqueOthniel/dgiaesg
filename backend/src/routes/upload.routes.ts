import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.middleware';
import { protect } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// POST /api/upload
// Only admins can upload for now (as per naming in Label/Company/News forms)
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload an image
 *     tags: [Upload]
 *     security: [{bearerAuth: []}]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image: {type: string, format: binary}
 *     responses:
 *       200: {description: File uploaded, returns URL}
 */
router.post('/', protect, authorize('admin', 'pro', 'editor', 'viewer'), upload.single('image'), (req: Request, res: Response) => {
    if (!req.file) {
        throw new AppError('Please upload a file', 400);
    }

    // Return the URL for the frontend
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
        success: true,
        data: fileUrl
    });
});

export default router;
