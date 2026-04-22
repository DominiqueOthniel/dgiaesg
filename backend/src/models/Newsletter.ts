import mongoose, { Schema, Document } from "mongoose";

export interface INewsletterDocument extends Document {
    title: { fr: string; en: string };
    summary: { fr: string; en: string };
    content: { fr: string; en: string };
    imageUrl: string;
    category: "esg" | "finance" | "governance" | "technology" | "general";
    status: "draft" | "published" | "scheduled";
    publishedAt: Date | null;
    scheduledAt: Date | null;
    sendEmail: boolean;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const newsletterSchema = new Schema<INewsletterDocument>(
    {
        title: {
            fr: { type: String, required: true },
            en: { type: String, required: true },
        },
        summary: {
            fr: { type: String, required: true },
            en: { type: String, required: true },
        },
        content: {
            fr: { type: String, required: true },
            en: { type: String, required: true },
        },
        imageUrl: {
            type: String,
            default: "",
        },
        category: {
            type: String,
            enum: ["esg", "finance", "governance", "technology", "general"],
            default: "general",
        },
        status: {
            type: String,
            enum: ["draft", "published", "scheduled"],
            default: "draft",
        },
        publishedAt: {
            type: Date,
            default: null,
        },
        scheduledAt: {
            type: Date,
            default: null,
        },
        sendEmail: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

newsletterSchema.index({ status: 1, publishedAt: -1 });

const Newsletter = mongoose.model<INewsletterDocument>("Newsletter", newsletterSchema);

export default Newsletter;
