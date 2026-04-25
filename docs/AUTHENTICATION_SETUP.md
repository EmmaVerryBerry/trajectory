# Authentication Setup Guide

## Overview

The Trajectory app now has a complete authentication system with login and registration. This guide explains how to set up and test the authentication flow.

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

The following packages are already in `package.json`:
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT token generation
- `mysql2` - Database connection
- `express` - Web framework
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### 2. Database Setup

Ensure your MySQL database is running and create the database:

```bash
mysql -u root -p < ../database/schema.sql
```

This creates the `academic_weapon` database with the `users` table that includes:
- `user_id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `password_hash` - Bcrypt hashed password
- `university` - User's university
- `major` - User's major
- `created_at` - Account creation timestamp
- `last_login` - Last login timestamp

### 3. Environment Configuration

The `backend/.env` file is already configured with:
- `PORT=3000` - Server port
- `DB_HOST=localhost` - Database host
- `DB_USER=root` - Database user
- `DB_PASSWORD=my_sql_password` - Database password
- `DB_NAME=academic_weapon` - Database name
- `JWT_SECRET=academic_weapon_super_secret_key_change_in_production` - JWT signing key
- `JWT_EXPIRES_IN=7d` - Token expiration time
- `CORS_ORIGIN=http://localhost:19000` - Expo development server

**Important**: Change `JWT_SECRET` in production!

### 4. Start the Backend Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` and test the database connection.

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This installs:
- React Native and Expo
- React Navigation
- Axios for API calls
- AsyncStorage for token persistence
- Google Fonts (Aldrich, Space Grotesk)

### 2. Environment Configuration

The `frontend/.env.example` shows the required configuration:
```
API_URL=http://localhost:3000/api
NODE_ENV=development
```

Create a `.env` file in the `frontend` directory with these values.

### 3. Start the Frontend

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Authentication Flow

### Registration

1. User taps "Create new account" on login screen
2. Fills in: username, email, password (8+ chars), university, major
3. Frontend validates input locally
4. Sends POST request to `/api/auth/register`
5. Backend:
   - Validates all fields
   - Checks if email/username already exists
   - Hashes password with bcrypt
   - Creates user in database
   - Generates JWT token
6. Frontend receives token and user data
7. Stores token in AsyncStorage
8. Navigates to main app

### Login

1. User enters email and password
2. Frontend validates input
3. Sends POST request to `/api/auth/login`
4. Backend:
   - Finds user by email
   - Compares password with hash
   - Updates last_login timestamp
   - Generates JWT token
5. Frontend receives token
6. Stores token in AsyncStorage
7. Navigates to main app

### Token Management

- Tokens are stored in AsyncStorage on the device
- Automatically included in all API requests via axios interceptor
- Tokens expire after 7 days (configurable)
- On 401 response, token is cleared and user is logged out

## Testing the Authentication

### Test Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "university": "Florida State University",
    "major": "Computer Science"
  }'
```

Expected response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "username": "testuser",
    "email": "test@example.com",
    "university": "Florida State University",
    "major": "Computer Science"
  }
}
```

### Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "username": "testuser",
    "email": "test@example.com",
    "university": "Florida State University",
    "major": "Computer Science"
  }
}
```

## Error Handling

### Common Errors

**Email or username already exists (409)**
```json
{ "error": "Email or username already exists" }
```

**Invalid credentials (401)**
```json
{ "error": "Invalid email or password" }
```

**Missing fields (400)**
```json
{ "error": "All fields are required" }
```

**Password too short (400)**
```json
{ "error": "Password must be at least 8 characters" }
```

## Security Considerations

1. **Password Hashing**: Passwords are hashed with bcrypt (10 salt rounds)
2. **JWT Tokens**: Signed with a secret key, expires after 7 days
3. **HTTPS**: Use HTTPS in production
4. **Environment Variables**: Never commit `.env` files with secrets
5. **Token Storage**: Tokens stored in AsyncStorage (device-specific)
6. **CORS**: Configured for Expo development server

## Next Steps

1. Implement logout functionality in ProfileScreen
2. Add password reset/forgot password flow
3. Add email verification
4. Implement refresh token rotation
5. Add two-factor authentication
6. Create auth context for global state management
