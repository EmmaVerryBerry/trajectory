# Academic Weapon Challenge - Setup Guide

Complete setup instructions for new team members.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git**
   - Download: https://git-scm.com/
   - Verify installation: `git --version`

4. **MySQL** (v8.0 or higher)
   - Download: https://dev.mysql.com/downloads/
   - Verify installation: `mysql --version`

5. **Expo CLI**
   ```bash
   npm install -g expo-cli
   ```
   - Verify installation: `expo --version`

6. **Code Editor** (VS Code recommended)
   - Download: https://code.visualstudio.com/

### Mobile Testing Options

Choose one:

**Option A: Physical Device**
- Install "Expo Go" app from App Store (iOS) or Google Play (Android)

**Option B: Emulator**
- **iOS**: Install Xcode (Mac only)
- **Android**: Install Android Studio + Android Emulator

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Trajectory
```

### 2. Switch to Development Branch

```bash
git checkout development
```

### 3. Set Up Backend

```bash
cd backend
npm install
```

Create environment file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=academic_weapon

JWT_SECRET=your_random_secret_key_here
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:19000
```

### 4. Set Up Database

**Start MySQL:**
```bash
# Mac/Linux
sudo mysql.server start

# Windows
# Start MySQL from Services or MySQL Workbench
```

**Create Database:**
```bash
mysql -u root -p < database/schema.sql
```

Or manually:
```bash
mysql -u root -p
```
```sql
source database/schema.sql;
exit;
```

**Verify Database:**
```bash
mysql -u root -p academic_weapon
```
```sql
SHOW TABLES;
SELECT * FROM achievements;
exit;
```

### 5. Set Up Frontend

```bash
cd ../frontend
npm install
```

Create environment file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
API_URL=http://localhost:3000/api
NODE_ENV=development
```

## Running the Application

### Start Backend Server

In the `backend` directory:

```bash
npm run dev
```

You should see:
```
Server is running on port 3000
Database connected successfully
```

Test the API:
```bash
curl http://localhost:3000
```

Expected response:
```json
{"message":"Welcome to Academic Weapon Challenge API"}
```

### Start Frontend App

In a **new terminal**, navigate to `frontend` directory:

```bash
npm start
```

Expo will start and show a QR code. You can:
- **Press `a`** - Open in Android emulator
- **Press `i`** - Open in iOS simulator (Mac only)
- **Press `w`** - Open in web browser
- **Scan QR code** - Open on physical device with Expo Go app

## Verification Checklist

Ensure everything is working:

- [ ] Backend server running on port 3000
- [ ] Database connection successful
- [ ] Frontend Metro bundler running
- [ ] App opens in Expo Go or emulator
- [ ] No error messages in terminal

## Common Issues & Solutions

### Issue: MySQL Connection Failed

**Error:** `ER_ACCESS_DENIED_ERROR`

**Solution:**
1. Check MySQL is running
2. Verify username/password in `.env`
3. Test connection: `mysql -u root -p`

### Issue: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using port 3000
# Mac/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Expo Metro Bundler Won't Start

**Solution:**
```bash
# Clear cache and restart
cd frontend
rm -rf node_modules
npm install
expo start -c
```

### Issue: Can't Connect to Backend from Expo Go

**Problem:** API requests failing from mobile device

**Solution:**
1. Ensure phone and computer are on same WiFi
2. Update `API_URL` in frontend `.env` to your computer's local IP:
   ```
   # Find your IP
   # Mac/Linux: ifconfig | grep "inet "
   # Windows: ipconfig

   API_URL=http://192.168.1.XXX:3000/api
   ```

### Issue: Database Tables Not Created

**Solution:**
```bash
# Drop and recreate database
mysql -u root -p
```
```sql
DROP DATABASE IF EXISTS academic_weapon;
CREATE DATABASE academic_weapon;
USE academic_weapon;
source database/schema.sql;
```

## Development Workflow

### Daily Workflow

1. **Pull Latest Changes**
   ```bash
   git checkout development
   git pull origin development
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Start Servers**
   - Terminal 1: `cd backend && npm run dev`
   - Terminal 2: `cd frontend && npm start`

4. **Make Changes**
   - Write code
   - Test locally
   - Commit frequently

5. **Push Changes**
   ```bash
   git add .
   git commit -m "feat: description of changes"
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to GitHub
   - Create PR to `development` branch
   - Request review

### Testing Your Changes

#### Backend Testing
```bash
# Test API endpoint
curl http://localhost:3000/api/endpoint

# Or use Postman/Insomnia for more complex requests
```

#### Frontend Testing
- Test on iOS and Android if possible
- Check different screen sizes
- Test both online and offline (airplane mode)
- Verify error handling

## Useful Commands

### Git Commands
```bash
# Check current branch
git branch

# See changes
git status
git diff

# Undo changes
git checkout -- filename

# Update branch with latest development
git merge development
```

### npm Commands
```bash
# Install new package
npm install package-name

# Install new dev dependency
npm install --save-dev package-name

# Update packages
npm update

# Check for outdated packages
npm outdated
```

### MySQL Commands
```bash
# Login to MySQL
mysql -u root -p

# Show databases
SHOW DATABASES;

# Use database
USE academic_weapon;

# Show tables
SHOW TABLES;

# Describe table structure
DESCRIBE users;

# View table contents
SELECT * FROM users;
```

## Next Steps

After setup is complete:

1. **Read Documentation**
   - `docs/DESIGN_SYSTEM.md` - Design guidelines
   - `docs/PROJECT_ORGANIZATION.md` - Workflow and standards
   - `backend/README.md` - Backend API documentation
   - `frontend/README.md` - Frontend structure

2. **Explore Codebase**
   - Review existing code
   - Understand project structure
   - Run the app and test features

3. **Pick First Task**
   - Check project board or issues
   - Start with `good first issue` label
   - Ask team for recommendations

4. **Ask Questions**
   - Don't hesitate to ask team members
   - Document solutions for common issues
   - Share knowledge with the team

## Additional Resources

### Learning Resources
- **React Native**: https://reactnative.dev/docs/getting-started
- **Expo**: https://docs.expo.dev/
- **Express.js**: https://expressjs.com/
- **MySQL**: https://dev.mysql.com/doc/

### Tools
- **Postman**: API testing - https://www.postman.com/
- **MySQL Workbench**: Database GUI - https://www.mysql.com/products/workbench/
- **React Native Debugger**: https://github.com/jhen0409/react-native-debugger

### VS Code Extensions
- ESLint
- Prettier - Code formatter
- React Native Tools
- MySQL
- GitLens
- Auto Rename Tag
- Bracket Pair Colorizer

## Getting Help

If you encounter issues:

1. Check this guide
2. Search project documentation
3. Check existing GitHub issues
4. Ask in team chat
5. Create new GitHub issue with details

## Welcome to the Team!

You're all set! Happy coding! 🚀
