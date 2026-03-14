import type { Request, Response } from "express";
import { Application, Company, Notification, User } from "../models";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";
import mongoose from "mongoose";

// POST /api/renewals/check-expiries — check and handle expiring certifications
export const checkExpiries = asyncHandler(async (_req: Request, res: Response) => {
    const now = new Date();
    const results = { expired: 0, reminded60: 0, reminded30: 0, reminded7: 0 };

    // 1. Mark expired applications
    const expiredApps = await Application.find({
        status: "approved",
        expiresAt: { $lte: now },
    }).populate("companyId", "name ownerId");

    for (const app of expiredApps) {
        app.status = "rejected"; // Using rejected as a terminal state
        await app.save();

        // Update company status
        await Company.findByIdAndUpdate(app.companyId, { status: "expired" });

        // Notify company owner
        const company = app.companyId as any;
        if (company?.ownerId) {
            await Notification.create({
                userId: company.ownerId,
                type: "certification_expired",
                title: "Certification expirée",
                message: `La certification de ${company.name} a expiré. Veuillez initier un renouvellement.`,
                link: `/org-hub/history`,
            });
        }
        results.expired++;
    }

    // 2. Remind for upcoming expiries (60, 30, 7 days)
    const reminderWindows = [
        { days: 60, key: "reminded60" as const },
        { days: 30, key: "reminded30" as const },
        { days: 7, key: "reminded7" as const },
    ];

    for (const { days, key } of reminderWindows) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);

        // Find apps expiring within this window (±1 day tolerance)
        const dayBefore = new Date(targetDate);
        dayBefore.setDate(dayBefore.getDate() - 1);
        const dayAfter = new Date(targetDate);
        dayAfter.setDate(dayAfter.getDate() + 1);

        const expiringApps = await Application.find({
            status: "approved",
            expiresAt: { $gte: dayBefore, $lte: dayAfter },
        }).populate("companyId", "name ownerId");

        for (const app of expiringApps) {
            const company = app.companyId as any;
            if (company?.ownerId) {
                await Notification.create({
                    userId: company.ownerId,
                    type: "certification_expiring",
                    title: `Certification expire dans ${days} jours`,
                    message: `La certification de ${company.name} expire dans ${days} jours. Pensez au renouvellement.`,
                    link: `/org-hub/history`,
                });
            }
            results[key]++;
        }
    }

    // Notify all admins about expiry check results
    const admins = await User.find({ role: "admin" }).select("_id");
    for (const admin of admins) {
        if (results.expired > 0) {
            await Notification.create({
                userId: admin._id,
                type: "system",
                title: "Certifications expirées détectées",
                message: `${results.expired} certification(s) viennent d'expirer. ${results.reminded60 + results.reminded30 + results.reminded7} rappels envoyés.`,
                link: "/admin/applications",
            });
        }
    }

    res.json({
        success: true,
        message: "Expiry check completed",
        data: results,
    });
});

// POST /api/renewals/:applicationId — initiate a renewal for an existing certification
export const initiateRenewal = asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;
    const user = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(applicationId as string)) {
        throw new AppError("Invalid application ID", 400);
    }

    const oldApp = await Application.findById(applicationId)
        .populate("companyId", "name ownerId")
        .populate("labelId", "name");

    if (!oldApp) {
        throw new AppError("Application not found", 404);
    }

    // Only approved or expired applications can be renewed
    if (!["approved"].includes(oldApp.status)) {
        throw new AppError("Only approved certifications can be renewed", 400);
    }

    const company = oldApp.companyId as any;
    const isAdmin = user.role === "admin";
    const isOwner = company?.ownerId?.toString() === user._id.toString();

    if (!isAdmin && !isOwner) {
        throw new AppError("Not authorized to initiate renewal", 403);
    }

    // Check if a renewal already exists
    const existingRenewal = await Application.findOne({
        renewedFrom: oldApp._id,
        status: { $in: ["draft", "submitted", "under_review"] },
    });

    if (existingRenewal) {
        res.json({
            success: true,
            message: "Renewal already in progress",
            data: existingRenewal,
        });
        return;
    }

    // Create new draft application linked to old one
    const newApp = await Application.create({
        companyId: company._id,
        labelId: oldApp.labelId,
        status: "draft",
        answers: [],
        documents: [],
        renewedFrom: oldApp._id,
    });

    // Update company status
    await Company.findByIdAndUpdate(company._id, { status: "pending_renewal" });

    // Notify admins
    const admins = await User.find({ role: "admin" }).select("_id");
    const label = oldApp.labelId as any;
    for (const admin of admins) {
        await Notification.create({
            userId: admin._id,
            type: "renewal_initiated",
            title: "Renouvellement initié",
            message: `${company.name} a initié le renouvellement de la certification "${label?.name}".`,
            link: `/admin/applications`,
        });
    }

    res.status(201).json({
        success: true,
        message: "Renewal application created",
        data: newApp,
    });
});
