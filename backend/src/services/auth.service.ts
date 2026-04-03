import bcrypt from 'bcrypt';
import prisma from '../prisma/client';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
  TokenPayload,
} from '../utils/jwt';
import { AppError } from '../middleware/error';

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 12;

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface UserData {
  id: string;
  email: string;
  createdAt: Date;
}

interface AuthResult {
  user: UserData;
  tokens: AuthTokens;
}

/**
 * Register a new user
 */
export const registerUser = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('User with this email already exists.', 409);
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user in database
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  // Generate tokens
  const tokenPayload: TokenPayload = { userId: user.id, email: user.email };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Store refresh token in database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    user,
    tokens: { accessToken, refreshToken },
  };
};

/**
 * Login an existing user
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  // Generate tokens
  const tokenPayload: TokenPayload = { userId: user.id, email: user.email };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Store refresh token in database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
    tokens: { accessToken, refreshToken },
  };
};

/**
 * Refresh access token using a valid refresh token
 */
export const refreshTokens = async (
  refreshTokenValue: string
): Promise<AuthTokens> => {
  // Verify the refresh token
  let decoded: TokenPayload;
  try {
    decoded = verifyRefreshToken(refreshTokenValue);
  } catch {
    throw new AppError('Invalid or expired refresh token.', 401);
  }

  // Check if refresh token exists in database
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenValue },
  });

  if (!storedToken) {
    throw new AppError('Refresh token not found. Please login again.', 401);
  }

  // Check if token has expired
  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new AppError('Refresh token has expired. Please login again.', 401);
  }

  // Delete the old refresh token (rotation)
  await prisma.refreshToken.delete({ where: { id: storedToken.id } });

  // Generate new token pair
  const tokenPayload: TokenPayload = { userId: decoded.userId, email: decoded.email };
  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);

  // Store new refresh token
  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: decoded.userId,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

/**
 * Logout user by invalidating their refresh token
 */
export const logoutUser = async (refreshTokenValue: string): Promise<void> => {
  // Delete the refresh token from database
  const token = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenValue },
  });

  if (token) {
    await prisma.refreshToken.delete({ where: { id: token.id } });
  }
};
