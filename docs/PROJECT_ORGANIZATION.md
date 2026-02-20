# Project Organization & Workflow

## Team Structure

### Current Team
- **Caitlin O'Donnell** (cmo21e) - Backend Development, Database Management

### Roles & Responsibilities

#### Backend Developer
- API endpoint implementation
- Database design and optimization
- Authentication and security
- Server deployment

#### Frontend Developer
- Mobile UI implementation
- User experience design
- API integration
- State management

#### Full Stack Developer
- Feature implementation end-to-end
- Bug fixes across the stack
- Code reviews
- Testing

## Git Workflow

### Branch Strategy

```
main
  └── development (default branch for all work)
        ├── feature/goal-setting
        ├── feature/pomodoro-timer
        ├── feature/social-feed
        └── bugfix/streak-calculation
```

### Branch Naming Conventions

- **Feature**: `feature/feature-name`
  - Example: `feature/friend-leaderboard`
- **Bug Fix**: `bugfix/bug-description`
  - Example: `bugfix/login-error`
- **Hotfix**: `hotfix/critical-issue`
  - Example: `hotfix/database-connection`
- **Documentation**: `docs/doc-name`
  - Example: `docs/api-documentation`

### Workflow Steps

1. **Start New Work**
   ```bash
   git checkout development
   git pull origin development
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   ```bash
   git add .
   git commit -m "Clear description of changes"
   ```

3. **Keep Updated**
   ```bash
   git checkout development
   git pull origin development
   git checkout feature/your-feature-name
   git merge development
   # Resolve conflicts if any
   ```

4. **Push Changes**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to GitHub
   - Create PR from your feature branch to `development`
   - Add description of changes
   - Request review from team member(s)

6. **After Approval**
   - Merge PR into `development`
   - Delete feature branch

7. **Production Release**
   - When `development` is stable and tested
   - Create PR from `development` to `main`
   - Tag release version
   - Deploy to production

### Commit Message Format

```
<type>: <short description>

<optional longer description>

<optional footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat: Add goal calculation logic

Implemented the formula for calculating weekly study hours
based on credit hours and difficulty level.

feat: Create friends leaderboard component

fix: Resolve streak reset bug

The streak was resetting at midnight instead of end of day.
Fixed by adjusting timezone handling.

docs: Update API endpoint documentation
```

## Project Management

### Feature Development Process

1. **Planning**
   - Review feature requirements
   - Break down into tasks
   - Estimate effort
   - Assign to team member

2. **Implementation**
   - Create feature branch
   - Implement backend (if needed)
   - Implement frontend (if needed)
   - Test locally

3. **Testing**
   - Unit tests
   - Integration tests
   - Manual testing
   - Cross-platform testing (iOS/Android)

4. **Review**
   - Code review by team member
   - Address feedback
   - Re-test if changes made

5. **Merge**
   - Merge to development
   - Delete feature branch
   - Update project board

### Task Tracking

Consider using GitHub Projects or Issues:

**Labels:**
- `feature` - New functionality
- `bug` - Something isn't working
- `enhancement` - Improvement to existing feature
- `documentation` - Documentation updates
- `backend` - Backend work
- `frontend` - Frontend work
- `database` - Database changes
- `urgent` - High priority
- `good first issue` - Good for new contributors

## Code Standards

### JavaScript/TypeScript

- Use ES6+ syntax
- Consistent indentation (2 spaces)
- Semicolons required
- Use `const` by default, `let` when needed, avoid `var`
- Meaningful variable names
- Comment complex logic

### React Native

- Functional components with hooks
- Extract reusable components
- Use StyleSheet.create for styles
- Avoid inline styles when possible
- PropTypes or TypeScript for type checking

### Backend (Node.js)

- Use async/await over callbacks
- Proper error handling
- Input validation
- Consistent naming (camelCase)
- Separate routes, controllers, models

### Database

- Use prepared statements (prevent SQL injection)
- Proper indexing
- Document schema changes
- Create migration files for changes

## File Organization Best Practices

### Frontend

```
src/
├── screens/          # One file per screen
├── components/       # Reusable components
│   ├── common/      # Generic components (Button, Card)
│   └── specific/    # Feature-specific components
├── navigation/       # Navigation configuration
├── services/         # API calls, external services
├── hooks/           # Custom React hooks
├── context/         # React Context providers
├── utils/           # Helper functions
└── constants/       # Constants (colors, config)
```

### Backend

```
backend/
├── routes/          # Route definitions
├── controllers/     # Route handlers
├── models/          # Data models
├── middleware/      # Custom middleware
├── utils/           # Helper functions
├── config/          # Configuration files
└── validators/      # Input validation
```

## Testing Strategy

### Frontend Testing
- Component tests (Jest + React Native Testing Library)
- Navigation tests
- Integration tests
- Manual testing on devices

### Backend Testing
- API endpoint tests (Jest + Supertest)
- Database integration tests
- Authentication tests
- Error handling tests

### Manual Testing Checklist
- [ ] Create account
- [ ] Set study goals
- [ ] Log study session
- [ ] Check streak updates
- [ ] Add friends
- [ ] View leaderboards
- [ ] Receive notifications
- [ ] Use Pomodoro timer

## Communication

### Stand-up Updates (Recommended)
- What did you work on?
- What are you working on today?
- Any blockers?

### Code Reviews
- Review within 24 hours
- Be constructive and kind
- Ask questions, don't demand changes
- Approve when satisfied

### Documentation
- Update README when adding features
- Document API endpoints
- Comment complex algorithms
- Keep database schema docs updated

## Development Environment Setup

### Required Software
- Node.js (v16+)
- MySQL
- Git
- Expo CLI
- Code editor (VS Code recommended)

### VS Code Extensions (Recommended)
- ESLint
- Prettier
- React Native Tools
- MySQL
- GitLens

### Environment Files
- Never commit `.env` files
- Keep `.env.example` updated
- Document all environment variables

## Deployment

### Development
- Backend: Local Node.js server
- Frontend: Expo Go app
- Database: Local MySQL

### Production (Future)
- Backend: Cloud hosting (AWS, Heroku, etc.)
- Frontend: Expo build (iOS/Android)
- Database: Cloud MySQL (AWS RDS, etc.)

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Hash passwords (bcrypt)
- [ ] Use JWT for authentication
- [ ] Validate all inputs
- [ ] Use prepared statements
- [ ] Keep dependencies updated
- [ ] Don't commit secrets
- [ ] Implement rate limiting
- [ ] Use CORS properly
- [ ] Sanitize user inputs

## Getting Help

- Check documentation first
- Search existing issues
- Ask team members
- Consult course resources
- Stack Overflow (be specific)
