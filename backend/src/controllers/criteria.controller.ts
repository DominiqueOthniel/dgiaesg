import type { Request, Response } from "express";
import { Criteria, Label, CompanyCriteria } from "../models";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";
import mongoose from "mongoose";

// GET /api/criteria — list all criteria (filter by labelId, category)
export const getCriteria = asyncHandler(async (req: Request, res: Response) => {
  const { labelId, category } = req.query;

  const filter: Record<string, unknown> = {};

  if (labelId && typeof labelId === "string") {
    if (!mongoose.Types.ObjectId.isValid(labelId)) {
      throw new AppError("Invalid label ID", 400);
    }
    filter.labelId = labelId;
  }
  if (category && typeof category === "string") {
    filter.category = category;
  }

  const criteria = await Criteria.find(filter)
    .populate("labelId", "name sector")
    .sort({ category: 1, weight: -1 });

  res.json({
    success: true,
    count: criteria.length,
    data: criteria,
  });
});

// GET /api/criteria/:id — get a single criterion
export const getCriteriaById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid criteria ID", 400);
  }

  const criteria = await Criteria.findById(id).populate(
    "labelId",
    "name sector status"
  );

  if (!criteria) {
    throw new AppError("Criteria not found", 404);
  }

  res.json({
    success: true,
    data: criteria,
  });
});

// POST /api/criteria — create a new criterion
export const createCriteria = asyncHandler(async (req: Request, res: Response) => {
  const { labelId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(labelId)) {
    throw new AppError("Invalid label ID", 400);
  }

  const labelExists = await Label.findOne({ _id: labelId, deletedAt: null });
  if (!labelExists) {
    throw new AppError("Referenced label not found", 404);
  }

  const criteria = await Criteria.create(req.body);
  const populated = await criteria.populate("labelId", "name sector");

  res.status(201).json({
    success: true,
    data: populated,
  });
});

// PUT /api/criteria/:id — update a criterion
export const updateCriteria = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid criteria ID", 400);
  }

  if (req.body.labelId) {
    if (!mongoose.Types.ObjectId.isValid(req.body.labelId)) {
      throw new AppError("Invalid label ID", 400);
    }
    const labelExists = await Label.findOne({
      _id: req.body.labelId,
      deletedAt: null,
    });
    if (!labelExists) {
      throw new AppError("Referenced label not found", 404);
    }
  }

  const criteria = await Criteria.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).populate("labelId", "name sector");

  if (!criteria) {
    throw new AppError("Criteria not found", 404);
  }

  res.json({
    success: true,
    data: criteria,
  });
});

// DELETE /api/criteria/:id — delete a criterion (hard delete, cascade remove scores)
export const deleteCriteria = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid criteria ID", 400);
  }

  const criteria = await Criteria.findById(id);

  if (!criteria) {
    throw new AppError("Criteria not found", 404);
  }

  await CompanyCriteria.deleteMany({ criteriaId: id });
  await criteria.deleteOne();

  res.json({
    success: true,
    message: "Criteria and associated scores deleted successfully",
  });
});
