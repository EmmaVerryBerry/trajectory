const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST /api/social/friends/add
router.post('/friends/add', async (req, res) => {
  try {
    const { user_id, userId, friend_id, friendId, username, email } = req.body;

    const finalUserId = user_id || userId;
    let finalFriendId = friend_id || friendId;

    if (!finalUserId) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    if (!finalFriendId && !username && !email) {
      return res.status(400).json({
        error: 'friend_id, username, or email is required'
      });
    }

    if (!finalFriendId) {
      const [users] = await db.execute(
        `
        SELECT user_id
        FROM users
        WHERE username = ? OR email = ?
        LIMIT 1
        `,
        [username || '', email || '']
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      finalFriendId = users[0].user_id;
    }

    if (Number(finalUserId) === Number(finalFriendId)) {
      return res.status(400).json({ error: 'Cannot add yourself as a friend' });
    }

    const [existing] = await db.execute(
      `
      SELECT *
      FROM friendships
      WHERE (user_id = ? AND friend_id = ?)
         OR (user_id = ? AND friend_id = ?)
      `,
      [finalUserId, finalFriendId, finalFriendId, finalUserId]
    );

    if (existing.length > 0) {
      return res.json({ message: 'Friend request already exists' });
    }

    await db.execute(
      `
      INSERT INTO friendships (user_id, friend_id, status)
      VALUES (?, ?, ?)
      `,
      [finalUserId, finalFriendId, 'accepted']
    );

    return res.status(201).json({
      message: 'Friend added successfully',
      friend_id: finalFriendId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/social/friends/:userId
router.get('/friends/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.execute(
      `
      SELECT u.user_id, u.username, u.email, u.university, u.major,
             s.current_streak, s.longest_streak
      FROM friendships f
      JOIN users u
        ON u.user_id = CASE
          WHEN f.user_id = ? THEN f.friend_id
          ELSE f.user_id
        END
      LEFT JOIN streaks s
        ON s.user_id = u.user_id
      WHERE (f.user_id = ? OR f.friend_id = ?)
        AND f.status = 'accepted'
      ORDER BY u.username
      `,
      [userId, userId, userId]
    );

    return res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/social/leaderboard/friends/:userId
router.get('/leaderboard/friends/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.execute(
      `
      SELECT u.user_id, u.username, u.university, u.major,
             COALESCE(s.current_streak, 0) AS current_streak,
             COALESCE(SUM(ss.duration_minutes), 0) / 60 AS total_hours
      FROM users u
      LEFT JOIN streaks s
        ON s.user_id = u.user_id
      LEFT JOIN study_sessions ss
        ON ss.user_id = u.user_id
      WHERE u.user_id = ?
         OR u.user_id IN (
          SELECT CASE
            WHEN f.user_id = ? THEN f.friend_id
            ELSE f.user_id
          END
          FROM friendships f
          WHERE (f.user_id = ? OR f.friend_id = ?)
            AND f.status = 'accepted'
        )
      GROUP BY u.user_id, u.username, u.university, u.major, s.current_streak
      ORDER BY current_streak DESC, total_hours DESC
      LIMIT 10
      `,
      [userId, userId, userId, userId]
    );

    return res.json(rows.map((row, index) => ({
      ...row,
      rank: index + 1
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/social/leaderboard/global
router.get('/leaderboard/global', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `
      SELECT u.user_id, u.username, u.university, u.major,
             COALESCE(s.current_streak, 0) AS current_streak,
             COALESCE(SUM(ss.duration_minutes), 0) / 60 AS total_hours
      FROM users u
      LEFT JOIN streaks s
        ON s.user_id = u.user_id
      LEFT JOIN study_sessions ss
        ON ss.user_id = u.user_id
      GROUP BY u.user_id, u.username, u.university, u.major, s.current_streak
      ORDER BY current_streak DESC, total_hours DESC
      LIMIT 20
      `
    );

    return res.json(rows.map((row, index) => ({
      ...row,
      rank: index + 1
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/social/leaderboard/community/:type/:id
router.get('/leaderboard/community/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;

    let column;

    if (type === 'university') {
      column = 'university';
    } else if (type === 'major') {
      column = 'major';
    } else {
      return res.status(400).json({
        error: 'Community type must be university or major'
      });
    }

    const [rows] = await db.execute(
      `
      SELECT u.user_id, u.username, u.university, u.major,
             COALESCE(s.current_streak, 0) AS current_streak,
             COALESCE(SUM(ss.duration_minutes), 0) / 60 AS total_hours
      FROM users u
      LEFT JOIN streaks s
        ON s.user_id = u.user_id
      LEFT JOIN study_sessions ss
        ON ss.user_id = u.user_id
      WHERE u.${column} = ?
      GROUP BY u.user_id, u.username, u.university, u.major, s.current_streak
      ORDER BY current_streak DESC, total_hours DESC
      LIMIT 20
      `,
      [id]
    );

    return res.json(rows.map((row, index) => ({
      ...row,
      rank: index + 1
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/social/activity/:userId
router.get('/activity/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.execute(
      `
      SELECT af.*, u.username
      FROM activity_feed af
      JOIN users u
        ON af.user_id = u.user_id
      WHERE af.user_id = ?
         OR af.user_id IN (
          SELECT CASE
            WHEN f.user_id = ? THEN f.friend_id
            ELSE f.user_id
          END
          FROM friendships f
          WHERE (f.user_id = ? OR f.friend_id = ?)
            AND f.status = 'accepted'
        )
      ORDER BY af.created_at DESC
      LIMIT 25
      `,
      [userId, userId, userId, userId]
    );

    return res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/social/activity
router.post('/activity', async (req, res) => {
  try {
    const { user_id, userId, activity_type, activityType, activity_text, activityText } = req.body;

    const finalUserId = user_id || userId;
    const finalType = activity_type || activityType;
    const finalText = activity_text || activityText;

    if (!finalUserId || !finalType || !finalText) {
      return res.status(400).json({
        error: 'user_id, activity_type, and activity_text are required'
      });
    }

    const [result] = await db.execute(
      `
      INSERT INTO activity_feed (user_id, activity_type, activity_text)
      VALUES (?, ?, ?)
      `,
      [finalUserId, finalType, finalText]
    );

    return res.status(201).json({
      activity_id: result.insertId,
      user_id: finalUserId,
      activity_type: finalType,
      activity_text: finalText
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;