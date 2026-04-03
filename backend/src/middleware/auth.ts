import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { sendError } from '../utils/response';

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Authentication middleware
 * Extracts and verifies JWT from Authorization header
 * Attaches user payload to request object
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 401, 'Access denied. No token provided.');
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      sendError(res, 401, 'Access denied. Invalid token format.');
      return;
    }

    // Verify the access token
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      sendError(res, 401, 'Access token has expired.');
      return;
    }
    sendError(res, 401, 'Invalid or malformed token.');
  }
};
