import type { Request, Response } from "express";
import Multimedia from "../models/Multimedia";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";

// GET /api/multimedia — list multimedia items with filters and pagination
export const getMultimedia = asyncHandler(async (req: Request, res: Response) => {
    const {
        page = "1",
        limit = "10",
        type,
        sector,
        featured,
        published = "true",
    } = req.query;

    const filter: Record<string, unknown> = {};

    if (published !== undefined && published !== "all") {
        filter.published = published === "true";
    }
    if (type && typeof type === "string") {
        filter.type = type;
    }
    if (sector && typeof sector === "string") {
        filter.sector = sector;
    }
    if (featured !== undefined) {
        filter.featured = featured === "true";
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
        Multimedia.find(filter)
            .sort({ featured: -1, createdAt: -1 })
            .skip(skip)
            .limit(limitNum),
        Multimedia.countDocuments(filter),
    ]);

    res.status(200).json({
        status: "success",
        results: items.length,
        pagination: {
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
        },
        data: items,
    });
});

// GET /api/multimedia/:id — get a single multimedia item
export const getMultimediaById = asyncHandler(async (req: Request, res: Response) => {
    const item = await Multimedia.findById(req.params.id);

    if (!item) {
        throw new AppError("No multimedia item found with that ID", 404);
    }

    res.status(200).json({
        status: "success",
        data: item,
    });
});

// POST /api/multimedia — create a new multimedia item (Admin only)
export const createMultimedia = asyncHandler(async (req: Request, res: Response) => {
    const newItem = await Multimedia.create(req.body);

    res.status(201).json({
        status: "success",
        data: newItem,
    });
});

// PATCH /api/multimedia/:id — update a multimedia item (Admin only)
export const updateMultimedia = asyncHandler(async (req: Request, res: Response) => {
    const updatedItem = await Multimedia.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!updatedItem) {
        throw new AppError("No multimedia item found with that ID", 404);
    }

    res.status(200).json({
        status: "success",
        data: updatedItem,
    });
});

// DELETE /api/multimedia/:id — delete a multimedia item (Admin only)
export const deleteMultimedia = asyncHandler(async (req: Request, res: Response) => {
    const item = await Multimedia.findByIdAndDelete(req.params.id);

    if (!item) {
        throw new AppError("No multimedia item found with that ID", 404);
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
});
