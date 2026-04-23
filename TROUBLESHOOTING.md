# Troubleshooting Guide

## White Screen of Death (WSOD)

### Symptoms
- App shows completely white screen
- No error messages visible
- App doesn't respond to touches

### Causes & Solutions

#### 1. Backend Not Running
**Problem**: Frontend is trying to connect to backend but it's not available

**Solution**:
```bash
cd backend
npm install
npm run dev
```

You should see:
```
Server is running on port 3000
Database connected successfully
```

#### 2. Database Not Running
**Problem**: Backend can't connect to MySQL

**Solution**:
```bash
# Start MySQL (Windows)
mysql -u root -p

# Or if MySQL is a service, restart it
net stop MySQL80
net start MySQL80
```

Then create the database:
```bash
mysql -u root -p < database/schema.sql
```

#### 3. Environment Variables Not Set
**Problem**: Backend can't find database credentials

**Solution**:
Check `backend/.env` has:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=my_sql_password
DB_NAME=academic_weapon
JWT_SECRET=academic_weapon_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:19000
```

#### 4. Frontend Dependencies Not Installed
**Problem**: Missing AsyncStorage or other packages

**Solution**:
```bash
cd frontend
npm install
```

#### 5. Expo Not Running Correctly
**Problem**: Frontend app won't load

**Solution**:
```bash
cd frontend
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Or scan QR code with Expo Go

#### 6. Port 3000 Already in Use
**Problem**: Backend can't start because port 3000 is taken

**Solution**:
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change the port in backend/.env
PORT=3001
```

## Step-by-Step Startup

### Terminal 1: Start Backend
```bash
cd backend
npm install
npm run dev
```

Wait for:
```
Server is running on port 3000
Database connected successfully
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm install
npm start
```

Then press `i` or `a` or scan QR code.

## Testing the Connection

### Test Backend is Running
```bash
curl http://localhost:3000
```

Should return:
```json
{"message":"Welcome to Academic Weapon Challenge API"}
```

### Test Login Endpoint
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Should return error (user doesn't exist yet):
```json
{"error":"Invalid email or password"}
```

## Common Error Messages

### "Cannot find module 'bcrypt'"
```bash
cd backend
npm install bcrypt
```

### "Cannot find module 'jsonwebtoken'"
```bash
cd backend
npm install jsonwebtoken
```

### "Cannot find module '@react-native-async-storage/async-storage'"
```bash
cd frontend
npm install @react-native-async-storage/async-storage
```

### "ECONNREFUSED 127.0.0.1:3000"
Backend is not running. Start it with:
```bash
cd backend
npm run dev
```

### "ECONNREFUSED 127.0.0.1:3306"
MySQL is not running. Start it or check credentials in `backend/.env`

## Checking Logs

### Backend Logs
Look for errors in the terminal where you ran `npm run dev`

### Frontend Logs
In Expo, press `j` to open the debugger or check the terminal output

### Database Logs
Check MySQL error log:
```bash
# Windows
type "C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err"
```

## Reset Everything

If nothing works, try a complete reset:

```bash
# 1. Stop all servers (Ctrl+C in terminals)

# 2. Clear frontend cache
cd frontend
rm -rf node_modules package-lock.json
npm install

# 3. Clear backend cache
cd backend
rm -rf node_modules package-lock.json
npm install

# 4. Reset database
mysql -u root -p
DROP DATABASE academic_weapon;
mysql -u root -p < database/schema.sql

# 5. Start fresh
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm start
```

## Still Not Working?

1. Check all three services are running:
   - MySQL (port 3306)
   - Backend (port 3000)
   - Frontend (Expo)

2. Verify environment variables:
   - `backend/.env` has correct DB credentials
   - `frontend/.env` has `API_URL=http://localhost:3000/api`

3. Check for typos in:
   - Database name: `academic_weapon`
   - Table name: `users`
   - Column names in schema

4. Look at error messages in terminal output

5. Try the curl test to verify backend is working

## For Android Emulator

If using Android emulator, change the API URL:
```
API_URL=http://10.0.2.2:3000/api
```

This is because `localhost` doesn't work from Android emulator - use `10.0.2.2` instead.
