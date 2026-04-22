import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUserDocument extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "editor" | "viewer" | "auditor";
  createdAt: Date;
  updatedAt: Date;
  savedArticles: mongoose.Types.ObjectId[];
  savedLabels: mongoose.Types.ObjectId[];
  avatar?: string;
  interests: string[];
  isPro: boolean;
  subscriptionId?: string;
  proExpiry?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer", "auditor"],
      default: "viewer",
    },
    savedArticles: [
      {
        type: Schema.Types.ObjectId,
        ref: "News",
      },
    ],
    savedLabels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Label",
      },
    ],
    avatar: {
      type: String,
      default: "",
    },
    interests: [
      {
        type: String,
        enum: ["finance", "governance", "tech", "energy", "leadership", "esg", "csr"],
      },
    ],
    isPro: {
      type: Boolean,
      default: false,
    },
    subscriptionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    proExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.index({ role: 1 });

const User = mongoose.model<IUserDocument>("User", userSchema);

export default User;
