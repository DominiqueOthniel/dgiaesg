import mongoose, { Schema, Document } from "mongoose";

export interface IMultimediaDocument extends Document {
    title: string;
    description: string;
    type: "video" | "audio";
    embedUrl: string;
    coverImageUrl: string;
    sector: "finance" | "governance" | "tech" | "energy" | "leadership";
    featured: boolean;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const multimediaSchema = new Schema<IMultimediaDocument>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            maxlength: [1000, "Description cannot exceed 1000 characters"],
        },
        type: {
            type: String,
            enum: ["video", "audio"],
            required: [true, "Type is required"],
        },
        embedUrl: {
            type: String,
            required: [true, "Embed URL is required"],
        },
        coverImageUrl: {
            type: String,
            default: "",
        },
        sector: {
            type: String,
            enum: ["finance", "governance", "tech", "energy", "leadership"],
            required: [true, "Sector is required"],
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

multimediaSchema.index({ published: 1, featured: 1 });
multimediaSchema.index({ createdAt: -1 });
multimediaSchema.index({ title: "text", description: "text" });

export default mongoose.model<IMultimediaDocument>("Multimedia", multimediaSchema);
