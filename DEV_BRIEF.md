# Youth Educated App — Developer Brief
**Version:** 1.2 | **Date:** 4 May 2026 | **Prepared for:** AI/Engineering Team

> **Status legend:** ✅ Resolved | 🔴 Critical open | 🟡 Medium open | 🟢 Minor open

### Quick status summary

| ID | Status | Description |
|---|---|---|
| BUILD-01 | ✅ | `Learn.tsx` TS build error fixed |
| CRIT-01 | ✅ | Dashboard circle feed fetches real data |
| CRIT-02 | ✅ | Continue Learning progress bar computed from `moduleProgress` |
| CRIT-03 | ✅ | Dashboard Life Kit uses real `LIFEKIT_ARTICLES` |
| CRIT-04 | ✅ | Leaderboard fetches from Supabase by county |
| CRIT-05 | ✅ | Mentor "Connect" wired to `requestMentorMatch()` with loading state |
| CRIT-06 | ✅ | Opportunities personalisation filters enabled |
| CRIT-07 | ✅ | Circles `circle_id` uses `state.user.county` |
| CRIT-08 | ✅ | Goals `remote_id` tracking implemented |
| MED-01 | ✅ | Safeguarding writes to `safeguarding_flags` (DSL Dashboard now works) |
| MED-02 | 🟡 | Admin Dashboard read-only, no mentor approval |
| MED-03 | 🟡 | Supabase content tables may be unseeded |
| MED-04 | 🟡 | Guardian phone not surfaced in DSL/Mentor views |
| MED-05 | 🟡 | MentorDashboard may not fetch all mentees |
| MED-06 | 🟡 | Opportunity deadlines stale in local fallback |
| MIN-01 | ✅ | `supabase.ts` throws hard error in prod if env vars missing |
| MIN-02 | 🟢 | i18n coverage incomplete |
| MIN-03 | 🟢 | Circles safeguarding block uses `alert()` |
| MIN-04 | 🟢 | VoiceChat not in nav |
| MIN-05 | 🟢 | `sw.js` cache version must be bumped manually |

---

## Overview

Youth Educated is a mobile-first React PWA (also wrapped in Capacitor for Android) targeting Kenyan youth aged 10–22. It combines an AI mentor (Jabari, powered by Gemini 2.0 Flash), human mentorship matching, life-skills content, safeguarding, and gamification. Backend is Supabase (PostgreSQL + RLS + Auth). State management is React Context + Dexie (IndexedDB) for offline-first support.

**Tech stack:**
- React 19 + Vite 6 + TypeScript
- Tailwind CSS v4 (custom theme tokens) + Framer Motion
- Supabase JS v2 (auth, database, realtime)
- Dexie v4 (offline IndexedDB layer with sync queue)
- Google Generative AI SDK (`@google/generative-ai`) — Gemini 2.0 Flash
- Capacitor 8 (Android wrapper)

**Key files:**
- `src/AppContext.tsx` — global state + reducer
- `src/api/jabari.ts` — all Gemini API calls
- `src/lib/safeguarding.ts` — keyword-based escalation engine
- `src/lib/sync.ts` — offline queue processor
- `src/hooks/useContent.ts` — Supabase-first, local fallback data fetching
- `src/data/` — local fallback data files (lifekit, modules, opportunities, etc.)

---

## Issue Registry

Issues are categorised into three severity tiers:

- 🔴 **CRITICAL** — Fake/hardcoded data that is visibly broken in a live demo or production environment
- 🟡 **MEDIUM** — Functional gaps that will surface under real usage
- 🟢 **MINOR** — Code quality, safety, and completeness

---

## 🔴 CRITICAL Issues

---

### ✅ BUILD-01 — `Learn.tsx` TypeScript Error Blocks Production Build (RESOLVED)

**File:** `src/pages/Learn.tsx` (lines 31, 39)

**Problem:**
`npm run build` (and `npm run lint`) fails with two TypeScript errors:

