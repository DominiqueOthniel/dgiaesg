import mongoose, { Schema, Document } from "mongoose";

export interface IMonthlyReviewDocument extends Document {
    title: string;
    coverImageUrl: string;
    pdfUrl: string;
    publishDate: Date;
    featured: boolean;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const monthlyReviewSchema = new Schema<IMonthlyReviewDocument>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        coverImageUrl: {
            type: String,
            required: [true, "Cover image URL is required"],
        },
        pdfUrl: {
            type: String,
            required: [true, "PDF URL is required"],
        },
        publishDate: {
            type: Date,
            required: [true, "Publication date is required"],
            default: Date.now,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        published: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const MonthlyReview = mongoose.model<IMonthlyReviewDocument>("MonthlyReview", monthlyReviewSchema);

export default MonthlyReview;
