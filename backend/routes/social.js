const express = require('express');
const router = express.Router();
const db = require('../config/database');

// simple id check
function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

// make sure type is one of the allowed community types
function isValidCommunityType(type) {
  return ['university', 'major', 'club', 'custom'].includes(type);
}

// gets all accepted friend ids for a user
async function getAcceptedFriendIds(userId) {
  const [rows] = await db.execute(
    `SELECT
        CASE
          WHEN user_id = ? THEN friend_id
          ELSE user_id
        END AS friend_user_id
     FROM friendships
     WHERE status = 'accepted'
       AND (user_id = ? OR friend_id = ?)`,
    [userId, userId, userId]
  );

  return rows.map(row => row.friend_user_id);
}

// checks whether a user exists
async function userExists(userId) {
  const [rows] = await db.execute(
    `SELECT user_id FROM users WHERE user_id = ?`,
    [userId]
  );

  return rows.length > 0;
}

// POST /api/social/friends/add
router.post('/friends/add', async (req, res) => {
  try {
    const { user_id, friend_id } = req.body;

    if (user_id === undefined || friend_id === undefined) {
      return res.status(400).json({
        error: 'user_id and friend_id are required'
      });
    }

    const parsedUserId = Number(user_id);
    const parsedFriendId = Number(friend_id);

    if (!isPositiveInteger(parsedUserId) || !isPositiveInteger(parsedFriendId)) {
      return res.status(400).json({
        error: 'user_id and friend_id must be positive integers'
      });
    }

    if (parsedUserId === parsedFriendId) {
      return res.status(400).json({
        error: 'You cannot add yourself as a friend'
      });
    }

    const requesterExists = await userExists(parsedUserId);
    const friendExists = await userExists(parsedFriendId);

    if (!requesterExists || !friendExists) {
      return res.status(404).json({
        error: 'One or both users were not found'
      });
    }

    // check if this exact friendship row already exists
    const [existingRows] = await db.execute(
      `SELECT friendship_id, status
       FROM friendships
       WHERE user_id = ? AND friend_id = ?`,
      [parsedUserId, parsedFriendId]
    );

    if (existingRows.length > 0) {
      return res.status(400).json({
        error: `Friend request already exists with status: ${existingRows[0].status}`
      });
    }

    // if the other person already sent a pending request, accept it
    const [reverseRows] = await db.execute(
      `SELECT friendship_id, status
       FROM friendships
       WHERE user_id = ? AND friend_id = ?`,
      [parsedFriendId, parsedUserId]
    );

    if (reverseRows.length > 0) {
      const reverseFriendship = reverseRows[0];

      if (reverseFriendship.status === 'pending') {
        await db.execute(
          `UPDATE friendships
           SET status = 'accepted'
           WHERE friendship_id = ?`,
          [reverseFriendship.friendship_id]
        );

        return res.json({
          message: 'Friend request accepted successfully'
        });
      }

      return res.status(400).json({
        error: `Friendship already exists with status: ${reverseFriendship.status}`
      });
    }

    // otherwise create a new pending request
    const [insertResult] = await db.execute(
      `INSERT INTO friendships (user_id, friend_id, status)
       VALUES (?, ?, 'pending')`,
      [parsedUserId, parsedFriendId]
    );

    return res.status(201).json({
      message: 'Friend request sent successfully',
      data: {
        friendship_id: insertResult.insertId,
        user_id: parsedUserId,
        friend_id: parsedFriendId,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('POST /api/social/friends/add error:', error);
    return res.status(500).json({
      error: 'Failed to send friend request'
    });
  }
});

// GET /api/social/friends/:userId
router.get('/friends/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!isPositiveInteger(userId)) {
      return res.status(400).json({
        error: 'userId must be a positive integer'
      });
    }

    const [rows] = await db.execute(
      `SELECT
          f.friendship_id,
          f.status,
          f.created_at,
          u.user_id,
          u.username,
          u.display_name,
          u.email,
          u.avatar_url,
          u.university,
          u.major
       FROM friendships f
       JOIN users u
         ON u.user_id = CASE
              WHEN f.user_id = ? THEN f.friend_id
              ELSE f.user_id
            END
       WHERE f.status = 'accepted'
         AND (f.user_id = ? OR f.friend_id = ?)
       ORDER BY u.display_name, u.username`,
      [userId, userId, userId]
    );

    return res.json({
      message: 'Friends retrieved successfully',
      data: rows
    });
  } catch (error) {
    console.error('GET /api/social/friends/:userId error:', error);
    return res.status(500).json({
      error: 'Failed to fetch friends list'
    });
  }
});

