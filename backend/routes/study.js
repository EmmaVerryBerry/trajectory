const express = require('express');
const router = express.Router();
const db = require('../config/database');

// simple check for ids/minutes
function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

// checks date format like 2026-04-12
function isValidDateString(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

// gets the monday-sunday range for the current week
function getWeekBounds(date = new Date()) {
  const current = new Date(date);
  const day = current.getDay(); // 0 = sunday
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const start = new Date(current);
  start.setDate(current.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10)
  };
}

// updates or creates the user's streak row
async function updateUserStreak(userId, sessionDate) {
  const [rows] = await db.execute(
    `SELECT streak_id, current_streak, longest_streak, last_study_date, streak_start_date
     FROM streaks
     WHERE user_id = ?`,
    [userId]
  );

  // if user does not have a streak row yet, make one
  if (rows.length === 0) {
    await db.execute(
      `INSERT INTO streaks (user_id, current_streak, longest_streak, last_study_date, streak_start_date)
       VALUES (?, 1, 1, ?, ?)`,
      [userId, sessionDate, sessionDate]
    );

    return {
      current_streak: 1,
      longest_streak: 1,
      last_study_date: sessionDate,
      streak_start_date: sessionDate
    };
  }

  const streak = rows[0];

  // if row exists but last_study_date is null, start fresh
  if (!streak.last_study_date) {
    await db.execute(
      `UPDATE streaks
       SET current_streak = 1,
           longest_streak = GREATEST(longest_streak, 1),
           last_study_date = ?,
           streak_start_date = ?
       WHERE user_id = ?`,
      [sessionDate, sessionDate, userId]
    );

    return {
      current_streak: 1,
      longest_streak: Math.max(streak.longest_streak || 0, 1),
      last_study_date: sessionDate,
      streak_start_date: sessionDate
    };
  }

  const lastDate = new Date(streak.last_study_date);
  const newDate = new Date(sessionDate);

  lastDate.setHours(0, 0, 0, 0);
  newDate.setHours(0, 0, 0, 0);

  const diffMs = newDate - lastDate;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  let newCurrentStreak = streak.current_streak || 0;
  let newLongestStreak = streak.longest_streak || 0;
  let newStartDate = streak.streak_start_date;

  // if they already logged for this day or gave an older date, do not change streak
  if (diffDays <= 0) {
    return {
      current_streak: newCurrentStreak,
      longest_streak: newLongestStreak,
      last_study_date: streak.last_study_date,
      streak_start_date: newStartDate
    };
  }

  // next day keeps the streak going
  if (diffDays === 1) {
    newCurrentStreak += 1;
  } else {
    // gap bigger than a day resets the streak
    newCurrentStreak = 1;
    newStartDate = sessionDate;
  }

  if (newCurrentStreak > newLongestStreak) {
    newLongestStreak = newCurrentStreak;
  }

  await db.execute(
    `UPDATE streaks
     SET current_streak = ?,
         longest_streak = ?,
         last_study_date = ?,
         streak_start_date = ?
     WHERE user_id = ?`,
    [newCurrentStreak, newLongestStreak, sessionDate, newStartDate, userId]
  );

  return {
    current_streak: newCurrentStreak,
    longest_streak: newLongestStreak,
    last_study_date: sessionDate,
    streak_start_date: newStartDate
  };
}

// helper for activity feed posts
async function createActivity(userId, activityType, content, metadata = null) {
  await db.execute(
    `INSERT INTO activity_feed (user_id, activity_type, content, metadata)
     VALUES (?, ?, ?, ?)`,
    [userId, activityType, content, metadata ? JSON.stringify(metadata) : null]
  );
}

