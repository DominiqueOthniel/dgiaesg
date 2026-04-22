import type { Request, Response } from "express";
import Newsletter from "../models/Newsletter";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";
import mongoose from "mongoose";
import { localizeFields } from "../utils/localization";

// GET /api/newsletters — list published newsletters
export const getNewsletters = asyncHandler(async (req: Request, res: Response) => {
    const { page = "1", limit = "10", category } = req.query;
    const filter: Record<string, unknown> = { status: "published" };

    if (category && typeof category === "string") {
        filter.category = category;
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [newsletters, total] = await Promise.all([
        Newsletter.find(filter)
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate("createdBy", "name"),
        Newsletter.countDocuments(filter),
    ]);

    res.json({
        success: true,
        data: newsletters,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum),
        },
    });
});

// GET /api/newsletters/latest — get the most recent published newsletter
export const getLatestNewsletter = asyncHandler(async (_req: Request, res: Response) => {
    const newsletter = await Newsletter.findOne({ status: "published" })
        .sort({ publishedAt: -1 })
        .populate("createdBy", "name");

    res.json({
        success: true,
        data: newsletter,
    });
});

// GET /api/newsletters/all — admin: get all newsletters
export const getAllNewsletters = asyncHandler(async (_req: Request, res: Response) => {
    const newsletters = await Newsletter.find()
        .sort({ createdAt: -1 })
        .populate("createdBy", "name");

    res.json({
        success: true,
        data: newsletters,
    });
});

// GET /api/newsletters/:id
export const getNewsletterById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as any)) {
        throw new AppError("Invalid newsletter ID", 400);
    }

    const newsletter = await Newsletter.findById(id as any).populate("createdBy", "name");
    if (!newsletter) {
        throw new AppError("Newsletter not found", 404);
    }

    res.json({
        success: true,
        data: newsletter,
    });
});

// POST /api/newsletters — admin create
export const createNewsletter = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const body = { ...req.body, createdBy: userId };

    if (body.status === "published" && !body.publishedAt) {
        body.publishedAt = new Date();
    }

    const localizedBody = localizeFields(body, ['title', 'summary', 'content']);
    const newsletter = await Newsletter.create(localizedBody);

    res.status(201).json({
        success: true,
        data: newsletter,
    });
});

// PUT /api/newsletters/:id — admin update
export const updateNewsletter = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as any)) {
        throw new AppError("Invalid newsletter ID", 400);
    }

    const existing = await Newsletter.findById(id as any);
    if (!existing) {
        throw new AppError("Newsletter not found", 404);
    }

    if (req.body.status === "published" && existing.status !== "published" && !req.body.publishedAt) {
        req.body.publishedAt = new Date();
    }

    const localizedBody = localizeFields(req.body, ['title', 'summary', 'content']);
    const newsletter = await Newsletter.findByIdAndUpdate(id as any, localizedBody, {
        new: true,
        runValidators: true,
    });

    res.json({
        success: true,
        data: newsletter,
    });
});

// DELETE /api/newsletters/:id — admin delete
export const deleteNewsletter = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as any)) {
        throw new AppError("Invalid newsletter ID", 400);
    }

    const newsletter = await Newsletter.findByIdAndDelete(id as any);
    if (!newsletter) {
        throw new AppError("Newsletter not found", 404);
    }

    res.json({
        success: true,
        message: "Newsletter deleted successfully",
    });
});
