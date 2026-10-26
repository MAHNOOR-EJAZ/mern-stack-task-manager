import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { TaskModel, ITask } from '../models/Task.ts';
import { getConnectionStatus, connectToMongo } from '../db.ts';

const router = Router();

// In-memory fallback repository when MongoDB connection is pending or not yet configured by user
let fallbackTasks: any[] = [
  {
    id: 'demo-task-1',
    _id: 'demo-task-1',
    title: 'Set up MongoDB Atlas Cluster',
    description: 'Create a free M0 cluster on cloud.mongodb.com and obtain the connection string.',
    priority: 'High',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    completed: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'demo-task-2',
    _id: 'demo-task-2',
    title: 'Test Express API Endpoints',
    description: 'Verify GET, POST, PUT, and DELETE operations with Mongoose schemas.',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    completed: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'demo-task-3',
    _id: 'demo-task-3',
    title: 'Review University Project Rubric',
    description: 'Ensure all requirements for React frontend, Express API, and Mongoose models are fulfilled.',
    priority: 'Low',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    completed: false,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

// Helper to determine if Mongoose is ready
const isMongooseReady = () => mongoose.connection.readyState === 1;

/**
 * GET /api/tasks
 * Fetch tasks with optional filters (status, priority, search, sort, order)
 */
router.get('/tasks', async (req: Request, res: Response) => {
  try {
    const { status, priority, search, sort = 'createdAt', order = 'desc' } = req.query;

    if (isMongooseReady()) {
      // Build MongoDB query
      const query: any = {};

      if (status === 'completed') query.completed = true;
      if (status === 'pending') query.completed = false;

      if (priority && priority !== 'all') {
        query.priority = priority;
      }

      if (search && typeof search === 'string' && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ title: regex }, { description: regex }];
      }

      // Sort
      const sortField = typeof sort === 'string' ? sort : 'createdAt';
      const sortOrder = order === 'asc' ? 1 : -1;
      const sortOptions: any = { [sortField]: sortOrder };

      const tasks = await TaskModel.find(query).sort(sortOptions).exec();
      return res.json({
        success: true,
        source: 'MongoDB Atlas',
        count: tasks.length,
        tasks: tasks.map(t => t.toJSON()),
      });
    }

    // Fallback store
    let filtered = [...fallbackTasks];

    if (status === 'completed') {
      filtered = filtered.filter(t => t.completed === true);
    } else if (status === 'pending') {
      filtered = filtered.filter(t => t.completed === false);
    }

    if (priority && priority !== 'all') {
      filtered = filtered.filter(t => t.priority === priority);
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        t => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sort fallback
    filtered.sort((a, b) => {
      const field = sort as string;
      let valA = a[field];
      let valB = b[field];

      if (field === 'dueDate') {
        valA = valA ? new Date(valA).getTime() : (order === 'asc' ? Infinity : -Infinity);
        valB = valB ? new Date(valB).getTime() : (order === 'asc' ? Infinity : -Infinity);
      } else if (field === 'priority') {
        const map: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
        valA = map[valA] || 0;
        valB = map[valB] || 0;
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return res.json({
      success: true,
      source: 'Server Memory (Connect MongoDB Atlas for Cloud Persistence)',
      count: filtered.length,
      tasks: filtered,
    });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

/**
 * POST /api/tasks
 * Create a new task
 */
router.post('/tasks', async (req: Request, res: Response) => {
  try {
    const { title, description, priority = 'Medium', dueDate, completed = false } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Task title is required' });
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    const chosenPriority = validPriorities.includes(priority) ? priority : 'Medium';

    let parsedDueDate = null;
    if (dueDate) {
      const d = new Date(dueDate);
      if (!isNaN(d.getTime())) {
        parsedDueDate = d;
      }
    }

    if (isMongooseReady()) {
      const newTask = new TaskModel({
        title: title.trim(),
        description: description ? description.trim() : '',
        priority: chosenPriority,
        dueDate: parsedDueDate,
        completed: Boolean(completed),
      });

      const savedTask = await newTask.save();
      return res.status(201).json({
        success: true,
        source: 'MongoDB Atlas',
        task: savedTask.toJSON(),
      });
    }

    // Fallback store
    const id = 'task-' + Date.now();
    const newTask = {
      id,
      _id: id,
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: chosenPriority,
      dueDate: parsedDueDate ? parsedDueDate.toISOString() : null,
      completed: Boolean(completed),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    fallbackTasks.unshift(newTask);
    return res.status(201).json({
      success: true,
      source: 'Server Memory',
      task: newTask,
    });
  } catch (error: any) {
    console.error('Error creating task:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to create task' });
  }
});

/**
 * GET /api/tasks/:id
 * Retrieve a single task by ID
 */
router.get('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongooseReady()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid MongoDB Task ID format' });
      }
      const task = await TaskModel.findById(id).exec();
      if (!task) {
        return res.status(404).json({ success: false, error: 'Task not found in MongoDB' });
      }
      return res.json({ success: true, task: task.toJSON() });
    }

    const task = fallbackTasks.find(t => t.id === id || t._id === id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    return res.json({ success: true, task });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/tasks/:id
 * Update an existing task
 */
router.put('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, completed } = req.body;

    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({ success: false, error: 'Title cannot be empty' });
    }

    let parsedDueDate: any = undefined;
    if (dueDate !== undefined) {
      if (!dueDate) {
        parsedDueDate = null;
      } else {
        const d = new Date(dueDate);
        if (!isNaN(d.getTime())) {
          parsedDueDate = d;
        }
      }
    }

    if (isMongooseReady()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid MongoDB ObjectId' });
      }

      const updates: any = {};
      if (title !== undefined) updates.title = title.trim();
      if (description !== undefined) updates.description = description.trim();
      if (priority !== undefined) updates.priority = priority;
      if (parsedDueDate !== undefined) updates.dueDate = parsedDueDate;
      if (completed !== undefined) updates.completed = Boolean(completed);

      const updated = await TaskModel.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      }).exec();

      if (!updated) {
        return res.status(404).json({ success: false, error: 'Task not found in MongoDB' });
      }

      return res.json({
        success: true,
        source: 'MongoDB Atlas',
        task: updated.toJSON(),
      });
    }

    // Fallback update
    const index = fallbackTasks.findIndex(t => t.id === id || t._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const existing = fallbackTasks[index];
    const updated = {
      ...existing,
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(priority !== undefined && { priority }),
      ...(parsedDueDate !== undefined && { dueDate: parsedDueDate ? parsedDueDate.toISOString() : null }),
      ...(completed !== undefined && { completed: Boolean(completed) }),
      updatedAt: new Date().toISOString(),
    };

    fallbackTasks[index] = updated;
    return res.json({
      success: true,
      source: 'Server Memory',
      task: updated,
    });
  } catch (error: any) {
    console.error('Error updating task:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to update task' });
  }
});