```
src/pages/Learn.tsx(31,10): error TS2304: Cannot find name 'lang'.
src/pages/Learn.tsx(39,31): error TS2304: Cannot find name 'lang'.
```

The `ArticleCard` sub-component (defined inside `Learn.tsx`) uses `lang` on lines 31 and 39 but never declares it. The rest of the app derives `lang` from `AppContext`.

**Failing lines:**
```tsx
// line 31
{lang === 'Kiswahili' ? article.title_sw : article.title}

// line 39
{t('tag.' + tag, lang)}
```

**Required fix:**
Add `lang` as a prop to `ArticleCard`, or read it from context inside the component:

```tsx
// Option A — read from context inside ArticleCard (preferred, consistent with other pages)
const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const { state } = useAppContext();
  const lang = (state.user?.language ?? 'English') as Language;
  // ... rest of component
};

// Option B — pass as prop
interface ArticleCardProps {
  article: LifeKitArticle;
  lang: Language;
}
```

`Language` is already exported from `src/lib/i18n.ts`. `useAppContext` is imported from `../AppContext`. Neither import is new — both are already at the top of `Learn.tsx`.

**Effort:** ~5 minutes. This must be done before any other work since the build is broken.

---

### ✅ CRIT-01 — Dashboard: Circle Activity Feed (RESOLVED)

**File:** `src/pages/Dashboard.tsx` (approx. line 115–145)

**Problem:**
The "Circle Activity" section renders three static cards with hardcoded users (Juma, Zainab, Mwangi), hardcoded emoji avatars, and hardcoded copy strings. This data does not come from the database.

```tsx
// Current — FAKE
{[1, 2, 3].map((i) => (
  <div key={i} className="min-w-[280px] ...">
    <div>🦁 / 🦒 / 🐘</div>
    <h4>{['Juma', 'Zainab', 'Mwangi'][i-1]}</h4>
    <p>{i === 1 ? "Just completed the High Confidence module..." : ...}</p>
  </div>
))}
```

**Required fix:**
Fetch the 3 most recent `circle_responses` rows from Supabase (or from Dexie when offline), joining with the `profiles` table to get the author name. Each card should render the real `response_text`, author name, and time elapsed since `created_at`.

**Supabase query (suggested):**
```sql
SELECT cr.response_text, cr.created_at, p.name
FROM circle_responses cr
JOIN profiles p ON p.id = cr.user_id
ORDER BY cr.created_at DESC
LIMIT 3;
```

**Offline fallback:** Return the 3 most recent rows from `db.circleResponses` via Dexie.

---

### 🔴 CRIT-02 — Dashboard: "Continue Learning" Progress Bar Hardcoded to 0%

**File:** `src/pages/Dashboard.tsx` (approx. line 190)

**Partially fixed:** The module shown is now dynamic — it uses the first module not in `state.modules.completed`. However, the progress bar is still a static `w-0`:

```tsx
// Current — still broken
<div className="w-0 h-full bg-yellow rounded-full" />
```

**Required fix:**
Compute the percentage from `state.modules.moduleProgress` and apply it as an inline style or Tailwind width. Also prefer `state.modules.inProgress` over `completed` exclusion, and show a "Start your first module" CTA when `inProgress` is empty.

```ts
const inProgressId = state.modules.inProgress[state.modules.inProgress.length - 1];
const moduleData = MODULES.find(m => m.id === inProgressId);
const progress = state.modules.moduleProgress[inProgressId];
// Note: Module.lessons is a count (number), Module.content is the lesson array
const percent = progress
  ? Math.round((progress.completedLessons.length / (moduleData?.content.length || 1)) * 100)
  : 0;
```

```tsx
<div className="h-full bg-yellow rounded-full" style={{ width: `${percent}%` }} />
```

---

### ✅ CRIT-03 — Dashboard: Life Kit Article Previews (RESOLVED)

**File:** `src/pages/Dashboard.tsx` (approx. line 180–215)

**Problem:**
Three articles in the "From the Life Kit" section are statically defined inline:

