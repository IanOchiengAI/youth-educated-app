# CLAUDE.md — Youth Educated App

> This file is the canonical guide for any AI agent working in this codebase.
> Read it fully before writing a single line of code.

---

## Project Overview

**Youth Educated** is a mobile-first React PWA (also wrapped in Capacitor for Android) targeting Kenyan youth aged 10–22. It combines:

- **Jabari** — an AI mentor powered by Gemini 2.0 Flash
- **Human mentorship** — pairing, scheduling, and goal-setting between mentors and students
- **Life Skills content** — modular lessons with quizzes and insight prompts
- **Safeguarding** — a keyword-triggered escalation system (never bypass this)
- **Gamification** — points, tiers (Swahili-named), streaks, and achievements
- **Offline-first** — Dexie (IndexedDB) queue syncs to Supabase when online

The primary market is **Kenya** (all 47 counties). UI language is **English** and **Kiswahili** via a lightweight in-app i18n system. Auth is OTP via SMS — no passwords, no email.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 6 + TypeScript |
| Styling | Tailwind CSS v4 (custom design tokens) |
| Animation | Framer Motion via `motion` package |
| Routing | React Router v7 |
| State | React Context + `useReducer` (`AppContext.tsx`) |
| Offline DB | Dexie v4 (IndexedDB) |
| Backend | Supabase JS v2 (Auth, PostgreSQL, RLS) |
| AI | Google Gemini 2.0 Flash — via `jabari-chat` Supabase Edge Function (key never in frontend) |
| TTS | Web Speech API (free) / ElevenLabs (premium, optional) |
| Native | Capacitor 8 (Android — push notifications, haptics, status bar) |
| Deployment | Vercel (web) + Android APK via Capacitor |

---

## Commands

```bash
# Install dependencies
npm install

# Local dev server (port 3000)
npm run dev

# Production build
npm run build

# TypeScript type check (no emit) — use as CI gate
npm run lint

# Preview production build
npm run preview

# Seed Supabase tables from local data files (requires SUPABASE_SERVICE_ROLE_KEY in .env.local)
npx ts-node scripts/seed.ts
```

```bash
npm run test         # Run safeguarding test suite (vitest)
npm run test:watch   # Watch mode
npm run deploy:edge  # Deploy jabari-chat + check-session-followup to Supabase
```

Run `npm test` before every deploy to verify the safeguarding logic. Type-checking via `npm run lint` is also a CI gate — run it before declaring work done.

---

## Environment Variables

Copy `.env.example` to `.env` before running locally.

```
VITE_SUPABASE_URL          # Supabase project URL
VITE_SUPABASE_ANON_KEY     # Supabase public anon key (protected by RLS)
VITE_ELEVENLABS_API_KEY    # Optional — premium TTS voice
```

**`GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` must NOT be in `.env`.** Set them as Supabase Edge Function secrets only:
```bash
npx supabase secrets set GEMINI_API_KEY=your_key
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key
```

All `VITE_` vars are **public** (exposed in the browser bundle). Never put secret keys here. Supabase security is enforced by **Row Level Security**.

---

## Project Structure

