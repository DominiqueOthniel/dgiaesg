import type { Request, Response } from "express";
import { Label, Company, News, Multimedia } from "../models";
import asyncHandler from "../middleware/asyncHandler";

// GET /api/search?q=query
export const unifiedSearch = asyncHandler(async (req: Request, res: Response) => {
    const { q, sector, dateFrom, dateTo } = req.query;

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

    const query: any = { $text: { $search: q }, deletedAt: null };

    // Sector filter
    if (sector && typeof sector === 'string' && sector !== 'all') {
        query.sector = sector;
    }

    // Date range filter
    if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) query.createdAt.$gte = new Date(dateFrom as string);
        if (dateTo) query.createdAt.$lte = new Date(dateTo as string);
    }

    // Search across all models
    const [labels, companies, news, multimedia] = await Promise.all([
        Label.find(query).limit(10),
        Company.find(query).populate("labelId", "name").limit(10),
        News.find({ ...query, published: true }).limit(10),
        Multimedia.find({ ...query, published: true }).limit(10),
    ]);

    res.json({
        success: true,
        data: {
            labels,
            companies,
            news,
            multimedia,
        },
    });
});
