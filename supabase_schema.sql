-- Youth Educated Supabase Schema

-- ENUMS
CREATE TYPE role_type AS ENUM ('student', 'mentor', 'admin', 'dsl');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'prefer_not_to_say', 'All', 'Female', 'Male');
CREATE TYPE match_status AS ENUM ('active', 'ended');
CREATE TYPE opportunity_type AS ENUM ('Job', 'Internship', 'Training', 'Scholarship', 'Mentorship', 'scholarship', 'internship', 'mentorship', 'grant', 'TVET');
CREATE TYPE risk_level_type AS ENUM ('low', 'medium', 'high');
CREATE TYPE case_status AS ENUM ('open', 'resolved');
CREATE TYPE circle_type AS ENUM ('mixed', 'brothers_keepers');

-- TABLES
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  county TEXT NOT NULL
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  age_bracket TEXT,
  gender gender_type,
  county TEXT,
  language TEXT DEFAULT 'English',
  goals TEXT[] DEFAULT '{}',
  school_id UUID REFERENCES schools(id),
  guardian_consent BOOLEAN DEFAULT FALSE,
  guardian_consent_at TIMESTAMPTZ,
  guardian_phone TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  role role_type DEFAULT 'student',
  can_access_srh BOOLEAN DEFAULT FALSE,
  can_access_drug_module BOOLEAN DEFAULT FALSE,
  points INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  current_tier TEXT DEFAULT 'MCHANGA',
  push_token TEXT,
  jabari_voice TEXT DEFAULT 'default',
  weekly_points INTEGER DEFAULT 0,
  weekly_points_reset_at DATE DEFAULT CURRENT_DATE,
  is_premium BOOLEAN DEFAULT false,
  tts_characters_today INTEGER DEFAULT 0,
  last_tts_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE modules (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points INTEGER DEFAULT 0,
  duration TEXT,
  lessons INTEGER DEFAULT 0,
  competency TEXT,
  difficulty TEXT,
  category TEXT,
  tier_requirement TEXT,
  min_age INTEGER DEFAULT 10,
  is_sensitive BOOLEAN DEFAULT FALSE,
  brothers_keepers_variant BOOLEAN DEFAULT FALSE,
  premium BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lessons (
  id TEXT PRIMARY KEY,
  module_id TEXT REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT,
  duration TEXT,
  content TEXT,
  sections JSONB,
  quiz_data JSONB,
  sort_order INTEGER NOT NULL
);

CREATE TABLE user_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id TEXT REFERENCES modules(id) ON DELETE CASCADE,
  completed_lessons INTEGER[] DEFAULT '{}',
  is_completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mentor_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  specialization TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE mentor_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status match_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mentor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES mentor_matches(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  mentee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  title TEXT DEFAULT 'Mentoring Session',
  student_commitment TEXT,
  session_type TEXT DEFAULT 'standard'
);

CREATE TABLE mentor_nudges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pair_id UUID REFERENCES mentor_matches(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  read_at TIMESTAMPTZ,
  response TEXT
);

CREATE TABLE session_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES mentor_sessions(id) ON DELETE CASCADE,
  rater_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER CHECK (score BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE endorsements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message_history JSONB DEFAULT '[]'::jsonb,
  safeguarding_flagged BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE mood_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  log_date DATE DEFAULT CURRENT_DATE,
  shared_with_mentor BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  week_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type circle_type DEFAULT 'mixed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE circle_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id TEXT,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  UNIQUE(circle_id, user_id)
);

CREATE TABLE circle_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id TEXT,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  week_number INTEGER,
  response_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE circle_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID REFERENCES circle_responses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL
);

CREATE TABLE opportunities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  description TEXT NOT NULL,
  category opportunity_type NOT NULL,
  points_required INTEGER DEFAULT 0,
  deadline DATE,
  gender TEXT DEFAULT 'All',
  min_age INTEGER DEFAULT 13,
  max_age INTEGER DEFAULT 25,
  counties TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE saved_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  opportunity_id TEXT REFERENCES opportunities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

CREATE TABLE lifekit_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_sw TEXT,
  category TEXT NOT NULL,
  min_age INTEGER DEFAULT 13,
  max_age INTEGER DEFAULT 25,
  read_time TEXT,
  emoji TEXT,
  body TEXT,
  body_sw TEXT,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  month TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE career_questions (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  options JSONB NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE safeguarding_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('A', 'B', 'C', 'D')),
  message TEXT NOT NULL,
  source TEXT DEFAULT 'chat',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE safeguarding_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  dsl_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  risk_level risk_level_type DEFAULT 'low',
  status case_status DEFAULT 'open',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE offline_sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  synced_at TIMESTAMPTZ
);

