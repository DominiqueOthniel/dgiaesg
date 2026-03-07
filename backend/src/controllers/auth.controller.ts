import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });
};

// POST /api/auth/register — register a new user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, username, email, password, role } = req.body;

  const userExists = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (userExists) {
    throw new AppError("Email or Username already taken", 400);
  }

  const user = await User.create({
    name,
    username,
    email,
    password,
    role: role || "viewer",
  });

  const token = signToken(user._id.toString());

  res.status(201).json({
    success: true,
    token,
    data: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

// POST /api/auth/login — login user
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  // Search by email OR username
  const user = await User.findOne({
    $or: [
      { email: identifier },
      { username: identifier }
    ]
  }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = signToken(user._id.toString());

  res.json({
    success: true,
    token,
    data: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

// GET /api/auth/me — get current user profile
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  // User is attached to req by authMiddleware
  const user = await User.findById((req as any).user.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({
    success: true,
    data: user,
  });
});

// PUT /api/auth/me — update profile
export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.name = req.body.name || user.name;
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    data: {
      id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
    },
  });
});

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("No user with that email", 404);
  }

  // Generate a random token (simulated for now)
  const resetToken = Math.random().toString(36).substring(2, 12);

  res.json({
    success: true,
    message: "Password reset token sent to email",
    token: resetToken // In production, send via email instead
  });
});

// POST /api/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.password = password;
  await user.save();

  res.json({
    success: true,
    message: "Password has been reset successfully"
  });
});
