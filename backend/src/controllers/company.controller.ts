import type { Request, Response } from "express";
import { Company, Label } from "../models";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";
import mongoose from "mongoose";
import { Parser } from "json2csv";

// GET /api/companies — list companies with filters and pagination
export const getCompanies = asyncHandler(async (req: Request, res: Response) => {
  const {
    label,
    sector,
    region,
    status,
    search,
    page = "1",
    limit = "10",
    sort = "-createdAt",
    includeDeleted,
    labelId,
  } = req.query;

  const isAdmin = (req as any).user?.role === 'admin';
  const filter: Record<string, unknown> = {};

  if (!isAdmin || includeDeleted !== 'true') {
    filter.deletedAt = null;
  }
  const labelFilter = (label || labelId) as string | undefined;

  if (labelFilter) {
    if (mongoose.Types.ObjectId.isValid(labelFilter)) {
      filter.labelId = labelFilter;
    }
  }
  if (sector && typeof sector === "string") {
    filter.sector = sector;
  }
  if (region && typeof region === "string") {
    filter.region = region;
  }
  if (status && typeof status === "string") {
    filter.status = status;
  }
  if (search && typeof search === "string") {
    filter.$text = { $search: search };
  }

  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const sortStr = typeof sort === "string" ? sort : "-createdAt";

  const [companies, total] = await Promise.all([
    Company.find(filter)
      .populate("labelId", "name sector status logoUrl")
      .sort(sortStr)
      .skip(skip)
      .limit(limitNum),
    Company.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: companies,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

// GET /api/companies/:id — get a single company with label info
export const getCompanyById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid company ID", 400);
  }

  const company = await Company.findOne({ _id: id, deletedAt: null }).populate(
    "labelId",
    "name sector status logoUrl description"
  );

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  res.json({
    success: true,
    data: company,
  });
});

// POST /api/companies — create a new company
export const createCompany = asyncHandler(async (req: Request, res: Response) => {
  const { labelId } = req.body;
  const user = (req as any).user;

  if (!mongoose.Types.ObjectId.isValid(labelId)) {
    throw new AppError("Invalid label ID", 400);
  }

  const labelExists = await Label.findOne({ _id: labelId, deletedAt: null });
  if (!labelExists) {
    throw new AppError("Referenced label not found", 404);
  }

  // Ownership Guard: One organization per user (unless Admin)
  const isAdmin = user.role === 'admin';
  if (!isAdmin) {
    const existing = await Company.findOne({ ownerId: user._id, deletedAt: null });
    if (existing) {
      throw new AppError("You already have an organization registered", 400);
    }
  }

  const companyData = { ...req.body };

  // Security: Non-admins cannot set their own status or ID
  if (!isAdmin) {
    companyData.ownerId = user._id;
    companyData.status = "pending";
    // Force default dates if not admin
    companyData.certificationDate = new Date();
    companyData.expiryDate = new Date();
    companyData.score = 0;
    companyData.socialScore = 0;
    companyData.governanceScore = 0;
  }

  const company = await Company.create(companyData);
  const populated = await company.populate("labelId", "name sector status logoUrl");

  res.status(201).json({
    success: true,
    data: populated,
  });
});

// GET /api/companies/my-org — get current user's organization
export const getMyOrganization = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?._id;

  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const company = await Company.findOne({ ownerId: userId, deletedAt: null }).populate(
    "labelId",
    "name sector status logoUrl description"
  );

  if (!company) {
    throw new AppError("Organization profile not found for this user", 404);
  }

  res.json({
    success: true,
    data: company,
  });
});

// PUT /api/companies/:id — update a company
export const updateCompany = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const user = (req as any).user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid company ID", 400);
  }

  const existingCompany = await Company.findOne({ _id: id, deletedAt: null });
  if (!existingCompany) {
    throw new AppError("Company not found", 404);
  }

  // Check authorization: Admin OR Owner
  const isAdmin = user.role === 'admin';
  const isOwner = existingCompany.ownerId?.toString() === user._id.toString();

  if (!isAdmin && !isOwner) {
    throw new AppError("You are not authorized to update this organization", 403);
  }

  // Security: Owners cannot change their own status, scores, or ownerId
  const updateData = { ...req.body };
  if (!isAdmin) {
    delete updateData.status;
    delete updateData.score;
    delete updateData.socialScore;
    delete updateData.governanceScore;
    delete updateData.ownerId;
    delete updateData.certificationDate;
    delete updateData.expiryDate;
  }

  const updatedCompany = await Company.findOneAndUpdate(
    { _id: id, deletedAt: null },
    updateData,
    { new: true, runValidators: true }
  ).populate("labelId", "name sector status logoUrl");

  res.json({
    success: true,
    data: updatedCompany,
  });
});

// DELETE /api/companies/:id — soft delete a company
export const deleteCompany = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid company ID", 400);
  }

  const company = await Company.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { deletedAt: new Date() },
    { new: true }
  );

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  res.json({
    success: true,
    message: "Company deleted successfully",
    data: company,
  });
});

// GET /api/companies/export/csv — export directory to CSV
export const exportCompanies = asyncHandler(async (_req: Request, res: Response) => {
  const companies = await Company.find({ deletedAt: null }).populate("labelId", "name");

  const fields = [
    { label: "Nom", value: "name" },
    { label: "Secteur", value: "sector" },
    { label: "Région", value: "region" },
    { label: "Statut", value: "status" },
    { label: "Label", value: "labelId.name" },
    { label: "Site Web", value: "website" },
    { label: "Date Certification", value: "certificationDate" },
    { label: "Date Expiration", value: "expiryDate" },
  ];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(companies);

  res.header("Content-Type", "text/csv");
  res.attachment("directory-export.csv");
  res.send(csv);
});

// PUT /api/companies/:id/restore — restore a soft deleted company
export const restoreCompany = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid company ID", 400);
  }

  const company = await Company.findOneAndUpdate(
    { _id: id, deletedAt: { $ne: null } },
    { deletedAt: null },
    { new: true }
  ).populate("labelId", "name sector status logoUrl");

  if (!company) {
    throw new AppError("Company not found or not deleted", 404);
  }

  res.json({
    success: true,
    message: "Company restored successfully",
    data: company,
  });
});
