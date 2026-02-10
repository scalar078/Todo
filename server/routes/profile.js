const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { updateProfileValidator } = require('../validators/auth');

// -------- GET /api/profile --------
router.get('/', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
});

// -------- PUT /api/profile --------
router.put('/', auth, updateProfileValidator, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, bio } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
