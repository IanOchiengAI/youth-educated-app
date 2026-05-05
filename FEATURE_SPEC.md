# Youth Educated — Feature Specification
**For the implementation team. Read the entire document before writing a single line of code.**

> Stack: React 19 + Vite 6 + TypeScript · Tailwind CSS v4 · Framer Motion (`motion` package) · Supabase JS v2 · Gemini 2.0 Flash · React Router v7  
> Design tokens: `bg-navy`, `bg-yellow`, `bg-off-white`, `text-grey` · Fonts: `font-poppins` (headings), `font-nunito` (body)  
> All pages are `React.FC` with no required props. Global state via `useAppContext()`. Never prop-drill more than one level.  
> Read `CLAUDE.md` fully before touching any file.

---

## Feature 1 — Mentor Discovery: Category-First Browse (App Store Style)

**Replaces:** the current list view in `src/pages/Mentor.tsx` (student-facing browse mode only — the "My Mentor" matched view stays untouched)

### 1.1 — Field Category Tiles

At the top of the Mentor browse page, render a 2×N grid of large tappable category tiles. Each tile covers half the screen width.

**Categories (add to `src/constants.ts` as `MENTOR_FIELDS`):**

```ts
export const MENTOR_FIELDS = [
  { id: 'technology',       label: 'Technology',       emoji: '💻', color: 'from-blue-500/20 to-blue-500/5',    border: 'border-blue-200'    },
  { id: 'business',         label: 'Business',         emoji: '📊', color: 'from-yellow/30 to-yellow/10',       border: 'border-yellow/40'   },
  { id: 'health',           label: 'Health & Wellness', emoji: '🏥', color: 'from-green-500/20 to-green-500/5', border: 'border-green-200'   },
  { id: 'finance',          label: 'Finance',           emoji: '💰', color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-200' },
  { id: 'creative',         label: 'Creative Arts',    emoji: '🎨', color: 'from-pink-500/20 to-pink-500/5',   border: 'border-pink-200'    },
  { id: 'law',              label: 'Law & Rights',     emoji: '⚖️', color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-200' },
  { id: 'education',        label: 'Education',        emoji: '📚', color: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-200' },
  { id: 'entrepreneurship', label: 'Entrepreneurship', emoji: '🚀', color: 'from-red-500/20 to-red-500/5',     border: 'border-red-200'     },
];
```

**Tile layout (each tile):**
```
┌─────────────────────────┐
│  [emoji — 32px]         │
│  [Label — font-bold]    │
│  [N mentors — xs muted] │
└─────────────────────────┘
```
- Background: gradient using the `color` field above
- Border: 1px using `border` field
- Border radius: `rounded-[28px]`
- Padding: `p-5`
- Tap: `active:scale-95 transition-transform`
- Selected state: ring `ring-2 ring-yellow ring-offset-2`, slightly elevated shadow

**Mentor count per tile:**
Derive from the fetched `mentors` array:
```ts
const countByField = (fieldId: string) =>
  mentors.filter(m =>
    m.expertise.some(e => e.toLowerCase().includes(fieldId))
  ).length;
```

If count is 0, still show the tile but with muted opacity (`opacity-50`) and label "Coming soon" instead of "0 mentors".

**Selecting a tile:**
- Sets `selectedField` state
- Smoothly scrolls past the grid to the mentor list section (use `ref` + `scrollIntoView({ behavior: 'smooth' })`)
- The mentor list below filters to that category
- Selected tile gets a yellow ring indicator
- An "All Fields" pill appears above the list as a reset option

---

### 1.2 — "Featured This Week" Editorial Card

Below the category grid, before the filtered mentor list, render a single featured mentor card. This is **admin-chosen** (see Section 1.4 for admin controls).

**Card layout:**
```
┌────────────────────────────────────────────┐
│  FEATURED THIS WEEK          [star badge]  │
│                                            │
│  [large avatar — 80px circle]              │
│  [Mentor Name — 2xl bold]                  │
│  [Field tag pill]  [County tag pill]       │
│                                            │
│  [Bio — 2 lines, font-nunito]              │
│                                            │
│  ─────────────────────────────             │
│  "One thing I wish I knew at your age..."  │
│  [mentor's quote — italic, sm]             │
│                                            │
│  [Connect button — full width, yellow]     │
└────────────────────────────────────────────┘
```

