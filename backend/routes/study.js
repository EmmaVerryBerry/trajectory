const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { updateStreak } = require('../utils/streak');
const { checkAndUnlockAchievements } = require('../utils/achievements');

// POST /api/study/sessions
router.post('/sessions', async (req, res) => {
  try {
    const { user_id, goal_id, session_date, duration_minutes, notes } = req.body;

    if (!user_id || !session_date || !duration_minutes) {
      return res.status(400).json({
        error: 'user_id, session_date, and duration_minutes are required'
      });
    }

    const durationNum = Number(duration_minutes);

    if (Number.isNaN(durationNum) || durationNum <= 0) {
      return res.status(400).json({
        error: 'duration_minutes must be a positive number'
      });
    }

    const [result] = await db.execute(
      `
      INSERT INTO study_sessions (user_id, goal_id, session_date, duration_minutes, notes)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        user_id,
        goal_id || null,
        session_date,
        durationNum,
        notes || null
      ]
    );

    await updateStreak(user_id);

    const [rows] = await db.execute(
      `SELECT * FROM study_sessions WHERE session_id = ?`,
      [result.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/study/sessions/:userId
router.get('/sessions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.execute(
      `
      SELECT * FROM study_sessions
      WHERE user_id = ?
      ORDER BY session_date DESC, session_id DESC
      `,
      [userId]
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/study/progress/:userId
router.get('/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [goals] = await db.execute(
      `
      SELECT weekly_hours
      FROM goals
      WHERE user_id = ? AND is_active = 1
      LIMIT 1
      `,
      [userId]
    );

    if (goals.length === 0) {
      return res.status(404).json({ error: 'No active goal found for this user' });
    }

    const [sessions] = await db.execute(
      `
      SELECT COALESCE(SUM(duration_minutes), 0) AS total_minutes
      FROM study_sessions
      WHERE user_id = ?
        AND YEARWEEK(session_date, 1) = YEARWEEK(CURDATE(), 1)
      `,
      [userId]
    );

    const totalMinutes = Number(sessions[0].total_minutes || 0);
    const totalHours = Number((totalMinutes / 60).toFixed(2));
    const weeklyGoalHours = Number(goals[0].weekly_hours);
    const completionPercentage = weeklyGoalHours > 0
      ? Number(((totalHours / weeklyGoalHours) * 100).toFixed(2))
      : 0;

    return res.json({
      total_hours_this_week: totalHours,
      weekly_goal_hours: weeklyGoalHours,
      completion_percentage: completionPercentage
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/study/streak/:userId
router.get('/streak/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.execute(
      `SELECT * FROM streaks WHERE user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No streak found for this user' });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;