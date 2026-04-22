import { Request, Response } from "express";
import { MonthlyReview } from "../models";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";

// @desc    Get all published monthly reviews
// @route   GET /api/reviews
// @access  Public
export const getMonthlyReviews = asyncHandler(async (_req: Request, res: Response) => {
    const reviews = await MonthlyReview.find({ published: true }).sort({ publishDate: -1 });
    res.json({
        success: true,
        data: reviews,
    });
});

// @desc    Get the latest published monthly review
// @route   GET /api/reviews/latest
// @access  Public
export const getLatestReview = asyncHandler(async (_req: Request, res: Response) => {
    const review = await MonthlyReview.findOne({ published: true }).sort({ publishDate: -1 });
    res.json({
        success: true,
        data: review,
    });
});

// @desc    Create a new monthly review
// @route   POST /api/reviews
// @access  Private/Admin
export const createReview = asyncHandler(async (req: Request, res: Response) => {
    const review = await MonthlyReview.create(req.body);
    res.status(201).json({
        success: true,
        data: review,
    });
});

// @desc    Update a monthly review
// @route   PUT /api/reviews/:id
// @access  Private/Admin
export const updateReview = asyncHandler(async (req: Request, res: Response) => {
    const review = await MonthlyReview.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!review) {
        throw new AppError("Review not found", 404);
    }

    res.json({
        success: true,
        data: review,
    });
});

// @desc    Delete a monthly review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const review = await MonthlyReview.findByIdAndDelete(req.params.id);

    if (!review) {
        throw new AppError("Review not found", 404);
    }

    res.json({
        success: true,
        message: "Review deleted successfully",
    });
});
