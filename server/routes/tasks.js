const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const { createTaskValidator, updateTaskValidator } = require('../validators/task');

// -------- GET /api/tasks  (list with search, filter, pagination) --------
router.get('/', auth, async (req, res, next) => {
  try {
    const {
      search,
      status,
      priority,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12,
    } = req.query;

    const query = { user: req.user.id };

    // Filter by status
    if (status && ['todo', 'in-progress', 'done'].includes(status)) {
      query.status = status;
    }

    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      query.priority = priority;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;
    const allowedSortFields = ['createdAt', 'title', 'status', 'priority', 'updatedAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Task.countDocuments(query),
    ]);

    res.json({
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// -------- GET /api/tasks/:id --------
router.get('/:id', auth, async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// -------- POST /api/tasks --------
router.post('/', auth, createTaskValidator, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { title, description, status, priority } = req.body;
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// -------- PUT /api/tasks/:id --------
router.put('/:id', auth, updateTaskValidator, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { title, description, status, priority } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

// -------- DELETE /api/tasks/:id --------
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
