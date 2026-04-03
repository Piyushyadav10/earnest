import { Router } from 'express';
import { z } from 'zod';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validate';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Please provide a valid email address.'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long.')
    .max(100, 'Password must not exceed 100 characters.'),
});

const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required.'),
});

// Routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.post('/logout', authController.logout);

export default router;
