import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

/**
 * Custom application error class
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 * Catches all errors and returns appropriate HTTP responses
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err.message);

  // Handle known operational errors
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message);
    return;
  }

  // Handle Prisma known errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as unknown as { code: string; meta?: { target?: string[] } };
    
    if (prismaError.code === 'P2002') {
      sendError(res, 409, 'A record with this value already exists.');
      return;
    }
    if (prismaError.code === 'P2025') {
      sendError(res, 404, 'Record not found.');
      return;
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 401, 'Invalid token.');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 401, 'Token has expired.');
    return;
  }

  // Default to 500 Internal Server Error
  sendError(
    res,
    500,
    process.env.NODE_ENV === 'production'
      ? 'Internal server error.'
      : err.message || 'Internal server error.'
  );
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  sendError(res, 404, `Route ${req.originalUrl} not found.`);
};
