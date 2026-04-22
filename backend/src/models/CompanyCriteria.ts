import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICompanyCriteriaDocument extends Document {
  companyId: Types.ObjectId;
  criteriaId: Types.ObjectId;
  score: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const companyCriteriaSchema = new Schema<ICompanyCriteriaDocument>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company reference is required"],
    },
    criteriaId: {
      type: Schema.Types.ObjectId,
      ref: "Criteria",
      required: [true, "Criteria reference is required"],
    },
    score: {
      type: Number,
      required: [true, "Score is required"],
      min: [0, "Score cannot be negative"],
      max: [100, "Score cannot exceed 100"],
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

companyCriteriaSchema.index({ companyId: 1 });
companyCriteriaSchema.index({ criteriaId: 1 });
companyCriteriaSchema.index({ companyId: 1, criteriaId: 1 }, { unique: true });

const CompanyCriteria = mongoose.model<ICompanyCriteriaDocument>(
  "CompanyCriteria",
  companyCriteriaSchema
);

export default CompanyCriteria;
