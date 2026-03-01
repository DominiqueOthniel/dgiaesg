import mongoose, { Schema, Document } from "mongoose";

export interface ILabelDocument extends Document {
  name: string;
  description: string;
  logoUrl: string;
  sector: string;
  status: "active" | "inactive";
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const labelSchema = new Schema<ILabelDocument>(
  {
    name: {
      type: String,
      required: [true, "Label name is required"],
      trim: true,
      unique: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    logoUrl: {
      type: String,
      default: "",
    },
    sector: {
      type: String,
      required: [true, "Sector is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

labelSchema.index({ sector: 1 });
labelSchema.index({ status: 1 });
labelSchema.index({ name: "text", description: "text" });

const Label = mongoose.model<ILabelDocument>("Label", labelSchema);

export default Label;
