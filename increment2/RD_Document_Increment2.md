# Software Requirements and Design Document
**Trajectory (Academic Weapon Challenge)**
For Group [X] — Version 2.0
Authors: Emma Berry, [Teammate 2], [Teammate 3], [Teammate 4]

---

## 1. Overview

Trajectory is a mobile application designed to help university students cultivate and sustain strong academic habits through structured productivity tools and social accountability. The system provides a centralized platform where students can log study sessions, define and track academic goals, use a Pomodoro-based focus timer, connect with fellow students, earn achievement badges for academic milestones, and engage with a community of peers.

The application targets the widespread challenge of academic self-discipline among college students. By combining personal productivity tracking with social motivation — leaderboards, a community feed, and friend connections — Trajectory transforms solitary studying into a shared, gamified experience. The system is built using React Native with Expo, enabling cross-platform deployment on iOS and Android from a single codebase.

---

## 2. Functional Requirements

### Authentication
- **FR-01** [High] The system shall allow a new user to create an account by providing a username, email address, password, university name, and academic major.
- **FR-02** [High] The system shall validate that the email address provided during registration follows a valid email format.
- **FR-03** [High] The system shall require passwords to be at least 8 characters in length.
- **FR-04** [High] The system shall allow a registered user to log in using their email address and password.
- **FR-05** [High] The system shall display descriptive error messages when required fields are left empty or contain invalid input during login or registration.
- **FR-06** [High] The system shall navigate the user to the main application after successful authentication, bypassing the authentication screens.

### Study Session Logging
- **FR-07** [High] The system shall allow a user to manually log a study session by specifying the subject, duration, and optional notes.
- **FR-08** [Medium] The system shall display a history of previously logged study sessions on the user's profile.
- **FR-09** [Medium] The system shall calculate and display the total study hours logged by the user across all sessions.

### Goal Setting
- **FR-10** [High] The system shall allow a user to create an academic goal with a title, description, target date, and priority level.
- **FR-11** [Medium] The system shall display the user's active goals with their current progress status.
- **FR-12** [Medium] The system shall allow a user to mark a goal as completed.
- **FR-13** [Low] The system shall allow a user to edit or delete an existing goal.

### Pomodoro Timer
- **FR-14** [High] The system shall provide a Pomodoro-style focus timer with a default work interval of 25 minutes and a break interval of 5 minutes.
- **FR-15** [Medium] The system shall allow the user to start, pause, and reset the timer.
- **FR-16** [Medium] The system shall notify the user when a work or break interval has ended.
- **FR-17** [Low] The system shall allow the user to configure custom work and break durations.

### Achievements
- **FR-18** [Medium] The system shall award achievement badges to users upon reaching defined academic milestones (e.g., first study session logged, 10-day streak, 100 total hours).
- **FR-19** [Medium] The system shall display all available badges, indicating which have been earned and which remain locked with progress indicators.

### Friends and Social
- **FR-20** [Medium] The system shall allow a user to search for and add other users as friends.
- **FR-21** [Medium] The system shall display a list of the user's friends along with their recent study activity.
- **FR-22** [Low] The system shall display a leaderboard ranking friends by study hours or streak length.

### Community Feed
- **FR-23** [Medium] The system shall display a community feed of posts from users.
- **FR-24** [Medium] The system shall allow a user to create a new post on the community feed.
- **FR-25** [Low] The system shall allow a user to like and comment on posts in the community feed.

### Profile
- **FR-26** [High] The system shall display a user profile showing the user's username, university, major, study stats, and earned badges.
- **FR-27** [Low] The system shall allow a user to edit their profile information.

---

## 3. Non-Functional Requirements

- **NFR-01 Performance:** The application shall load the main screen within 3 seconds on a standard mobile device with a stable internet connection.
- **NFR-02 Usability:** The user interface shall follow a consistent dark-theme design language with sufficient color contrast ratios to meet WCAG AA accessibility standards.
- **NFR-03 Reliability:** The application shall not crash during normal usage flows (login, navigation between screens, timer operation, session logging).
- **NFR-04 Security:** User passwords shall never be stored or transmitted in plaintext. Authentication tokens shall be stored securely on the device using encrypted storage.
- **NFR-05 Portability:** The application shall run on iOS 14+ and Android 10+.
- **NFR-06 Maintainability:** The source code shall follow consistent naming conventions, use descriptive identifiers, and be organized into modular components to facilitate future development.
- **NFR-07 Scalability:** The backend architecture (when implemented) shall be designed to support at least 10,000 concurrent users without degradation in response time.
- **NFR-08 Offline Capability:** The Pomodoro timer shall function without an internet connection.

---

## 4. Use Case Diagram

