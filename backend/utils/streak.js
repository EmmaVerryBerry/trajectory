const db = require('../config/database');

function normalizeStudyDays(studyDaysRaw) {
  if (Array.isArray(studyDaysRaw)) {
    return studyDaysRaw;
  }

  if (typeof studyDaysRaw === 'string') {
    if (studyDaysRaw.includes('[')) {
      return JSON.parse(studyDaysRaw);
    }
    return studyDaysRaw.split(',').map(day => day.trim());
  }

  return [];
}

function toDateString(date) {
  return date.toISOString().split('T')[0];
}

function dayNameFromDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function missedScheduledDayBetween(previousDate, currentDate, studyDays) {
  let checkDate = addDays(previousDate, 1);

  while (toDateString(checkDate) < toDateString(currentDate)) {
    const dayName = dayNameFromDate(checkDate);

    if (studyDays.includes(dayName)) {
      return true;
    }

    checkDate = addDays(checkDate, 1);
  }

  return false;
}

async function updateStreak(user_id) {
  try {
    const [goals] = await db.execute(
      `SELECT study_days FROM goals WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [user_id]
    );

    if (goals.length === 0) {
      return;
    }

    const studyDays = normalizeStudyDays(goals[0].study_days);

    const [sessions] = await db.execute(
      `SELECT session_date FROM study_sessions WHERE user_id = ? ORDER BY session_date DESC LIMIT 1`,
      [user_id]
    );

    if (sessions.length === 0) {
      return;
    }

    const latestSessionDate = new Date(sessions[0].session_date);
    const latestSessionDateString = toDateString(latestSessionDate);
    const latestSessionDayName = dayNameFromDate(latestSessionDate);

    // only count streaks for scheduled study days
    if (!studyDays.includes(latestSessionDayName)) {
      return;
    }

    const [streakRows] = await db.execute(
      `SELECT * FROM streaks WHERE user_id = ?`,
      [user_id]
    );

    // first streak row for this user
    if (streakRows.length === 0) {
      await db.execute(
        `
        INSERT INTO streaks (user_id, current_streak, longest_streak, last_study_date, streak_start_date)
        VALUES (?, ?, ?, ?, ?)
        `,
        [user_id, 1, 1, latestSessionDateString, latestSessionDateString]
      );
      return;
    }

    const streak = streakRows[0];

    const previousLastStudyDate = streak.last_study_date
      ? new Date(streak.last_study_date)
      : null;

    // already counted this date
    if (
      previousLastStudyDate &&
      toDateString(previousLastStudyDate) === latestSessionDateString
    ) {
      return;
    }

    let currentStreak = streak.current_streak || 0;
    let longestStreak = streak.longest_streak || 0;
    let streakStartDate = streak.streak_start_date
      ? toDateString(new Date(streak.streak_start_date))
      : latestSessionDateString;

    if (!previousLastStudyDate) {
      currentStreak = 1;
      streakStartDate = latestSessionDateString;
    } else {
      const missedDay = missedScheduledDayBetween(
        previousLastStudyDate,
        latestSessionDate,
        studyDays
      );

      if (missedDay) {
        currentStreak = 1;
        streakStartDate = latestSessionDateString;
      } else {
        currentStreak += 1;
      }
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    await db.execute(
      `
      UPDATE streaks
      SET current_streak = ?, longest_streak = ?, last_study_date = ?, streak_start_date = ?
      WHERE user_id = ?
      `,
      [
        currentStreak,
        longestStreak,
        latestSessionDateString,
        streakStartDate,
        user_id
      ]
    );
  } catch (err) {
    console.error('Streak update error:', err.message);
  }
}

module.exports = { updateStreak };