-- FUNCTIONS & TRIGGERS
CREATE OR REPLACE FUNCTION set_access_flags()
RETURNS TRIGGER AS $$
BEGIN
  NEW.can_access_srh := (NEW.age_bracket IN ('16-18', '19-22'));
  NEW.can_access_drug_module := (NEW.age_bracket IN ('13-15', '16-18', '19-22'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER tr_set_access_flags
BEFORE INSERT OR UPDATE OF age_bracket ON profiles
FOR EACH ROW EXECUTE FUNCTION set_access_flags();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, joined_at)
  VALUES (NEW.id, NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
REVOKE EXECUTE ON FUNCTION handle_new_user() FROM PUBLIC, authenticated, anon;

CREATE TRIGGER tr_handle_new_user
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view circles" ON circles FOR SELECT USING (true);
CREATE POLICY "Users can manage circle members" ON circle_members FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage circle reactions" ON circle_reactions FOR ALL USING (auth.uid() = user_id);
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE safeguarding_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE safeguarding_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifekit_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_questions ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Profiles: Own SELECT/UPDATE, Mentor SELECT students, Admin/DSL SELECT all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Mentors can view their students' profiles" ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM mentor_matches WHERE mentor_id = auth.uid() AND student_id = profiles.id AND status = 'active'));
CREATE POLICY "Admins/DSL can view all profiles" ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'dsl')));

-- Modules, Lessons, LifeKit, Career Questions: Public SELECT
CREATE POLICY "Anyone can view schools" ON schools FOR SELECT USING (true);
CREATE POLICY "Anyone can view published modules" ON modules FOR SELECT USING (is_published = true);
CREATE POLICY "Anyone can view lessons" ON lessons FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view lifekit articles" ON lifekit_articles FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view career questions" ON career_questions FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view circles" ON circles FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view circle members" ON circle_members FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view circle reactions" ON circle_reactions FOR SELECT USING (TRUE);

-- User Progress: Own rows, Mentors SELECT students
CREATE POLICY "Users can manage own progress" ON user_module_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Mentors can view student progress" ON user_module_progress FOR SELECT
  USING (EXISTS (SELECT 1 FROM mentor_matches WHERE mentor_id = auth.uid() AND student_id = user_id AND status = 'active'));

-- Mood Logs: Own rows, Mentors SELECT if shared
CREATE POLICY "Users can manage own mood logs" ON mood_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Mentors can view shared mood logs" ON mood_logs FOR SELECT
  USING (shared_with_mentor = true AND EXISTS (SELECT 1 FROM mentor_matches WHERE mentor_id = auth.uid() AND student_id = user_id AND status = 'active'));

-- AI Conversations: Own rows, DSL SELECT if flagged
CREATE POLICY "Users can manage own AI conversations" ON ai_conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "DSL can view flagged conversations" ON ai_conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('dsl', 'admin')
    ) AND EXISTS (
      SELECT 1 FROM public.safeguarding_flags sf
      WHERE sf.user_id = ai_conversations.user_id
    )
  );

-- Safeguarding: DSL/Admin ONLY
CREATE POLICY "DSL and Admin only view cases" ON safeguarding_cases FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'dsl')));
CREATE POLICY "Users cannot view safeguarding cases" ON safeguarding_cases FOR ALL TO PUBLIC USING (FALSE);

CREATE POLICY "DSL and Admin only view flags" ON safeguarding_flags FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'dsl')));
CREATE POLICY "Users can insert own safeguarding flags" ON safeguarding_flags FOR INSERT
  WITH CHECK (auth.uid() = user_id AND category IN ('A', 'B', 'C', 'D'));
CREATE POLICY "DSL and Admin can update flags" ON safeguarding_flags FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'dsl')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'dsl')));

-- Offline Sync Queue
CREATE POLICY "Users can manage own sync queue" ON offline_sync_queue FOR ALL USING (auth.uid() = user_id);

-- Circle Responses: Insert own, Select if submitted for that week
CREATE POLICY "Users can insert own circle response" ON circle_responses FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND circle_id = (SELECT county FROM public.profiles WHERE id = auth.uid())
  );