```
src/
├── api/
│   └── jabari.ts            # All Gemini API calls — AI mentor logic
├── components/
│   ├── AchievementToast.tsx # Toast shown when an achievement unlocks
│   ├── ErrorBoundary.tsx    # Top-level error boundary
│   ├── Layout.tsx           # Shell: top bar + bottom nav + offline banner
│   ├── Leaderboard.tsx      # Weekly points leaderboard (fetches from Supabase by county)
│   ├── MoodTracker.tsx      # Mood check-in widget
│   ├── RoleRoute.tsx        # Route guard for mentor/admin/dsl roles
│   ├── SafeguardingCard.tsx # Renders escalation guidance cards
│   ├── TierUpgrade.tsx      # Confetti + tier-up celebration
│   └── TierUpgradeModal.tsx # Modal variant of tier upgrade
├── data/                    # Static fallback data (used when offline or Supabase tables empty)
│   ├── circles.ts           # Peer circle discussion prompts
│   ├── jabariOffline.json   # Canned Jabari responses for offline mode
│   ├── lifekit.ts           # Life Kit articles
│   ├── modules.ts           # Life skills module definitions
│   ├── opportunities.ts     # Scholarships / jobs / programs
│   ├── careerQuestions.ts   # Career mapper assessment questions
│   └── voices.ts            # TTS voice configurations
├── hooks/
│   ├── useGamification.ts   # Points, streaks, achievements — main hook
│   ├── useContent.ts        # Supabase-first, local fallback data fetching
│   └── useOnlineStatus.ts   # Online/offline detection
├── lib/
│   ├── auth.ts              # OTP send/verify, phone normalisation (E.164)
│   ├── db.ts                # Dexie schema — YouthEducatedDB class
│   ├── gamification.ts      # Pure functions: tiers, points, achievements
│   ├── i18n.ts              # Translation system (English ↔ Kiswahili)
│   ├── mentoring.ts         # Supabase queries: mentor pairs, profiles
│   ├── notifications.ts     # Capacitor push notifications + haptics
│   ├── safeguarding.ts      # ⚠️ Keyword escalation engine — do not modify lightly
│   ├── supabase.ts          # Supabase client singleton
│   ├── sync.ts              # Offline queue processor (flushes Dexie → Supabase)
│   └── tts.ts               # TTS service abstraction (Web Speech / ElevenLabs)
├── pages/
│   ├── AdminDashboard.tsx   # Admin-only panel
│   ├── ArticleDetail.tsx    # Life Kit article reader
│   ├── CareerMapper.tsx     # Career assessment + results
│   ├── Chat.tsx             # Jabari AI chat interface
│   ├── Circles.tsx          # Peer discussion circles
│   ├── Dashboard.tsx        # Home screen
│   ├── DSLDashboard.tsx     # DSL (Deputy/Safeguarding Lead) panel
│   ├── Goals.tsx            # Weekly goal setting
│   ├── Learn.tsx            # Life skills module browser
│   ├── Mentor.tsx           # Student → browse/connect with mentors
│   ├── MentorDashboard.tsx  # Mentor panel: students, endorsements
│   ├── ModuleView.tsx       # Lesson player inside a module
│   ├── NotFound.tsx         # Custom 404
│   ├── Onboarding.tsx       # Multi-step onboarding wizard
│   ├── Opportunities.tsx    # Jobs/scholarships feed (personalised by age/gender/county)
│   ├── PrivacyPolicy.tsx    # Static privacy policy
│   ├── Profile.tsx          # User profile + settings
│   ├── SessionCalendar.tsx  # Mentor session scheduling calendar
│   ├── SignIn.tsx           # OTP phone auth with international picker
│   └── VoiceChat.tsx        # Voice mode for Jabari
├── utils/
│   └── gamification.ts      # Additional gamification utilities
├── App.tsx                  # Router, lazy loading, Suspense boundary
├── AppContext.tsx            # Global state — THE source of truth
├── constants.ts             # MODULES, COUNTIES, GOAL_OPTIONS, CHAT_TREE
├── index.css                # Tailwind base + custom CSS variables
└── main.tsx                 # React root mount
scripts/
└── seed.ts                  # Seeds Supabase from local data files (run once per env)
```

---

## Data Model: Key Types

### `Module` (src/data/modules.ts)

```ts
interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;               // emoji
  min_age: number;
  is_sensitive: boolean;
  brothers_keepers_variant: boolean;
  lessons: number;            // count (NOT an array — the array is `content`)
  duration: string;
  competency: string;
  difficulty: string;
  content: Lesson[];          // the actual lesson objects
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  sections: LessonSection[];
}
```

**Important:** `lessons` is a numeric count; `content` is the lesson array. This is a common source of confusion — do not swap them.

