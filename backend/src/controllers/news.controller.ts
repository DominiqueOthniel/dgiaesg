import type { Request, Response } from "express";
import { News } from "../models";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";
import mongoose from "mongoose";
import { localizeFields } from "../utils/localization";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET /api/news — list news articles with filters and pagination
export const getNews = asyncHandler(async (req: Request, res: Response) => {
  const {
    page,
    published,
    search,
    limit = "10",
    includeDeleted,
    sector,
  } = req.query;

  const isAdmin = (req as any).user?.role === 'admin';
  const filter: Record<string, unknown> = {};

  if (!isAdmin || includeDeleted !== 'true') {
    filter.deletedAt = null;
  }

  if (published !== undefined && typeof published === "string") {
    filter.published = published === "true";
  }
  if (search && typeof search === "string") {
    filter.$text = { $search: search };
  }
  if (sector && typeof sector === "string") {
    filter.sector = sector;
  }

  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [articles, total] = await Promise.all([
    News.find(filter)
      .populate("category")
      .populate("subCategory")
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    News.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: articles,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

// GET /api/news/:id — get a single article by ID
export const getNewsById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid news ID", 400);
  }

  const article = await News.findOne({ _id: id, deletedAt: null })
    .populate("category")
    .populate("subCategory");

  if (!article) {
    throw new AppError("Article not found", 404);
  }

  res.json({
    success: true,
    data: article,
  });
});

// GET /api/news/slug/:slug — get an article by slug
export const getNewsBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const article = await News.findOne({ slug, deletedAt: null })
    .populate("category")
    .populate("subCategory");

  if (!article) {
    throw new AppError("Article not found", 404);
  }

  res.json({
    success: true,
    data: article,
  });
});

// POST /api/news — create a new article
export const createNews = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body.slug) {
    req.body.slug = slugify(req.body.title);
  }

  const existingSlug = await News.findOne({ slug: req.body.slug });
  if (existingSlug) {
    req.body.slug = `${req.body.slug}-${Date.now()}`;
  }

  if (req.body.published && !req.body.publishedAt) {
    req.body.publishedAt = new Date();
  }

  const localizedBody = localizeFields(req.body, ['title', 'content', 'excerpt']);
  const article = await News.create(localizedBody);

  res.status(201).json({
    success: true,
    data: article,
  });
});

// PUT /api/news/:id — update an article
export const updateNews = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid news ID", 400);
  }

  if (req.body.slug) {
    const existingSlug = await News.findOne({
      slug: req.body.slug,
      _id: { $ne: id as string },
    });
    if (existingSlug) {
      throw new AppError("An article with this slug already exists", 409);
    }
  }

  const existing = await News.findOne({ _id: id, deletedAt: null });
  if (!existing) {
    throw new AppError("Article not found", 404);
  }

  if (req.body.published === true && !existing.published && !req.body.publishedAt) {
    req.body.publishedAt = new Date();
  }

  const localizedBody = localizeFields(req.body, ['title', 'content', 'excerpt']);
  const article = await News.findByIdAndUpdate(id, localizedBody, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: article,
  });
});

// DELETE /api/news/:id — soft delete an article
export const deleteNews = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid news ID", 400);
  }

  const article = await News.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { deletedAt: new Date() },
    { new: true }
  );

  if (!article) {
    throw new AppError("Article not found", 404);
  }

  res.json({
    success: true,
    message: "Article deleted successfully",
    data: article,
  });
});

// PUT /api/news/:id/restore — restore a soft deleted article
export const restoreNews = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid news ID", 400);
  }

  const article = await News.findOneAndUpdate(
    { _id: id, deletedAt: { $ne: null } },
    { deletedAt: null },
    { new: true }
  );

  if (!article) {
    throw new AppError("Article not found or not deleted", 404);
  }

  res.json({
    success: true,
    message: "Article restored successfully",
    data: article,
  });
});