> **[Insert UML Use Case Diagram here]**
>
> The diagram should show the following actors and use cases:

**Primary Actor:** Student (registered user)

**Use Cases:**
- UC-01: Register Account
- UC-02: Log In
- UC-03: Log Study Session
- UC-04: Set Academic Goal
- UC-05: Run Pomodoro Timer
- UC-06: View Achievements
- UC-07: Add Friend
- UC-08: View Community Feed
- UC-09: Create Post
- UC-10: Like / Comment on Post
- UC-11: View Profile
- UC-12: Edit Profile

**Relationships:**
- UC-03 through UC-12 all `<<include>>` UC-02 (user must be logged in)
- UC-09 `<<include>>` UC-08 (posting requires viewing the feed)

---

### Textual Use Case Descriptions

#### UC-01: Register Account
- **Actor:** Unregistered user
- **Precondition:** User has the app installed and is on the Sign Up screen.
- **Main Flow:**
  1. User enters username, email, password, university, and major.
  2. System validates all fields (non-empty, valid email format, password ≥ 8 chars).
  3. System creates the account and navigates user to the main app.
- **Alternative Flow:** If validation fails, system displays field-specific error messages and the user corrects input.
- **Postcondition:** User account is created and user is authenticated.

#### UC-02: Log In
- **Actor:** Registered user
- **Precondition:** User has an existing account.
- **Main Flow:**
  1. User enters email and password on the Login screen.
  2. System validates credentials.
  3. System navigates user to the main app.
- **Alternative Flow:** If credentials are invalid, system displays an error message.
- **Postcondition:** User is authenticated and auth screens are bypassed.

#### UC-03: Log Study Session
- **Actor:** Authenticated student
- **Precondition:** User is logged in and on the Log Session screen.
- **Main Flow:**
  1. User enters subject name, duration, and optional notes.
  2. User submits the form.
  3. System saves the session and updates the user's total study hours.
- **Postcondition:** Study session is recorded and reflected in the user's stats.

#### UC-04: Set Academic Goal
- **Actor:** Authenticated student
- **Precondition:** User is on the Goal Setting screen.
- **Main Flow:**
  1. User enters goal title, description, target date, and priority.
  2. User saves the goal.
  3. System displays the goal in the active goals list.
- **Postcondition:** New goal appears in the user's goal list.

#### UC-05: Run Pomodoro Timer
- **Actor:** Authenticated student
- **Precondition:** User is on the Pomodoro screen.
- **Main Flow:**
  1. User presses Start.
  2. Timer counts down from the configured work duration (default 25 min).
  3. On completion, system notifies user and begins break interval.
  4. User can pause or reset at any time.
- **Postcondition:** Timer session completed; optionally logged as a study session.

#### UC-06: View Achievements
- **Actor:** Authenticated student
- **Precondition:** User is on the Achievements screen.
- **Main Flow:**
  1. System displays all available badges.
  2. Earned badges are highlighted; locked badges show progress toward earning them.
- **Postcondition:** User can see their achievement progress.

#### UC-07: Add Friend
- **Actor:** Authenticated student
- **Precondition:** User is on the Friends screen.
- **Main Flow:**
  1. User searches for another user by username.
  2. User sends a friend request.
  3. Target user accepts; both are added to each other's friends list.
- **Postcondition:** New friend connection is established.

#### UC-08: View Community Feed
- **Actor:** Authenticated student
- **Precondition:** User is on the Community screen.
- **Main Flow:**
  1. System loads and displays recent posts from the community.
  2. User scrolls through posts.
- **Postcondition:** User has viewed recent community activity.

#### UC-09: Create Post
- **Actor:** Authenticated student
- **Precondition:** User is on the Community screen.
- **Main Flow:**
  1. User taps the create post button.
  2. User enters post content.
  3. User submits. System displays the post on the feed.
- **Postcondition:** New post is visible on the community feed.

#### UC-10: Like / Comment on Post
- **Actor:** Authenticated student
- **Precondition:** User is viewing the community feed.
- **Main Flow:**
  1. User taps the like icon — like count increments.
  2. User taps comment icon — input appears; user submits a comment.
- **Postcondition:** Like/comment is recorded and visible on the post.

#### UC-11: View Profile
- **Actor:** Authenticated student
- **Precondition:** User is logged in.
- **Main Flow:**
  1. User navigates to the Profile screen.
  2. System displays username, university, major, study stats, streak, and earned badges.
- **Postcondition:** User can review their academic progress.

#### UC-12: Edit Profile
- **Actor:** Authenticated student
- **Precondition:** User is on the Profile screen.
- **Main Flow:**
  1. User taps Edit.
  2. User modifies bio, university, or major.
  3. User saves changes. System updates the profile display.