### `LifeKitArticle` (src/data/lifekit.ts)

```ts
interface LifeKitArticle {
  id: string;
  title: string;
  title_sw: string;
  category: string;
  tags: string[];
  emoji: string;
  readTime: string;
  body: string;
  body_sw: string;
  month?: number;
}
```

Note: there is **no** `minAge`, `maxAge`, `isPremium`, or `content` field on `LifeKitArticle`. These were removed in a previous refactor. Do not re-add them without updating `useContent.ts`, `seed.ts`, and the Supabase table schema simultaneously.

---

## State Architecture

### Single source of truth: `AppContext.tsx`

All global state lives in one `AppState` object managed by `useReducer`. Components read via `useAppContext()`.

**Key state slices:**

```ts
AppState {
  user: User | null           // Profile, role, language, mentor pair
  progress: Progress          // Points, tier, streak, achievements
  modules: ModulesState       // In-progress, completed, per-lesson progress
  notifications: { unreadChat, unreadMentor }
  isOffline: boolean
  canAccessSRH: boolean       // Age-gated sexual/reproductive health content
  canAccessDrugModule: boolean
  careerResults: CareerResults | null
  circleType: 'mixed' | 'brothers_keepers'
  jabariGoals: string[]       // Mentor-set goals injected into Jabari's system prompt
  jabariAgenda: string
}
```

### Reducer actions

| Action | What it does |
|---|---|
| `SET_USER` | Set the authenticated user object |
| `UPDATE_PROGRESS` | Update points / streak / tier / achievements |
| `COMPLETE_LESSON` | Mark lesson done, sync to Supabase or queue offline |
| `AWARD_POINTS` | Award points and queue Supabase transaction |
| `SET_OFFLINE` | Toggle offline mode |
| `HYDRATE` | Restore state from localStorage on boot |
| `SYNC_FROM_SUPABASE` | Merge Supabase progress after sign-in |
| `SET_MENTOR_PAIR` | Store `mentorPairId` on user object |
| `SET_JABARI_VOICE` | Persist chosen TTS voice |

### Persistence flow (three layers)

1. **localStorage** — state is serialised on every change (debounced 500ms). Restored via `HYDRATE` on boot.
2. **Supabase** — authoritative. Synced on `SIGNED_IN` event and when online.
3. **Dexie (IndexedDB)** — offline queue. `sync.ts` flushes pending actions when connectivity returns.

### Critical: stale closure fix in `AppContext`

The Supabase `onAuthStateChange` listener is registered **once** (empty deps `[]`). It reads latest state via `stateRef.current` (a `useRef` updated on every render). Do **not** add state to that effect's dependency array.

```ts
// ✅ Correct
const stateRef = useRef(state);
useEffect(() => { stateRef.current = state; }, [state]);

useEffect(() => {
  supabase.auth.onAuthStateChange(async (event, session) => {
    // Always read stateRef.current — never read `state` directly here
  });
}, []); // intentionally empty
```

---

## User Roles

| Role | Access |
|---|---|
| `student` | All standard pages |
| `mentor` | Everything students have + `/mentor-dashboard` |
| `admin` | Everything + `/admin` panel |
| `dsl` | Everything + `/dsl` panel (Deputy Safeguarding Lead) |

Role routing is enforced client-side via `<RoleRoute>` **and** server-side via Supabase RLS. Never rely on client-side checks alone for data security.

---

## Authentication

- **Method:** SMS OTP via Supabase Auth (no passwords, no email)
- **Phone normalisation:** `lib/auth.ts` → `normalizePhone(phone, countryCode)` → E.164 format
- **Country picker:** 15 East/West African + UK/US/DE country codes in `SignIn.tsx`
- **Supported dialling codes:** 254 (KE), 256 (UG), 255 (TZ), 250 (RW), 251 (ET), 234 (NG), 233 (GH), 27 (ZA), 265 (MW), 260 (ZM), 263 (ZW), 243 (CD), 44 (GB), 1 (US), 49 (DE)

