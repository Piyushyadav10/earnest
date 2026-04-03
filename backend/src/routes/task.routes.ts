import { Router } from 'express';
import { z } from 'zod';
import * as taskController from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

// Validation schemas
const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required.')
    .max(500, 'Task title must not exceed 500 characters.'),
});

const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required.')
    .max(500, 'Task title must not exceed 500 characters.')
    .optional(),
  completed: z.boolean().optional(),
});

// Routes
router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.patch('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/toggle', taskController.toggleTask);

export default router;