- **Postcondition:** Profile reflects updated information.

---

## 5. Class Diagram and Sequence Diagrams

> **[Insert UML Class Diagram here]**

### Core Classes

**User**
- Attributes: `userId`, `username`, `email`, `passwordHash`, `university`, `major`, `bio`, `createdAt`
- Methods: `login()`, `register()`, `updateProfile()`
- Relationships: has many `StudySession`, `Goal`, `Achievement`, `Post`, `Friend`

**StudySession**
- Attributes: `sessionId`, `userId`, `subject`, `durationMinutes`, `notes`, `createdAt`
- Methods: `save()`, `delete()`

**Goal**
- Attributes: `goalId`, `userId`, `title`, `description`, `targetDate`, `priority`, `isCompleted`
- Methods: `save()`, `markComplete()`, `delete()`

**Achievement**
- Attributes: `achievementId`, `title`, `description`, `iconName`, `criteria`, `isEarned`, `progress`
- Methods: `checkCriteria(user)`, `award(user)`

**Post**
- Attributes: `postId`, `userId`, `content`, `likeCount`, `createdAt`
- Methods: `create()`, `like()`, `addComment()`

**Comment**
- Attributes: `commentId`, `postId`, `userId`, `content`, `createdAt`

**PomodoroSession**
- Attributes: `sessionId`, `userId`, `workDuration`, `breakDuration`, `completedCycles`
- Methods: `start()`, `pause()`, `reset()`

**Friend**
- Attributes: `friendshipId`, `userId`, `friendId`, `status`
- Methods: `sendRequest()`, `accept()`, `remove()`

---

### Sequence Diagram 1: User Registration (UC-01)

```
User → SignUpScreen: enter username, email, password, university, major
SignUpScreen → SignUpScreen: validate fields (client-side)
SignUpScreen → AuthService: register(userData)
AuthService → UserRepository: createUser(userData)
UserRepository → Database: INSERT user record
Database → UserRepository: userId
AuthService → SignUpScreen: success + auth token
SignUpScreen → NavigationService: reset to Main
```

### Sequence Diagram 2: Log Study Session (UC-03)

```
User → LogSessionScreen: enter subject, duration, notes
User → LogSessionScreen: tap Submit
LogSessionScreen → SessionService: createSession(userId, subject, duration, notes)
SessionService → SessionRepository: save(sessionData)
SessionRepository → Database: INSERT session record
SessionService → AchievementService: checkCriteria(userId)
AchievementService → AchievementRepository: award(achievementId) [if criteria met]
LogSessionScreen → ProfileScreen: update stats display
```

### Sequence Diagram 3: Run Pomodoro Timer (UC-05)

```
User → PomodoroScreen: tap Start
PomodoroScreen → TimerService: startTimer(workDuration=25min)
TimerService → TimerService: countdown loop
TimerService → PomodoroScreen: onTick(remainingSeconds)
PomodoroScreen → UI: update display
TimerService → PomodoroScreen: onWorkComplete()
PomodoroScreen → NotificationService: sendNotification("Break time!")
PomodoroScreen → TimerService: startTimer(breakDuration=5min)
TimerService → PomodoroScreen: onBreakComplete()
PomodoroScreen → NotificationService: sendNotification("Back to work!")
```

---

## 6. Operating Environment

- **Mobile Platform:** iOS 14+ and Android 10+
- **Development Framework:** React Native 0.76+ with Expo SDK 52+
- **Runtime:** JavaScript/JSX via Hermes engine
- **Device Requirements:** Smartphone with at least 2GB RAM; internet connection required for social features; offline capable for timer
- **Development OS:** Windows 10/11, macOS 12+
- **Node.js:** v18+ for Expo CLI toolchain
- **Expo Go:** Used for development testing on physical devices

---

## 7. Assumptions and Dependencies

**Assumptions:**
- A-01: Users have a smartphone running iOS 14+ or Android 10+.
- A-02: Users have a stable internet connection for social and data-sync features.
- A-03: A backend API will be implemented in a future phase to replace mock/static data.
- A-04: Users are currently enrolled at a university.

**Dependencies:**
- D-01: **React Navigation** — all screen routing and tab navigation.
- D-02: **Expo Font** + `@expo-google-fonts/aldrich` + `@expo-google-fonts/space-grotesk` — custom typography.
- D-03: **Expo Splash Screen** — splash screen management during font loading.
- D-04: **Expo Status Bar** — system status bar styling.
- D-05: **Metro Bundler** — JavaScript bundling.
- D-06: **EAS Build** *(planned)* — production build generation for iOS and Android.
