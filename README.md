# Academic Weapon Challenge

An academic social networking mobile application designed to encourage productive study habits through goal setting, accountability, and friendly competition.

## Project Overview

The Academic Weapon Challenge helps students track their study progress, maintain streaks, earn achievements, and compete with friends through gamification and social reinforcement.

## Team Members

- **Caitlin O’Donnell (cmo21e)**: Experience with MySQL, Python, C++, and C#. Will manage the backend portion of the project as well as assist with developing any core features as necessary.
- **Hailie Tucker (hlt22c)**: experience with HTML, C++, C#, JavaScript, Unity, Blender, git bash, will work on mainly front end for the project, so UX/UI implementation 
- **Emma Berry (Emb23e)**: experience with typescript, react, c++, css/html frontend, design, figma, so I would like to manage design if possible and assist in any other aspect of frontend and backend. I have a pretty broad experience range so I’m open to helping with anything needed.
- **Joseph Daniele (jnd23a)**: experience with c++, c sharp, and MySQL. Will manage backend with Caitlin and also assist with any additional features as needed.


## Tech Stack

### Frontend
- React Native
- Expo
- TypeScript/JavaScript

### Backend
- Node.js
- Express.js
- MySQL

### Third-Party Libraries
- mysql2 - MySQL client for Node.js
- cors - Cross-origin resource sharing
- dotenv - Environment variable management

## Project Structure

```
Trajectory/
├── frontend/           # React Native/Expo mobile app
├── backend/           # Node.js/Express API server
├── database/          # Database schemas and migrations
├── docs/              # Project documentation
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MySQL Server
- Expo CLI (`npm install -g expo-cli`)
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Trajectory
```

2. Switch to development branch:
```bash
git checkout development
```

3. Set up the backend:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

4. Set up the frontend:
```bash
cd frontend
npm install
npm start
```

5. Set up the database:
```bash
# Create MySQL database
mysql -u root -p < database/schema.sql
```

## Features

### Core Features
- **Goal Setting**: Calculate recommended study time based on credit hours and difficulty
- **Study Logging**: Track study sessions and progress
- **Pomodoro Timer**: Adjustable timer with focus sounds
- **Achievements & Streaks**: Track milestones and consecutive study days
- **Social Features**: Friends list, leaderboards, activity feed
- **Community**: Group-based rankings and global leaderboards
- **Notifications**: Reminders and streak warnings

## Design System

### Colors
- `#000814` - Ink Black (Primary)
- `#001D3D` - Persian Blue
- `#003566` - Regal Navy
- `#FFC300` - School Bus Yellow (Accent)
- `#FFD60A` - Gold (Accent)

### Fonts
- **Title**: Aldrich
- **Title**: Aldrich
- **Body**: Space Grotesk (recommended)
- **Alt Options**: Agdasima, Alumni Sans SC, Pixelify Sans

## Development Workflow

### Branch Structure
- `main` - Production-ready code
- `development` - Active development branch (default for all work)
- `feature/*` - Individual feature branches

### Contributing

1. Ensure you're on the development branch:
```bash
git checkout development
git pull origin development
```

2. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

3. Make your changes and commit:
```bash
git add .
git commit -m "Description of changes"
```

4. Push your feature branch:
```bash
git push origin feature/your-feature-name
```

5. Create a Pull Request to merge into `development`

6. After review and approval, merge to `development`

## License

Copyright 2026 - CEN 4090L Group Project