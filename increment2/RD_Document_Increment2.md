# Software Requirements and Design Document
Group 8 | Version 2.0 | Authors: Hailie Tucker, Emma Berry, Caitlin O'Donnell, Joseph Daniele

---

## Overview

Trajectory is a mobile application meant to bridge the gap between academic growth and social accountability. It functions by allowing users to set study goals, log sessions, and track progress over time using a structured timer system. Unlike apps that focus purely on passive habit tracking, Trajectory incorporates gamification elements — users can unlock achievements, earn badges, and compete on leaderboards with friends. The interface follows a consistent dark-theme visual language throughout and is designed to be as simple and intuitive as possible.

This version reflects the completed frontend implementation across all screens, an updated navigation architecture, and a refined set of requirements based on development progress in Increment 2.

---

## Functional Requirements

1. **User Registration** (High Priority) — the system shall allow a new user to create an account by providing a username, email, password, university, and major. All fields are required; email format and password length (minimum 8 characters) are validated.
2. **User Login** (High Priority) — the system shall allow a registered user to log in with their email and password, with descriptive error messages for missing or invalid input.
3. **Goal Setting** (High Priority) — the system shall allow users to create and track academic goals with a title, description, deadline, and priority level.
4. **Timer System** (High Priority) — a Pomodoro-style timer with a default 25-minute work interval and 5-minute break, with start, pause, and reset controls.
5. **Study Session Logging** (High Priority) — users shall be able to manually log study sessions with subject, duration, and optional notes.
6. **Achievement System** (Medium Priority) — tracks milestones and awards badges; displays earned and locked badges with progress indicators.
7. **Community Feed** (Medium Priority) — users shall be able to view, create, like, and comment on posts in a shared community feed.
8. **Social / Friends** (Medium Priority) — friend connections and activity feeds to increase accountability between users.
9. **Profile** (Medium Priority) — displays username, university, major, study stats, streak, and earned badges.
10. **Leaderboards** (Low Priority) — ranks friends by study hours or streak; increases interactivity but is not essential to core functionality.

---

## Non-Functional Requirements

- **Usability:** Interface must be intuitive and operable without a manual; all core actions reachable within two taps. Color contrast must meet WCAG AA standards.
- **Portability:** Application must run on iOS 14+ and Android 10+.
- **Reliability:** The timer must always work correctly and accurately, including offline. The app shall not crash during normal navigation flows.
- **Security:** Passwords shall never be stored or transmitted in plaintext; authentication tokens shall be stored securely on-device.
- **Visual Consistency:** Maintain a consistent dark brand theme (`#000814` background, `#FFC300` accent, Aldrich + Space Grotesk typography) across all screens.
- **Performance:** App shall load and reach the main screen within 3 seconds on a standard device with a stable connection.

---

## Use Case Diagram

> [Insert Use Case Diagram here]

The diagram includes the following use cases: Register Account, Log In, Set Goal, Log Study Session, Run Pomodoro Timer, View Achievements, Add Friend, View Community Feed, Create Post, Like/Comment on Post, View Profile, Edit Profile. All use cases except Register and Log In include Log In as a dependency.

### Textual Use Case Descriptions

**UC-01: Register Account** — Actor: unregistered user. User enters username, email, password, university, and major. System validates all fields and navigates to the main app on success; displays field-specific errors on failure.

**UC-02: Log In** — Actor: registered user. User enters email and password. System validates credentials and navigates to the main app; displays an error on failure.

**UC-03: Set Goal** — Actor: authenticated student. User enters a goal title, description, target date, and priority. System saves and displays the goal in the active goals list.

**UC-04: Log Study Session** — Actor: authenticated student. User enters subject, duration, and optional notes and submits. System saves the session and updates the user's total study hours.

**UC-05: Run Pomodoro Timer** — Actor: authenticated student. User taps Start; timer counts down from 25 minutes. On completion, system notifies the user and begins the 5-minute break. User can pause or reset at any time.

**UC-06: View Achievements** — Actor: authenticated student. System displays all badges; earned badges are highlighted and locked badges show progress toward earning them.

**UC-07: Add Friend** — Actor: authenticated student. User searches by username and sends a friend request. On acceptance, both users are added to each other's friends list.

**UC-08: View Community Feed** — Actor: authenticated student. System loads and displays recent community posts for the user to scroll through.

**UC-09: Create Post** — Actor: authenticated student. User enters post content and submits; system displays the post on the community feed.

**UC-10: Like / Comment on Post** — Actor: authenticated student. User taps the like icon to increment the like count, or taps the comment icon to submit a text comment.

**UC-11: View Profile** — Actor: authenticated student. System displays the user's username, university, major, study stats, streak, and earned badges.

**UC-12: Edit Profile** — Actor: authenticated student. User modifies bio, university, or major and saves; system updates the profile display.

---

## Class Diagram and/or Sequence Diagrams

> [Insert Class Diagram and Sequence Diagrams here]

The project uses an object-oriented paradigm. The class diagram covers the full system with the following core classes: **User** (userId, username, email, passwordHash, university, major; methods: login, register, updateProfile), **StudySession** (sessionId, userId, subject, durationMinutes, notes), **Goal** (goalId, userId, title, description, targetDate, priority, isCompleted), **Achievement** (achievementId, title, criteria, isEarned, progress), **Post** (postId, userId, content, likeCount), **Comment** (commentId, postId, userId, content), **PomodoroSession** (workDuration, breakDuration, completedCycles), and **Friend** (userId, friendId, status).

Sequence diagrams are provided for the three most important use cases: User Registration, Log Study Session, and Run Pomodoro Timer.

---

## Operating Environment

- **Platforms:** iOS 14+ and Android 10+
- **Development Environment:** Local development using Expo Go on physical devices and simulators; Metro bundler for JavaScript bundling
- **Version Control:** GitHub — `master` branch (production-stable), `development` branch (active work), feature sub-branches for specific tasks
- **Coexistence:** Must work alongside standard mobile background processes; notification support required for Pomodoro timer alerts

---

## Assumptions and Dependencies

- **Assumptions:** Users will have a mobile device running iOS 14+ or Android 10+. Backend integration will align with the completed frontend once implemented in Increment 3.
- **Dependencies:** GitHub/git (version control); React Native and Expo SDK (UI framework and build tooling); React Navigation (screen routing between Home, Log, Start, Friends, and Badges tabs); Expo Font with Aldrich and Space Grotesk (typography); Node.js and Express.js (planned backend); MySQL (planned database); EAS Build (planned production build service).
