import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AppError } from "./errorHandler";
import asyncHandler from "./asyncHandler";

interface DecodedToken {
    id: string;
}

export const protect = asyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
        let token: string | undefined;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            throw new AppError("Not authorized to access this route", 401);
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || "secret"
            ) as DecodedToken;

            const user = await User.findById(decoded.id);

            if (!user) {
                throw new AppError("User not found with this id", 401);
            }

            (req as any).user = user;
            next();
        } catch (err) {
            throw new AppError("Not authorized to access this route", 401);
        }
    }
);

export const optionalProtect = asyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
        let token: string | undefined;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next();
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || "secret"
            ) as DecodedToken;

            const user = await User.findById(decoded.id);

            if (user) {
                (req as any).user = user;
            }
            next();
        } catch (err) {
            // If token is invalid, we still proceed but without user object
            next();
        }
    }
);

export const authorize = (...roles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || !roles.includes(user.role)) {
            throw new AppError("Not authorized for this action", 403);
        }
        next();
    };
};
