# Academic Weapon Challenge - Frontend

React Native mobile application built with Expo.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm start
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

## Project Structure

```
frontend/
├── src/
│   ├── screens/          # Screen components
│   │   ├── HomeScreen.js
│   │   ├── GoalsScreen.js
│   │   ├── TimerScreen.js
│   │   ├── SocialScreen.js
│   │   └── ProfileScreen.js
│   ├── components/       # Reusable components
│   ├── services/         # API and external services
│   │   └── api.js
│   ├── constants/        # Constants and config
│   │   └── colors.js
│   ├── utils/           # Utility functions
│   └── hooks/           # Custom React hooks
├── assets/              # Images, fonts, etc.
├── App.js              # Root component
├── app.json            # Expo configuration
└── package.json

```

## Screens

### HomeScreen
- Dashboard with current streak
- Weekly progress overview
- Recent achievements

### GoalsScreen
- Set credit hours and course difficulty
- Calculate recommended study time
- Configure study schedule

### TimerScreen
- Pomodoro timer with adjustable duration
- Focus sounds (Lofi, waves, rain, thunder)
- Study tips and break suggestions

### SocialScreen
- Friends list
- Friends leaderboard (by streak)
- Activity feed
- Community leaderboards

### ProfileScreen
- User profile and stats
- Achievement showcase
- Study history

## Design System

### Colors
Use the exported constants from `src/constants/colors.js`:

```javascript
import COLORS from '../constants/colors';

backgroundColor: COLORS.BACKGROUND,
color: COLORS.TEXT_PRIMARY,
```

### Typography
- **Title Font**: Aldrich
- **Body Font**: Space Grotesk (recommended)
- **Alternatives**: Agdasima, Alumni Sans SC, Pixelify Sans

## API Integration

The app communicates with the backend API using axios. See `src/services/api.js` for the API client configuration.

Example usage:
```javascript
import api from '../services/api';

const fetchData = async () => {
  const response = await api.get('/endpoint');
  return response.data;
};
```

## Future Additions

- [ ] Authentication screens (Login/Signup)
- [ ] Goal setting form with calculations
- [ ] Timer with sound integration
- [ ] Friends management
- [ ] Notifications setup
- [ ] Offline support
- [ ] Push notifications
