# Software Requirements and Design Document
Group 8 | Version 1.0 | Authors: Hailie Tucker, Emma Berry, Caitlin O'Donnell, Joseph Daniele

---

## Overview

Trajectory is a mobile application meant to bridge the gap between academic growth and social accountability. It functions by allowing users to set study goals, log sessions, and track progress over time using a structured timer system. Unlike apps that focus purely on passive habit tracking, Trajectory incorporates gamification elements — users can unlock achievements, earn badges, and compete on leaderboards with friends. The interface is designed to be as simple and intuitive as possible, following a consistent dark-theme visual language throughout.

---

## Functional Requirements

1. **Goal Setting** (High Priority) — the system needs to allow users to create and track academic goals with deadlines and priorities.
2. **Timer System** (High Priority) — a Pomodoro-style timer to set focused study windows and enforce regular breaks.
3. **Study Session Logging** (High Priority) — users must be able to manually log study sessions with subject, duration, and notes.
4. **Achievement System** (Medium Priority) — tracks milestones and awards badges to motivate consistent study behavior.
5. **Social / Friends** (Medium Priority) — friend connections and activity feeds increase accountability between users.
6. **Leaderboards** (Low Priority) — increases interactivity and friendly competition but is not essential to core functionality.

---

## Non-Functional Requirements

- **Usability:** Interface must be intuitive and operable without a manual; all core actions reachable within two taps.
- **Portability:** Application must be developed for mobile use on both iOS and Android.
- **Reliability:** The timer must always work correctly and accurately, including when the app is in the background.
- **Visual Consistency:** Maintain a consistent dark brand theme (`#000814` background, `#FFC300` accent) across all screens.

---

## Use Case Diagram

> [Insert Use Case Diagram here]

Textual descriptions are not required for the first increment. The diagram should include the following use cases: Register Account, Log In, Set Goal, Log Study Session, Run Pomodoro Timer, View Achievements, Add Friend, View Community Feed.

---

## Class Diagram and/or Sequence Diagrams

> [Insert Class Diagram and Sequence Diagram here]

The project uses an object-oriented paradigm (React Native components and planned backend models), so a class diagram of the full system is required along with sequence diagrams for the three most important use cases: User Registration, Log Study Session, and Run Pomodoro Timer. These will be refined in subsequent increments.

---

## Operating Environment

- **Platforms:** Mobile devices running iOS 14+ and Android 10+
- **Development Environment:** Local development using Expo Go on physical devices and simulators
- **Version Control:** GitHub — `master` branch (production-stable), `development` branch (active work), feature sub-branches for specific tasks
- **Coexistence:** Must work alongside standard mobile background processes; notification support required for timer alerts

---

## Assumptions and Dependencies

- **Assumptions:** Users will have a mobile device with sufficient storage and battery life. Backend integration will align with the frontend UI once implemented.
- **Dependencies:** GitHub/git (version control and collaboration); React Native and Expo (UI framework); React Navigation (screen routing); Node.js and Express.js (planned backend); MySQL (planned database); team availability for regular meetings and code reviews.