**After sign-in routing:**
- `dsl` → `/dsl`, `admin` → `/admin`, all others (including `mentor`) → `/dashboard`

**Dev bypass buttons** (only rendered when `import.meta.env.DEV`): student, mentor, admin bypasses that dispatch mock users without touching Supabase.

---

## Gamification System

All logic in `lib/gamification.ts` (pure functions) and `hooks/useGamification.ts`.

### Point values

| Action | Points |
|---|---|
| Complete lesson | 20 |
| Complete module | 150 |
| Daily check-in | 10 |
| Weekly reflection | 40 |
| AI interaction | 15 |
| Mentor session | 75 |
| Endorsement received | 100 |
| Onboarding complete | 50 |
| Mood check-in | 10 |
| Career assessment | 75 |
| Opportunity application | 50 |
| Circle response | 30 |
| Brothers Keepers circle response | 35 |
| Circle streak bonus | 50 |

### Tier system (Swahili names)

| Tier | Swahili | Points |
|---|---|---|
| Seedling | MCHANGA | 0–299 |
| Beginning | MWANZO | 300–899 |
| Grounded | MSIMAMO | 900–2,199 |
| Strength | NGUVU | 2,200–4,999 |
| Leader | KIONGOZI | 5,000+ |

Weekly points reset every Monday at midnight. Use `shouldResetWeeklyPoints(lastResetDate)` to check.

---

## Jabari AI Mentor

**File:** `src/api/jabari.ts` (frontend) + `supabase/functions/jabari-chat/index.ts` (Edge Function)

All Gemini calls are proxied through the `jabari-chat` Edge Function. The frontend builds the prompt and history, then posts to the Edge Function via `fetch()` with the user's Supabase auth token. The Gemini API key lives only in `Deno.env.get('GEMINI_API_KEY')` — it never touches the browser bundle or the APK.

- Model: `gemini-2.0-flash`
- Max output tokens: 600
- Temperature: 0.8
- Safety filters: `BLOCK_ONLY_HIGH` for explicit content, `BLOCK_MEDIUM_AND_ABOVE` for dangerous/hate/harassment

System prompt pulls in: user name, age bracket, county, goals, language preference, and mentor-set `jabariGoals` / `jabariAgenda`.

**Offline fallback:** `src/data/jabariOffline.json`

**Interaction modes:** `default`, `roleplay`, `quiz`

**Roleplay scenarios:** Job interview (Mr. Otieno), tricky parent talk (Mama K.), peer pressure (Jakes)

**Critical:** All user input passes through `safeguarding.ts` BEFORE being sent to Gemini. If a keyword is triggered, the AI call is **skipped entirely**.

---

## Safeguarding System

**File:** `src/lib/safeguarding.ts` — **do not refactor without explicit sign-off**

### Categories

| Category | Examples |
|---|---|
| A (Critical) | Self-harm, suicidal ideation, abuse, homelessness |
| B (Serious) | Threats, coercion, exploitation, food insecurity |
| C (Moderate) | Stress, relationship conflict, school pressure |
| D (Informational) | General SRH questions, mild concerns |

### Rules

1. **Category A or B:** AI response is entirely replaced by a hardcoded escalation text. Gemini is never called.
2. **Category C/D:** Gemini is called but response is prefixed with a safeguarding note.
3. When triggered, `safeguarding.ts` writes a row to the **`safeguarding_flags`** table (not `ai_conversations`). The DSL Dashboard reads from `safeguarding_flags`.
4. Escalation texts are verbatim — never make them configurable or dynamic.
5. Keywords include both English and Kiswahili terms.
6. **Never log safeguarding trigger content to analytics or Supabase** (beyond `safeguarding_flags` with category + source only).

---

## TTS (Text-to-Speech)

**File:** `src/lib/tts.ts`

- **`WebSpeechTTS`** — `window.speechSynthesis`. Free, works offline. Default.
- **`ElevenLabsTTS`** — premium African accent voice. Requires `VITE_ELEVENLABS_API_KEY`.