```tsx
// Current — FAKE
{[
  { emoji: '💙', title: 'Feeling overwhelmed? Try this 5-minute reset', tags: ['Stress', 'MentalHealth'], readTime: '2 min' },
  { emoji: '🚀', title: 'Do not know what you want to be? Start here', ... },
  { emoji: '💰', title: 'Got pocket money?...', ... },
].map(...)}
```

**Required fix:**
Import `LIFEKIT_ARTICLES` from `src/data/lifekit.ts` (already used in `Learn.tsx`) and display the first 3 articles from the array, filtered by the user's age bracket and existing access rules. Wrap in an `onClick` that navigates to `/learn/article/${article.id}`.

---

### ✅ CRIT-04 — Leaderboard (RESOLVED)

**File:** `src/components/Leaderboard.tsx`

**Problem:**
The leaderboard generates 10 fake cohort members with hardcoded Kenyan names and arbitrary point values using `useMemo`. Only the current user's own points are real. No data is fetched from Supabase.

```tsx
// Current — FAKE
const members = [
  { name: 'Keziah M.', points: 1240, isUser: false },
  { name: 'Otieno J.', points: 1150, isUser: false },
  // ... 8 more fake entries
];
```

**Required fix:**
Fetch the top 10 users by `points` from Supabase, scoped to the current user's county (cohort grouping). Mark the current user's entry with `isUser: true`. Add a loading skeleton state while fetching.

**Supabase query (suggested):**
```sql
SELECT id, name, points, county
FROM profiles
WHERE county = $user_county
ORDER BY points DESC
LIMIT 10;
```

**Offline fallback:** Show only the current user's entry with a "Leaderboard unavailable offline" notice.

---

### 🔴 CRIT-05 — Mentor Page: Browse Fixed, Connect Button Still Broken

**File:** `src/pages/Mentor.tsx`

**Partially fixed:** Browse view now fetches from `mentor_profiles` and match status is queried from `mentor_matches`. Search input has `onChange` wired.

**Remaining problem (`src/pages/Mentor.tsx` line 222–224):**
The "Connect" button still calls `alert()` and does **not** write to `mentor_matches`:

```tsx
onClick={() => {
  // In a real flow, this would create a 'pending' mentor_matches request
  alert(`Connection request sent to ${m.name}!`);
}}
```

**Required fix:**
Replace with a real Supabase insert. Use `lib/mentoring.ts` → `requestMentorMatch(studentId, mentorId)` which already exists. On success, set `isMatched = true` and refresh the match data.

```ts
await requestMentorMatch(state.user.id, m.id);
// then re-fetch active match to update UI
```

---

### ✅ CRIT-06 — Opportunities Personalisation Filter (RESOLVED)

**File:** `src/pages/Opportunities.tsx` (line 41)

**Problem:**
The filter logic for age, gender, and county was written but is commented out, meaning every user sees every opportunity regardless of their profile:

```ts
return matchesSearch && matchesCategory; // && matchesAge && matchesGender && matchesCounty;
```

**Required fix:**
Re-enable the personalisation filters. Verify the filter logic against the `Opportunity` type in `src/data/opportunities.ts` — specifically check that `minAge`, `maxAge`, `gender`, and `counties` fields are present and correctly typed on all records.

---

### ✅ CRIT-07 — Circles: `circle_id` (RESOLVED)

**File:** `src/pages/Circles.tsx` (line 90)

**Problem:**
Every circle response is posted with `circle_id: 'default-circle-id'`, with a comment acknowledging this is not real:

```ts
const payload = {
  circle_id: 'default-circle-id', // In a real app, this would be dynamic
  week_number: weekNumber,
  response_text: responseText
};
```

**Required fix:**
Determine the correct circle assignment logic. The likely intent is that circles are scoped by cohort (county or school). Look up the user's circle assignment from a `circles` or `cohort_assignments` table, or derive `circle_id` from `state.user.county` if circles are county-scoped. Use that value in the payload instead of the hardcoded string.

---

