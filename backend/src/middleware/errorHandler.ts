import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(err.info && { info: err.info }), 
    });
    return;
  }

  

  const isDev = process.env.NODE_ENV === 'development';
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    ...(isDev && { stack: err.stack }),
  });
}
