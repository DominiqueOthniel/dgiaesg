import type { Request, Response } from "express";
import { Comment, Notification, News } from "../models";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";
import mongoose from "mongoose";

// GET /api/comments?targetType=news&targetId=xxx — get comments for a target
export const getComments = asyncHandler(async (req: Request, res: Response) => {
    const { targetType, targetId } = req.query;

    if (!targetType || !targetId) {
        throw new AppError("targetType and targetId are required", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(targetId as string)) {
        throw new AppError("Invalid target ID", 400);
    }

    const filter: Record<string, any> = {
        targetType,
        targetId,
        isVisible: true,
    };

    const comments = await Comment.find(filter)
        .populate("userId", "name username")
        .sort("-createdAt");

    res.json({
        success: true,
        count: comments.length,
        data: comments,
    });
});

// POST /api/comments — create a comment (authenticated users)
export const createComment = asyncHandler(async (req: Request, res: Response) => {
    const { targetType, targetId, content } = req.body;
    const user = (req as any).user;

    if (!targetType || !targetId || !content) {
        throw new AppError("targetType, targetId, and content are required", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(targetId as string)) {
        throw new AppError("Invalid target ID", 400);
    }

    const comment = await Comment.create({
        targetType,
        targetId,
        userId: user._id,
        userName: user.name,
        content: content.trim(),
    });

    // Notify article author if commenting on news
    if (targetType === "news") {
        const article = await News.findById(targetId);
        if (article) {
            // Notify all admins about new comment
            const User = mongoose.model("User");
            const admins = await User.find({ role: "admin" }).select("_id");
            for (const admin of admins) {
                await Notification.create({
                    userId: admin._id,
                    type: "comment",
                    title: "Nouveau commentaire",
                    message: `${user.name} a commenté l'article "${article.title}".`,
                    link: `/news/${targetId}`,
                });
            }
        }
    }

    const populated = await comment.populate("userId", "name username");

    res.status(201).json({
        success: true,
        data: populated,
    });
});

// DELETE /api/comments/:id — delete/hide a comment (Admin or Author)
export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
        throw new AppError("Invalid comment ID", 400);
    }

    const comment = await Comment.findById(id);
    if (!comment) {
        throw new AppError("Comment not found", 404);
    }

    const isAdmin = user.role === "admin";
    const isAuthor = comment.userId.toString() === user._id.toString();

    if (!isAdmin && !isAuthor) {
        throw new AppError("Not authorized to delete this comment", 403);
    }

    // Soft-delete: hide the comment
    comment.isVisible = false;
    await comment.save();

    res.json({
        success: true,
        message: "Comment removed",
    });
});
