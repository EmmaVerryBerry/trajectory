# Software Implementation and Testing Document
**Trajectory (Academic Weapon Challenge)**
For Group [X] — Version 2.0
Authors: Emma Berry, [Teammate 2], [Teammate 3], [Teammate 4]

---

## 1. Programming Languages

### JavaScript (JSX)
- **Used in:** All frontend application code — screens, components, navigation, constants, and utility logic.
- **Reason:** React Native's primary language is JavaScript. JSX extends JS to allow writing UI components declaratively. The entire codebase uses modern ES2020+ JavaScript with JSX for all component definitions. JavaScript was chosen for its ubiquity in mobile development, the team's existing familiarity, and the strong React Native ecosystem built around it.

### JSON
- **Used in:** `app.json` (Expo app configuration) and `package.json` (dependency management).
- **Reason:** Standard configuration format for the Expo and Node.js ecosystems.

---

## 2. Platforms, APIs, Databases, and Other Technologies

### React Native (v0.76+)
- **Used in:** Core mobile UI framework. All screens, components, and navigation are built with React Native primitives (`View`, `Text`, `TextInput`, `TouchableOpacity`, `ScrollView`, `Image`, `StyleSheet`, etc.).
- **Why:** Cross-platform mobile development from a single JavaScript codebase targeting both iOS and Android. Strong community support and a large component ecosystem.

### Expo SDK (v52+)
- **Used in:** Application bootstrapping, asset management, splash screen control, font loading, and build tooling.
- **Components used:**
  - `expo-font` — loads Aldrich and Space Grotesk fonts before the app renders.
  - `expo-splash-screen` — keeps the splash screen visible while fonts are loading.
  - `expo-status-bar` — controls the iOS/Android system status bar appearance.
- **Why:** Expo's managed workflow simplifies device API access, asset bundling, and development builds without requiring native Xcode/Android Studio configuration.

### React Navigation (v6+)
- **Packages:** `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`
- **Used in:** All screen-to-screen navigation.
  - **Stack Navigator** — handles the Login → SignUp auth flow and the conditional auth gate.
  - **Bottom Tab Navigator** — five-tab main app navigation (Home, Log, Start/Pomodoro, Friends, Badges).
- **Why:** The standard navigation library for React Native. Provides native-feeling transitions and a declarative API.

### Expo Google Fonts
- **Packages:** `@expo-google-fonts/aldrich`, `@expo-google-fonts/space-grotesk`
- **Used in:** Typography throughout the entire app. Aldrich for headings and the app logo; Space Grotesk (Regular, Medium, Bold) for all body text and UI elements.
- **Why:** Custom fonts were specified in the Figma design. Expo Google Fonts integrates directly with `expo-font`'s `useFonts` hook.

### GitHub
- **Used in:** Version control, issue tracking, pull request management, and team collaboration.
- **Repository:** `https://github.com/EmmaVerryBerry/trajectory`
- **Branches:** `master` (production-stable), `development` (active development)
- **Issue Tracker:** Used to track all features and bugs per project requirements.

### Metro Bundler
- **Used in:** JavaScript bundling during development and production builds.
- **Why:** Default bundler for React Native/Expo. Handles module resolution, asset bundling, and hot reload.

### Backend / Database *(planned — not yet implemented)*
- A REST API backend (Node.js/Express or similar) and a database (PostgreSQL or Firebase) are planned for Increment 3 to replace the current static/mock data.

---

## 3. Execution-Based Functional Testing

Functional testing was performed manually using the Expo Go application on a physical iOS device and the iOS Simulator. Each functional requirement was exercised by running through the corresponding user flow.

| Test ID | Requirement | Test Description | Expected Result | Status |
|---------|------------|------------------|-----------------|--------|
| FT-01 | FR-01, FR-02, FR-03 | Register with valid username, email, 8+ char password, university, major | Navigates to main app | Pass |
| FT-02 | FR-05 | Submit Sign Up with all fields empty | Error messages shown for each field | Pass |
| FT-03 | FR-02 | Enter invalid email (e.g. "notanemail") | "Invalid email format" error shown | Pass |
| FT-04 | FR-03 | Enter password shorter than 8 characters | "Password must be at least 8 characters" error shown | Pass |
| FT-05 | FR-04, FR-06 | Log in with valid credentials | App resets navigation to Main tabs | Pass |
| FT-06 | FR-05 | Submit Login with empty fields | "Email is required" and "Password is required" errors shown | Pass |
| FT-07 | FR-14, FR-15 | Tap Start on Pomodoro screen | Timer counts down from 25:00 | Pass |
| FT-08 | FR-15 | Tap Pause during active timer | Timer pauses at current value | Pass |
| FT-09 | FR-23 | Navigate to Community screen | Feed posts render correctly | Pass |
| FT-10 | FR-25 | Tap like icon on a community post | Like icon activates; like count increments | Pass |
| FT-11 | FR-26 | Navigate to Profile screen | Username, stats, and badges display | Pass |
| FT-12 | FR-19 | Navigate to Achievements screen | Badge grid shows earned and locked badges | Pass |

---

## 4. Execution-Based Non-Functional Testing

### NFR-01: Performance
- **Test:** Measured app cold start time from launch to main screen rendered on an iPhone running iOS 17.
- **Result:** App fully loaded (fonts loaded, splash dismissed, home screen visible) in approximately 2.1 seconds on Wi-Fi. Meets the ≤ 3 second requirement.

### NFR-02: Usability / Accessibility
- **Test:** Visually inspected all screens for color contrast using the WebAIM contrast checker applied to the design tokens.
- **Result:** Primary text (white `#FFFFFF` on dark `#000814`) achieves a 21:1 contrast ratio — well above WCAG AA minimum of 4.5:1. Yellow accent (`#ffc300`) on dark background achieves ~9.5:1. Gray placeholder text is borderline; flagged for improvement.

### NFR-03: Reliability
- **Test:** Navigated through all screens repeatedly in varying orders for 30+ minutes.
- **Result:** No crashes observed during normal navigation flows.

### NFR-05: Portability
- **Test:** Ran the app on iOS Simulator (iPhone 15 Pro, iOS 17) and a physical Android device via Expo Go.
- **Result:** All screens rendered correctly on both platforms with consistent font and icon behavior.

### NFR-08: Offline (Pomodoro Timer)
- **Test:** Enabled airplane mode, then launched the Pomodoro timer.
- **Result:** Timer started and counted down correctly with no network connection.

---

## 5. Non-Execution-Based Testing

### Code Reviews
The team conducted code reviews via GitHub pull requests for all major feature branches. Reviewers checked for:
- Consistent use of the design token system (no hardcoded color/spacing values)
- Proper component reuse (`Button`, `Input`, `Card` from `src/components/common`)
- Correct navigation patterns (`navigation.navigate`, `navigation.reset`)
- Absence of logic errors in form validation
- Readable variable and function names

### Static Analysis
The Expo/Metro bundler performs module-level static analysis at build time. Missing imports, unresolved modules, or syntax errors cause a build failure before runtime. The corrupted `CommunityScreen.js` file was caught by Babel's parser at bundle time — an example of static analysis detecting a defect before it reached runtime.

### Walkthrough
The team walked through the complete registration and login flow as a group, verifying that form errors clear correctly when users fix their input, and that navigation reset behaves correctly on successful auth.
