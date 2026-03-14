import mongoose, { Schema, Document } from "mongoose";

export interface INewsDocument extends Document {
  title: {
    fr: string;
    en: string;
  };
  slug: string;
  content: {
    fr: string;
    en: string;
  };
  excerpt: {
    fr: string;
    en: string;
  };
  author: string;
  imageUrl: string;
  sector: string;
  category?: mongoose.Types.ObjectId;
  subCategory?: mongoose.Types.ObjectId;
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
      fr: { type: String, required: true },
      en: { type: String, required: true },
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
    },
    excerpt: {
      fr: { type: String, default: "" },
      en: { type: String, default: "" },
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
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
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