CREATE POLICY "Users can select weekly circle responses after submitting" ON circle_responses FOR SELECT
  USING (EXISTS (SELECT 1 FROM circle_responses cr WHERE cr.user_id = auth.uid() AND cr.circle_id = circle_responses.circle_id AND cr.week_number = circle_responses.week_number));

-- Points & Goals: Own rows
CREATE POLICY "Users can manage own point transactions" ON point_transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own goals" ON goals FOR ALL USING (auth.uid() = user_id);

-- Achievements & Opportunities: Public details, own mapping
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Users can manage own achievements" ON user_achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view opportunities" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Users can manage own saved opportunities" ON saved_opportunities FOR ALL USING (auth.uid() = user_id);

-- Messaging
CREATE POLICY "Users can send messages" ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND (
      EXISTS (
        SELECT 1 FROM public.mentor_matches
        WHERE (student_id = sender_id AND mentor_id = receiver_id AND status = 'active')
           OR (mentor_id = sender_id AND student_id = receiver_id AND status = 'active')
      )
    )
  );
CREATE POLICY "Users can view their messages" ON messages FOR SELECT USING (auth.uid() IN (sender_id, receiver_id));

-- Analytics
CREATE POLICY "Users can insert own analytics events" ON analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Admins can view analytics" ON analytics_events FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Mentoring Extensions
CREATE POLICY "Users can view their mentor matches" ON mentor_matches FOR SELECT USING (auth.uid() IN (student_id, mentor_id));
CREATE POLICY "Users can view their mentor sessions" ON mentor_sessions FOR SELECT
  USING (EXISTS (SELECT 1 FROM mentor_matches mm WHERE mm.id = mentor_sessions.match_id AND auth.uid() IN (mm.student_id, mm.mentor_id)));

-- Mentoring Extensions: Nudges & Ratings
CREATE POLICY "Users can manage their nudges" ON mentor_nudges FOR ALL 
  USING (EXISTS (SELECT 1 FROM mentor_matches mm WHERE mm.id = mentor_nudges.pair_id AND auth.uid() IN (mm.student_id, mm.mentor_id)));
  
CREATE POLICY "Users can view session ratings" ON session_ratings FOR SELECT
  USING (EXISTS (SELECT 1 FROM mentor_sessions ms JOIN mentor_matches mm ON ms.match_id = mm.id WHERE ms.id = session_ratings.session_id AND auth.uid() IN (mm.student_id, mm.mentor_id)));
CREATE POLICY "Users can insert session ratings for their matches" ON session_ratings FOR INSERT
  WITH CHECK (
    auth.uid() = rater_id
    AND EXISTS (
      SELECT 1 FROM public.mentor_sessions ms
      JOIN public.mentor_matches mm ON ms.match_id = mm.id
      WHERE ms.id = session_id
        AND auth.uid() IN (mm.student_id, mm.mentor_id)
    )
  );

-- Push Notification Webhook Triggers
CREATE OR REPLACE FUNCTION notify_push_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Requires pg_net extension to be enabled
  PERFORM net.http_post(
    url := 'https://' || current_setting('supabase.project_ref', true) || '.supabase.co/functions/v1/push-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('core.service_role_key', true)
    ),
    body := jsonb_build_object(
      'user_id', NEW.receiver_id,
      'title', 'New Message',
      'body', 'You have received a new message.'
    )
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
REVOKE EXECUTE ON FUNCTION notify_push_message() FROM PUBLIC, authenticated, anon;

CREATE TRIGGER tr_notify_push_message
AFTER INSERT ON messages
FOR EACH ROW EXECUTE FUNCTION notify_push_message();

CREATE OR REPLACE FUNCTION notify_push_tier()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.current_tier IS DISTINCT FROM NEW.current_tier THEN
    PERFORM net.http_post(
      url := 'https://' || current_setting('supabase.project_ref', true) || '.supabase.co/functions/v1/push-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('core.service_role_key', true)
      ),
      body := jsonb_build_object(
        'user_id', NEW.id,
        'title', 'Tier Upgraded! 🎉',
        'body', 'Congratulations! You reached ' || NEW.current_tier || ' tier.'
      )
    );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
REVOKE EXECUTE ON FUNCTION notify_push_tier() FROM PUBLIC, authenticated, anon;

CREATE TRIGGER tr_notify_push_tier
AFTER UPDATE OF current_tier ON profiles
FOR EACH ROW EXECUTE FUNCTION notify_push_tier();

