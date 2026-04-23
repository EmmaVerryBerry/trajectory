const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, university, major } = req.body;

    // Validate input
    if (!username || !email || !password || !university || !major) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const connection = await db.getConnection();

    try {
      // Check if user already exists
      const [existingUser] = await connection.query(
        'SELECT user_id FROM users WHERE email = ? OR username = ?',
        [email, username]
      );

      if (existingUser.length > 0) {
        return res.status(409).json({ error: 'Email or username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const [result] = await connection.query(
        'INSERT INTO users (username, email, password_hash, university, major) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, university, major]
      );

      const userId = result.insertId;

      // Generate JWT token
      const token = jwt.sign(
        { userId, email, username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { userId, username, email, university, major }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const connection = await db.getConnection();

    try {
      // Find user by email
      const [users] = await connection.query(
        'SELECT user_id, username, email, password_hash, university, major FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = users[0];

      // Check password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Update last login
      await connection.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
        [user.user_id]
      );

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.user_id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          userId: user.user_id,
          username: user.username,
          email: user.email,
          university: user.university,
          major: user.major
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  try {
    // Logout is typically handled client-side by removing the token
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
