const db = require('../config/database');

async function unlockAchievement(user_id, achievement_id) {
  const [existing] = await db.execute(
    `
    SELECT * FROM user_achievements
    WHERE user_id = ? AND achievement_id = ?
    `,
    [user_id, achievement_id]
  );

  if (existing.length > 0) {
    return false;
  }

  await db.execute(
    `
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (?, ?)
    `,
    [user_id, achievement_id]
  );

  return true;
}

async function checkAndUnlockAchievements(user_id) {
  try {
    // First Step: first study session
    const [sessionRows] = await db.execute(
      `
      SELECT COUNT(*) AS session_count
      FROM study_sessions
      WHERE user_id = ?
      `,
      [user_id]
    );

    const sessionCount = Number(sessionRows[0].session_count || 0);

    if (sessionCount >= 1) {
      await unlockAchievement(user_id, 1);
    }

    // streak-based achievements
    const [streakRows] = await db.execute(
      `
      SELECT current_streak
      FROM streaks
      WHERE user_id = ?
      LIMIT 1
      `,
      [user_id]
    );

    if (streakRows.length > 0) {
      const currentStreak = Number(streakRows[0].current_streak || 0);

      if (currentStreak >= 5) {
        await unlockAchievement(user_id, 2); // 5 Day Warrior
      }

      if (currentStreak >= 30) {
        await unlockAchievement(user_id, 4); // Consistent Scholar
      }

      if (currentStreak >= 100) {
        await unlockAchievement(user_id, 5); // Academic Weapon
      }
    }

    // hours-based achievement: Study Marathon (30+ hours in current week)
    const [hourRows] = await db.execute(
      `
      SELECT COALESCE(SUM(duration_minutes), 0) AS total_minutes
      FROM study_sessions
      WHERE user_id = ?
        AND YEARWEEK(session_date, 1) = YEARWEEK(CURDATE(), 1)
      `,
      [user_id]
    );

    const totalMinutes = Number(hourRows[0].total_minutes || 0);
    const totalHours = totalMinutes / 60;

    if (totalHours >= 30) {
      await unlockAchievement(user_id, 3); // Study Marathon
    }

  } catch (error) {
    console.error('Achievement check error:', error.message);
  }
}

module.exports = {
  checkAndUnlockAchievements
};