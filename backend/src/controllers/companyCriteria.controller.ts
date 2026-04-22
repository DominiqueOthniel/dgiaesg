import type { Request, Response } from "express";
import { CompanyCriteria, Company, Criteria } from "../models";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";
import mongoose from "mongoose";

// GET /api/company-criteria?companyId=X — get all scores for a company
// GET /api/company-criteria?criteriaId=X — get all scores for a criterion
export const getCompanyCriteria = asyncHandler(
  async (req: Request, res: Response) => {
    const { companyId, criteriaId } = req.query;

    const filter: Record<string, unknown> = {};

    if (companyId && typeof companyId === "string") {
      if (!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new AppError("Invalid company ID", 400);
      }
      filter.companyId = companyId;
    }
    if (criteriaId && typeof criteriaId === "string") {
      if (!mongoose.Types.ObjectId.isValid(criteriaId)) {
        throw new AppError("Invalid criteria ID", 400);
      }
      filter.criteriaId = criteriaId;
    }

    if (!companyId && !criteriaId) {
      throw new AppError(
        "At least one filter is required: companyId or criteriaId",
        400
      );
    }

    const scores = await CompanyCriteria.find(filter)
      .populate("companyId", "name sector region status")
      .populate("criteriaId", "title category weight labelId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: scores.length,
      data: scores,
    });
  }
);

// GET /api/company-criteria/:id — get a single score entry
export const getCompanyCriteriaById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid ID", 400);
    }

    const score = await CompanyCriteria.findById(id)
      .populate("companyId", "name sector region status")
      .populate("criteriaId", "title category weight labelId");

    if (!score) {
      throw new AppError("Score entry not found", 404);
    }

    res.json({
      success: true,
      data: score,
    });
  }
);

// POST /api/company-criteria — assign a score
export const createCompanyCriteria = asyncHandler(
  async (req: Request, res: Response) => {
    const { companyId, criteriaId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      throw new AppError("Invalid company ID", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(criteriaId)) {
      throw new AppError("Invalid criteria ID", 400);
    }

    const [companyExists, criteriaExists] = await Promise.all([
      Company.findOne({ _id: companyId, deletedAt: null }),
      Criteria.findById(criteriaId),
    ]);

    if (!companyExists) {
      throw new AppError("Referenced company not found", 404);
    }
    if (!criteriaExists) {
      throw new AppError("Referenced criteria not found", 404);
    }

    const existingScore = await CompanyCriteria.findOne({
      companyId,
      criteriaId,
    });
    if (existingScore) {
      throw new AppError(
        "A score for this company-criteria pair already exists. Use PUT to update.",
        409
      );
    }

    const score = await CompanyCriteria.create(req.body);
    const populated = await score.populate([
      { path: "companyId", select: "name sector region status" },
      { path: "criteriaId", select: "title category weight" },
    ]);

    res.status(201).json({
      success: true,
      data: populated,
    });
  }
);

// PUT /api/company-criteria/:id — update a score
export const updateCompanyCriteria = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid ID", 400);
    }

    const score = await CompanyCriteria.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("companyId", "name sector region status")
      .populate("criteriaId", "title category weight");

    if (!score) {
      throw new AppError("Score entry not found", 404);
    }

    res.json({
      success: true,
      data: score,
    });
  }
);

// DELETE /api/company-criteria/:id — remove a score
export const deleteCompanyCriteria = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid ID", 400);
    }

    const score = await CompanyCriteria.findByIdAndDelete(id);

    if (!score) {
      throw new AppError("Score entry not found", 404);
    }

    res.json({
      success: true,
      message: "Score entry deleted successfully",
    });
  }
);
