import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICompanyDocument extends Document {
  name: string;
  description: string;
  sector: string;
  region: string;
  logoUrl: string;
  website: string;
  labelId: Types.ObjectId;
  certificationDate: Date;
  expiryDate: Date;
  score: number | null;
  status: "certified" | "pending" | "expired";
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompanyDocument>(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [300, "Name cannot exceed 300 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    sector: {
      type: String,
      required: [true, "Sector is required"],
      trim: true,
    },
    region: {
      type: String,
      required: [true, "Region is required"],
      trim: true,
    },
    logoUrl: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
      trim: true,
    },
    labelId: {
      type: Schema.Types.ObjectId,
      ref: "Label",
      required: [true, "Label reference is required"],
    },
    certificationDate: {
      type: Date,
      required: [true, "Certification date is required"],
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    score: {
      type: Number,
      default: null,
      min: [0, "Score cannot be negative"],
      max: [200, "Score cannot exceed 200"],
    },
    status: {
      type: String,
      enum: ["certified", "pending", "expired"],
      default: "pending",
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

companySchema.index({ labelId: 1 });
companySchema.index({ sector: 1 });
companySchema.index({ region: 1 });
companySchema.index({ status: 1 });
companySchema.index({ name: "text", description: "text" });

const Company = mongoose.model<ICompanyDocument>("Company", companySchema);

export default Company;
