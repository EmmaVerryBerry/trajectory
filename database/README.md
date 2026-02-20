# Database Documentation

MySQL database schema for Academic Weapon Challenge.

## Setup

1. Ensure MySQL is installed and running

2. Create the database:
```bash
mysql -u root -p < schema.sql
```

Or manually:
```bash
mysql -u root -p
source schema.sql
```

## Database Structure

### Core Tables

#### users
Stores user account information, profile details, and authentication data.

**Key Fields:**
- `user_id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `password_hash` - Hashed password (bcrypt)
- `university`, `major` - For community grouping

#### goals
Tracks user study goals with calculated weekly and daily hours.

**Key Fields:**
- `credit_hours` - Number of credit hours enrolled
- `difficulty_level` - 'normal' (2hrs/credit) or 'hard' (3hrs/credit)
- `weekly_hours` - Calculated total weekly study hours
- `study_days` - JSON array of planned study days
- `hours_per_day` - Calculated hours needed per study day

**Calculation:**
```
weekly_hours = credit_hours * (2 for normal OR 3 for hard)
hours_per_day = weekly_hours / number of study_days
```

#### study_sessions
Logs individual study sessions with date and duration.

**Key Fields:**
- `session_date` - Date of study session
- `duration_minutes` - Length of session in minutes
- `notes` - Optional notes about the session

#### streaks
Tracks current and longest study streaks for each user.

**Key Fields:**
- `current_streak` - Current consecutive days
- `longest_streak` - All-time best streak
- `last_study_date` - Last recorded study date
- `streak_start_date` - When current streak started

**Logic:**
- Streak increases when user studies on scheduled day
- Resets to 0 if user misses a scheduled day
- Updates `longest_streak` when `current_streak` exceeds it

### Social Tables

#### friendships
Manages friend connections between users.

**Status Values:**
- `pending` - Friend request sent, awaiting response
- `accepted` - Friendship confirmed
- `declined` - Request declined

#### communities
Groups for universities, majors, clubs, and custom groups.

**Types:**
- `university` - School-based groups
- `major` - Department/major groups
- `club` - Student organizations
- `custom` - User-created groups

#### activity_feed
Public feed of user activities for friends to see.

**Activity Types:**
- `study_session` - Session completed
- `achievement` - Achievement unlocked
- `streak_milestone` - Streak milestone reached
- `goal_completed` - Weekly goal achieved

### Gamification Tables

#### achievements
Predefined achievements users can earn.

**Types:**
- `streak` - Based on consecutive study days
- `hours` - Based on total study time
- `grade` - Based on academic performance
- `milestone` - Special accomplishments

#### user_achievements
Links users to achievements they've earned.

### Notifications Table

#### notifications
Stores notifications for users.

**Types:**
- `morning_reminder` - Reminder on scheduled study day
- `evening_checkin` - Reminder to log study time
- `streak_warning` - Alert when streak is at risk
- `friend_achievement` - Friend earned achievement
- `friend_request` - New friend request

## Indexes

Optimized indexes for common queries:
- User lookups by username/email
- Study sessions by user and date
- Friendships by user and status
- Activity feed by user and date
- Achievements by user and earned date

## Default Data

The schema includes 10 default achievements:
1. First Step (1 session)
2. 5 Day Warrior (5 day streak)
3. Study Marathon (30+ hours/week)
4. Consistent Scholar (30 day streak)
5. Academic Weapon (100 day streak)
6. Night Owl (10 late sessions)
7. Early Bird (10 morning sessions)
8. Goal Crusher (4 week streak)
9. Social Butterfly (10 friends)
10. Top of the Class (#1 rank)

## Sample Queries

### Get user's current streak
```sql
SELECT current_streak, longest_streak
FROM streaks
WHERE user_id = ?;
```

### Get weekly study progress
```sql
SELECT SUM(duration_minutes) / 60 as total_hours
FROM study_sessions
WHERE user_id = ?
AND session_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY);
```

### Get friends leaderboard
```sql
SELECT u.username, s.current_streak
FROM users u
JOIN streaks s ON u.user_id = s.user_id
WHERE u.user_id IN (
    SELECT friend_id FROM friendships
    WHERE user_id = ? AND status = 'accepted'
)
ORDER BY s.current_streak DESC
LIMIT 10;
```

## Migration Notes

For future schema changes, create migration files in `database/migrations/` with the format:
```
YYYYMMDD_description.sql
```

Example: `20260218_add_pomodoro_settings.sql`