// GET /api/social/leaderboard/friends/:userId
router.get('/leaderboard/friends/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!isPositiveInteger(userId)) {
      return res.status(400).json({
        error: 'userId must be a positive integer'
      });
    }

    const friendIds = await getAcceptedFriendIds(userId);

    // include the user too so they can see themselves on the list
    const leaderboardIds = [userId, ...friendIds];

    if (leaderboardIds.length === 0) {
      return res.json({
        message: 'Friends leaderboard retrieved successfully',
        data: []
      });
    }

    const placeholders = leaderboardIds.map(() => '?').join(',');

    const [rows] = await db.execute(
      `SELECT
          u.user_id,
          u.username,
          u.display_name,
          u.avatar_url,
          COALESCE(s.current_streak, 0) AS current_streak,
          COALESCE(s.longest_streak, 0) AS longest_streak
       FROM users u
       LEFT JOIN streaks s ON u.user_id = s.user_id
       WHERE u.user_id IN (${placeholders})
       ORDER BY current_streak DESC, longest_streak DESC, u.username ASC`,
      leaderboardIds
    );

    return res.json({
      message: 'Friends leaderboard retrieved successfully',
      data: rows
    });
  } catch (error) {
    console.error('GET /api/social/leaderboard/friends/:userId error:', error);
    return res.status(500).json({
      error: 'Failed to fetch friends leaderboard'
    });
  }
});

// GET /api/social/leaderboard/global
router.get('/leaderboard/global', async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 25;

    if (!Number.isInteger(limit) || limit <= 0) {
      return res.status(400).json({
        error: 'limit must be a positive integer'
      });
    }
    
    // cap the limit so nobody requests some huge number
const safeLimit = Math.min(limit, 100);

const [rows] = await db.query(
  `SELECT
      u.user_id,
      u.username,
      u.display_name,
      u.avatar_url,
      u.university,
      u.major,
      COALESCE(s.current_streak, 0) AS current_streak,
      COALESCE(s.longest_streak, 0) AS longest_streak
   FROM users u
   LEFT JOIN streaks s ON u.user_id = s.user_id
   WHERE u.is_active = TRUE
   ORDER BY current_streak DESC, longest_streak DESC, u.username ASC
   LIMIT ${safeLimit}`
);
    
    return res.json({
      message: 'Global leaderboard retrieved successfully',
      data: rows
    });
  } catch (error) {
    console.error('GET /api/social/leaderboard/global error:', error);
    return res.status(500).json({
      error: 'Failed to fetch global leaderboard'
    });
  }
});

