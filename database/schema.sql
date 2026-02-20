-- Academic Weapon Challenge Database Schema

CREATE DATABASE IF NOT EXISTS academic_weapon;
USE academic_weapon;

-- Users table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(255),
    university VARCHAR(100),
    major VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Goals table
CREATE TABLE goals (
    goal_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    credit_hours INT NOT NULL,
    difficulty_level ENUM('normal', 'hard') NOT NULL,
    weekly_hours DECIMAL(5,2) NOT NULL,
    study_days JSON NOT NULL, -- Array of days: ["Monday", "Wednesday", "Friday"]
    hours_per_day DECIMAL(5,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_active (user_id, is_active)
);

-- Study sessions table
CREATE TABLE study_sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    goal_id INT,
    session_date DATE NOT NULL,
    duration_minutes INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (goal_id) REFERENCES goals(goal_id) ON DELETE SET NULL,
    INDEX idx_user_date (user_id, session_date),
    INDEX idx_session_date (session_date)
);

-- Streaks table
CREATE TABLE streaks (
    streak_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_study_date DATE,
    streak_start_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_streak (user_id)
);

-- Achievements table
CREATE TABLE achievements (
    achievement_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    achievement_type ENUM('streak', 'hours', 'grade', 'milestone') NOT NULL,
    requirement_value INT, -- e.g., 5 for "5 day streak"
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User achievements table (linking users to achievements they've earned)
CREATE TABLE user_achievements (
    user_achievement_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(achievement_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_achievement (user_id, achievement_id),
    INDEX idx_user_earned (user_id, earned_at)
);

-- Friendships table
CREATE TABLE friendships (
    friendship_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_friendship (user_id, friend_id),
    INDEX idx_user_status (user_id, status),
    INDEX idx_friend_status (friend_id, status)
);

-- Communities table
CREATE TABLE communities (
    community_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    community_type ENUM('university', 'major', 'club', 'custom') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_type (community_type)
);

-- Community members table
CREATE TABLE community_members (
    membership_id INT PRIMARY KEY AUTO_INCREMENT,
    community_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (community_id) REFERENCES communities(community_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_membership (community_id, user_id),
    INDEX idx_community (community_id),
    INDEX idx_user (user_id)
);

-- Activity feed table
CREATE TABLE activity_feed (
    activity_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    activity_type ENUM('study_session', 'achievement', 'streak_milestone', 'goal_completed') NOT NULL,
    content TEXT,
    metadata JSON, -- Additional data like achievement details, session duration, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_created (created_at)
);

-- Notifications table
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    notification_type ENUM('morning_reminder', 'evening_checkin', 'streak_warning', 'friend_achievement', 'friend_request') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_user_created (user_id, created_at)
);

-- Insert default achievements
INSERT INTO achievements (name, description, achievement_type, requirement_value, points) VALUES
('First Step', 'Complete your first study session', 'milestone', 1, 10),
('5 Day Warrior', 'Maintain a 5 day study streak', 'streak', 5, 25),
('Study Marathon', 'Study over 30 hours in a single week', 'hours', 30, 50),
('Consistent Scholar', 'Maintain a 30 day study streak', 'streak', 30, 100),
('Academic Weapon', 'Maintain a 100 day study streak', 'streak', 100, 500),
('Night Owl', 'Complete 10 late night study sessions', 'milestone', 10, 25),
('Early Bird', 'Complete 10 morning study sessions', 'milestone', 10, 25),
('Goal Crusher', 'Achieve your weekly goal 4 weeks in a row', 'milestone', 4, 75),
('Social Butterfly', 'Connect with 10 friends', 'milestone', 10, 20),
('Top of the Class', 'Reach #1 on any leaderboard', 'milestone', 1, 150);