-- SEED DATA
INSERT INTO schools (name, county) VALUES ('Drumvale Secondary', 'Nairobi');

INSERT INTO achievements (id, name, description, icon) VALUES
('first_step', 'First Step', 'You showed up. That''s where everything starts.', '🌱'),
('moto', 'Moto (Fire)', 'Seven days in a row. That''s not luck — that''s character.', '🔥'),
('voice_found', 'Voice Found', 'You found the words. Now use them.', '🗣️'),
('mkutano', 'Mkutano', 'You showed up for someone who showed up for you.', '🤝'),
('mentors_choice', 'Mentor''s Choice', 'A mentor noticed. Remember this moment.', '⭐'),
('kiongozi_wa_kwanza', 'Kiongozi wa Kwanza', 'First. Not last. Never settling.', '🏆');

INSERT INTO modules (id, title, description, is_published) VALUES
('self_discovery', 'Self Discovery', 'Who am I? Where am I going?', true),
('mental_health', 'Mental Health', 'Inside out: Navigating emotions and stress.', true),
('srh', 'Sexual & Reproductive Health', 'Decisions that matter.', true),
('financial_literacy', 'Financial Literacy', 'The art of building.', true),
('drug_awareness', 'Drug Awareness', 'Staying clean, staying sharp.', true),
('digital_literacy', 'Digital Literacy', 'The connected world.', true),
('career_pathways', 'Career Pathways', 'Finding your lane.', true),
('leadership', 'Leadership', 'Stepping up.', true);

-- ============================================================
-- JABARI MENTOR GOAL INJECTION & CHECK-IN LOGGING
-- ============================================================

-- Add goal injection columns to existing mentor_matches table
ALTER TABLE mentor_matches
  ADD COLUMN jabari_goals TEXT[] DEFAULT '{}',
  ADD COLUMN jabari_agenda TEXT DEFAULT '';

-- Check-in log: one row per mentee per session
CREATE TABLE jabari_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pair_id UUID REFERENCES mentor_matches(id) ON DELETE SET NULL,
  checkin_date DATE DEFAULT CURRENT_DATE,
  summary TEXT,
  goals_touched TEXT[] DEFAULT '{}',
  mood_signal TEXT NOT NULL CHECK (mood_signal IN ('positive', 'neutral', 'concerning')),
  safeguarding_flag BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS — every table ships with it or it doesn't ship
ALTER TABLE jabari_checkins ENABLE ROW LEVEL SECURITY;

-- Mentors can view checkins for their active students
CREATE POLICY "Mentors can view checkins for their students"
  ON jabari_checkins FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM mentor_matches mm
      WHERE mm.id = jabari_checkins.pair_id
        AND mm.mentor_id = auth.uid()
        AND mm.status = 'active'
    )
  );

-- DSLs can view any checkin that carries a safeguarding flag
CREATE POLICY "DSLs can view flagged checkins"
  ON jabari_checkins FOR SELECT
  USING (
    safeguarding_flag = TRUE
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'dsl'
    )
  );

-- Users can insert their own checkins
CREATE POLICY "Users can insert own checkins"
  ON jabari_checkins FOR INSERT
  WITH CHECK (auth.uid() = mentee_id);

-- ============================================================
-- MENTOR TABLES — PRODUCTION FINALIZATION
-- KOFI: every table ships with RLS or it doesn't ship.
-- ============================================================

-- 1. Extend match_status enum to support pending match requests
ALTER TYPE match_status ADD VALUE IF NOT EXISTS 'pending';

-- 2. Add missing columns to mentor_profiles
ALTER TABLE mentor_profiles
  ADD COLUMN IF NOT EXISTS expertise TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS county TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE;

-- 3. Add activated_at to mentor_matches
ALTER TABLE mentor_matches
  ADD COLUMN IF NOT EXISTS activated_at TIMESTAMPTZ;

-- 4. RLS POLICIES for mentor_matches
--
-- ⚠ DUPLICATE NOTE:
-- Line 345 already defines:
--   "Users can view their mentor matches" ON mentor_matches FOR SELECT
--     USING (auth.uid() IN (student_id, mentor_id))
-- This already covers both student and mentor SELECT.
-- Adding a second student-only SELECT policy would be redundant (Postgres
-- ORs all matching policies). We skip the duplicate and note it here.

