# Academic Weapon Challenge - Backend

Node.js/Express backend API with MySQL database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Edit `.env` with your database credentials

4. Create the database:
```bash
mysql -u root -p < ../database/schema.sql
```

5. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon (auto-restart)

## Project Structure

```
backend/
├── config/
│   └── database.js       # Database connection configuration
├── routes/
│   ├── auth.js          # Authentication endpoints
│   ├── users.js         # User management
│   ├── goals.js         # Study goals
│   ├── study.js         # Study sessions and progress
│   ├── achievements.js  # Achievements system
│   └── social.js        # Social features and leaderboards
├── middleware/          # Custom middleware (to be added)
├── models/             # Database models (to be added)
├── utils/              # Utility functions (to be added)
├── server.js           # Express app configuration
├── .env.example        # Environment variables template
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile/:id` - Update user profile
- `GET /api/users/:id/stats` - Get user statistics

### Goals
- `POST /api/goals` - Create study goal
- `GET /api/goals/:userId` - Get user's goals
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Study Sessions
- `POST /api/study/sessions` - Log study session
- `GET /api/study/sessions/:userId` - Get study sessions
- `GET /api/study/progress/:userId` - Get weekly progress
- `GET /api/study/streak/:userId` - Get current streak

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/user/:userId` - Get user's achievements
- `POST /api/achievements/unlock` - Unlock achievement

### Social
- `POST /api/social/friends/add` - Add friend
- `GET /api/social/friends/:userId` - Get friends list
- `GET /api/social/leaderboard/friends/:userId` - Get friends leaderboard
- `GET /api/social/leaderboard/global` - Get global leaderboard
- `GET /api/social/leaderboard/community/:type/:id` - Get community leaderboard
- `GET /api/social/activity/:userId` - Get activity feed
- `POST /api/social/activity` - Create activity post

## Database

Uses MySQL with the following main tables:
- users
- goals
- study_sessions
- achievements
- user_achievements
- friendships
- activity_feed
- communities

See `../database/schema.sql` for complete database structure.

## Development Notes

### Goal Calculation Formula
- Normal difficulty: 2 hours per credit hour per week
- Hard difficulty: 3 hours per credit hour per week
- Hours per study day = Total weekly hours / Number of study days

Example:
- 15 credit hours (normal difficulty) = 30 hours/week
- 5 study days = 6 hours per day

### Streak Logic
- Streak increases when user completes study goal on scheduled day
- Streak resets if user misses a scheduled study day
- Grace period: User has until end of day to log study session

## Future Additions

- [ ] JWT authentication middleware
- [ ] Input validation middleware
- [ ] Rate limiting
- [ ] Database models/ORM layer
- [ ] Password hashing with bcrypt
- [ ] Push notification service integration
- [ ] Data pagination for large datasets
- [ ] Caching layer (Redis)
- [ ] API documentation (Swagger)
