# Mentor / Mentee Experience — Fix Plan

> Author: Claude Code · Date: 2026-05-05  
> Priority order: Critical → High → Medium

---

## The Core Problem

The app currently treats mentors like students who have an extra dashboard bolted on.  
What it should do is give mentors and mentees **completely separate experiences** that happen to connect through the same pairing system.

| Role | Should feel like | Currently feels like |
|---|---|---|
| **Mentee (student)** | A young person browsing coaches and getting paired with one | OK, but discovery is weak — no field categories |
| **Mentor (coach)** | A professional managing their caseload | A student with a bonus panel — they see mood check-ins, lesson modules, peer circles — none of which apply |

---

## Issue 1 — CRITICAL: Mentor lands on the student dashboard after login

**File:** `src/pages/SignIn.tsx` line 91

After OTP verification, the role-routing is:

```ts
if (profile.role === 'dsl')   navigate('/dsl');
if (profile.role === 'admin') navigate('/admin');
navigate('/dashboard');  // ← mentor falls through to here
```

Mentor is sent to `/dashboard`, which shows mood check-in, lesson progress bar, tier tracker, and peer circle feed — all student-only content.

**Fix:**

```ts
if (profile.role === 'dsl')    navigate('/dsl');
if (profile.role === 'admin')  navigate('/admin');
if (profile.role === 'mentor') navigate('/mentor-dashboard');
navigate('/dashboard');
```

Also update the three dev-bypass buttons (lines ~270, ~297, ~324) so the mentor bypass goes to `/mentor-dashboard`.

---

## Issue 2 — CRITICAL: Mentor nav shows all student items

**File:** `src/components/Layout.tsx`

The nav is built once and adds items based on role. Mentors currently see:  
Home → `/dashboard` (student), Life Kit, Chat (Jabari AI), Circles, Mentor browse, Calendar, My Panel

Life Kit (lesson modules), Circles (peer discussion), and the Jabari chat are **student features**. A coach has no business taking youth life-skills lessons or participating in peer circles.

**Fix — replace the nav build logic:**

```ts
// Current (flat addition)
navItems.push({ path: '/mentor-dashboard', label: t('nav.mypanel', lang), icon: LayoutDashboard });

// Replace with role-aware base items:
if (state.user.role === 'mentor') {
  return [
    { path: '/mentor-dashboard', label: 'My Panel',  icon: LayoutDashboard },
    { path: '/calendar',         label: 'Calendar',  icon: CalendarDays },
    { path: '/mentor',           label: 'Mentors',   icon: Users },  // repurposed as "My Network"
    { path: '/profile',          label: 'Profile',   icon: User },
  ];
}

// Students keep the existing full nav
```

The `Home` icon for mentors should link to `/mentor-dashboard`, not `/dashboard`.

---

## Issue 3 — HIGH: MentorDashboard has hardcoded stats

**File:** `src/pages/MentorDashboard.tsx` lines 304–318

Stats show `val: '12'`, `val: '48'`, `val: '8.4'` — hardcoded strings, never fetched.

**Fix — derive from real data:**

```ts
// After fetching students + mentor_sessions:
const stats = {
  students: students.length,
  sessions: sessionCount,   // count from mentor_sessions WHERE mentor_id = user.id AND status = 'completed'
  impact: students.length > 0
    ? (students.filter(s => s.lastActiveDaysAgo < 7).length / students.length * 10).toFixed(1)
    : '—',
};
```

Add a `sessionCount` fetch alongside the existing students fetch:

```ts
const { count } = await supabase
  .from('mentor_sessions')
  .select('*', { count: 'exact', head: true })
  .eq('mentor_id', state.user.id)
  .eq('status', 'completed');
```

---

## Issue 4 — HIGH: No pending match requests on MentorDashboard

**File:** `src/pages/MentorDashboard.tsx`

When a student hits "Connect" on the Mentor browse page, `requestMentorMatch()` inserts a row into `mentor_matches` with `status = 'pending'`. There is no UI for the mentor to see or act on this.

**Fix — add a "Pending Requests" section above the student list:**

```ts
// Fetch alongside existing query
const { data: pendingData } = await supabase
  .from('mentor_matches')
  .select('id, student_id, created_at, profiles!student_id (name, county)')
  .eq('mentor_id', state.user.id)
  .eq('status', 'pending');
```

