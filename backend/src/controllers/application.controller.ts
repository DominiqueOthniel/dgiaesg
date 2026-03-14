import type { Request, Response } from "express";
import { Application, Company, Criteria, Notification, User } from "../models";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";
import mongoose from "mongoose";

// GET /api/applications — list all applications (Admin/Auditor)
export const getApplications = asyncHandler(async (req: Request, res: Response) => {
    const { status, companyId, labelId, auditorId } = req.query;
    const filter: Record<string, any> = {};
    const user = (req as any).user;

    if (status) filter.status = status;
    if (companyId) filter.companyId = companyId;
    if (labelId) filter.labelId = labelId;
    if (auditorId) filter.auditorId = auditorId;

    // Auditors can only see their assigned applications
    if (user.role === 'auditor') {
        filter.auditorId = user._id;
    }

    const applications = await Application.find(filter)
        .populate("companyId", "name sector region logoUrl")
        .populate("labelId", "name sector logoUrl")
        .populate("auditorId", "name email")
        .sort("-createdAt");

    res.json({
        success: true,
        data: applications
    });
    return;
});

// GET /api/applications/my — get current PRO user's applications
export const getMyApplications = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;

    const company = await Company.findOne({ ownerId: userId, deletedAt: null });
    if (!company) {
        throw new AppError("No organization found associated with your account", 404);
    }

    const applications = await Application.find({ companyId: company._id })
        .populate("labelId", "name sector logoUrl")
        .sort("-createdAt");

    res.json({
        success: true,
        data: applications
    });
    return;
});

// GET /api/applications/:id — get single application
export const getApplicationById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
        throw new AppError("Invalid application ID", 400);
    }

    const application = await Application.findById(id)
        .populate("companyId")
        .populate("labelId")
        .populate("answers.criteriaId");

    if (!application) {
        throw new AppError("Application not found", 404);
    }

    // Auth check: Admin, assigned Auditor, or Company Owner
    const user = (req as any).user;
    const isAdmin = user.role === 'admin';
    const isAssignedAuditor = user.role === 'auditor' && application.auditorId?.toString() === user._id.toString();
    if (!isAdmin && !isAssignedAuditor) {
        const company = await Company.findById(application.companyId);
        if (!company || company.ownerId?.toString() !== user._id.toString()) {
            throw new AppError("Unauthorized access to this application", 403);
        }
    }

    // FIX: Fetch criteria for this label and attach it to the response
    const labelId = (application.labelId as any)?._id;
    const criteria = labelId ? await Criteria.find({ labelId }) : [];

    const appObj = application.toObject();
    if (appObj.labelId) {
        (appObj.labelId as any).criteria = criteria;
    }

    res.json({
        success: true,
        data: appObj
    });
    return;
});

// POST /api/applications — create new application (PRO User)
export const createApplication = asyncHandler(async (req: Request, res: Response) => {
    const { labelId } = req.body;
    const userId = (req as any).user?._id;

    if (!mongoose.Types.ObjectId.isValid(labelId as string)) {
        throw new AppError("Invalid label ID", 400);
    }

    const company = await Company.findOne({ ownerId: userId, deletedAt: null });
    if (!company) {
        throw new AppError("You must have a registered organization to apply for a label", 403);
    }

    // Check if a pending or draft application already exists for this label
    const existing = await Application.findOne({
        companyId: company._id,
        labelId,
        status: { $in: ['draft', 'submitted', 'under_review', 'more_info'] }
    });

    if (existing) {
        res.json({
            success: true,
            message: "Application already exists",
            data: existing
        });
        return;
    }

    const application = await Application.create({
        companyId: company._id,
        labelId,
        status: 'draft',
        answers: [],
        documents: []
    });

    res.status(201).json({
        success: true,
        data: application
    });
    return;
});

// PUT /api/applications/:id — update application (PRO User or Admin)
export const updateApplication = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
        throw new AppError("Invalid application ID", 400);
    }
    const user = (req as any).user;

    const application = await Application.findById(id);
    if (!application) {
        throw new AppError("Application not found", 404);
    }

    // Auth check
    const isAdmin = user.role === 'admin';
    const isAuditor = user.role === 'auditor' && application.auditorId?.toString() === user._id.toString();
    const company = await Company.findById(application.companyId);
    const isOwner = company?.ownerId?.toString() === user._id.toString();

    if (!isAdmin && !isAuditor && !isOwner) {
        throw new AppError("Unauthorized", 403);
    }

    // Restrict what owners can update based on status
    if (isOwner && !isAdmin && !isAuditor) {
        if (!['draft', 'more_info'].includes(application.status) && req.body.status === 'submitted') {
            // This is allowed: submitting a draft or responding to more_info
        } else if (!['draft', 'more_info'].includes(application.status)) {
            throw new AppError(`Cannot update application in ${application.status} status`, 400);
        }
    }

    // Handle submission timestamp
    if (req.body.status === 'submitted' && application.status !== 'submitted') {
        req.body.submittedAt = new Date();
    }

    const updated = await Application.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    }).populate("labelId", "name sector logoUrl");

    // Notification: when application is submitted, notify all admins
    if (req.body.status === 'submitted' && updated) {
        const admins = await User.find({ role: 'admin' }).select('_id');
        for (const admin of admins) {
            await Notification.create({
                userId: admin._id,
                type: 'application_submitted',
                title: 'Nouvelle candidature soumise',
                message: `${company?.name || 'Une organisation'} a soumis une candidature pour le label ${(updated.labelId as any)?.name || ''}.`,
                link: `/admin/applications/${id}`,
            });
        }
    }

    res.json({
        success: true,
        data: updated
    });
    return;
});

