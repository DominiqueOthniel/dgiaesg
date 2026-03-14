import mongoose, { Schema, Document } from "mongoose";

export interface ICategoryDocument extends Document {
    name: {
        fr: string;
        en: string;
    };
    slug: string;
    description?: {
        fr: string;
        en: string;
    };
    parent?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema<ICategoryDocument>(
    {
        name: {
            fr: { type: String, required: true, trim: true },
            en: { type: String, required: true, trim: true }
        },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            fr: { type: String, trim: true },
            en: { type: String, trim: true }
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            default: null
        }
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model<ICategoryDocument>("Category", categorySchema);

export default Category;