Render each pending request as an accept/decline card:

```tsx
<div className="bg-yellow/10 border border-yellow/30 rounded-[32px] p-5 flex items-center justify-between">
  <div>
    <p className="font-bold text-navy">{req.name}</p>
    <p className="text-xs text-navy/40">{req.county} · Requested {timeAgo(req.created_at)}</p>
  </div>
  <div className="flex gap-2">
    <button onClick={() => handleAccept(req.id)} className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold">Accept</button>
    <button onClick={() => handleDecline(req.id)} className="px-4 py-2 bg-off-white text-navy/60 rounded-xl text-xs font-bold">Decline</button>
  </div>
</div>
```

`handleAccept` → `supabase.from('mentor_matches').update({ status: 'active' }).eq('id', id)`  
`handleDecline` → `supabase.from('mentor_matches').update({ status: 'ended' }).eq('id', id)`

---

## Issue 5 — HIGH: Student progress cards show no real progress data

**File:** `src/pages/MentorDashboard.tsx` — `Student` interface & card render

Currently `progress` shows `current_tier` (e.g. "MWANZO") and `lastActive` shows a date string. There is no module progress, streak, points, or mood visible.

**Fix — enrich the Supabase student fetch:**

```ts
// Extend profiles select:
profiles!mentor_matches_student_id_fkey (
  name,
  current_tier,
  total_points,
  streak_days,
  last_active_date,
  guardian_phone
)
```

Then fetch module completions per student:

```ts
// After main fetch, for each student:
const { count: lessonsCount } = await supabase
  .from('user_module_progress')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', studentId);
```

Render a progress row under each student card:

```tsx
<div className="grid grid-cols-3 gap-2 mt-3">
  <div className="bg-off-white rounded-2xl p-3 text-center">
    <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Points</p>
    <p className="font-bold text-navy">{student.totalPoints.toLocaleString()}</p>
  </div>
  <div className="bg-off-white rounded-2xl p-3 text-center">
    <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Streak</p>
    <p className="font-bold text-navy">{student.streakDays}d</p>
  </div>
  <div className="bg-off-white rounded-2xl p-3 text-center">
    <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Tier</p>
    <p className="font-bold text-navy text-xs">{student.tier}</p>
  </div>
</div>
```

---

## Issue 6 — HIGH: Mentor browse page has no field-based discovery

**File:** `src/pages/Mentor.tsx`

Students can only search by free text. There are no field categories to browse. Expertise is stored as an array (`expertise: string[]`) but only `expertise[0]` is shown on the card.

**Fix — add a field filter row above the mentor list:**

Define the canonical field categories (add these to `src/constants.ts`):

```ts
export const MENTOR_FIELDS = [
  { id: 'all',            label: 'All',           emoji: '✨' },
  { id: 'technology',     label: 'Technology',    emoji: '💻' },
  { id: 'business',       label: 'Business',      emoji: '📊' },
  { id: 'health',         label: 'Health',        emoji: '🏥' },
  { id: 'finance',        label: 'Finance',       emoji: '💰' },
  { id: 'creative',       label: 'Creative Arts', emoji: '🎨' },
  { id: 'law',            label: 'Law',           emoji: '⚖️' },
  { id: 'education',      label: 'Education',     emoji: '📚' },
  { id: 'entrepreneurship', label: 'Entrepreneurship', emoji: '🚀' },
];
```

Add `selectedField` state and filter logic:

```ts
const [selectedField, setSelectedField] = useState('all');

const filteredMentors = mentors.filter(m => {
  const matchesField = selectedField === 'all' ||
    m.expertise.some(e => e.toLowerCase().includes(selectedField));
  const matchesSearch = !searchQuery ||
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
  return matchesField && matchesSearch;
});
```

Render a horizontal scroll row of field pills between the search bar and the mentor list:

```tsx
<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
  {MENTOR_FIELDS.map(f => (
    <button
      key={f.id}
      onClick={() => setSelectedField(f.id)}
      className={`flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all
        ${selectedField === f.id ? 'bg-yellow text-navy' : 'bg-white text-navy/40 border border-navy/10'}`}
    >
      {f.emoji} {f.label}
    </button>
  ))}
</div>
```

---

