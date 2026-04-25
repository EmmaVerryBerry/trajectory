# Quick Start Guide - Trajectory Authentication

## Prerequisites

- Node.js v18+
- MySQL running locally
- Expo CLI: `npm install -g expo-cli`

## Setup (5 minutes)

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The server starts on `http://localhost:3000`

### 2. Database Setup

In a new terminal:
```bash
mysql -u root -p < database/schema.sql
```

Enter your MySQL password when prompted.

### 3. Frontend Setup

In a new terminal:
```bash
cd frontend
npm install
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Or scan QR code with Expo Go app

## Test the Login

1. **Sign Up**
   - Tap "Create new account"
   - Fill in all fields:
     - Username: `testuser`
     - Email: `test@example.com`
     - Password: `password123` (8+ chars)
     - University: `Florida State University`
     - Major: `Computer Science`
   - Tap "Launch →"

2. **Login**
   - You should be logged in and see the main app
   - To test login again, restart the app and tap "Create new account" → "Already have an account?"
   - Enter: `test@example.com` / `password123`

## What's Working

✅ User registration with validation
✅ Password hashing with bcrypt
✅ JWT token generation
✅ User login with credentials
✅ Token persistence in AsyncStorage
✅ Automatic token injection in API requests
✅ Error handling and user feedback
✅ Navigation based on auth state

## Project Structure

```
Trajectory/
├── backend/
│   ├── routes/auth.js          ← Login/Register endpoints
│   ├── config/database.js      ← MySQL connection
│   ├── server.js               ← Express app
│   └── .env                    ← Configuration
├── frontend/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── LoginScreen.js  ← Login UI
│   │   │   └── SignUpScreen.js ← Registration UI
│   │   └── services/
│   │       └── api.js          ← API client
│   ├── App.js                  ← Auth state management
│   └── package.json
├── database/
│   └── schema.sql              ← Database schema
└── docs/
    └── AUTHENTICATION_SETUP.md ← Detailed guide
```

## Troubleshooting

**Backend won't start**
- Check MySQL is running: `mysql -u root -p`
- Check `.env` file has correct DB credentials
- Check port 3000 is not in use

**Frontend won't connect to backend**
- Ensure backend is running on `http://localhost:3000`
- Check `frontend/.env` has `API_URL=http://localhost:3000/api`
- On Android emulator, use `http://10.0.2.2:3000/api` instead

**Database connection fails**
- Run: `mysql -u root -p < database/schema.sql`
- Check MySQL credentials in `backend/.env`

**AsyncStorage errors**
- Clear app cache and reinstall
- On iOS: `npm run ios` (fresh install)
- On Android: `npm run android` (fresh install)

## Next Steps

1. Test the complete flow
2. Check `docs/AUTHENTICATION_SETUP.md` for detailed documentation
3. Implement logout in ProfileScreen
4. Add password reset functionality
5. Set up email verification

## Support

For detailed information, see:
- `docs/AUTHENTICATION_SETUP.md` - Complete setup guide
- `IMPLEMENTATION_SUMMARY.md` - What was implemented
- `README.md` - Project overview