// PUT /api/applications/:id/assign — assign an auditor (Admin only)
export const assignAuditor = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { auditorId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
        throw new AppError("Invalid application ID", 400);
    }
    if (!auditorId || !mongoose.Types.ObjectId.isValid(auditorId as string)) {
        throw new AppError("Valid auditor ID is required", 400);
    }

    const application = await Application.findById(id);
    if (!application) {
        throw new AppError("Application not found", 404);
    }

    // Only submitted or under_review applications can be assigned
    if (!['submitted', 'under_review'].includes(application.status)) {
        throw new AppError(`Cannot assign auditor to application with status '${application.status}'`, 400);
    }

    application.auditorId = new mongoose.Types.ObjectId(auditorId as string);
    application.status = 'under_review';
    await application.save();

    // Notification: notify assigned auditor
    await Notification.create({
        userId: auditorId,
        type: 'auditor_assigned',
        title: 'Nouvelle assignation d\'audit',
        message: `Vous avez été assigné(e) à l'audit d'une candidature.`,
        link: `/admin/applications/${id}`,
    });

    // Notify company owner about status change
    const company = await Company.findById(application.companyId);
    if (company?.ownerId) {
        await Notification.create({
            userId: company.ownerId,
            type: 'application_status',
            title: 'Candidature en cours d\'examen',
            message: `Votre candidature est maintenant en cours d'examen par un auditeur.`,
            link: `/apply/${id}`,
        });
    }

    const populated = await Application.findById(id)
        .populate("companyId", "name sector region logoUrl")
        .populate("labelId", "name sector logoUrl")
        .populate("auditorId", "name email");

    res.json({
        success: true,
        data: populated
    });
    return;
});

// PUT /api/applications/:id/review — review/decide on an application (Admin/Auditor)
export const reviewApplication = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { decision, auditNotes, internalNotes } = req.body;
    const user = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
        throw new AppError("Invalid application ID", 400);
    }

    if (!['approved', 'rejected', 'more_info'].includes(decision)) {
        throw new AppError("Decision must be 'approved', 'rejected', or 'more_info'", 400);
    }

    const application = await Application.findById(id);
    if (!application) {
        throw new AppError("Application not found", 404);
    }

    // Only submitted or under_review applications can be reviewed
    if (!['submitted', 'under_review'].includes(application.status)) {
        throw new AppError(`Cannot review application with status '${application.status}'`, 400);
    }

    // Auth: Admin or assigned auditor only
    const isAdmin = user.role === 'admin';
    const isAssignedAuditor = user.role === 'auditor' && application.auditorId?.toString() === user._id.toString();

    if (!isAdmin && !isAssignedAuditor) {
        throw new AppError("Not authorized to review this application", 403);
    }

    // Update application
    application.status = decision;
    application.reviewedAt = new Date();
    if (auditNotes) application.auditNotes = auditNotes;
    if (internalNotes) application.internalNotes = internalNotes;

    // If approved, set expiry (1 year from now) and update Company
    if (decision === 'approved') {
        const oneYear = new Date();
        oneYear.setFullYear(oneYear.getFullYear() + 1);
        application.expiresAt = oneYear;

        // Update the Company status to certified
        await Company.findByIdAndUpdate(application.companyId, {
            status: 'certified',
            certificationDate: new Date(),
            expiryDate: oneYear,
            labelId: application.labelId,
        });

        // Auto-generate certificate (fire and forget — non-blocking)
        try {
            const { generateCertificate } = await import("./certificate.controller");
            // Create a mock request/response to call the generator
            const mockReq = { params: { applicationId: id } } as any;
            const mockRes = { json: () => { }, status: () => ({ json: () => { } }) } as any;
            const mockNext = () => { };
            await (generateCertificate as any)(mockReq, mockRes, mockNext);
        } catch (certErr) {
            console.error("Auto-certificate generation failed:", certErr);
        }
    }

    // If rejected, optionally update Company status
    if (decision === 'rejected') {
        await Company.findByIdAndUpdate(application.companyId, {
            status: 'rejected',
        });
    }

    await application.save();

    // Notification: notify company owner about the decision
    const companyForNotif = await Company.findById(application.companyId);
    if (companyForNotif?.ownerId) {
        const decisionLabels: Record<string, string> = {
            approved: 'Candidature approuvée ! 🎉',
            rejected: 'Candidature refusée',
            more_info: 'Informations complémentaires requises',
        };
        const decisionMessages: Record<string, string> = {
            approved: `Félicitations ! Votre candidature a été approuvée. Votre certification est désormais active.`,
            rejected: `Votre candidature a été refusée. Consultez les notes de l'auditeur pour plus de détails.`,
            more_info: `L'auditeur demande des informations complémentaires sur votre dossier.`,
        };

        await Notification.create({
            userId: companyForNotif.ownerId,
            type: 'application_status',
            title: decisionLabels[decision] || 'Mise à jour de candidature',
            message: decisionMessages[decision] || `Le statut de votre candidature a été mis à jour.`,
            link: `/apply/${id}`,
        });
    }

    const populated = await Application.findById(id)
        .populate("companyId", "name sector region logoUrl")
        .populate("labelId", "name sector logoUrl")
        .populate("auditorId", "name email");

    res.json({
        success: true,
        data: populated
    });
    return;
});