### ✅ CRIT-08 — Goals: Remote ID Tracking (RESOLVED)

**File:** `src/pages/Goals.tsx` (approx. line 84)

**Problem:**
The comment in `toggleGoal()` reads:

```ts
// In a real app, 'goals' table would have a 'remote_id'.
```

The local Dexie `goals` table stores goals with a local auto-increment `id`. When a goal is completed offline and then synced, there is no reliable way to match the local record to the Supabase row — this can result in duplicate completions or failed syncs silently passing.

**Required fix:**
Add a `remote_id: string | null` column to the Dexie `goals` table schema and increment the Dexie version. When a goal is created online, store the Supabase-returned `id` as `remote_id`. Update `sync.ts` `GOAL_COMPLETE` handler to use `remote_id` when sending the completion event to Supabase.

---

## 🟡 MEDIUM Issues

---

### ✅ MED-01 — Safeguarding Table Mismatch (RESOLVED)

**Files:** `src/lib/safeguarding.ts`, `src/pages/Circles.tsx`, `src/pages/DSLDashboard.tsx`

**Problem:**
The DSL Dashboard (`DSLDashboard.tsx`) reads from a `safeguarding_flags` table:

```ts
const { data, error } = await supabase.from('safeguarding_flags').select('*');
```

But the actual safeguarding trigger in `Circles.tsx` writes to `ai_conversations` with `safeguarding_flagged: true`:

```ts
await supabase.from('ai_conversations').upsert({
  user_id: state.user.id,
  message_history: [...],
  safeguarding_flagged: true,
  updated_at: new Date().toISOString()
});
```

These two are not connected. The DSL Dashboard will always be empty because safeguarding events are not written to `safeguarding_flags`.

**Required fix:**
When a safeguarding trigger fires (categories A, B, C), write a row to `safeguarding_flags` with the `user_id`, `category`, a sanitised version of the message (not the verbatim content if category A), and `status: 'pending'`. Do this in `safeguarding.ts` as a side-effect or call it from each page that uses `checkSafeguarding()` (currently: `Chat.tsx`, `VoiceChat.tsx`, `Circles.tsx`).

