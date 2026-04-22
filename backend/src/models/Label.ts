import mongoose, { Schema, Document } from "mongoose";

export interface ILabelDocument extends Document {
  name: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  logoUrl: string;
  sector: string;
  status: "active" | "inactive";
  validationWorkflow: {
    step: string;
    status: "complete" | "active" | "pending";
  }[];
  deletedAt: Date | null;
  publishDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const labelSchema = new Schema<ILabelDocument>(
  {
    name: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
    },
    description: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
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
    validationWorkflow: {
      type: [
        {
          step: String,
          status: { type: String, enum: ["complete", "active", "pending"] },
        },
      ],
      default: [
        { step: "Analyse documentaire", status: "complete" },
        { step: "Inspection sur site", status: "active" },
        { step: "Audit de conformité éthique", status: "pending" },
        { step: "Certification par le comité", status: "pending" },
      ],
    },
    publishDate: {
      type: Date,
      default: Date.now,
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