- Background: `bg-navy` text white — makes it stand out from all other cards
- Badge: `⭐ FEATURED` in yellow pill, top right
- The "one thing I wish I knew" quote: a new field on `mentor_profiles` — `featured_quote TEXT` (see Section 1.5 DB changes)
- Connect button behaviour: same as existing connect flow (`requestMentorMatch`)
- If this mentor is already the student's active match, show "Your Mentor ✓" instead

**Visibility logic:**
- Fetch from `mentor_profiles` where `is_featured = true` + `is_verified = true`
- If none found, hide the section entirely (don't show an empty state)
- Only ever show one (take the first result ordered by `featured_at DESC`)

---

### 1.3 — Filtered Mentor List

Below the featured card, the filtered mentor list. When no category is selected, show all mentors (with a heading "All Mentors"). When a category is selected, show "Technology Mentors" etc.

**Mentor card (list item) — professional, not a swipe card:**
```
┌────────────────────────────────────────────┐
│  [avatar 56px]  [Name — bold]              │
│                 [field tags — wrap]        │
│                 [county — muted]           │
│                                            │
│  [Bio — 2 lines, clipped]                  │
│                                            │
│  [Connect button — right aligned, navy]    │
└────────────────────────────────────────────┘
```

- No star ratings (hardcoded 5.0 is misleading — remove entirely until a real rating system exists)
- Show up to 3 expertise tags as pills
- If mentor is already matched to this student, disable the Connect button and show "Connected ✓"
- Entry animation: `opacity 0→1`, `y 8→0`, stagger 60ms per card

---

### 1.4 — Admin: Set Featured Mentor

In `src/pages/AdminDashboard.tsx`, add a "Featured Mentor" section with a dropdown of all verified mentors and a "Set as Featured" button.

```ts
// Supabase call:
await supabase
  .from('mentor_profiles')
  .update({ is_featured: false })
  .neq('id', selectedId);  // clear all others

await supabase
  .from('mentor_profiles')
  .update({ is_featured: true, featured_at: new Date().toISOString() })
  .eq('id', selectedId);
```

This is admin-only. Wrap the section in a check: `if (state.user?.role !== 'admin') return null`.

---

### 1.5 — Database Changes

```sql
ALTER TABLE mentor_profiles
  ADD COLUMN IF NOT EXISTS is_featured     BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS featured_quote  TEXT,
  ADD COLUMN IF NOT EXISTS is_available    BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS field_category  TEXT;

-- RLS: anyone can read featured mentor
CREATE POLICY "Public can read featured mentor"
  ON mentor_profiles FOR SELECT
  USING (is_featured = true AND is_verified = true);
```

---

### 1.6 — Offline Fallback

When `state.isOffline` or `!isSupabaseConfigured`, load from `src/data/mentors.ts`:

```ts
export const FALLBACK_MENTORS = [
  { id: 'fm-1', name: 'Amina Odhiambo', expertise: ['Technology', 'Entrepreneurship'], bio: 'Software engineer helping youth break into tech.', county: 'Nairobi', icon: '👩‍💻' },
  { id: 'fm-2', name: 'Brian Kamau',    expertise: ['Finance', 'Business'],            bio: 'Accountant and business mentor for young entrepreneurs.', county: 'Kiambu',  icon: '📊' },
  { id: 'fm-3', name: 'Dr. Fatuma Ali', expertise: ['Health', 'Education'],            bio: 'Public health practitioner and youth advocate.', county: 'Mombasa', icon: '🏥' },
  { id: 'fm-4', name: 'James Otieno',   expertise: ['Law', 'Human Rights'],            bio: 'Advocate helping young people understand their rights.', county: 'Kisumu',  icon: '⚖️' },
  { id: 'fm-5', name: 'Grace Njeri',    expertise: ['Creative Arts', 'Media'],         bio: 'Graphic designer and media trainer.', county: 'Nairobi', icon: '🎨' },
  { id: 'fm-6', name: 'Peter Mwangi',   expertise: ['Entrepreneurship', 'Business'],   bio: 'Serial entrepreneur helping youth build businesses.', county: 'Nakuru',  icon: '🚀' },
];
```

No featured card offline (requires DB). Show a soft offline banner above the grid.

---

## Feature 2 — The Match Moment

**When:** a mentor accepts a pending match request (status changes `pending → active`)

**Trigger:** `MentorDashboard.tsx` — after `handleAccept()` succeeds, dispatch a custom event or use existing `AchievementToast` pattern to show the celebration in real-time if the student is online.

For the **student side**: on the Mentor page, when `myMatch` is first populated (status just became active), show a full-screen overlay before settling into the "My Mentor" view.

### Match Celebration Overlay

```
┌────────────────────────────────────────────┐
│                                            │
│         🎉  (confetti animation)           │
│                                            │
│     It's a Match!                          │
│     [Mentor Name] has accepted             │
│     your connection request.               │
│                                            │
│   ┌──────────────────────────────────┐     │
│   │  [avatar]  [Name]  [field tag]  │     │
│   └──────────────────────────────────┘     │
│                                            │
│   [Say Hello →]  (navigates to /chat)      │
│   [View Profile]  (shows full card)        │
│                                            │
└────────────────────────────────────────────┘
```

**Implementation:**
- New component: `src/components/MatchCelebration.tsx`
- Uses existing `TierUpgradeModal.tsx` as structural reference
- Confetti: use `canvas-confetti` npm package (lightweight, no React dep)
- Auto-dismiss after 8 seconds or on button tap
- Store a flag in localStorage: `matched_celebrated_${matchId}` — only show once per match
- Background: blurred overlay (`backdrop-blur-sm bg-navy/60`)
- Animation: card enters from bottom with spring (`damping: 22, stiffness: 280`)

**Confetti colours:** use brand colours — `#1a2e4a` (navy), `#FFD700` (yellow), `#FFFFFF`

---

## Feature 3 — Jabari-Guided Smart Matching

**Entry point:** a "Help me find the right mentor" button on the Mentor browse page (below the header, above the category grid). Optional flow — students can skip straight to browsing.

### Flow (3 screens inside the Mentor page, not separate routes)

**Screen 1 — Goal question:**
```
Jabari avatar (animated pulse)
"What's the one thing you most want to change in the next 3 months?"

[Big answer tiles — 2 columns]:
  💡 Learn a skill      📈 Start something
  💪 Build confidence   🎓 Improve at school
  💰 Understand money   🏥 Health & wellbeing
```

**Screen 2 — Learning style:**
```
"How do you prefer to get guidance?"

  🎯 Give me a clear plan and structure
  👂 Listen to me and help me figure it out
  🔥 Challenge me and push me harder
  🤝 Check in on me regularly
```

**Screen 3 — Availability:**
```
"How often can you commit to meeting?"

  📅 Once a week (30 min)
  📅 Every two weeks (45 min)
  📅 Once a month (60 min)
  💬 Flexible — just when I need it
```

**After answering all 3:** show a loading state (*"Jabari is finding your matches..."*, 1.5s) then present **"Your Top Matches"** — 3 mentor cards filtered from the real mentor list.

**Matching logic (client-side, no extra API call):**
```ts
function scoreMatch(mentor: MentorProfile, answers: MatchAnswers): number {
  let score = 0;
  // Goal → expertise match
  if (answers.goal === 'learn_skill' && mentor.expertise.some(e => ['technology','creative','education'].includes(e.toLowerCase()))) score += 3;
  if (answers.goal === 'start_something' && mentor.expertise.some(e => ['entrepreneurship','business'].includes(e.toLowerCase()))) score += 3;
  // County proximity bonus
  if (mentor.county?.toLowerCase() === state.user?.county?.toLowerCase()) score += 2;
  // Availability match (future: match against mentor.availability field)
  return score;
}
```

**"Why Jabari thinks you'll click" blurb:**
One sentence, generated locally (not an API call) from a template:
```ts
const reason = `${mentor.name} specialises in ${mentor.expertise[0]} and has helped students ${goalReasonMap[answers.goal]}.`;
```

This avoids an extra Gemini call and keeps it instant.

**Skip option:** always visible — *"I know what I'm looking for → Browse all mentors"*

---

## Feature 4 — Mentor Daily Nudge

**What it is:** mentor sends a one-line prompt to all their mentees once per day. Student sees it on the Dashboard as a card. Mentee can respond in one tap.

### Data model

```sql
CREATE TABLE IF NOT EXISTS mentor_nudges (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pair_id      UUID REFERENCES mentor_matches(id) ON DELETE CASCADE,
  message      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now(),
  read_at      TIMESTAMPTZ,
  response     TEXT
);
```

### Mentor side (MentorDashboard)

Below each student card, a small "Send Today's Nudge" input — one-line text field, 80 char max, "Send" button. Only enabled if no nudge sent to this student today (check `created_at > today`).

Example prompts (shown as placeholder, rotating):
- *"What's one thing you're going to do differently today?"*
- *"What was hard this week and what did you learn?"*
- *"Name one person you're grateful for today."*

### Student side (Dashboard)

A new card below the mood check-in: **"Message from [Mentor Name]"** — navy background, mentor avatar, the nudge text, and two response options:

```
[👍 Got it]   [💬 Reply]
```

"Got it" marks it read. "Reply" opens a one-line text input that stores `response` on the nudge row.

Push notification (via existing `lib/notifications.ts`): sent when mentor submits the nudge.

---

## Feature 5 — Session Commit & Jabari Check-in

### The "Commit" Button

At the start of every Calendar session (status = `confirmed`), show a **"Make a commitment"** prompt on the student's Dashboard:

```
📌 You have a session with [Mentor] today.
   "What's one thing you want to achieve in this session?"
   [____________ type here ____________]  [Commit →]
```

Store the commitment on the `mentor_sessions` row:
```sql
ALTER TABLE mentor_sessions ADD COLUMN IF NOT EXISTS student_commitment TEXT;
```

### Jabari 24-Hour Follow-up

After the session's `scheduled_at + 24 hours`, Jabari sends a proactive check-in (via push notification → opens Chat):

> *"Yesterday you said: '[commitment]'. Did you make progress on that? Tell me what happened."*

Implementation: a Supabase Edge Function (`check-session-followup`) that runs on a cron schedule, queries sessions from the past 24 hours with a `student_commitment`, and creates a row in `ai_conversations` seeded with that prompt. On next Chat page load, Jabari opens with that message.

---

## Feature 6 — Mentor "Today's Wisdom" Status

**What it is:** mentor posts a one-liner daily thought. Students see it on the Mentor page hero card and on their Dashboard.

### Data model

```sql
ALTER TABLE mentor_profiles
  ADD COLUMN IF NOT EXISTS today_wisdom      TEXT,
  ADD COLUMN IF NOT EXISTS wisdom_updated_at TIMESTAMPTZ;
```

### Mentor side

In `MentorDashboard.tsx` header area, a small editable field:

```
TODAY'S WISDOM  [✏️ edit]
"Success is not about how fast you go,
but how far you've come from where you started."
```

Inline edit — tap the pencil, text becomes editable, tap "Done" to save. Upserts `today_wisdom` on `mentor_profiles`. Auto-clears at midnight (Edge Function or client-side check on `wisdom_updated_at`).

### Student side (Dashboard)

If the student has an active mentor match AND `today_wisdom` is set AND was updated today, show a wisdom card on the Dashboard:

```
┌─────────────────────────────────────────┐
│  💬  [Mentor Name] says today:          │
│  "Success is not about how fast you...  │
│  [read more →]                          │
└─────────────────────────────────────────┘
```

Background: `bg-yellow` text `text-navy`. Position: after mood check-in, before circle feed.

---

## Feature 7 — Connection Health & Re-matching

### Match Health Score

After each completed session (`status = 'completed'`), both mentor and student are each asked separately (not publicly):

```
How was your connection in this session?
[😕 1]  [😐 2]  [🙂 3]  [😊 4]  [🤩 5]
```

Store in a new table:
```sql
CREATE TABLE IF NOT EXISTS session_ratings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID REFERENCES mentor_sessions(id),
  rater_id     UUID REFERENCES profiles(id),
  score        INTEGER CHECK (score BETWEEN 1 AND 5),
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

Ratings are **never shown publicly** — not to the mentor, not to the student, not to anyone except DSL/Admin.

### Re-match Suggestion

After 2 completed sessions where BOTH ratings ≤ 2:

```
Sometimes it takes a few tries to find the right fit.
Would you like to explore other mentors?

[Browse Again]   [Stay with [Mentor Name]]
```

"Browse Again" changes match status to `ended`, navigates to Mentor browse page.

### "Deep Dive" Unlock

After 2 sessions where BOTH ratings ≥ 4, unlock a **"Deep Dive"** session type in `SessionCalendar.tsx`:
- Duration options extend to 90 minutes
- A shared agenda template is pre-populated
- Special badge on the session card: `⚡ Deep Dive`

Store as `session_type: 'standard' | 'deep_dive'` on `mentor_sessions`.

---

## Feature 8 — Mentor Profile Full Page

Right now tapping a mentor card does nothing. Add a **full mentor profile page** reachable via `/mentor/:mentorId`.

**Route:** Add to `App.tsx`:
```tsx
<Route path="/mentor/:mentorId" element={<ProtectedRoute><PageWrapper><MentorProfile /></PageWrapper></ProtectedRoute>} />
```

**New page:** `src/pages/MentorProfile.tsx`

Sections (top to bottom):
1. **Hero** — large avatar, name, field tags, county, verified badge
2. **About** — full bio
3. **Expertise** — all expertise tags as pills
4. **Availability** — days of week (new `mentor_profiles.availability_days TEXT[]` column)
5. **"Today's Wisdom"** — if set today
6. **Endorsements** — from previous mentees (pulled from `point_transactions` where `action = 'ENDORSEMENT_RECEIVED'` and `user_id = mentorId`)
7. **Connect / Connected CTA** — same logic as list card

---

## Implementation Order

Work in this order — each step is independently shippable:

| # | Feature | Files touched | Est. effort |
|---|---|---|---|
| 1 | Add `MENTOR_FIELDS` to constants | `constants.ts` | 10 min |
| 2 | DB migrations (featured, available, wisdom columns) | Supabase SQL | 15 min |
| 3 | `FALLBACK_MENTORS` in `data/mentors.ts` | new file | 10 min |
| 4 | Category grid + filtered list in `Mentor.tsx` | `Mentor.tsx` | 2 hrs |
| 5 | Featured card fetch + display | `Mentor.tsx` | 45 min |
| 6 | Admin: set featured mentor | `AdminDashboard.tsx` | 30 min |
| 7 | `MatchCelebration.tsx` component | new file | 1 hr |
| 8 | Hook celebration into mentor accept flow | `MentorDashboard.tsx`, `Mentor.tsx` | 30 min |
| 9 | Jabari matching quiz (3 screens in `Mentor.tsx`) | `Mentor.tsx` | 2 hrs |
| 10 | Mentor "Today's Wisdom" post + student Dashboard card | `MentorDashboard.tsx`, `Dashboard.tsx` | 1.5 hrs |
| 11 | Daily Nudge (send + receive) | `MentorDashboard.tsx`, `Dashboard.tsx`, DB | 2 hrs |
| 12 | Session Commit field | `SessionCalendar.tsx`, DB | 45 min |
| 13 | Session rating (post-session prompt) | new component, DB | 1.5 hrs |
| 14 | Re-match suggestion logic | `Mentor.tsx` | 45 min |
| 15 | Full mentor profile page | new `MentorProfile.tsx` | 2 hrs |

**Total estimated: ~16 hours of focused implementation.**

---

## Design Constraints (enforce these strictly)

- **Child-friendly at all times.** No dark patterns, no urgency manipulation, no "limited spots" fake scarcity. Every CTA must be positive.
- **No star ratings shown publicly** until a real rating system with enough data exists. Static 5.0 is dishonest — remove it.
- **Mentor dignity.** Mentors are professionals. Their cards must feel like a directory, not a marketplace. No "connect in 3 seconds" or pressure language.
- **Safeguarding first.** Any free-text input (nudge responses, session commitments) passes through `safeguarding.ts` before storage. No exceptions.
- **Offline graceful.** Every new feature that fetches data must have a fallback — either local data or a clean empty state. Never a spinner that never resolves.
- **Animations: subtle.** Entry fade + slight Y lift only. No bouncing, no excessive motion. This is a professional app, not a game.
- **Brand colours only.** Navy, yellow, off-white, with semantic greens/reds for status. No random colour introductions.
- **Max width `max-w-md mx-auto`.** Mobile-first. Every new layout must look correct on a 375px screen first.
