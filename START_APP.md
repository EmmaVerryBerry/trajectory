# How to Start the App

## Prerequisites
- Node.js v18+ installed
- MySQL running locally
- Expo CLI installed: `npm install -g expo-cli`

## Quick Start (3 Steps)

### Step 1: Start Backend (Terminal 1)
```bash
cd backend
npm install
npm run dev
```

**Wait for this message:**
```
Server is running on port 3000
Database connected successfully
```

### Step 2: Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```

**Then:**
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Or scan QR code with Expo Go app on your phone

### Step 3: Test Login
1. Tap "Create new account"
2. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - University: `Florida State University`
   - Major: `Computer Science`
3. Tap "Launch →"
4. You should see the main app!

## If You Get White Screen

**Most Common Cause**: Backend isn't running

**Fix**:
1. Make sure Terminal 1 shows "Server is running on port 3000"
2. Make sure Terminal 1 shows "Database connected successfully"
3. If not, check `backend/.env` has correct MySQL credentials
4. If MySQL isn't running, start it first

**See TROUBLESHOOTING.md for more help**

## What's Running

- **Backend**: `http://localhost:3000` (Node.js + Express)
- **Frontend**: Expo app (React Native)
- **Database**: MySQL on `localhost:3306`

## Stop Everything

Press `Ctrl+C` in each terminal to stop the servers.

## Next Time

Just run these two commands in separate terminals:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

No need to `npm install` again unless you add new packages.
