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
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  const user = await User.create({
    name,
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
      email: user.email,
      role: user.role,
    },
  });
});

// POST /api/auth/login — login user
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken(user._id.toString());

  res.json({
    success: true,
    token,
    data: {
      id: user._id,
      name: user.name,
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
      email: updatedUser.email,
      role: updatedUser.role,
    },
  });
});
