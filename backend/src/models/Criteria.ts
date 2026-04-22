import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICriteriaDocument extends Document {
  labelId: Types.ObjectId;
  category: "governance" | "environment" | "social" | "economic" | "quality";
  title: string;
  description: string;
  weight: number;
  createdAt: Date;
  updatedAt: Date;
}

const criteriaSchema = new Schema<ICriteriaDocument>(
  {
    labelId: {
      type: Schema.Types.ObjectId,
      ref: "Label",
      required: [true, "Label reference is required"],
    },
    category: {
      type: String,
      enum: ["governance", "environment", "social", "economic", "quality"],
      required: [true, "Category is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [300, "Title cannot exceed 300 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
      min: [0, "Weight cannot be negative"],
      max: [100, "Weight cannot exceed 100"],
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

criteriaSchema.index({ labelId: 1 });
criteriaSchema.index({ category: 1 });

const Criteria = mongoose.model<ICriteriaDocument>("Criteria", criteriaSchema);

export default Criteria;
