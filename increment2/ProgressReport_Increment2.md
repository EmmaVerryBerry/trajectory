# Progress Report - Increment 2 - Group #8

---

## Team Members

| Name | FSU ID | GitHub ID |
|------|--------|-----------|
| Emma Berry | Emb23e | EmmaVerryBerry |
| Hailie Tucker | hlt22c | HailieT |
| Caitlin O’Donnel | cmo21e | [GitHub username] |
| Joseph Danielle | [FSU ID] | [GitHub username] |

---

## Project Title and Description

**Trajectory** (Academic Weapon Challenge)

Trajectory is a mobile application designed to help university students build and maintain strong academic habits. The app provides a structured environment for tracking study sessions, setting and monitoring academic goals, using a Pomodoro-based focus timer, connecting with peers for accountability, earning achievement badges for academic milestones, and engaging with a community feed. Trajectory targets the challenge of academic self-discipline by gamifying productive study behavior and fostering a community of motivated learners.

---

## Accomplishments and Overall Project Status During This Increment

### Design System Established
A complete design token system was built from scratch based on the Figma specifications:
- **Colors** (`src/constants/colors.js`) — full palette including primary (`#000814`), accent yellow (`#ffc300`), blues, grays, status colors, and transparency variants.
- **Typography** (`src/constants/Typography.js`) — font size scale, font weights, font families (Aldrich for headings, Space Grotesk for body), and text presets.
- **Spacing** (`src/constants/Spacing.js`) — spacing scale, border radius values, and standard component sizes.
- **Constants index** (`src/constants/index.js`) — central export for all design tokens.

### Reusable Component Library
Three core UI components were built to be reused across all screens:
- **Button** — supports primary (yellow), secondary (outlined), text, and disabled variants with loading state.
- **Input** — dark-themed text input with label, placeholder, error state, and validation feedback.
- **Card** — white/light surface card for content grouping with shadow.

### All Core Screens Implemented
Every screen in the application has been built with the full dark-theme design language:
- **LoginScreen** — email/password login with form validation, error messages, and navigation to Sign Up.
- **SignUpScreen** — full registration form (username, email, password, university, major) with field validation.
- **HomeScreen** — study streak display, daily goal progress, quick-action buttons.
- **ProfileScreen** — user stats, bio, and achievement summary.
- **CommunityScreen** — social feed with posts, like/comment interactions.
- **PomodoroScreen** — Pomodoro focus timer with start/pause/reset.
- **FriendsScreen** — friends list with study stats.
- **AchievementsScreen** — badge gallery with earned/locked states and progress indicators.
- **GoalSettingScreen** — goal creation and management interface.
- **LogSessionScreen** — manual study session logging.

### Navigation Architecture
- Stack + tab navigation implemented using React Navigation.
- Auth stack (Login → SignUp) conditionally rendered based on auth state.
- Main bottom tab navigator with 5 tabs: Home, Log, Start (Pomodoro), Friends, Badges.
- Custom tab icons and a center elevated Play button for the Pomodoro tab.

### App Configuration
- `app.json` updated with Expo configuration (bundle identifiers, orientation, asset patterns).
- `package.json` updated with all required dependencies.
- Placeholder image assets added for app icon, splash screen, adaptive icon, and favicon.
- Tab bar icon assets added for all five tabs.

### Bug Fixes
- Resolved Metro bundler crash from corrupted binary characters in `CommunityScreen.js`.
- Resolved `Asset not found: icon.png` error by generating valid placeholder PNG assets.

### Overall Project Status
The frontend of Trajectory is feature-complete at the UI/UX layer. All planned screens are implemented and navigable. The app launches correctly, progresses through the authentication flow, and all tab screens render as designed. The primary remaining work is backend integration — authentication, data persistence, and real-time social features have not yet been connected to a server.

---

## Challenges, Changes in the Plan and Scope of the Project and Things That Went Wrong During This Increment

**1. No Backend Integration**
Connecting the frontend to a live server proved more complex than initially scoped within this increment. Backend integration (user authentication, session storage, social features) is planned for Increment 3. It was planned to have this somewhat built out this increment but it wasn't able to be fully flushed out in the time.

