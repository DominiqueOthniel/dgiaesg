import type { Request, Response, NextFunction } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const { method, originalUrl } = req;

    // Log incoming request
    console.log(`>>> ${method} ${originalUrl}`);

    // Once the response is finished, log the details
    res.on("finish", () => {
        const duration = Date.now() - start;
        const { statusCode } = res;

        // Standard log format: METHOD /path STATUS - TIMEms
        console.log(`<<< ${method} ${originalUrl} ${statusCode} - ${duration}ms`);
    });

    next();
};
