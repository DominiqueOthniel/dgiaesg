import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICommentDocument extends Document {
    targetType: "news" | "review";
    targetId: Types.ObjectId;
    userId: Types.ObjectId;
    userName: string;
    content: string;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<ICommentDocument>(
    {
        targetType: {
            type: String,
            enum: ["news", "review"],
            required: [true, "Target type is required"],
        },
        targetId: {
            type: Schema.Types.ObjectId,
            required: [true, "Target reference is required"],
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
        },
        userName: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: [true, "Comment content is required"],
            trim: true,
            maxlength: [2000, "Comment cannot exceed 2000 characters"],
        },
        isVisible: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

commentSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });

const Comment = mongoose.model<ICommentDocument>("Comment", commentSchema);

export default Comment;
