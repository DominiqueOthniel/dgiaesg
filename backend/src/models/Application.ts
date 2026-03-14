import mongoose, { Schema, Document, Types } from "mongoose";

export interface IApplicationDocument extends Document {
    companyId: Types.ObjectId;
    labelId: Types.ObjectId;
    status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'more_info';
    answers: Array<{
        criteriaId: Types.ObjectId;
        text?: string;
        fileUrl?: string;
    }>;
    documents: Array<{
        name: string;
        url: string;
        type: string;
    }>;
    auditorId?: Types.ObjectId;
    auditNotes: string;
    internalNotes: string;
    certificateUrl?: string;
    renewedFrom?: Types.ObjectId;
    submittedAt?: Date;
    reviewedAt?: Date;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const applicationSchema = new Schema<IApplicationDocument>(
    {
        companyId: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: [true, "Company reference is required"],
        },
        labelId: {
            type: Schema.Types.ObjectId,
            ref: "Label",
            required: [true, "Label reference is required"],
        },
        status: {
            type: String,
            enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'more_info'],
            default: 'draft',
        },
        answers: [
            {
                criteriaId: {
                    type: Schema.Types.ObjectId,
                    ref: "Criteria",
                    required: true,
                },
                text: String,
                fileUrl: String,
            },
        ],
        documents: [
            {
                name: { type: String, required: true },
                url: { type: String, required: true },
                type: { type: String, required: true },
            },
        ],
        auditorId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        auditNotes: {
            type: String,
            default: "",
        },
        internalNotes: {
            type: String,
            default: "",
        },
        submittedAt: Date,
        reviewedAt: Date,
        expiresAt: Date,
        certificateUrl: {
            type: String,
            default: "",
        },
        renewedFrom: {
            type: Schema.Types.ObjectId,
            ref: "Application",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

applicationSchema.index({ companyId: 1 });
applicationSchema.index({ labelId: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ auditorId: 1 });

const Application = mongoose.model<IApplicationDocument>("Application", applicationSchema);

export default Application;
