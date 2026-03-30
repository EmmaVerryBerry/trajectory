# Software Implementation and Testing Document
Group 8 | Version 1.0 | Authors: Hailie Tucker, Emma Berry, Caitlin O'Donnell, Joseph Daniele

---

## Programming Languages

- **JavaScript (React Native):** mobile frontend — cross-platform UI, screen components, and navigation. Chosen for its consistency across iOS and Android and the strength of the React Native ecosystem.
- **JavaScript (Node.js):** backend server environment — handles API requests and business logic.
- **SQL:** database interaction for users, goals, study sessions, and achievements.

---

## Platforms, APIs, Databases, and Other Technologies

- **React Native / Expo:** mobile interface framework, including navigation, status bar, font loading, and splash screen management.
- **Express.js:** RESTful API framework powering the "Trajectory API" backend.
- **Node.js:** backend server runtime environment.
- **React Navigation:** handles movement between the five main screens — Home, Log, Start (Pomodoro), Friends, and Profile.
- **REST APIs:** custom endpoints planned for authentication, users, goals, study sessions, achievements, and social features.
- **MySQL:** relational database for persistent storage of user data, sessions, and goals.
- **CORS & Dotenv:** cross-origin resource sharing middleware and environment variable management for the backend.

---

## Execution-Based Functional Testing

- **Navigation Routing:** verified the tab bar loads correctly and switches between all placeholder screens without errors.
- **API Connectivity:** tested the root endpoint (`/`) for a successful "Welcome to Trajectory API" response confirming the server starts and routes are registered.
- **Database Handshake:** executed `db.getConnection()` to confirm the backend can establish a connection to the MySQL database.
- **UI Rendering:** verified the HomeScreen and ProfileScreen correctly display user stats (Day Streak, Total Hours) and the achievement card section without layout errors.

---

## Execution-Based Non-Functional Testing

- **Visual Consistency:** verified the color palette (`#000814` backgrounds, `#FFC300` highlights) is applied consistently across all implemented screens.
- **Error Handling:** tested the backend 404 and 500 middleware to confirm JSON error responses are returned correctly with no server crashes.
- **Responsiveness:** confirmed ScrollView in the Profile and Community components allows vertical scrolling on smaller screen sizes without clipping content.

---

## Non-Execution-Based Testing

- **Code Inspections:** walkthroughs of `server.js` and `App.js` to confirm route modules (auth, goals, social) are correctly imported and wired up.
- **Peer Reviews:** team members review code pushes for timer functionality and screen connections before merging into the development branch.
- **Design Documentation Audit:** team reviewed requirements against the Figma design to confirm the dark theme, typography, and color system are consistently reflected in the UI implementation.
