import mongoose, { Schema, Document } from "mongoose";

export interface IBreakingNews extends Document {
    title: string;
    link?: string;
    active: boolean;
    priority: number; // For ordering
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const breakingNewsSchema = new Schema<IBreakingNews>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [300, "Breaking news title cannot exceed 300 characters"],
        },
        link: {
            type: String,
            trim: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
        priority: {
            type: Number,
            default: 0,
        },
        expiresAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

breakingNewsSchema.index({ active: 1, priority: -1 });

const BreakingNews = mongoose.model<IBreakingNews>("BreakingNews", breakingNewsSchema);

export default BreakingNews;