**Safeguarding schema (minimum required):**
```sql
CREATE TABLE safeguarding_flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  category TEXT CHECK (category IN ('A', 'B', 'C', 'D')),
  message TEXT,
  source TEXT, -- 'chat' | 'voice' | 'circle'
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### MED-02 — Admin Dashboard is Read-Only and Capped at 50 Users

**File:** `src/pages/AdminDashboard.tsx`

**Problem:**
The Admin Dashboard fetches the 50 most recent profiles but provides no actions. Admins cannot approve mentors, change roles, suspend accounts, or view more than 50 users. The dashboard will become misleading as user count grows.

**Required fix:**
1. Add pagination (offset-based or cursor-based)
2. Add a "Pending Mentor Approvals" section — filter profiles where `mentor_approved = false` and `role = 'mentor'`
3. Add an "Approve" action that sets `mentor_approved = true`
4. Consider an RLS policy verification — admins should only be able to call these updates if the Supabase RLS policy checks for `role = 'admin'`

---

### MED-03 — Supabase Content Tables May Be Unseeded

**File:** `src/hooks/useContent.ts`

**Problem:**
`useContent.ts` attempts to fetch from `career_questions`, `opportunities`, and `modules` tables in Supabase, falling back to local data files if the tables are empty. This is correct behaviour for offline support, but if the Supabase tables are empty in production, the app will silently run on stale bundled data — and any content updates made in Supabase will require a code deployment to take effect.

**Required fix:**
1. Confirm whether the Supabase content tables are populated. Check via Supabase Studio or `SELECT COUNT(*) FROM career_questions`.
2. If they are empty, either seed them from the local data files or document that bundled data is the intended CMS.
3. If Supabase is the intended CMS, add a simple admin UI or Supabase table editor workflow for content editors to manage articles, modules, and opportunities without code changes.

---

### MED-04 — Guardian Consent Phone Number Has No Downstream Use

**File:** `src/pages/Onboarding.tsx`

**Problem:**
The onboarding flow collects a guardian phone number and consent checkbox for users aged 10–15. This data is stored in the profile, but there is no visible place where it surfaces — not in the Mentor Dashboard, not in the DSL Dashboard, not in Admin.

**Required fix:**
Decide where guardian contact should appear. The most logical place is:
- The DSL Dashboard, shown alongside safeguarding flags for the relevant student
- The Mentor Dashboard, shown in the student detail card

Surface `guardian_phone` from the relevant `profiles` row in those views.

---

### MED-05 — MentorDashboard: Student List is Not Fetched

**File:** `src/pages/MentorDashboard.tsx`

**Problem:**
The Mentor Dashboard fetches AI check-in summaries and goal data but does not fetch its list of students dynamically. The student cards are populated from `mentor_matches` data, but it's unclear whether the initial student list populates correctly for a mentor who has multiple mentees, or whether it defaults to an empty state.

**Required fix:**
Add an explicit fetch of all active `mentor_matches` where `mentor_id = state.user.id` and `status = 'active'`, then for each match, fetch the corresponding student `profiles` row. This ensures mentors with multiple mentees see all of them.

---

### MED-06 — Opportunities Data May Have Stale Deadlines

**File:** `src/data/opportunities.ts`

**Problem:**
The local fallback opportunities data contains hardcoded deadline dates. Without a CMS or Supabase seed pipeline, these deadlines will silently expire and users will see opportunities marked "Apply anytime" that are actually closed, or see negative day counts.

**Required fix:**
Either (a) move opportunities to Supabase and set up a process to keep deadlines current, or (b) add a guard in `getUrgency()` that returns `null` (and hides the deadline chip) when `days < 0`, so expired opportunities don't show misleading urgency labels. Option (a) is strongly preferred.

---

## 🟢 MINOR Issues

---

### MIN-01 — `.env` Safety: Placeholder Supabase URL Should Fail Loudly in Production

**File:** `src/lib/supabase.ts`

The `createClient` call falls back to a placeholder URL if env vars are missing:

```ts
const PLACEHOLDER_URL = 'https://placeholder.supabase.co'
export const supabase = createClient(supabaseUrl || PLACEHOLDER_URL, ...)
```

This prevents crashes in development but will silently fail in production if env vars are not set on Vercel/the hosting platform. All Supabase calls will fail silently, returning errors that are swallowed.

**Fix:** In the production build, add an env var check that throws a hard error at startup if `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are missing. Keep the graceful fallback only for local development.

---

### MIN-02 — i18n Coverage is Partial

**File:** `src/lib/i18n.ts`

The `t()` function provides English and Kiswahili translations for nav, dashboard, onboarding, and action labels. However, several pages (`Opportunities.tsx`, `CareerMapper.tsx`, `Goals.tsx`, `MentorDashboard.tsx`) render hardcoded English strings directly in JSX without going through `t()`.

**Fix:** Audit all JSX string literals across pages and move them into the `TRANSLATIONS` map in `i18n.ts`. This is low-risk but important before any Kiswahili-first users try the app.

---

### MIN-03 — Circles Page: Alert Used for Safeguarding Message

**File:** `src/pages/Circles.tsx` (line ~92)

```ts
alert("Please keep our community safe. Your message contains sensitive content.");
```

A browser `alert()` is used to notify the user of a safeguarding block. This is jarring, inaccessible, and breaks the app's visual consistency.

**Fix:** Replace with the existing `SafeguardingCard` component (already used in `Chat.tsx` and `VoiceChat.tsx`) rendered inline, or use a motion-animated modal matching the app's design system.

---

### MIN-04 — VoiceChat is Not Linked from the Main Navigation

**File:** `src/components/Layout.tsx`, `src/pages/VoiceChat.tsx`

`VoiceChat.tsx` exists and appears complete (mic, TTS, Jabari integration, safeguarding) but is not listed in the nav items and can only be reached via a direct link from `Chat.tsx`. It may be intentionally gated, but if it's a shipped feature it should either appear in nav or have a documented entry point.