Voice selection stored in `user.jabariVoice` → `profiles.jabari_voice` in Supabase.

`Tutor Mode` (`slow_clear`) sets `utterance.rate = 0.8`.

---

## Offline-First Architecture

### Dexie tables (`lib/db.ts`)

| Table | Purpose |
|---|---|
| `syncQueue` | Pending actions to flush to Supabase |
| `modules` / `lessons` | Downloaded content metadata |
| `moduleProgress` | Per-user per-module lesson completion |
| `moodLogs` | Daily mood entries |
| `chatMessages` | Jabari conversation history |
| `circleResponses` | Peer circle discussion submissions |
| `goals` | Weekly goals — includes `remote_id` for sync matching |
| `achievements` | Unlocked achievements |
| `profile` | Cached user profile |

### Sync flow

1. Action fires → if online, write directly to Supabase; if offline, `queueOfflineAction()` writes to `syncQueue`.
2. On `window.online`, `processOfflineQueue()` in `sync.ts` flushes all pending items.
3. Goals use `remote_id` (the Supabase row `id`) to avoid duplicate completions on sync.

**Action types in queue:** `MOOD_LOG`, `LESSON_COMPLETE`, `CIRCLE_RESPONSE`, `GOAL_CREATE`, `GOAL_COMPLETE`, `AI_MESSAGE`, `POINT_TRANSACTION`

---

## Database Tables (Supabase)