// GET /api/social/leaderboard/community/:type/:id
router.get('/leaderboard/community/:type/:id', async (req, res) => {
  try {
    const { type } = req.params;
    const communityId = Number(req.params.id);

    if (!isValidCommunityType(type)) {
      return res.status(400).json({
        error: 'type must be university, major, club, or custom'
      });
    }

    if (!isPositiveInteger(communityId)) {
      return res.status(400).json({
        error: 'id must be a positive integer'
      });
    }

    const [communityRows] = await db.execute(
      `SELECT community_id, name, community_type
       FROM communities
       WHERE community_id = ? AND community_type = ?`,
      [communityId, type]
    );

    if (communityRows.length === 0) {
      return res.status(404).json({
        error: 'Community not found for this type'
      });
    }

    const community = communityRows[0];

    const [rows] = await db.execute(
      `SELECT
          u.user_id,
          u.username,
          u.display_name,
          u.avatar_url,
          COALESCE(s.current_streak, 0) AS current_streak,
          COALESCE(s.longest_streak, 0) AS longest_streak,
          cm.joined_at
       FROM community_members cm
       JOIN users u ON cm.user_id = u.user_id
       LEFT JOIN streaks s ON u.user_id = s.user_id
       WHERE cm.community_id = ?
       ORDER BY current_streak DESC, longest_streak DESC, u.username ASC`,
      [communityId]
    );

    return res.json({
      message: 'Community leaderboard retrieved successfully',
      data: {
        community,
        members: rows
      }
    });
  } catch (error) {
    console.error('GET /api/social/leaderboard/community/:type/:id error:', error);
    return res.status(500).json({
      error: 'Failed to fetch community leaderboard'
    });
  }
});

// GET /api/social/activity/:userId
router.get('/activity/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    if (!isPositiveInteger(userId)) {
      return res.status(400).json({
        error: 'userId must be a positive integer'
      });
    }

    if (!Number.isInteger(limit) || limit <= 0) {
      return res.status(400).json({
        error: 'limit must be a positive integer'
      });
    }

    const friendIds = await getAcceptedFriendIds(userId);
    const feedIds = [userId, ...friendIds];

    if (feedIds.length === 0) {
      return res.json({
        message: 'Activity feed retrieved successfully',
        data: []
      });
    }

    const placeholders = feedIds.map(() => '?').join(',');

    // cap the limit so the feed request stays reasonable
const safeLimit = Math.min(limit, 100);

const [rows] = await db.query(
  `SELECT
      a.activity_id,
      a.user_id,
      a.activity_type,
      a.content,
      a.metadata,
      a.created_at,
      u.username,
      u.display_name,
      u.avatar_url
   FROM activity_feed a
   JOIN users u ON a.user_id = u.user_id
   WHERE a.user_id IN (${placeholders})
   ORDER BY a.created_at DESC
   LIMIT ${safeLimit}`,
  feedIds
);
    return res.json({
      message: 'Activity feed retrieved successfully',
      data: rows
    });
  } catch (error) {
    console.error('GET /api/social/activity/:userId error:', error);
    return res.status(500).json({
      error: 'Failed to fetch activity feed'
    });
  }
});

// POST /api/social/activity
router.post('/activity', async (req, res) => {
  try {
    const { user_id, activity_type, content, metadata } = req.body;

    if (user_id === undefined || !activity_type || !content) {
      return res.status(400).json({
        error: 'user_id, activity_type, and content are required'
      });
    }

    const parsedUserId = Number(user_id);
    const allowedTypes = ['study_session', 'achievement', 'streak_milestone', 'goal_completed'];

    if (!isPositiveInteger(parsedUserId)) {
      return res.status(400).json({
        error: 'user_id must be a positive integer'
      });
    }

    if (!allowedTypes.includes(activity_type)) {
      return res.status(400).json({
        error: 'Invalid activity_type'
      });
    }

    const exists = await userExists(parsedUserId);

    if (!exists) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const [insertResult] = await db.execute(
      `INSERT INTO activity_feed (user_id, activity_type, content, metadata)
       VALUES (?, ?, ?, ?)`,
      [
        parsedUserId,
        activity_type,
        content,
        metadata ? JSON.stringify(metadata) : null
      ]
    );

    return res.status(201).json({
      message: 'Activity created successfully',
      data: {
        activity_id: insertResult.insertId,
        user_id: parsedUserId,
        activity_type,
        content,
        metadata: metadata || null
      }
    });
  } catch (error) {
    console.error('POST /api/social/activity error:', error);
    return res.status(500).json({
      error: 'Failed to create activity'
    });
  }
});

module.exports = router;