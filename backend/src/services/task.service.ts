import prisma from '../prisma/client';
import { Prisma } from '@prisma/client';
import { AppError } from '../middleware/error';

interface CreateTaskInput {
  title: string;
  userId: string;
}

interface UpdateTaskInput {
  title?: string;
  completed?: boolean;
}

interface GetTasksQuery {
  page: number;
  limit: number;
  completed?: boolean;
  search?: string;
}

interface PaginatedTasks {
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
    userId: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Create a new task for the authenticated user
 */
export const createTask = async ({ title, userId }: CreateTaskInput) => {
  const task = await prisma.task.create({
    data: {
      title,
      userId,
    },
  });
  return task;
};

/**
 * Get all tasks for the authenticated user with pagination, filtering, and search
 */
export const getTasks = async (
  userId: string,
  query: GetTasksQuery
): Promise<PaginatedTasks> => {
  const { page, limit, completed, search } = query;
  const skip = (page - 1) * limit;

  // Build where clause dynamically
  const where: Prisma.TaskWhereInput = { userId };

  if (completed !== undefined) {
    where.completed = completed;
  }

  if (search) {
    where.title = {
      contains: search,
      mode: 'insensitive',
    };
  }

  // Execute queries in parallel for performance
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.task.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
  };
};

/**
 * Get a single task by ID (scoped to user)
 */
export const getTaskById = async (taskId: string, userId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  return task;
};

/**
 * Update a task by ID (scoped to user)
 */
export const updateTask = async (
  taskId: string,
  userId: string,
  data: UpdateTaskInput
) => {
  // Check if task exists and belongs to user
  const existingTask = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!existingTask) {
    throw new AppError('Task not found.', 404);
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data,
  });

  return updatedTask;
};

/**
 * Delete a task by ID (scoped to user)
 */
export const deleteTask = async (taskId: string, userId: string) => {
  // Check if task exists and belongs to user
  const existingTask = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!existingTask) {
    throw new AppError('Task not found.', 404);
  }

  await prisma.task.delete({ where: { id: taskId } });
};

/**
 * Toggle the completion status of a task
 */
export const toggleTask = async (taskId: string, userId: string) => {
  // Check if task exists and belongs to user
  const existingTask = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!existingTask) {
    throw new AppError('Task not found.', 404);
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { completed: !existingTask.completed },
  });

  return updatedTask;
};
