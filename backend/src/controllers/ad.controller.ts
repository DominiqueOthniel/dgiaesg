import type { Request, Response } from "express";
import { Ad } from "../models";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";
import mongoose from "mongoose";

// GET /api/ads/random?position=sidebar
export const getRandomAd = asyncHandler(async (req: Request, res: Response) => {
    const { position } = req.query;

    const query: any = { active: true };
    if (position) query.position = position;

    // Simplified random: get all and pick one (for low volume)
    // Or use $sample for better performance at scale
    const ads = await Ad.aggregate([
        { $match: query },
        { $sample: { size: 1 } }
    ]);

    if (ads.length === 0) {
        res.json({
            success: true,
            data: null
        });
        return;
    }

    // Increment impressions
    await Ad.findByIdAndUpdate(ads[0]._id, { $inc: { impressions: 1 } });

    res.json({
        success: true,
        data: ads[0]
    });
});

// POST /api/ads/:id/click
export const trackAdClick = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
        throw new AppError("Invalid Ad ID", 400);
    }

    const ad = await Ad.findByIdAndUpdate(id, { $inc: { clicks: 1 } });

    if (!ad) {
        throw new AppError("Ad not found", 404);
    }

    res.json({
        success: true,
        message: "Click tracked"
    });
});

// Admin CRUD
export const getAds = asyncHandler(async (_req: Request, res: Response) => {
    const ads = await Ad.find().sort("-createdAt");
    res.json({
        success: true,
        data: ads
    });
});

export const createAd = asyncHandler(async (req: Request, res: Response) => {
    const ad = await Ad.create(req.body);
    res.status(201).json({
        success: true,
        data: ad
    });
});

export const updateAd = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const ad = await Ad.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!ad) throw new AppError("Ad not found", 404);
    res.json({
        success: true,
        data: ad
    });
});

export const deleteAd = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const ad = await Ad.findByIdAndDelete(id);
    if (!ad) throw new AppError("Ad not found", 404);
    res.json({
        success: true,
        message: "Ad deleted"
    });
});
