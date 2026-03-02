import type { Request, Response } from "express";
import BreakingNews from "../models/BreakingNews";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";
import mongoose from "mongoose";

// GET /api/breaking-news — Get active breaking news
export const getActiveBreakingNews = asyncHandler(async (_req: Request, res: Response) => {
    const news = await BreakingNews.find({
        active: true,
        $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } }
        ]
    }).sort({ priority: -1, createdAt: -1 });

    res.json({
        success: true,
        data: news,
    });
});

// GET /api/breaking-news/all — Get all (for admin)
export const getAllBreakingNews = asyncHandler(async (_req: Request, res: Response) => {
    const news = await BreakingNews.find().sort({ createdAt: -1 });
    res.json({
        success: true,
        data: news,
    });
});

// POST /api/breaking-news — Create
export const createBreakingNews = asyncHandler(async (req: Request, res: Response) => {
    const news = await BreakingNews.create(req.body);
    res.status(201).json({
        success: true,
        data: news,
    });
});

// PUT /api/breaking-news/:id — Update
export const updateBreakingNews = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid ID", 400);
    }

    const news = await BreakingNews.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!news) {
        throw new AppError("Not found", 404);
    }

    res.json({
        success: true,
        data: news,
    });
});

// DELETE /api/breaking-news/:id — Delete
export const deleteBreakingNews = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid ID", 400);
    }

    const news = await BreakingNews.findByIdAndDelete(id);

    if (!news) {
        throw new AppError("Not found", 404);
    }

    res.json({
        success: true,
        message: "Breaking news deleted",
    });
});
