const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/achievements
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM achievements ORDER BY achievement_id`
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/achievements/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.execute(
      `
      SELECT a.*, ua.earned_at
      FROM achievements a
      JOIN user_achievements ua
        ON a.achievement_id = ua.achievement_id
      WHERE ua.user_id = ?
      ORDER BY ua.earned_at DESC
      `,
      [userId]
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/achievements/unlock
// body: { user_id, achievement_id }
router.post('/unlock', async (req, res) => {
  try {
    const { user_id, achievement_id } = req.body;

    if (!user_id || !achievement_id) {
      return res.status(400).json({
        error: 'user_id and achievement_id are required'
      });
    }

    const [existing] = await db.execute(
      `
      SELECT * FROM user_achievements
      WHERE user_id = ? AND achievement_id = ?
      `,
      [user_id, achievement_id]
    );

    if (existing.length > 0) {
      return res.json({
        message: 'Achievement already unlocked'
      });
    }

    await db.execute(
      `
      INSERT INTO user_achievements (user_id, achievement_id)
      VALUES (?, ?)
      `,
      [user_id, achievement_id]
    );

    try {
      await db.execute(
        `
        INSERT INTO activity_feed (user_id, activity_type, activity_text)
        VALUES (?, ?, ?)
        `,
        [user_id, 'achievement', 'earned an achievement']
      );
    } catch (activityError) {
      console.log('Activity feed insert skipped:', activityError.message);
    }

    return res.json({
      message: 'Achievement unlocked successfully'
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;