/**
 * PATCH /api/tasks/:id/toggle
 * Toggle completed status
 */
router.patch('/tasks/:id/toggle', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongooseReady()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid MongoDB ObjectId' });
      }
      const task = await TaskModel.findById(id).exec();
      if (!task) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }
      task.completed = !task.completed;
      await task.save();
      return res.json({ success: true, task: task.toJSON() });
    }

    const task = fallbackTasks.find(t => t.id === id || t._id === id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    task.completed = !task.completed;
    task.updatedAt = new Date().toISOString();
    return res.json({ success: true, task });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
router.delete('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongooseReady()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid MongoDB ObjectId' });
      }
      const deleted = await TaskModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }
      return res.json({ success: true, message: 'Task deleted from MongoDB Atlas', id });
    }

    const initialLength = fallbackTasks.length;
    fallbackTasks = fallbackTasks.filter(t => t.id !== id && t._id !== id);

    if (fallbackTasks.length === initialLength) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    return res.json({ success: true, message: 'Task deleted successfully', id });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/status
 * Get connection status and database metadata
 */
router.get('/status', async (req: Request, res: Response) => {
  const shouldRetry = req.query.retry === 'true' || req.query.refresh === 'true';
  if (shouldRetry && !isMongooseReady() && process.env.MONGODB_URI) {
    await connectToMongo(process.env.MONGODB_URI).catch(() => {});
  }
  const connStatus = getConnectionStatus();
  let taskCount = 0;

  try {
    if (isMongooseReady()) {
      taskCount = await TaskModel.countDocuments();
    } else {
      taskCount = fallbackTasks.length;
    }
  } catch (err) {
    taskCount = fallbackTasks.length;
  }

  return res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      ...connStatus,
      driver: 'Mongoose v' + mongoose.version,
      readyState: mongoose.connection.readyState,
      activeCollection: 'tasks',
      totalTasks: taskCount,
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      hasMongoUriEnv: Boolean(process.env.MONGODB_URI),
    },
  });
});

/**
 * POST /api/connect-mongodb
 * Disabled in standard application configuration for security
 */
router.post('/connect-mongodb', (_req: Request, res: Response) => {
  return res.status(403).json({
    success: false,
    error: 'Access denied: Dynamic database connection reconfiguration is disabled in standard application configuration. Configure MONGODB_URI in server environment variables.',
  });
});

/**
 * POST /api/seed-tasks
 * Disabled in standard application configuration for security
 */
router.post('/seed-tasks', (_req: Request, res: Response) => {
  return res.status(403).json({
    success: false,
    error: 'Access denied: Database wipe and seed operations are disabled in standard application configuration to prevent data loss.',
  });
});

export default router;
