# Software Implementation and Testing Document
Group 8 | Version 2.0 | Authors: Hailie Tucker, Emma Berry, Caitlin O'Donnell, Joseph Daniele

---

## Programming Languages

- **JavaScript (React Native):** mobile frontend — all screen components, navigation, design tokens, and UI logic. Chosen for cross-platform consistency and the strength of the React Native/Expo ecosystem.
- **JavaScript (Node.js):** backend server environment — handles API requests and business logic (planned for Increment 3).
- **SQL:** database interaction for users, goals, study sessions, and achievements (planned for Increment 3).

---

## Platforms, APIs, Databases, and Other Technologies

- **React Native / Expo:** mobile interface framework covering navigation, status bar, font loading, splash screen management, and asset bundling.
- **Expo Font / Google Fonts:** loads Aldrich (headings) and Space Grotesk (body) typefaces before the app renders, matching the Figma design spec.
- **React Navigation:** handles movement between all screens — Home, Log, Start (Pomodoro), Friends, and Badges tabs, plus the Login/SignUp auth stack.
- **Express.js:** RESTful API framework for the planned "Trajectory API" backend.
- **Node.js:** planned backend server runtime.
- **MySQL:** planned relational database for persistent storage of user data, sessions, and goals.
- **REST APIs:** custom endpoints planned for authentication, users, goals, study sessions, achievements, and social features.
- **CORS & Dotenv:** cross-origin resource sharing middleware and environment variable management for the backend.

---

## Execution-Based Functional Testing

- **Auth Flow:** verified that submitting the Sign Up form with valid inputs (username, email, 8+ character password, university, major) navigates to the main app. Confirmed field-specific error messages appear for empty or invalid inputs.
- **Navigation Routing:** verified the tab bar loads and switches correctly between all five screens — Home, Log, Start, Friends, and Badges — without errors.
- **Pomodoro Timer:** confirmed the timer starts at 25:00, counts down correctly, and pauses/resets as expected.
- **Community Feed:** verified posts render correctly and the like button toggles state and increments the count.
- **UI Rendering:** verified all screens (Home, Profile, Achievements, Friends, Community, GoalSetting, LogSession) render without layout errors on iOS.

---

## Execution-Based Non-Functional Testing

- **Visual Consistency:** verified the color palette (`#000814` backgrounds, `#FFC300` highlights, Aldrich + Space Grotesk fonts) is applied consistently across all screens.
- **Performance:** app cold start from launch to home screen measured at approximately 2.1 seconds on Wi-Fi — within the 3-second target.
- **Offline Reliability:** confirmed the Pomodoro timer functions correctly with airplane mode enabled.
- **Error Handling:** tested the backend 404 and 500 middleware to confirm JSON error responses are returned correctly with no server crashes.
- **Responsiveness:** confirmed ScrollView components in Profile, Community, and GoalSetting allow vertical scrolling without clipping content on smaller screen sizes.

---

## Non-Execution-Based Testing

- **Code Inspections:** walkthroughs of `App.js` and all screen files to confirm the navigation structure, component reuse (Button, Input, Card), and design token usage are consistent and correct.
- **Peer Reviews:** team members review code pushes for screen implementation, timer functionality, and auth flow before merging into the development branch.
- **Design Documentation Audit:** team reviewed all screens against the Figma design spec to confirm dark theme, typography, spacing, and color system are consistently reflected throughout the implementation.
