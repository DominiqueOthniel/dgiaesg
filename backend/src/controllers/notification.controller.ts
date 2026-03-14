import type { Request, Response } from "express";
import { Notification } from "../models";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";
import mongoose from "mongoose";

// GET /api/notifications — get current user's notifications
export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { unreadOnly } = req.query;

    const filter: Record<string, any> = { userId: user._id };
    if (unreadOnly === "true") filter.isRead = false;

    const notifications = await Notification.find(filter)
        .sort("-createdAt")
        .limit(50);

    const unreadCount = await Notification.countDocuments({ userId: user._id, isRead: false });

    res.json({
        success: true,
        unreadCount,
        data: notifications,
    });
});

// PUT /api/notifications/:id/read — mark a single notification as read
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
        throw new AppError("Invalid notification ID", 400);
    }

    const notification = await Notification.findOne({ _id: id, userId: user._id });
    if (!notification) {
        throw new AppError("Notification not found", 404);
    }

    notification.isRead = true;
    await notification.save();

    res.json({
        success: true,
        data: notification,
    });
});

// PUT /api/notifications/read-all — mark all notifications as read
export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;

    await Notification.updateMany(
        { userId: user._id, isRead: false },
        { isRead: true }
    );

    res.json({
        success: true,
        message: "All notifications marked as read",
    });
});

// Helper: create a notification (used by other controllers)
export const createNotification = async (data: {
    userId: string | mongoose.Types.ObjectId;
    type: string;
    title: string;
    message: string;
    link?: string;
}) => {
    return Notification.create(data);
};
