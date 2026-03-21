# Developer Handover: Jabari AI Evolution

Greetings! This document summarizes the recent major upgrades to the Jabari AI companion and the associated Mentor/Admin systems.

## 🧠 Core AI System (`src/api/jabari.ts`)
- **Model:** Uses `gemini-2.0-flash` for high-speed, low-latency life skills coaching.
- **Socratic Prompting:** Jabari is programmed to ask guiding questions rather than giving direct answers.
- **Action Modes:** Supports `roleplay` (scenario-based practice) and `quiz` (knowledge checking).
- **Mentor Briefing:** A specialized function `generateMentorBriefing` is used by human mentors to get student summaries.

## 💾 Database & Sync (`supabase_schema.sql`)
- **Table:** `ai_conversations` stores the persistent message history as JSONB.
- **Persistence:** Chat history is automatically synced to Supabase after every AI response in both `Chat.tsx` and `VoiceChat.tsx`.
- **Policies:** RLS is enabled. Students see their own chats; DSLs can see flagged chats (managed via `safeguarding_flagged` column).

## 🚀 Key Page Updates
- **`Chat.tsx`:** Now features a "Practice Mode" menu (Sparkles icon) to trigger Roleplay scenarios.
- **`MentorDashboard.tsx` (NEW):** A dedicated dashboard for mentors to oversee their assigned students and generate AI session briefings.
- **`SignIn.tsx`:** Updated "Dev Bypass" buttons for both Student and Mentor roles to facilitate local testing.

## 📚 Lesson Content (`src/data/modules.ts`)
- **Modules Expanded:** All 8 learning modules have been fully populated with 33 new lessons (totaling the intended capacity for each module).
- **Kenyan Context:** Lessons now include authentic local context (Sheng, CBC system, local heroes like Wangari Maathai) and accurate, recent statistics (e.g., NSDCC HIV data).
- **Structure:** Every lesson strictly adheres to the TypeScript interfaces, equipped with text, pullquotes, insight prompts, and a 3-option quiz.

## 🛠️ Dev Handover Checklist
1. **API Keys:** Ensure `VITE_GEMINI_API_KEY` is set in the `.env` file (and in the PWA's build environment).
2. **Supabase Migration:** Run the `ai_conversations` table create script from `supabase_schema.sql` if it's not already in production.
3. **Role Management:** To test the Mentor Dashboard, ensure your test user has the `role` enum set to `'mentor'` in the `profiles` table.
4. **Vite Build:** The build is verified. Run `npm run build` to generate the production `dist` folder.

Good luck with the launch! Jabari is now ready to support the next generation of Kenyan youth.