-- 4a. Mentors can update jabari_goals and jabari_agenda for their active matches
-- 4a. Mentors can update status/goals/agenda for their assigned matches
CREATE POLICY "Mentors can update own mentor matches"
  ON mentor_matches
  FOR UPDATE
  USING (auth.uid() = mentor_id)
  WITH CHECK (
    auth.uid() = mentor_id
    AND status IN ('pending', 'active', 'ended')
  );

-- 4b. Students can insert match requests with their own student_id
CREATE POLICY "Students can insert match requests"
  ON mentor_matches FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- 4c. Students can update status to 'ended' (disconnect)
CREATE POLICY "Students can update own mentor matches"
  ON mentor_matches
  FOR UPDATE
  USING (auth.uid() = student_id)
  WITH CHECK (
    auth.uid() = student_id
    AND status = 'ended'
  );

-- 5. mentor_profiles: anyone can view available mentors (public directory)
CREATE POLICY "Anyone can view available mentor profiles"
  ON mentor_profiles FOR SELECT
  USING (is_available = true);

-- 6. Mentors can update their own profile
CREATE POLICY "Mentors can update own profile"
  ON mentor_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 6b. User and Admin mentor_profiles policies
CREATE POLICY "Users can select own mentor profile" ON mentor_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own mentor profile" ON mentor_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can select all mentor profiles" ON mentor_profiles
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert all mentor profiles" ON mentor_profiles
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update all mentor profiles" ON mentor_profiles
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete all mentor profiles" ON mentor_profiles
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 7. Triggers & Functions for strict authorization

-- 7a. prevent_self_profile_privilege_escalation
CREATE OR REPLACE FUNCTION public.prevent_self_profile_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester_role text;
BEGIN
  IF auth.role() = 'service_role' OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT role::text
  INTO requester_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF COALESCE(requester_role, 'student') <> 'admin' THEN
    -- Check INSERTs
    IF TG_OP = 'INSERT' AND COALESCE(NEW.role::text, 'student') <> 'student' THEN
      RAISE EXCEPTION 'Only admins can assign privileged roles';
    END IF;

    IF TG_OP = 'INSERT' AND COALESCE(NEW.is_premium, false) <> false THEN
      RAISE EXCEPTION 'Only admins can assign premium entitlement';
    END IF;

    -- Check UPDATEs
    IF TG_OP = 'UPDATE' THEN
      -- Role updates
      IF NEW.role IS DISTINCT FROM OLD.role THEN
        -- Allow verified mentors to switch their own profile role between student and mentor
        IF NEW.id = auth.uid() 
           AND ((OLD.role = 'student'::role_type AND NEW.role = 'mentor'::role_type) OR (OLD.role = 'mentor'::role_type AND NEW.role = 'student'::role_type))
           AND EXISTS (SELECT 1 FROM public.mentor_profiles WHERE id = NEW.id AND is_verified = true)
        THEN
          -- Switch is permitted
          NULL;
        ELSE
          RAISE EXCEPTION 'Only admins can change profile roles';
        END IF;
      END IF;

      -- Premium updates
      IF NEW.is_premium IS DISTINCT FROM OLD.is_premium THEN
        RAISE EXCEPTION 'Only admins can change premium entitlement';
      END IF;

      -- Points tempering validation (allow at most 200 points increment per update)
      IF NEW.points IS DISTINCT FROM OLD.points THEN
        IF NEW.points < OLD.points THEN
          RAISE EXCEPTION 'Points cannot decrease';
        ELSIF NEW.points - OLD.points > 200 THEN
          RAISE EXCEPTION 'Invalid points increment: cannot add more than 200 points in a single transaction';
        END IF;
      END IF;

      -- Weekly points tempering validation (allow resets, but limit increments to 200)
      IF NEW.weekly_points IS DISTINCT FROM OLD.weekly_points THEN
        IF NEW.weekly_points < 0 THEN
          RAISE EXCEPTION 'Weekly points cannot be negative';
        ELSIF NEW.weekly_points > OLD.weekly_points AND NEW.weekly_points - OLD.weekly_points > 200 THEN
          RAISE EXCEPTION 'Invalid weekly points increment: cannot add more than 200 points in a single transaction';
        END IF;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_self_profile_privilege_escalation_insert ON profiles;
CREATE TRIGGER prevent_self_profile_privilege_escalation_insert
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_self_profile_privilege_escalation();

DROP TRIGGER IF EXISTS prevent_self_profile_privilege_escalation_update ON profiles;
CREATE TRIGGER prevent_self_profile_privilege_escalation_update
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_self_profile_privilege_escalation();

