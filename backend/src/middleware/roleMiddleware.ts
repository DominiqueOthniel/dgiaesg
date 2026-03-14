import type { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

export const authorize = (...roles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user) {
            throw new AppError("Not authorized to access this route", 401);
        }

        const hasRole = roles.includes(user.role);
        const isProAuthorized = roles.includes('pro') && user.isPro;

        if (!hasRole && !isProAuthorized) {
            throw new AppError(
                `User role ${user.role} is not authorized to access this route`,
                403
            );
        }
        next();
    };
};
