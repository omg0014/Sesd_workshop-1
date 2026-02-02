import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    constructor(public message: string, public statusCode: number = 400) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
