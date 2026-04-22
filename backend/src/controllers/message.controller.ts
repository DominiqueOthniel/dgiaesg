import type { Request, Response } from "express";
import { Message, Application, Company, Notification } from "../models";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";
import mongoose from "mongoose";

// GET /api/messages/:applicationId — get all messages for an application
export const getMessages = asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;
    const user = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(applicationId as string)) {
        throw new AppError("Invalid application ID", 400);
    }

    // Verify access: user must be admin, assigned auditor, or company owner
    const application = await Application.findById(applicationId);
    if (!application) {
        throw new AppError("Application not found", 404);
    }

    const isAdmin = user.role === "admin";
    const isAuditor = user.role === "auditor" && application.auditorId?.toString() === user._id.toString();
    const company = await Company.findById(application.companyId);
    const isOwner = company?.ownerId?.toString() === user._id.toString();

    if (!isAdmin && !isAuditor && !isOwner) {
        throw new AppError("Not authorized to view these messages", 403);
    }

    const messages = await Message.find({ applicationId })
        .sort("createdAt");

    res.json({
        success: true,
        data: messages,
    });
});

// POST /api/messages/:applicationId — send a message in an application thread
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;
    const { content } = req.body;
    const user = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(applicationId as string)) {
        throw new AppError("Invalid application ID", 400);
    }
    if (!content || !content.trim()) {
        throw new AppError("Message content is required", 400);
    }

    const application = await Application.findById(applicationId);
    if (!application) {
        throw new AppError("Application not found", 404);
    }

    const isAdmin = user.role === "admin";
    const isAuditor = user.role === "auditor" && application.auditorId?.toString() === user._id.toString();
    const company = await Company.findById(application.companyId);
    const isOwner = company?.ownerId?.toString() === user._id.toString();

    if (!isAdmin && !isAuditor && !isOwner) {
        throw new AppError("Not authorized to send messages here", 403);
    }

    const message = await Message.create({
        applicationId,
        senderId: user._id,
        senderName: user.name,
        senderRole: user.role,
        content: content.trim(),
    });

    // Create notification for the other party
    if (isOwner && application.auditorId) {
        // Notify assigned auditor
        await Notification.create({
            userId: application.auditorId,
            type: "message",
            title: "Nouveau message",
            message: `${user.name} a envoyé un message sur la candidature de ${company?.name}.`,
            link: `/admin/applications/${applicationId}`,
        });
    } else if (isAdmin || isAuditor) {
        // Notify the company owner
        if (company?.ownerId) {
            await Notification.create({
                userId: company.ownerId,
                type: "message",
                title: "Nouveau message de l'auditeur",
                message: `Un auditeur a envoyé un message concernant votre candidature.`,
                link: `/apply/${applicationId}`,
            });
        }
    }

    res.status(201).json({
        success: true,
        data: message,
    });
});
