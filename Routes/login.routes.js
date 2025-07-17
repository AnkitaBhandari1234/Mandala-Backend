const express = require('express');
const router = express.Router();
const User = require('../Models/user.model');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email,name:user.name,role:user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send token and user info
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name:user.name,
        role:user.role
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
