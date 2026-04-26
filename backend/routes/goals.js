const express = require('express');
const router = express.Router();
const db = require('../config/database');

function calculateGoalValues(creditHours, difficultyLevel, studyDays) {
  const weeklyHours = difficultyLevel === 'hard'
    ? creditHours * 3
    : creditHours * 2;

  const hoursPerDay = weeklyHours / studyDays.length;

  return {
    weekly_hours: weeklyHours,
    hours_per_day: Number(hoursPerDay.toFixed(2))
  };
}

// POST /api/goals
router.post('/', async (req, res) => {
  try {
    const { user_id, credit_hours, difficulty_level, study_days } = req.body;

    if (!user_id || !credit_hours || !difficulty_level || !study_days) {
      return res.status(400).json({
        error: 'user_id, credit_hours, difficulty_level, and study_days are required'
      });
    }

    if (difficulty_level !== 'normal' && difficulty_level !== 'hard') {
      return res.status(400).json({
        error: 'difficulty_level must be "normal" or "hard"'
      });
    }

    if (!Array.isArray(study_days) || study_days.length === 0) {
      return res.status(400).json({
        error: 'study_days must be a non-empty array'
      });
    }

    const creditHoursNum = Number(credit_hours);

    if (Number.isNaN(creditHoursNum) || creditHoursNum <= 0) {
      return res.status(400).json({
        error: 'credit_hours must be a positive number'
      });
    }

    const { weekly_hours, hours_per_day } = calculateGoalValues(
      creditHoursNum,
      difficulty_level,
      study_days
    );

    // ✅ REQUIRED FIX: add start_date
    const start_date = new Date().toISOString().split('T')[0];

    const [result] = await db.execute(
      `
      INSERT INTO goals
      (user_id, credit_hours, difficulty_level, weekly_hours, study_days, hours_per_day, start_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user_id,
        creditHoursNum,
        difficulty_level,
        weekly_hours,
        JSON.stringify(study_days),
        hours_per_day,
        start_date
      ]
    );

    const [rows] = await db.execute(
      `SELECT * FROM goals WHERE goal_id = ?`,
      [result.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/goals/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.execute(
      `SELECT * FROM goals WHERE user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No goals found for this user' });
    }

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/goals/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { credit_hours, difficulty_level, study_days } = req.body;

    const [existingRows] = await db.execute(
      `SELECT * FROM goals WHERE goal_id = ?`,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const existingGoal = existingRows[0];

    const updatedCreditHours =
      credit_hours !== undefined ? Number(credit_hours) : Number(existingGoal.credit_hours);

    const updatedDifficultyLevel =
      difficulty_level !== undefined ? difficulty_level : existingGoal.difficulty_level;

const updatedStudyDays =
  study_days !== undefined
    ? study_days
    : Array.isArray(existingGoal.study_days)
      ? existingGoal.study_days
      : typeof existingGoal.study_days === 'string'
        ? existingGoal.study_days.includes('[')
          ? JSON.parse(existingGoal.study_days)
          : existingGoal.study_days.split(',')
        : [];

    if (updatedDifficultyLevel !== 'normal' && updatedDifficultyLevel !== 'hard') {
      return res.status(400).json({
        error: 'difficulty_level must be "normal" or "hard"'
      });
    }

    if (!Array.isArray(updatedStudyDays) || updatedStudyDays.length === 0) {
      return res.status(400).json({
        error: 'study_days must be a non-empty array'
      });
    }

    if (Number.isNaN(updatedCreditHours) || updatedCreditHours <= 0) {
      return res.status(400).json({
        error: 'credit_hours must be a positive number'
      });
    }

    const { weekly_hours, hours_per_day } = calculateGoalValues(
      updatedCreditHours,
      updatedDifficultyLevel,
      updatedStudyDays
    );

    await db.execute(
      `
      UPDATE goals
      SET credit_hours = ?, difficulty_level = ?, weekly_hours = ?, study_days = ?, hours_per_day = ?
      WHERE goal_id = ?
      `,
      [
        updatedCreditHours,
        updatedDifficultyLevel,
        weekly_hours,
        JSON.stringify(updatedStudyDays),
        hours_per_day,
        id
      ]
    );

    const [updatedRows] = await db.execute(
      `SELECT * FROM goals WHERE goal_id = ?`,
      [id]
    );

    return res.json(updatedRows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /api/goals/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [existingRows] = await db.execute(
      `SELECT * FROM goals WHERE goal_id = ?`,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await db.execute(
      `DELETE FROM goals WHERE goal_id = ?`,
      [id]
    );

    return res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
