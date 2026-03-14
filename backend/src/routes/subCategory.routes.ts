import { Router } from "express";
import SubCategory from "../models/SubCategory";
import asyncHandler from "../middleware/asyncHandler";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

// @desc    Get all sub-categories (optionally filtered by parent)
// @route   GET /api/subcategories
// @access  Public
router.get("/", asyncHandler(async (req, res) => {
    const { parent } = req.query;
    const filter = parent ? { parentCategory: parent } : {};
    const subCategories = await SubCategory.find(filter).sort({ name: 1 });
    res.json({ success: true, data: subCategories });
}));

// @desc    Create a sub-category
// @route   POST /api/subcategories
// @access  Admin
router.post("/", protect, authorize("admin"), asyncHandler(async (req, res) => {
    const subCategory = await SubCategory.create(req.body);
    res.status(201).json({ success: true, data: subCategory });
}));

export default router;