// POST /api/study/sessions
router.post('/sessions', async (req, res) => {
  try {
    const { user_id, session_date, duration_minutes, notes, goal_id } = req.body;

    // make sure required fields are there
    if (
      user_id === undefined ||
      session_date === undefined ||
      duration_minutes === undefined
    ) {
      return res.status(400).json({
        error: 'user_id, session_date, and duration_minutes are required'
      });
    }

    const parsedUserId = Number(user_id);
    const parsedDuration = Number(duration_minutes);
    const parsedGoalId =
      goal_id === undefined || goal_id === null || goal_id === ''
        ? null
        : Number(goal_id);

    // validate user id
    if (!isPositiveInteger(parsedUserId)) {
      return res.status(400).json({
        error: 'user_id must be a positive integer'
      });
    }

    // validate duration
    if (!isPositiveInteger(parsedDuration)) {
      return res.status(400).json({
        error: 'duration_minutes must be a positive integer'
      });
    }

    // validate date format
    if (!isValidDateString(session_date)) {
      return res.status(400).json({
        error: 'session_date must be YYYY-MM-DD'
      });
    }

    // validate goal id only if one was sent
    if (parsedGoalId !== null && !isPositiveInteger(parsedGoalId)) {
      return res.status(400).json({
        error: 'goal_id must be a positive integer if provided'
      });
    }

    // make sure user exists
    const [userRows] = await db.execute(
      `SELECT user_id FROM users WHERE user_id = ?`,
      [parsedUserId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // if they sent a goal_id, make sure it belongs to this user
    if (parsedGoalId !== null) {
      const [goalCheckRows] = await db.execute(
        `SELECT goal_id
         FROM goals
         WHERE goal_id = ? AND user_id = ?`,
        [parsedGoalId, parsedUserId]
      );

      if (goalCheckRows.length === 0) {
        return res.status(404).json({
          error: 'Goal not found for this user'
        });
      }
    }

    // save the study session
    const [insertResult] = await db.execute(
      `INSERT INTO study_sessions (user_id, goal_id, session_date, duration_minutes, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [parsedUserId, parsedGoalId, session_date, parsedDuration, notes || null]
    );

    // update streak after session is saved
    const streak = await updateUserStreak(parsedUserId, session_date);

    // create feed post for study session
    await createActivity(
      parsedUserId,
      'study_session',
      `Completed a ${parsedDuration}-minute study session`,
      {
        session_id: insertResult.insertId,
        session_date,
        duration_minutes: parsedDuration
      }
    );

    // make a streak post every 5 days
    if (streak.current_streak > 0 && streak.current_streak % 5 === 0) {
      await createActivity(
        parsedUserId,
        'streak_milestone',
        `Reached a ${streak.current_streak}-day study streak`,
        {
          current_streak: streak.current_streak,
          longest_streak: streak.longest_streak
        }
      );
    }

    // check weekly progress against active goal
    const { start, end } = getWeekBounds(new Date(session_date));

    const [goalRows] = await db.execute(
      `SELECT goal_id, weekly_hours
       FROM goals
       WHERE user_id = ? AND is_active = TRUE
       ORDER BY created_at DESC
       LIMIT 1`,
      [parsedUserId]
    );

    let progress = null;

    if (goalRows.length > 0) {
      const activeGoal = goalRows[0];

      const [progressRows] = await db.execute(
        `SELECT COALESCE(SUM(duration_minutes), 0) AS total_minutes
         FROM study_sessions
         WHERE user_id = ?
           AND session_date BETWEEN ? AND ?`,
        [parsedUserId, start, end]
      );

      const totalMinutes = Number(progressRows[0].total_minutes || 0);
      const completedHours = totalMinutes / 60;
      const weeklyGoalHours = Number(activeGoal.weekly_hours || 0);
      const percentComplete =
        weeklyGoalHours > 0 ? (completedHours / weeklyGoalHours) * 100 : 0;

      progress = {
        week_start: start,
        week_end: end,
        weekly_goal_hours: weeklyGoalHours,
        completed_hours: Number(completedHours.toFixed(2)),
        remaining_hours: Number(Math.max(weeklyGoalHours - completedHours, 0).toFixed(2)),
        percent_complete: Number(Math.min(percentComplete, 100).toFixed(2))
      };

      // if weekly goal is met, add a goal completed activity post
      if (weeklyGoalHours > 0 && completedHours >= weeklyGoalHours) {
        await createActivity(
          parsedUserId,
          'goal_completed',
          'Completed weekly study goal',
          {
            week_start: start,
            week_end: end,
            weekly_goal_hours: weeklyGoalHours,
            completed_hours: Number(completedHours.toFixed(2))
          }
        );
      }
    }

    return res.status(201).json({
      message: 'Study session logged successfully',
      data: {
        session_id: insertResult.insertId,
        user_id: parsedUserId,
        goal_id: parsedGoalId,
        session_date,
        duration_minutes: parsedDuration,
        notes: notes || null,
        streak,
        progress
      }
    });
  } catch (error) {
    console.error('POST /api/study/sessions error:', error);
    return res.status(500).json({
      error: 'Failed to log study session'
    });
  }
});

// GET /api/study/sessions/:userId
router.get('/sessions/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const { start_date, end_date } = req.query;

    if (!isPositiveInteger(userId)) {
      return res.status(400).json({
        error: 'userId must be a positive integer'
      });
    }

    let query = `
      SELECT session_id, user_id, goal_id, session_date, duration_minutes, notes, created_at
      FROM study_sessions
      WHERE user_id = ?
    `;
    const params = [userId];

    // optional date filtering
    if (start_date) {
      if (!isValidDateString(start_date)) {
        return res.status(400).json({
          error: 'start_date must be YYYY-MM-DD'
        });
      }
      query += ' AND session_date >= ?';
      params.push(start_date);
    }

    if (end_date) {
      if (!isValidDateString(end_date)) {
        return res.status(400).json({
          error: 'end_date must be YYYY-MM-DD'
        });
      }
      query += ' AND session_date <= ?';
      params.push(end_date);
    }

    query += ' ORDER BY session_date DESC, created_at DESC';

    const [rows] = await db.execute(query, params);

    return res.json({
      message: 'Study sessions retrieved successfully',
      data: rows
    });
  } catch (error) {
    console.error('GET /api/study/sessions/:userId error:', error);
    return res.status(500).json({
      error: 'Failed to fetch study sessions'
    });
  }
});

// GET /api/study/progress/:userId
router.get('/progress/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!isPositiveInteger(userId)) {
      return res.status(400).json({
        error: 'userId must be a positive integer'
      });
    }

    // get current week range
    const { start, end } = getWeekBounds();

    // grab the user's active goal
    const [goalRows] = await db.execute(
      `SELECT goal_id, weekly_hours, credit_hours, difficulty_level, study_days, hours_per_day
       FROM goals
       WHERE user_id = ? AND is_active = TRUE
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (goalRows.length === 0) {
      return res.status(404).json({
        error: 'No active goal found for this user'
      });
    }

    const goal = goalRows[0];

    // total study time for this week
    const [progressRows] = await db.execute(
      `SELECT COALESCE(SUM(duration_minutes), 0) AS total_minutes
       FROM study_sessions
       WHERE user_id = ?
         AND session_date BETWEEN ? AND ?`,
      [userId, start, end]
    );

    const totalMinutes = Number(progressRows[0].total_minutes || 0);
    const completedHours = totalMinutes / 60;
    const weeklyGoalHours = Number(goal.weekly_hours || 0);
    const remainingHours = Math.max(weeklyGoalHours - completedHours, 0);
    const percentComplete =
      weeklyGoalHours > 0 ? (completedHours / weeklyGoalHours) * 100 : 0;

    return res.json({
      message: 'Weekly progress retrieved successfully',
      data: {
        week_start: start,
        week_end: end,
        weekly_goal_hours: weeklyGoalHours,
        completed_hours: Number(completedHours.toFixed(2)),
        remaining_hours: Number(remainingHours.toFixed(2)),
        percent_complete: Number(Math.min(percentComplete, 100).toFixed(2)),
        total_minutes: totalMinutes,
        goal: {
          goal_id: goal.goal_id,
          credit_hours: goal.credit_hours,
          difficulty_level: goal.difficulty_level,
          study_days: goal.study_days,
          hours_per_day: Number(goal.hours_per_day)
        }
      }
    });
  } catch (error) {
    console.error('GET /api/study/progress/:userId error:', error);
    return res.status(500).json({
      error: 'Failed to fetch study progress'
    });
  }
});

// GET /api/study/streak/:userId
router.get('/streak/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!isPositiveInteger(userId)) {
      return res.status(400).json({
        error: 'userId must be a positive integer'
      });
    }

    const [rows] = await db.execute(
      `SELECT current_streak, longest_streak, last_study_date, streak_start_date, updated_at
       FROM streaks
       WHERE user_id = ?`,
      [userId]
    );

    // if there is no streak row yet, just return zeros
    if (rows.length === 0) {
      return res.json({
        message: 'Streak retrieved successfully',
        data: {
          current_streak: 0,
          longest_streak: 0,
          last_study_date: null,
          streak_start_date: null
        }
      });
    }

    return res.json({
      message: 'Streak retrieved successfully',
      data: rows[0]
    });
  } catch (error) {
    console.error('GET /api/study/streak/:userId error:', error);
    return res.status(500).json({
      error: 'Failed to fetch streak'
    });
  }
});

module.exports = router;