## Issue 7 — HIGH: Mentor cards show only one expertise tag and no county

**File:** `src/pages/Mentor.tsx` mentor card render

Currently only `m.field` (= `expertise[0]`) is shown. County is fetched in `fetchAvailableMentors()` in `mentoring.ts` but not used here.

**Fix — update the `MentorProfile` interface and card:**

```ts
interface MentorProfile {
  id: string;
  name: string;
  expertise: string[];   // full array, not just [0]
  bio: string;
  icon: string;
  county: string | null;
  rating: number;
}
```

In the card, replace the single field tag with a tag row:

```tsx
<div className="flex flex-wrap gap-1 mt-1">
  {m.expertise.slice(0, 3).map(tag => (
    <span key={tag} className="bg-navy/5 text-navy/50 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">
      {tag}
    </span>
  ))}
  {m.county && (
    <span className="bg-yellow/10 text-yellow-700 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">
      📍 {m.county}
    </span>
  )}
</div>
```

---

## Issue 8 — MEDIUM: No offline fallback for mentor browse

**File:** `src/pages/Mentor.tsx`

When offline or Supabase unconfigured, `mentors` stays empty and the page shows "No mentors available". Unlike modules and articles, there is no local fallback.

**Fix — add `src/data/mentors.ts`:**

```ts
export interface FallbackMentor {
  id: string;
  name: string;
  expertise: string[];
  bio: string;
  county: string;
  icon: string;
}

export const FALLBACK_MENTORS: FallbackMentor[] = [
  { id: 'fm-1', name: 'Amina Odhiambo', expertise: ['Technology', 'Entrepreneurship'], bio: 'Software engineer helping youth break into tech.', county: 'Nairobi', icon: '👩‍💻' },
  { id: 'fm-2', name: 'Brian Kamau',    expertise: ['Finance', 'Business'],            bio: 'Accountant and business mentor for young entrepreneurs.', county: 'Kiambu', icon: '📊' },
  { id: 'fm-3', name: 'Dr. Fatuma Ali', expertise: ['Health', 'Education'],            bio: 'Public health practitioner and youth advocate.', county: 'Mombasa', icon: '🏥' },
  { id: 'fm-4', name: 'James Otieno',   expertise: ['Law', 'Human Rights'],            bio: 'Advocate helping young people understand their rights.', county: 'Kisumu', icon: '⚖️' },
  { id: 'fm-5', name: 'Grace Njeri',    expertise: ['Creative Arts', 'Media'],         bio: 'Graphic designer and media trainer.', county: 'Nairobi', icon: '🎨' },
];
```

In `Mentor.tsx`, use fallback when offline or Supabase unconfigured:

```ts
if (!state.user?.id || state.isOffline || !isSupabaseConfigured) {
  setMentors(FALLBACK_MENTORS.map(m => ({ ...m, rating: 5.0 })));
  setLoading(false);
  return;
}
```

---

## Issue 9 — MEDIUM: `recentActivity` on student cards is hardcoded

**File:** `src/pages/MentorDashboard.tsx` line 183

```ts
recentActivity: 'Student assigned and active.',  // placeholder
```

This is what gets fed into `generateMentorBriefing()` — so the AI briefing is always generated from a useless string.

**Fix — build `recentActivity` from real data:**

After the main students fetch, do a second pass to pull mood logs and recent chat messages:

```ts
for (const student of fetchedStudents) {
  const [moodResult, chatResult] = await Promise.all([
    supabase.from('mood_logs')
      .select('mood_score, created_at')
      .eq('user_id', student.id)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase.from('ai_conversations')
      .select('user_message, created_at')
      .eq('user_id', student.id)
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  const moods = moodResult.data ?? [];
  const chats = chatResult.data ?? [];

  student.recentActivity = [
    moods.length > 0 ? `Recent moods: ${moods.map(m => m.mood_score).join(', ')}/10` : '',
    chats.length > 0 ? `Recent Jabari messages: "${chats[0].user_message}"` : '',
  ].filter(Boolean).join('. ') || 'No recent activity recorded.';
}
```

---

## Issue 10 — MEDIUM: Match request creates duplicate rows

**File:** `src/lib/mentoring.ts` — `requestMentorMatch()`

If a student clicks "Connect" twice (network delay), two rows are inserted. There is no guard.

