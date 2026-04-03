import jwt, { JwtPayload } from 'jsonwebtoken';

// Load secrets from environment
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'fallback-access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret';

// Token expiration durations
const ACCESS_TOKEN_EXPIRY = '15m';   // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d';   // 7 days

export interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Generate a short-lived access token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

/**
 * Generate a long-lived refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

/**
 * Verify and decode an access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
};

/**
 * Verify and decode a refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
};

/**
 * Get the expiration date for refresh tokens (7 days from now)
 */
export const getRefreshTokenExpiry = (): Date => {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
};
