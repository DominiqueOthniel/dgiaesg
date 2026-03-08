import { Request, Response } from "express";
import { User } from "../models";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";
import mongoose from "mongoose";

// @desc    Toggle save/unsave article
// @route   POST /api/users/save-article
// @access  Private
export const toggleSaveArticle = asyncHandler(async (req: Request, res: Response) => {
    const { articleId } = req.body;

    if (!articleId || !mongoose.Types.ObjectId.isValid(articleId)) {
        throw new AppError("A valid Article ID is required", 400);
    }

    const user = await User.findById((req as any).user?._id);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Ensure array exists
    if (!user.savedArticles) {
        user.savedArticles = [];
    }

    const articleObjectId = new mongoose.Types.ObjectId(articleId);

    // Defensive findIndex (handle potential nulls/undefined in legacy data)
    const articleIndex = user.savedArticles.findIndex(id => id && id.toString() === articleObjectId.toString());

    if (articleIndex > -1) {
        // Already saved, so remove it
        user.savedArticles.splice(articleIndex, 1);
    } else {
        // Not saved, so add it
        user.savedArticles.push(articleObjectId);
    }

    await user.save();

    res.json({
        success: true,
        data: user.savedArticles,
        message: articleIndex > -1 ? "Article retiré de votre bibliothèque" : "Article sauvegardé",
    });
});

// @desc    Toggle save/unsave label
// @route   POST /api/users/save-label
// @access  Private
export const toggleSaveLabel = asyncHandler(async (req: Request, res: Response) => {
    const { labelId } = req.body;

    if (!labelId || !mongoose.Types.ObjectId.isValid(labelId)) {
        throw new AppError("A valid Label ID is required", 400);
    }

    const user = await User.findById((req as any).user?._id);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Ensure array exists
    if (!user.savedLabels) {
        user.savedLabels = [];
    }

    const labelObjectId = new mongoose.Types.ObjectId(labelId);

    // Defensive findIndex
    const labelIndex = user.savedLabels.findIndex(id => id && id.toString() === labelObjectId.toString());

    if (labelIndex > -1) {
        // Already saved, so remove it
        user.savedLabels.splice(labelIndex, 1);
    } else {
        // Not saved, so add it
        user.savedLabels.push(labelObjectId);
    }

    await user.save();

    res.json({
        success: true,
        data: user.savedLabels,
        message: labelIndex > -1 ? "Label retiré de votre bibliothèque" : "Label sauvegardé",
    });
});

// @desc    Get all saved items for the current user
// @route   GET /api/users/saved-items
// @access  Private
export const getSavedItems = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById((req as any).user?._id)
        .populate({
            path: "savedArticles",
            options: { sort: { createdAt: -1 } }
        })
        .populate({
            path: "savedLabels",
            options: { sort: { createdAt: -1 } }
        });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    res.json({
        success: true,
        data: {
            articles: user.savedArticles,
            labels: user.savedLabels
        }
    });
});

// GET /api/users - Admin: List all users
export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
    const users = await User.find().select("-password").sort("-createdAt");
    res.json({
        success: true,
        data: users
    });
});

// PUT /api/users/:id/subscription - Admin: Update user subscription
export const updateUserSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isPro, proExpiry } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
        throw new AppError("Invalid user ID", 400);
    }

    const user = await User.findByIdAndUpdate(
        id,
        { isPro, proExpiry },
        { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
        throw new AppError("User not found", 404);
    }

    res.json({
        success: true,
        data: user
    });
});
