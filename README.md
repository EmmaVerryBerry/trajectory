# Trajectory

A mobile app for university students to build and sustain strong academic habits through study tracking, goal setting, social accountability, and gamification.

## Team

| Name | FSU ID | Role |
|------|--------|------|
| Emma Berry (Emb23e) | emb23e | Frontend, Design |
| Caitlin O'Donnell | cmo21e | Backend, Database |
| Hailie Tucker | hlt22c | Frontend, UI/UX |
| Joseph Daniele | jnd23a | Backend, Database |

## Project Documentation

| Document | Increment 1 | Increment 2 |
|----------|-------------|-------------|
| Progress Report | — | [Increment 2](increment2/ProgressReport_Increment2.md) |
| Requirements & Design | [Increment 1](increment1/RD_Document_Increment1.md) | [Increment 2](increment2/RD_Document_Increment2.md) |
| Implementation & Testing | [Increment 1](increment1/IT_Document_Increment1.md) | [Increment 2](increment2/IT_Document_Increment2.md) |

## Features

- **Study Session Logging** — Track sessions by subject, duration, and notes
- **Goal Setting** — Create and monitor academic goals with deadlines and priorities
- **Pomodoro Timer** — Built-in 25/5 focus timer with pause and reset
- **Achievements** — Earn badges for academic milestones and streaks
- **Friends** — Connect with peers and view their study activity
- **Community Feed** — Post updates, like, and comment with the academic community
- **Profile** — View your stats, streak, and earned badges

## Tech Stack

**Frontend:** React Native, Expo, JavaScript, React Navigation, Expo Font (Aldrich + Space Grotesk)

**Backend (planned):** Node.js, Express.js, MySQL

## Getting Started

### Prerequisites
- Node.js v18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone (for testing)

### Run the app

```bash
cd frontend
npm install
npm start
```

Then press `i` for iOS simulator, `a` for Android, or scan the QR code with Expo Go.

## Repository Structure

```
Trajectory/
├── frontend/          # React Native/Expo mobile app
├── backend/           # Node.js/Express API (planned)
├── database/          # Database schemas
├── docs/              # Additional documentation
├── increment1/        # Increment 1 deliverables
├── increment2/        # Increment 2 deliverables
└── README.md
```

## Branch Strategy

- `master` — production-stable
- `development` — active development (default for all work)
- `feature/*` — individual feature branches

## License

Copyright 2026 — CEN 4090L Group Project, Florida State University
