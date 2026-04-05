import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET;

export function authenticate(_req: Request, _res: Response, next: NextFunction) {
    const authHeader = _req.headers.authorization;
    if (!authHeader) {
        throw new AppError(401, "Authorization header is missing");
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new AppError(401, "Token is missing");
    }

    try {
        const decoded: { userId: number } = jwt.verify(token, JWT_SECRET) as { userId: number };
        _req.userId = decoded.userId;
        next();
    } catch (error) {
        throw new AppError(401, "Invalid token");
    }
}