-- 7b. prevent_mentor_match_participant_change
CREATE OR REPLACE FUNCTION public.prevent_mentor_match_participant_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester_role text;
BEGIN
  IF auth.role() = 'service_role' OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT role::text
  INTO requester_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF COALESCE(requester_role, 'student') <> 'admin'
    AND (
      NEW.student_id IS DISTINCT FROM OLD.student_id
      OR NEW.mentor_id IS DISTINCT FROM OLD.mentor_id
    )
  THEN
    RAISE EXCEPTION 'Only admins can change mentor match participants';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_mentor_match_participant_change_update ON mentor_matches;
CREATE TRIGGER prevent_mentor_match_participant_change_update
  BEFORE UPDATE ON mentor_matches
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_mentor_match_participant_change();

-- 7c. check_mentor_session_update
CREATE OR REPLACE FUNCTION public.check_mentor_session_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester_role text;
BEGIN
  IF auth.role() = 'service_role' OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT role::text
  INTO requester_role
  FROM public.profiles
  WHERE id = auth.uid();

  -- Freeze IDs
  IF OLD.match_id IS DISTINCT FROM NEW.match_id THEN
    RAISE EXCEPTION 'match_id cannot be changed';
  END IF;
  IF OLD.mentor_id IS DISTINCT FROM NEW.mentor_id THEN
    RAISE EXCEPTION 'mentor_id cannot be changed';
  END IF;
  IF OLD.mentee_id IS DISTINCT FROM NEW.mentee_id THEN
    RAISE EXCEPTION 'mentee_id cannot be changed';
  END IF;

  -- Students can only set status to 'cancelled'
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    IF EXISTS (
      SELECT 1 FROM public.mentor_matches mm
      WHERE mm.id = OLD.match_id AND mm.student_id = auth.uid()
    ) AND NEW.status <> 'cancelled' THEN
      RAISE EXCEPTION 'Students can only cancel sessions';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_check_mentor_session_update ON mentor_sessions;
CREATE TRIGGER tr_check_mentor_session_update
  BEFORE UPDATE ON mentor_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.check_mentor_session_update();

-- 7d. check_mentor_nudge_update
CREATE OR REPLACE FUNCTION public.check_mentor_nudge_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- Freeze IDs
  IF OLD.id IS DISTINCT FROM NEW.id THEN
    RAISE EXCEPTION 'id cannot be changed';
  END IF;
  IF OLD.mentor_id IS DISTINCT FROM NEW.mentor_id THEN
    RAISE EXCEPTION 'mentor_id cannot be changed';
  END IF;
  IF OLD.pair_id IS DISTINCT FROM NEW.pair_id THEN
    RAISE EXCEPTION 'pair_id cannot be changed';
  END IF;
  IF OLD.message IS DISTINCT FROM NEW.message THEN
    RAISE EXCEPTION 'message cannot be changed';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_check_mentor_nudge_update ON mentor_nudges;
CREATE TRIGGER tr_check_mentor_nudge_update
  BEFORE UPDATE ON mentor_nudges
  FOR EACH ROW
  EXECUTE FUNCTION public.check_mentor_nudge_update();

-- 7e. increment_tts_usage
CREATE OR REPLACE FUNCTION public.increment_tts_usage(char_count INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_id uuid;
  current_used integer;
  current_date_val date;
BEGIN
  caller_id := auth.uid();
  IF caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: Session missing';
  END IF;

  -- Select current details
  SELECT tts_characters_today, last_tts_date
  INTO current_used, current_date_val
  FROM public.profiles
  WHERE id = caller_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  -- Reset count if new day
  IF current_date_val IS DISTINCT FROM CURRENT_DATE THEN
    UPDATE public.profiles
    SET
      tts_characters_today = char_count,
      last_tts_date = CURRENT_DATE
    WHERE id = caller_id;
  ELSE
    -- Check if it exceeds the 5,000 character daily limit
    IF (COALESCE(current_used, 0) + char_count) > 5000 THEN
      RAISE EXCEPTION 'TTS daily character quota exceeded (Limit: 5,000 characters)';
    END IF;

    UPDATE public.profiles
    SET
      tts_characters_today = COALESCE(current_used, 0) + char_count
    WHERE id = caller_id;
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.increment_tts_usage(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_tts_usage(integer) TO authenticated;

