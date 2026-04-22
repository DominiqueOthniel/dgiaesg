import mongoose, { Schema, Document, Types } from "mongoose";

export interface INotificationDocument extends Document {
    userId: Types.ObjectId;
    type: "application_submitted" | "application_status" | "auditor_assigned" | "document_uploaded" | "comment" | "message" | "certification_expiry" | "system";
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotificationDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
        },
        type: {
            type: String,
            enum: [
                "application_submitted",
                "application_status",
                "auditor_assigned",
                "document_uploaded",
                "comment",
                "message",
                "certification_expiry",
                "system",
            ],
            required: [true, "Notification type is required"],
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
        },
        link: {
            type: String,
            trim: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model<INotificationDocument>("Notification", notificationSchema);

export default Notification;
