const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/users/profile/:id
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      `
      SELECT user_id, username, email, display_name, bio, avatar_url,
             university, major, created_at, last_login
      FROM users
      WHERE user_id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/profile/:id
router.put('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { display_name, bio, avatar_url, university, major } = req.body;

    await db.execute(
      `
      UPDATE users
      SET display_name = ?,
          bio = ?,
          avatar_url = ?,
          university = ?,
          major = ?
      WHERE user_id = ?
      `,
      [
        display_name || null,
        bio || null,
        avatar_url || null,
        university || null,
        major || null,
        id
      ]
    );

    const [rows] = await db.execute(
      `
      SELECT user_id, username, email, display_name, bio, avatar_url,
             university, major, created_at, last_login
      FROM users
      WHERE user_id = ?
      `,
      [id]
    );

    return res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/:id/stats
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;

    const [totalRows] = await db.execute(
      `
      SELECT COALESCE(SUM(duration_minutes), 0) AS total_minutes
      FROM study_sessions
      WHERE user_id = ?
      `,
      [id]
    );

    const [weeklyRows] = await db.execute(
      `
      SELECT COALESCE(SUM(duration_minutes), 0) AS weekly_minutes
      FROM study_sessions
      WHERE user_id = ?
        AND YEARWEEK(session_date, 1) = YEARWEEK(CURDATE(), 1)
      `,
      [id]
    );

    const [streakRows] = await db.execute(
      `
      SELECT current_streak, longest_streak
      FROM streaks
      WHERE user_id = ?
      `,
      [id]
    );

    const [achievementRows] = await db.execute(
      `
      SELECT COUNT(*) AS achievement_count
      FROM user_achievements
      WHERE user_id = ?
      `,
      [id]
    );

    const totalHours = Number(((totalRows[0].total_minutes || 0) / 60).toFixed(2));
    const weeklyHours = Number(((weeklyRows[0].weekly_minutes || 0) / 60).toFixed(2));
    const currentStreak = streakRows[0]?.current_streak || 0;
    const longestStreak = streakRows[0]?.longest_streak || 0;
    const achievements = achievementRows[0]?.achievement_count || 0;

    return res.json({
      total_hours: totalHours,
      totalHours,
      weekly_hours: weeklyHours,
      weeklyHours,
      current_streak: currentStreak,
      currentStreak,
      longest_streak: longestStreak,
      longestStreak,
      achievements_count: achievements,
      achievements
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;