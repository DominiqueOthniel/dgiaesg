import mongoose, { Schema, Document } from "mongoose";

export interface ISubCategoryDocument extends Document {
    name: string;
    slug: string;
    parentCategory: mongoose.Types.ObjectId;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const subCategorySchema = new Schema<ISubCategoryDocument>(
    {
        name: {
            type: String,
            required: [true, "Sub-category name is required"],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            lowercase: true,
            trim: true,
        },
        parentCategory: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Parent category is required"],
        },
        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

subCategorySchema.index({ slug: 1, parentCategory: 1 }, { unique: true });

const SubCategory = mongoose.model<ISubCategoryDocument>("SubCategory", subCategorySchema);

export default SubCategory;
