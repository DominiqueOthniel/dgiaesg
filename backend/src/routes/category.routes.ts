import { Router } from "express";
import Category from "../models/Category";
import asyncHandler from "../middleware/asyncHandler";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get("/", asyncHandler(async (req, res) => {
    const filter: any = {};
    if (req.query.parent) {
        filter.parent = req.query.parent === 'null' ? null : req.query.parent;
    }
    
    const categories = await Category.find(filter)
        .populate('parent', 'name slug')
        .sort({ 'name.fr': 1 });
    res.json({ success: true, data: categories });
}));

// @desc    Create a category
// @route   POST /api/categories
// @access  Admin
router.post("/", protect, authorize("admin"), asyncHandler(async (req, res) => {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
}));

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Admin
router.delete("/:id", protect, authorize("admin"), asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404).json({ success: false, message: "Category not found" });
        return;
    }
    await category.deleteOne();
    res.json({ success: true, data: {} });
}));

export default router;
