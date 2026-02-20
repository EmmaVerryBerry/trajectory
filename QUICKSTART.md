# Quick Start Guide

Get Academic Weapon Challenge running in 5 minutes!

## Prerequisites

- Node.js (v16+)
- MySQL
- Expo CLI (`npm install -g expo-cli`)

## Setup

### 1. Clone & Install

```bash
git clone <repository-url>
cd Trajectory
git checkout development

# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 2. Create Database

```bash
mysql -u root -p < database/schema.sql
```

### 3. Run the App

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Press `s` to switch to expo go
- Scan QR code with Expo Go app

## What's Next?

- **Full Setup Guide**: See `docs/SETUP_GUIDE.md`
- **Design System**: See `docs/DESIGN_SYSTEM.md`
- **Project Organization**: See `docs/PROJECT_ORGANIZATION.md`
- **API Docs**: See `backend/README.md`
- **Frontend Structure**: See `frontend/README.md`

## Troubleshooting

**Backend won't start?**
- Check MySQL is running
- Verify `.env` credentials

**Frontend won't connect?**
- Ensure backend is running on port 3000
- Check `API_URL` in `frontend/.env`

**Need help?**
- See detailed `docs/SETUP_GUIDE.md`
- Ask the team!

Happy coding! 🎓⚔️
