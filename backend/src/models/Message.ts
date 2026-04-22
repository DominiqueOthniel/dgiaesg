import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessageDocument extends Document {
    applicationId: Types.ObjectId;
    senderId: Types.ObjectId;
    senderName: string;
    senderRole: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessageDocument>(
    {
        applicationId: {
            type: Schema.Types.ObjectId,
            ref: "Application",
            required: [true, "Application reference is required"],
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Sender reference is required"],
        },
        senderName: {
            type: String,
            required: true,
        },
        senderRole: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: [true, "Message content is required"],
            trim: true,
            maxlength: [5000, "Message cannot exceed 5000 characters"],
        },
    },
    {
        timestamps: true,
    }
);

messageSchema.index({ applicationId: 1, createdAt: 1 });

const Message = mongoose.model<IMessageDocument>("Message", messageSchema);

export default Message;
