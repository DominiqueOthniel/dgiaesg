import mongoose, { Schema, Document } from "mongoose";

export interface IAdDocument extends Document {
    title: string;
    imageUrl: string;
    targetUrl: string;
    position: "sidebar" | "top" | "inline";
    active: boolean;
    startDate: Date;
    endDate?: Date;
    impressions: number;
    clicks: number;
    createdAt: Date;
    updatedAt: Date;
}

const adSchema = new Schema<IAdDocument>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        imageUrl: {
            type: String,
            required: [true, "Image URL is required"],
        },
        targetUrl: {
            type: String,
            required: [true, "Target URL is required"],
        },
        position: {
            type: String,
            enum: ["sidebar", "top", "inline"],
            default: "sidebar",
        },
        active: {
            type: Boolean,
            default: true,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
        },
        impressions: {
            type: Number,
            default: 0,
        },
        clicks: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

adSchema.index({ active: 1, position: 1 });

const Ad = mongoose.model<IAdDocument>("Ad", adSchema);

export default Ad;
