# 🦁 Youth Educated — Collaborator Goals & Review Notes

Welcome Dylan! Here's everything you need to get started and what to focus on.

---

## 🚀 Setup (Do This First)

```bash
git pull
cp .env.example .env          # Windows: Copy-Item .env.example .env
npm install
npm run dev                    # App runs at http://localhost:3000
```

**Requires:** Node.js v18+

### Getting the App on Your Android Device

```bash
npm run build
npx cap sync android
npx cap open android           # Opens in Android Studio → Run ▶️
```

> Make sure **Developer Options** and **USB Debugging** are enabled on your phone.

---

## 📱 App Overview

Youth Educated is a life-skills PWA for Kenyan youth aged 10–22. It has:

| Feature | Status | Notes |
|---------|--------|-------|
| Onboarding (name, age, county, goals) | ✅ Working | Phone OTP auth via Supabase |
| Dashboard (points, streaks, achievements) | ✅ Working | Gamification tier system |
| Jabari AI Mentor (chat + voice) | ✅ Working | Gemini 2.0 Flash, Socratic method |
| Learning Modules (8 modules) | ⚠️ Partial | Only **2 lessons per module** (Marie is writing the rest) |
| Career Mapper (quiz) | ✅ Working | Maps to CBC pathways |
| Circles (peer groups) | ✅ Working | Weekly prompts |
| Mentor Dashboard | ✅ Working | AI briefings for mentors |
| DSL Dashboard (safeguarding) | ✅ Working | Keyword flagging system |
| Offline Support | ⚠️ Basic | Dexie/IndexedDB sync queue exists, needs testing |
| Push Notifications | ⚠️ Configured | Capacitor plugin installed, not fully wired |

---

## 🎯 Priority Goals

### 🔴 Priority 1: Offline Experience
- The sync queue (`src/lib/sync.ts`) handles queuing actions when offline
- **Test this**: turn off WiFi, use the app, turn WiFi back on — do synced items arrive in Supabase?
- Consider: can lessons load fully offline once "downloaded"?

### 🟡 Priority 2: Android Polish
- Test all screens on a real Android device
- Check touch targets, font sizes, scroll behaviour
- Verify Capacitor plugins work (status bar, splash screen)
- Note any screens that feel clunky on mobile

### 🟢 Priority 3: General Review
Walk through every screen and note:
- [ ] Bugs or broken flows
- [ ] UI/UX improvements needed
- [ ] Missing features for launch
- [ ] Any content that feels off or incomplete

---

## 🗂️ Key Files to Know

| File / Folder | What It Does |
|---------------|-------------|
| `src/data/modules.ts` | **All lesson content lives here** — this is where new lessons go |
| `src/api/jabari.ts` | Jabari AI logic (Gemini prompts, roleplay, quiz modes) |
| `src/AppContext.tsx` | Global state management (user, progress, modules) |
| `src/lib/supabase.ts` | Supabase client setup |
| `src/lib/sync.ts` | Offline sync queue |
| `src/lib/db.ts` | Local IndexedDB schema (Dexie) |
| `src/lib/auth.ts` | Phone OTP authentication |
| `src/lib/safeguarding.ts` | Keyword detection for safeguarding alerts |
| `supabase_schema.sql` | Full database schema |
| `capacitor.config.ts` | Android/iOS build config |

---

## 🧪 Testing Tips

- **Dev Bypass**: The SignIn page has dev bypass buttons to skip OTP — use these for testing
- **Roles**: Change `role` in the `profiles` Supabase table to test `student`, `mentor`, `admin`, or `dsl` views
- **Sensitive Modules**: SRH is only visible to 16+ users, Healthy Choices to 13+ — test with different age brackets

---

## 📞 Questions?

Reach out to Ian if anything is unclear, or drop a message in our chat. The `docs/handover_notes.md` file has more technical details about the AI system and database.
