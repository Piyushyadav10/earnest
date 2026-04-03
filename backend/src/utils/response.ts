import { Response } from 'express';

/**
 * Standardized API response helpers
 */

interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}

/**
 * Send a success response
 */
export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T
): Response => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 */
export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: unknown
): Response => {
  const response: ErrorResponse = {
    success: false,
    message,
  };
  if (errors !== undefined) {
    response.errors = errors;
  }
  return res.status(statusCode).json(response);
};