| Table | Purpose |
|---|---|
| `profiles` | User data: name, county, role, points, streak, jabari_voice, push_token |
| `modules` | Module metadata: id, title, icon, min_age, is_sensitive, brothers_keepers_variant, lessons (count), duration, competency, difficulty |
| `lessons` | Lesson content per module: id, module_id, title, duration, sections (JSONB), sort_order |
| `lifekit_articles` | Articles: id, title, title_sw, category, tags, emoji, read_time, body, body_sw, month |
| `opportunities` | Scholarships/jobs: id, title, provider, description, category, points_required, deadline, gender, min_age, max_age, counties |
| `career_questions` | Assessment questions: id, text, options (JSONB), sort_order |
| `user_module_progress` | Per-user module completion, unique on `(user_id, module_id)` |
| `point_transactions` | Audit log of every point award |
| `ai_conversations` | Jabari message history per user |
| `mood_logs` | Daily mood check-in entries |
| `circle_responses` | Peer circle discussion submissions — scoped by `circle_id` (= user's county) |
| `safeguarding_flags` | Escalation events: user_id, category, message, source, status — read by DSL Dashboard |
| `mentor_matches` | Mentor–student pairing (status: pending/active/ended) |
| `mentor_profiles` | Mentor bio, expertise, avatar_url, is_verified |
| `mentor_pairs` | Simplified pairing table used by SessionCalendar |
| `mentor_sessions` | Scheduled sessions (pending/confirmed/completed/cancelled) |
| `goals` | Weekly student goals — includes remote_id for offline sync matching |

**All tables have RLS enabled.** Seeding requires a service role key (see `scripts/seed.ts`).

---

## Routing

Pages are **lazy-loaded** via `React.lazy()` with `<Suspense fallback={<PageLoader />}>`, except `SignIn`, `Onboarding`, and `NotFound` (eagerly loaded).

| Route | Auth | Roles |
|---|---|---|
| `/` | — | Redirects to `/dashboard` or `/signin` |
| `/signin` | — | All |
| `/onboarding` | — | All |
| `/dashboard` | ✅ | All |
| `/learn` | ✅ | All |
| `/learn/:moduleId` | ✅ | All |
| `/chat` | ✅ | All |
| `/chat/voice` | ✅ | All |
| `/circles` | ✅ | All |
| `/career-mapper` | ✅ | All |
| `/opportunities` | ✅ | All |
| `/mentor` | ✅ | All |
| `/goals` | ✅ | All |
| `/profile` | ✅ | All |
| `/calendar` | ✅ | All |
| `/mentor-dashboard` | ✅ | `mentor` only |
| `/admin` | ✅ | `admin` only |
| `/dsl` | ✅ | `admin`, `dsl` |
| `/privacy` | — | All |

---

## Bottom Navigation

Defined in `src/components/Layout.tsx`. Nav items built dynamically by role:

- **All authenticated users:** Home, Life Kit, Chat, Circles, Mentor, Calendar
- **Mentors also get:** My Panel (`/mentor-dashboard`)
- **Admins also get:** Admin (`/admin`)
- **DSLs also get:** DSL (`/dsl`)

Nav is hidden on `/onboarding`, `/signin`, and when `!state.user`. Mentor role badge (yellow pill) appears in the top bar for mentor users.

---

## i18n

**File:** `src/lib/i18n.ts`

Minimal custom system. Flat `Record<string, Record<Language, string>>` keyed by dot-notation strings.

```ts
import { useAppContext } from '../AppContext';
import { t, type Language } from '../lib/i18n';

const { state } = useAppContext();
const lang = (state.user?.language ?? 'English') as Language;
t('nav.home', lang)  // → 'Home' or 'Nyumbani'
```

Always derive `lang` from context — never use a bare string literal. Several pages currently render some English strings outside `t()` — see open issues.

---

## Design System

### Custom Tailwind tokens (`index.css`)

| Token | Usage |
|---|---|
| `bg-navy` / `text-navy` | Primary brand colour — deep navy |
| `bg-yellow` / `text-yellow` | Accent — warm yellow for CTAs |
| `bg-off-white` | Page background |
| `text-grey` | Secondary / muted text |
| `font-poppins` | Headings |
| `font-nunito` | Body text |

### Animation conventions

- Page transitions: `<PageWrapper>` — `opacity 0→1`, `y 10→0`, 0.2s
- `AnimatePresence mode="wait"` on route switch
- Card entry: `opacity 0→1`, `y 8→0`
- Bottom sheet springs: `damping: 26, stiffness: 300`
- Nav active indicator: `layoutId="nav-indicator"` shared motion div

### Mobile-first constraints

- Max width: `max-w-md mx-auto` on all containers
- Bottom nav height: `h-20`, `pb-24` on page content
- Tap targets: minimum `active:scale-95 transition-transform`

---

## Service Worker (`public/sw.js`)

- Cache name: `youth-educated-v3` — **bump `CACHE_VERSION` on every deploy** that changes shell files
- Network-first: `supabase.co` (Gemini calls now go through Supabase Edge Functions, not the browser)
- Cache-first: all static assets
- Precaches: `/`, `/index.html`, `/manifest.json`, `/logo-mark.png`, `/logo.png`

---

## Deployment

### Vercel (web)

`vercel.json` configures SPA rewrite (all routes → `/index.html`), 1-year immutable cache for `/assets/*`, `must-revalidate` for `/sw.js` and `/manifest.json`.

### Android (Capacitor)

```bash
npm run build && npx cap sync android && npx cap open android
```

Push notification token stored in `profiles.push_token` via `lib/notifications.ts`.

---

## Open Issues (as of 4 May 2026)

Full details with suggested fixes are in `DEV_BRIEF.md`. Summary:

### 🔴 Still open

| ID | Description |
|---|---|
| CRIT-02 | Dashboard "Continue Learning" progress bar is hardcoded to `w-0` — module selected dynamically but % complete not computed |
| CRIT-05 | Mentor "Connect" button calls `alert()` and does **not** write to `mentor_matches` — match request flow is unimplemented |

### ✅ Fixed

| ID | Description |
|---|---|
| BUILD-01 | `Learn.tsx` TS error — `lang` undefined in `ArticleCard` |
| CRIT-01 | Dashboard circle feed — now fetches real `circle_responses` |
| CRIT-03 | Dashboard Life Kit previews — now uses `LIFEKIT_ARTICLES` |
| CRIT-04 | Leaderboard — now fetches `profiles` by county from Supabase |
| CRIT-05 (partial) | Mentor browse view — now fetches from `mentor_profiles` |
| CRIT-06 | Opportunities personalisation filters re-enabled |
| CRIT-07 | Circles `circle_id` — now uses `state.user.county` |
| CRIT-08 | Goals `remote_id` sync tracking implemented |
| MED-01 | Safeguarding writes to correct `safeguarding_flags` table |

### 🟡 Medium (open)

| ID | Description |
|---|---|
| MED-02 | Admin Dashboard read-only, capped at 50 users, no mentor approval action |
| MED-03 | Supabase content tables may be unseeded — run `scripts/seed.ts` |
| MED-04 | Guardian phone collected at onboarding but not surfaced in DSL/Mentor dashboards |
| MED-05 | MentorDashboard student list may not fetch all mentees for mentors with multiple students |
| MED-06 | Opportunities deadlines may be stale in local fallback data |

### 🟢 Minor (open)

| ID | Description |
|---|---|
| MIN-01 | `supabase.ts` placeholder URL silently fails in prod if env vars missing |
| MIN-02 | i18n coverage incomplete — several pages have hardcoded English strings |
| MIN-03 | Circles safeguarding block uses `alert()` — should use `SafeguardingCard` component |
| MIN-04 | VoiceChat only reachable from Chat page, not listed in nav |
| MIN-05 | `sw.js` `CACHE_VERSION` must be bumped manually on every deploy |

---

## Conventions

### File naming
- Pages: `PascalCase.tsx` in `src/pages/`
- Components: `PascalCase.tsx` in `src/components/`
- Hooks: `camelCase.ts` prefixed with `use` in `src/hooks/`
- Lib: `camelCase.ts` in `src/lib/`

### Component patterns
- All pages are `React.FC` with no required props
- Context via `useAppContext()` — never prop-drill more than one level
- Supabase calls in `useEffect` or event handlers — never during render
- Always check `if (error)` on Supabase responses — never assume success

### Supabase query pattern
```ts
const { data, error } = await supabase
  .from('table_name')
  .select('col1, col2')
  .eq('user_id', state.user.id);

if (error) {
  console.error('[context] operation failed:', error.message);
  return;
}
```

### Adding a new page
1. Create `src/pages/NewPage.tsx`
2. Add lazy import in `App.tsx`
3. Add route with `<ProtectedRoute>` or `<RoleRoute>` wrapper
4. If nav item needed, add to `navItems` in `Layout.tsx`
5. Add i18n keys to `lib/i18n.ts`

### Adding a new gamification action
1. Add key + point value to `POINT_VALUES` in `lib/gamification.ts`
2. Call `addPoints('YOUR_ACTION')` via `useGamification()` in the component
3. Optionally add achievement logic to `checkAchievements()`

---

## What NOT to Do

- **Do not** add state to the Supabase auth listener's `useEffect` dep array in `AppContext.tsx`
- **Do not** call Gemini API directly from the frontend — always use the `jabari-chat` Edge Function
- **Do not** call Supabase inside `appReducer` — reducers must be pure; put side-effects in the dispatch wrapper
- **Do not** read `state` directly inside the auth `useEffect` — use `stateRef.current`
- **Do not** store service role keys in any `VITE_` env var
- **Do not** log phone numbers, guardian info, or safeguarding content to analytics
- **Do not** skip the safeguarding check before any Jabari AI call
- **Do not** modify `public/sw.js` without bumping `CACHE_VERSION`
- **Do not** add `localStorage`/`sessionStorage` directly in components — all persistence flows through `AppContext` or Dexie
- **Do not** confuse `Module.lessons` (a count) with `Module.content` (the lesson array)
- **Do not** add fields to `LifeKitArticle` without updating `useContent.ts`, `seed.ts`, and the Supabase schema together
