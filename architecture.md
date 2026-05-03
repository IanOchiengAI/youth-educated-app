# Youth Educated App - Codebase Overview

This document provides a high-level overview of the application's architecture and directory structure to help understand the codebase before making drastic changes.

## Tech Stack Overview

- **Core Framework:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4, Lucide React (icons), Framer Motion (animations)
- **Backend & Database:** Supabase (Auth & Postgres DB)
- **Offline Storage:** Dexie.js (IndexedDB wrapper for offline capabilities)
- **Mobile Capabilities:** Capacitor (Android packaging, Push Notifications, Haptics, Splash Screen)
- **AI Integration:** Google Generative AI (Jabari AI integration)
- **Routing:** React Router v7
- **Data Visualization:** Recharts, Canvas Confetti

## Directory Structure

Here is the structural layout of the `src` directory where the application logic resides:

```text
src/
├── App.tsx                 # Main application component & routing setup
├── AppContext.tsx          # Global React Context (State management)
├── constants.ts            # Application-wide constants
├── index.css               # Global styles and Tailwind configuration
├── main.tsx                # Application entry point
├── api/                    # External API integrations
│   └── jabari.ts           # Jabari AI integration logic (Google Generative AI)
├── assets/                 # Static assets and graphics
│   └── store/              # App store graphics (splash, icons, etc.)
├── components/             # Reusable React components
│   ├── AchievementToast.tsx
│   ├── ErrorBoundary.tsx
│   ├── Layout.tsx          # Main application layout wrapper
│   ├── Leaderboard.tsx
│   ├── MoodTracker.tsx
│   ├── RoleRoute.tsx       # Role-based route protection
│   └── TierUpgrade*.tsx    # Gamification/Tier components
├── data/                   # Static/Offline JSON and TypeScript data structures
│   ├── careerQuestions.ts
│   ├── circles.ts
│   ├── jabariOffline.json  # Offline fallback data for Jabari
│   ├── modules.ts
│   └── opportunities.ts
├── hooks/                  # Custom React Hooks
│   ├── useContent.ts       # Content fetching/management hook
│   ├── useGamification.ts  # Gamification logic hook
│   └── useOnlineStatus.ts  # Network connectivity tracking hook
├── lib/                    # Core library wrappers and services
│   ├── auth.ts             # Authentication utilities
│   ├── db.ts               # Dexie local database setup for offline mode
│   ├── gamification.ts     # Core gamification engine logic
│   ├── notifications.ts    # Capacitor Push/Local Notifications logic
│   ├── safeguarding.ts     # Content safeguarding & moderation logic
│   ├── supabase.ts         # Supabase client initialization
│   └── sync.ts             # Online/Offline data synchronization logic
├── pages/                  # Route-level Page Components
│   ├── AdminDashboard.tsx
│   ├── CareerMapper.tsx
│   ├── Chat.tsx
│   ├── Circles.tsx
│   ├── Dashboard.tsx
│   ├── DSLDashboard.tsx    # Designated Safeguarding Lead Dashboard
│   ├── Goals.tsx
│   ├── Learn.tsx
│   ├── Mentor.tsx
│   ├── MentorDashboard.tsx
│   ├── ModuleView.tsx
│   ├── NotFound.tsx
│   ├── Onboarding.tsx
│   ├── Opportunities.tsx
│   ├── PrivacyPolicy.tsx
│   ├── Profile.tsx
│   ├── SignIn.tsx
│   └── VoiceChat.tsx
└── utils/                  # Helper utilities
    └── gamification.ts     # Utility functions for gamification
```

## Key Architectural Concepts

1. **Offline-First Capabilities:**
   - The app uses `Dexie` (in `lib/db.ts`) to store data locally via IndexedDB.
   - The `lib/sync.ts` file likely manages synchronizing this local data with the remote Supabase database when the `useOnlineStatus.ts` hook detects an active internet connection.

2. **State Management & Data Flow:**
   - Global state is primarily managed in `AppContext.tsx`.
   - Reusable logic and data fetching are abstracted into custom hooks (`useContent.ts`, `useGamification.ts`).

3. **Role-Based Access Control:**
   - The app features different user roles (e.g., standard users, mentors, admins, DSLs).
   - This is enforced at the routing level via `RoleRoute.tsx` and dedicated dashboard pages (`AdminDashboard`, `MentorDashboard`, `DSLDashboard`).

4. **Gamification Engine:**
   - Gamification is deeply integrated, with core logic in `lib/gamification.ts`, utilities in `utils/gamification.ts`, and UI components like `Leaderboard.tsx` and `TierUpgrade.tsx`.

5. **AI Integration (Jabari):**
   - The application has an AI assistant or tool named Jabari, integrated via `@google/generative-ai` in `api/jabari.ts`, with an offline fallback mechanism provided by `data/jabariOffline.json`.

6. **Safeguarding:**
   - Given the educational and youth-focused nature of the app, there is a dedicated `lib/safeguarding.ts` library and a `DSLDashboard.tsx` (Designated Safeguarding Lead) to ensure a safe environment.
