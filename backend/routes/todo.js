const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const { protect } = require('../middleware/auth');

// All routes here require protection middleware
router.use(protect);

// @route   GET /api/todos
// @desc    Get all user's todos with optional filtering/sorting
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, priority, sortBy } = req.query;
    
    // Build query object
    let query = { user: req.user.id };
    
    // Status filter
    if (status === 'completed') {
      query.completed = true;
    } else if (status === 'pending') {
      query.completed = false;
    }
    
    // Priority filter
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      query.priority = priority;
    }

    // Sorting definition
    let sortOptions = { createdAt: -1 }; // Default: Newest first
    if (sortBy === 'dueDate') {
      sortOptions = { dueDate: 1, createdAt: -1 }; // Soonest due date first
    } else if (sortBy === 'priority') {
      // Custom priority sort can be done in application logic or with a mongo collation/weight.
      // We will sort in application or default to a standard sort. Let's sort by priority.
      // In MongoDB, sorting 'high'/'medium'/'low' alphabetically is 'high', 'low', 'medium'.
      // We will do sorting in JS if requested, or just sorting by createdAt / dueDate here.
      sortOptions = { priority: 1, createdAt: -1 };
    }

    const todos = await Todo.find(query).sort(sortOptions);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/todos
// @desc    Create a todo
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTodo = new Todo({
      user: req.user.id,
      title,
      description,
      priority: priority || 'medium',
      dueDate: dueDate || null
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/todos/:id
// @desc    Update a todo
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;

    let todo = await Todo.findById(req.id || req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Verify user owns the todo
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Fields to update
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (completed !== undefined) updateFields.completed = completed;
    if (priority !== undefined) updateFields.priority = priority;
    if (dueDate !== undefined) updateFields.dueDate = dueDate;

    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/todos/:id
// @desc    Delete a todo
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Verify user owns the todo
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Todo.findByIdAndDelete(req.params.id);

    res.json({ message: 'Todo removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
