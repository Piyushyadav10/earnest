import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

/**
 * POST /auth/register
 * Register a new user
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.registerUser(email, password);

    sendSuccess(res, 201, 'User registered successfully.', {
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/login
 * Login an existing user
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    sendSuccess(res, 200, 'Login successful.', {
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/refresh
 * Refresh the access token using a refresh token
 */
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      sendError(res, 400, 'Refresh token is required.');
      return;
    }

    const tokens = await authService.refreshTokens(refreshToken);

    sendSuccess(res, 200, 'Token refreshed successfully.', tokens);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/logout
 * Logout user and invalidate refresh token
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await authService.logoutUser(refreshToken);
    }

    sendSuccess(res, 200, 'Logged out successfully.', null);
  } catch (error) {
    next(error);
  }
};