**Fix:** Clarify intent. If VoiceChat is a feature, add a mic button to the Chat page header that navigates to `/voice-chat`. If it's deprioritised, remove the route from `App.tsx` to avoid dead-end navigation.

---

### MIN-05 — Dexie Schema Version Not Incremented for Goals `remote_id` Change

**File:** `src/lib/db.ts`

When the `remote_id` column is added to the `goals` table (per CRIT-08), the Dexie database version **must** be incremented. Failing to do so will silently ignore the new column on existing installs.

```ts
// Correct pattern:
this.version(2).stores({
  goals: '++id, userId, remote_id, isCompleted, weekNumber, synced',
  // ... other tables unchanged
});
```

---

## Implementation Priority Order (updated 4 May 2026)

Items BUILD-01, CRIT-01, CRIT-03–08, and MED-01 are resolved. Remaining work:

1. **CRIT-02** — Dashboard Continue Learning progress bar (`Dashboard.tsx` ~line 190): add `style={{ width: \`${percent}%\` }}` using `state.modules.moduleProgress`
2. **CRIT-05** — Mentor Connect button (`Mentor.tsx` ~line 222): replace `alert()` with `requestMentorMatch(state.user.id, m.id)` from `lib/mentoring.ts`
3. **MED-02** — Admin Dashboard: add pagination + mentor approval action
4. **MED-03** — Run `scripts/seed.ts` to populate Supabase content tables
5. **MED-04** — Surface `guardian_phone` in DSL and Mentor dashboards
6. **MED-05** — MentorDashboard: ensure all mentees fetched for mentors with multiple students
7. **MED-06** — Expire or move opportunity deadlines to Supabase
8. **MIN-01** — `supabase.ts`: throw hard error in prod build if env vars missing
9. **MIN-02** — Audit JSX for hardcoded English strings; move to `i18n.ts`
10. **MIN-03** — Circles: replace `alert()` safeguarding block with `<SafeguardingCard>`
11. **MIN-04** — Add mic button on Chat page linking to `/chat/voice`
12. **MIN-05** — Bump `CACHE_VERSION` in `sw.js` before first production deploy

---

## Environment Setup Notes

The app requires the following environment variables:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GEMINI_API_KEY=
```

A `.env.example` file is present. Copy to `.env` before running:
```bash
cp .env.example .env
```

To run locally:
```bash
npm install
npm run dev     # starts on port 3000
```

To build for production:
```bash
npm run build
```

Android build (requires Android Studio + Capacitor CLI):
```bash
npm run build && npx cap sync android && npx cap open android
```

---

## What is Working Well (Do Not Break)

- **Jabari AI (Chat + VoiceChat):** Gemini 2.0 Flash integration is solid. System prompt, roleplay modes, quiz mode, offline fallback via `jabariOffline.json`, conversation history persistence, and check-in summary generation are all functional.
- **Safeguarding keyword engine:** `src/lib/safeguarding.ts` correctly classifies A/B/C/D categories in both English and Kiswahili. Do not modify keyword lists without consulting the client's safeguarding lead.
- **Offline sync queue:** The `sync.ts` queue correctly handles mood logs, lesson completions, circle responses, and goal creation/completion via Dexie. The pattern works — the only gap is CRIT-08 (remote_id).
- **Gamification:** Points, tiers, streaks, achievements, and confetti fire correctly via `AppContext` + `lib/gamification.ts`.
- **Onboarding flow:** 6-step onboarding with voice input, guardian consent, and Supabase profile creation works end-to-end.
- **OTP Auth:** Phone auth with 15 African country codes is wired correctly via Supabase Auth.
- **Age-gating:** SRH and drug awareness modules correctly check `canAccessSRH` / `canAccessDrugModule` derived from age bracket.
- **Design system:** Colour tokens, component classes, typography scale, and animation patterns are consistent throughout. Maintain these conventions.
