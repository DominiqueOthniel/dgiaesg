import type { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

export const authorize = (...roles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!roles.includes((req as any).user.role)) {
            throw new AppError(
                `User role ${(req as any).user.role} is not authorized to access this route`,
                403
            );
        }
        next();
    };
};