**2. Asset and Bundler Issues**
The Metro bundler failed on startup due to two issues discovered early in the increment: corrupted binary data in a source file and missing required image assets. Both were resolved through debugging but consumed development time.

**3. Design Alignment**
The initial implementation diverged from the Figma design specs, inputs and card backgrounds rendered in white instead of the intended dark theme. This required revising the component library and all screen styles to align with the design system.

**4. Merge Conflicts**
Remote changes on the `development` branch introduced a simpler navigation structure with different screen names. This caused a merge conflict that was resolved by retaining the more complete navigation implementation.

---

## Team Member Contribution for This Increment

### Emma Berry
- **Progress Report:** Wrote all sections of this report.
- **Requirements and Design Document:** Wrote all of the increment two section updates from increment one.
- **Implementation and Testing Document:** Wrote all of the increment two section updates from increment one.
- **Source Code:** LoginScreen, SignUpScreen redesign; auth navigation flow; fixed Metro asset errors; fixed corrupted `CommunityScreen.js`; design token system (`colors.js`, `Typography.js`, `Spacing.js`, `index.js`); `Input` component dark theme update; `App.js` navigator restructure; placeholder PNG assets; Figma design; implementation of design; all screens.
- **Video:** Created, edited, and published the video for increment two

### Hailie Tucker
- **Progress Report:** [sections]
- **Requirements and Design Document:** [sections]
- **Implementation and Testing Document:** [sections]
- **Source Code:** [features]
- **Video:** [contribution]

### Caitlin O’Donnel
- **Progress Report:** [sections]
- **Requirements and Design Document:** [sections]
- **Implementation and Testing Document:** [sections]
- **Source Code:** [features]
- **Video:** [contribution]

### Joseph Danielle
- **Progress Report:** [sections]
- **Requirements and Design Document:** [sections]
- **Implementation and Testing Document:** [sections]
- **Source Code:** [features]
- **Video:** [contribution]

---

## Plans for the Next Increment

In Increment 3, the team plans to:

1. **Backend integration** — implement a REST API (Node.js/Express) and database (MySQL) to replace all static/mock data with live persistence.
2. **User authentication** — connect login and sign-up to a real auth system with secure password hashing and token storage.
3. **Study session persistence** — save logged sessions to the database and display real history on the Profile screen.
4. **Goal tracking** — persist goals to the backend and update completion status.
5. **Community feed** — connect posts, likes, and comments to live data.
6. **Friends system** — implement friend requests and activity feeds backed by the database.
7. **Achievement logic** — implement criteria checks that award badges based on real user activity data.
8. **Testing** — add unit and integration tests for critical user flows.
9. **Design Polishing** - complete polished designs and updates to fully reflect Figma prototype

---

## Stakeholder Communication

**Subject:** Trajectory App — Increment 2 Progress Update

Dear Stakeholders,

I am writing to share an update on the development of Trajectory, our academic productivity platform for university students.

This development phase focused on completing the full user-facing experience of the application. We are pleased to report that every major feature area of Trajectory is now built and navigable: study session logging, goal setting, a Pomodoro focus timer, peer connections, achievement badges, and a community feed. The visual design is polished and consistent throughout, reflecting the branding guidelines established at the start of the project.

The login and account creation experience includes complete input validation and a smooth flow into the main application. The Pomodoro timer provides a structured focus experience, the achievement system tracks progress toward academic milestones, and the community feed supports social engagement between students.

As is common in software development, connecting the user-facing experience to a live server involves architectural decisions that take time to get right. During this phase, the team made the deliberate choice to ensure the frontend was complete and high quality before introducing backend complexity. This approach ensures that when server integration is implemented in the next phase, it can be done cleanly without disrupting the user experience. Live data features, persistent accounts, real-time social interactions, and cloud-synced study data, are the focus of our next development phase.

We are confident in the quality of what has been built and look forward to bringing the full connected experience to users in our final increment.

Thank you for your continued support.

Best regards,
The Trajectory Development Team

---

## Link to Video

[https://canva.link/8yuyh01jnrtn8c3](https://canva.link/8yuyh01jnrtn8c3)
