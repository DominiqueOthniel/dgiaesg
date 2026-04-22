import type { Request, Response } from "express";
import { Label, Criteria, Company } from "../models";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";
import mongoose from "mongoose";
import { localizeFields } from "../utils/localization";

// GET /api/labels — list all labels (with optional filters)
export const getLabels = asyncHandler(async (req: Request, res: Response) => {
  const { status, sector, search, includeDeleted } = req.query;
  const isAdmin = (req as any).user?.role === 'admin';

  const filter: Record<string, unknown> = {};

  if (!isAdmin || includeDeleted !== 'true') {
    filter.deletedAt = null;
  }

  if (status && typeof status === "string") {
    filter.status = status;
  }
  if (sector && typeof sector === "string") {
    filter.sector = sector;
  }
  if (search && typeof search === "string") {
    filter.$text = { $search: search };
  }

  const labels = await Label.find(filter).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: labels.length,
    data: labels,
  });
});

// GET /api/labels/:id — get a single label with criteria count and company count
export const getLabelById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid label ID", 400);
  }

  const label = await Label.findOne({ _id: id, deletedAt: null });

  if (!label) {
    throw new AppError("Label not found", 404);
  }

  const [criteriaCount, companyCount] = await Promise.all([
    Criteria.countDocuments({ labelId: id }),
    Company.countDocuments({ labelId: id, deletedAt: null }),
  ]);

  res.json({
    success: true,
    data: {
      ...label.toObject(),
      criteriaCount,
      companyCount,
    },
  });
});

// POST /api/labels — create a new label
export const createLabel = asyncHandler(async (req: Request, res: Response) => {
  const existing = await Label.findOne({ name: req.body.name });
  if (existing) {
    throw new AppError("A label with this name already exists", 409);
  }

  const localizedBody = localizeFields(req.body, ['name', 'description']);
  const label = await Label.create(localizedBody);

  res.status(201).json({
    success: true,
    data: label,
  });
});

// PUT /api/labels/:id — update a label
export const updateLabel = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid label ID", 400);
  }

  const localizedBody = localizeFields(req.body, ['name', 'description']);
  
  if (localizedBody.name) {
    const existing = await Label.findOne({
      name: localizedBody.name,
      _id: { $ne: id as string },
    });
    if (existing) {
      throw new AppError("A label with this name already exists", 409);
    }
  }

  const label = await Label.findOneAndUpdate(
    { _id: id, deletedAt: null },
    localizedBody,
    { new: true, runValidators: true }
  );

  if (!label) {
    throw new AppError("Label not found", 404);
  }

  res.json({
    success: true,
    data: label,
  });
});

// DELETE /api/labels/:id — soft delete a label
export const deleteLabel = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid label ID", 400);
  }

  const label = await Label.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { deletedAt: new Date() },
    { new: true }
  );

  if (!label) {
    throw new AppError("Label not found", 404);
  }

  res.json({
    success: true,
    message: "Label deleted successfully",
    data: label,
  });
});

// PUT /api/labels/:id/restore — restore a soft deleted label
export const restoreLabel = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid label ID", 400);
  }

  const label = await Label.findOneAndUpdate(
    { _id: id, deletedAt: { $ne: null } },
    { deletedAt: null },
    { new: true }
  );

  if (!label) {
    throw new AppError("Label not found or not deleted", 404);
  }

  res.json({
    success: true,
    message: "Label restored successfully",
    data: label,
  });
});
