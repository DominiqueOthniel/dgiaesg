import mongoose, { Schema, Document } from "mongoose";

export interface INewsletterSubscriptionDocument extends Document {
    email: string;
    interests: string[];
    status: "active" | "unsubscribed";
    subscribedAt: Date;
    updatedAt: Date;
}

const newsletterSubscriptionSchema = new Schema<INewsletterSubscriptionDocument>(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        interests: [
            {
                type: String,
                enum: ["finance", "governance", "tech", "energy", "leadership", "esg", "csr"],
            },
        ],
        status: {
            type: String,
            enum: ["active", "unsubscribed"],
            default: "active",
        },
    },
    {
        timestamps: { createdAt: "subscribedAt", updatedAt: "updatedAt" },
    }
);

newsletterSubscriptionSchema.index({ status: 1 });

const NewsletterSubscription = mongoose.model<INewsletterSubscriptionDocument>(
    "NewsletterSubscription",
    newsletterSubscriptionSchema
);

export default NewsletterSubscription;
