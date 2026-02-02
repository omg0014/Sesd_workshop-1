import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader !== 'Bearer secure-token') {
        return next(new AppError('Unauthorized: Please provide a valid authorization token', 401));
    }

    next();
};
