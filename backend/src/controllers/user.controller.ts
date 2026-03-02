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

    if (!articleId) {
        throw new AppError("Article ID is required", 400);
    }

    const user = await User.findById((req as any).user?._id);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const articleObjectId = new mongoose.Types.ObjectId(articleId);
    const articleIndex = user.savedArticles.findIndex(id => id.equals(articleObjectId));

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
        message: articleIndex > -1 ? "Article removed from library" : "Article saved to library",
    });
});

// @desc    Get all saved articles for the current user
// @route   GET /api/users/saved-articles
// @access  Private
export const getSavedArticles = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById((req as any).user?._id).populate({
        path: "savedArticles",
        options: { sort: { createdAt: -1 } }
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    res.json({
        success: true,
        data: user.savedArticles,
    });
});