**Fix — check for existing row before inserting:**

```ts
export async function requestMentorMatch(studentId: string, mentorId: string) {
  // Idempotency guard
  const { data: existing } = await supabase
    .from('mentor_matches')
    .select('id, status')
    .eq('student_id', studentId)
    .eq('mentor_id', mentorId)
    .in('status', ['pending', 'active'])
    .maybeSingle();

  if (existing) return { id: existing.id };  // already exists, return it

  const { data, error } = await supabase
    .from('mentor_matches')
    .insert({ student_id: studentId, mentor_id: mentorId, status: 'pending' })
    .select('id')
    .single();

  if (error) { console.error('[mentoring] requestMentorMatch:', error.message); return null; }
  return { id: data.id };
}
```

---

## Issue 11 — MEDIUM: `mentor_profiles` table missing `is_available` flag

**File:** `src/lib/mentoring.ts` line 91

`fetchAvailableMentors()` filters on `.eq('is_available', true)` but `is_available` is not in the DB table documented in CLAUDE.md. The query likely returns nothing or errors silently.

**Fix — add column to Supabase:**

```sql
ALTER TABLE mentor_profiles ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
UPDATE mentor_profiles SET is_available = true WHERE is_verified = true;
```

Or, if keeping the column out of scope, change the filter in `mentoring.ts` to use `is_verified`:

```ts
.eq('is_verified', true)   // already the pattern used in Mentor.tsx directly
```

And align `Mentor.tsx` to call `fetchAvailableMentors()` from `mentoring.ts` instead of duplicating the Supabase query inline.

---

## Supabase Schema Additions

Run these migrations before deploying the mentor fixes:

```sql
-- 1. is_available flag on mentor_profiles
ALTER TABLE mentor_profiles
  ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

-- 2. field_category for quick browsing (denormalised from expertise[0])
ALTER TABLE mentor_profiles
  ADD COLUMN IF NOT EXISTS field_category TEXT;

-- 3. Ensure mentor_matches has jabari_goals + jabari_agenda (may already exist)
ALTER TABLE mentor_matches
  ADD COLUMN IF NOT EXISTS jabari_goals TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS jabari_agenda TEXT DEFAULT '';

-- 4. RLS: mentors can see their own pending requests
CREATE POLICY "Mentor sees own pending matches"
  ON mentor_matches FOR SELECT
  USING (mentor_id = auth.uid());

CREATE POLICY "Mentor can update own match status"
  ON mentor_matches FOR UPDATE
  USING (mentor_id = auth.uid());
```

---

## Implementation Order

| # | Task | File(s) | Effort |
|---|---|---|---|
| 1 | Fix post-login routing for mentors | `SignIn.tsx` | 5 min |
| 2 | Fix mentor nav items | `Layout.tsx` | 15 min |
| 3 | Add MENTOR_FIELDS constant | `constants.ts` | 5 min |
| 4 | Field filter row + full expertise tags + county on mentor cards | `Mentor.tsx` | 30 min |
| 5 | Add offline fallback mentor data | `data/mentors.ts`, `Mentor.tsx` | 15 min |
| 6 | Deduplicate `requestMentorMatch` | `lib/mentoring.ts` | 10 min |
| 7 | Add pending requests section to MentorDashboard | `MentorDashboard.tsx` | 30 min |
| 8 | Real session count + dynamic stats | `MentorDashboard.tsx` | 20 min |
| 9 | Real student progress data (points, streak, tier) | `MentorDashboard.tsx` | 25 min |
| 10 | Real `recentActivity` from mood_logs + ai_conversations | `MentorDashboard.tsx` | 20 min |
| 11 | Add `is_available` column + RLS policies | Supabase SQL | 10 min |

**Total estimated effort: ~3 hours**

---

## What NOT to Change

- Do not remove mentors' access to `/calendar` — they need it for session scheduling
- Do not remove the Jabari AI for mentors entirely — the AI briefing in MentorDashboard uses Gemini directly via `generateMentorBriefing()`, which is correct
- Do not change the `mentor_matches` table's `pending → active → ended` status flow
- Do not add mentor auth to the student peer circles — circles are age-cohort-safe spaces
- Safeguarding flags visible to mentors (via `SafeguardingBanner`) should stay — mentors are trained safeguarders
