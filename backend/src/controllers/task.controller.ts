import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/task.service';
import { sendSuccess } from '../utils/response';

/**
 * POST /tasks
 * Create a new task
 */
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title } = req.body;
    const userId = req.user!.userId;

    const task = await taskService.createTask({ title, userId });

    sendSuccess(res, 201, 'Task created successfully.', task);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /tasks
 * Get all tasks with pagination, filtering, and search
 */
export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    // Parse completed filter
    let completed: boolean | undefined;
    if (req.query.completed === 'true') completed = true;
    else if (req.query.completed === 'false') completed = false;

    const result = await taskService.getTasks(userId, {
      page,
      limit,
      completed,
      search,
    });

    sendSuccess(res, 200, 'Tasks retrieved successfully.', result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /tasks/:id
 * Get a single task by ID
 */
export const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    const task = await taskService.getTaskById(id, userId);

    sendSuccess(res, 200, 'Task retrieved successfully.', task);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /tasks/:id
 * Update a task
 */
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;
    const { title, completed } = req.body;

    const task = await taskService.updateTask(id, userId, { title, completed });

    sendSuccess(res, 200, 'Task updated successfully.', task);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /tasks/:id
 * Delete a task
 */
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    await taskService.deleteTask(id, userId);

    sendSuccess(res, 200, 'Task deleted successfully.', null);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /tasks/:id/toggle
 * Toggle the completion status of a task
 */
export const toggleTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    const task = await taskService.toggleTask(id, userId);

    sendSuccess(res, 200, 'Task toggled successfully.', task);
  } catch (error) {
    next(error);
  }
};
