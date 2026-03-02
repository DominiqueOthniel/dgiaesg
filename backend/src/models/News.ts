import mongoose, { Schema, Document } from "mongoose";

export interface INewsDocument extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  imageUrl: string;
  sector: string;
  readingTime: string;
  premium: boolean;
  published: boolean;
  publishedAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<INewsDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [500, "Title cannot exceed 500 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      default: "",
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    sector: {
      type: String,
      enum: ["finance", "governance", "tech", "energy", "leadership"],
      default: "finance",
    },
    readingTime: {
      type: String,
      default: "3 min",
    },
    premium: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
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

newsSchema.index({ published: 1 });
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ title: "text", content: "text" });

const News = mongoose.model<INewsDocument>("News", newsSchema);

export default News;
