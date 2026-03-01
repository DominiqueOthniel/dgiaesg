import type { Request, Response } from "express";
import { Label, Company, News } from "../models";
import asyncHandler from "../middleware/asyncHandler";

// GET /api/search?q=query
export const unifiedSearch = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
        res.json({
            success: true,
            data: {
                labels: [],
                companies: [],
                news: [],
            },
        });
        return;
    }

    // Search across all models using text index
    const [labels, companies, news] = await Promise.all([
        Label.find({ $text: { $search: q }, deletedAt: null }).limit(5),
        Company.find({ $text: { $search: q }, deletedAt: null }).populate("labelId", "name").limit(5),
        News.find({ $text: { $search: q }, deletedAt: null, published: true }).limit(5),
    ]);

    res.json({
        success: true,
        data: {
            labels,
            companies,
            news,
        },
    });
});
