-- Youth Educated Supabase Schema

-- ENUMS
CREATE TYPE role_type AS ENUM ('student', 'mentor', 'admin', 'dsl');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'prefer_not_to_say');
CREATE TYPE match_status AS ENUM ('active', 'ended');
CREATE TYPE opportunity_type AS ENUM ('job', 'internship', 'training');
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
  push_token TEXT
);

CREATE TABLE modules (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lessons (
  id TEXT PRIMARY KEY,
  module_id TEXT REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_url TEXT,
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
  scheduled_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  notes TEXT
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
  circle_id UUID REFERENCES circles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  UNIQUE(circle_id, user_id)
);

CREATE TABLE circle_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID REFERENCES circles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type opportunity_type NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE saved_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

CREATE TABLE safeguarding_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
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
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE safeguarding_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_sync_queue ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Profiles: Own SELECT/UPDATE, Mentor SELECT students, Admin/DSL SELECT all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Mentors can view their students' profiles" ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM mentor_matches WHERE mentor_id = auth.uid() AND student_id = profiles.id AND status = 'active'));
CREATE POLICY "Admins/DSL can view all profiles" ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'dsl')));

-- Modules & Lessons: Public SELECT
CREATE POLICY "Anyone can view published modules" ON modules FOR SELECT USING (is_published = true);
CREATE POLICY "Anyone can view lessons" ON lessons FOR SELECT USING (TRUE);

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
  USING (safeguarding_flagged = true AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'dsl'));

-- Safeguarding: DSL/Admin ONLY
CREATE POLICY "DSL and Admin only view cases" ON safeguarding_cases FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'dsl')));
CREATE POLICY "Users cannot view safeguarding cases" ON safeguarding_cases FOR ALL TO PUBLIC USING (FALSE);

-- Offline Sync Queue
CREATE POLICY "Users can manage own sync queue" ON offline_sync_queue FOR ALL USING (auth.uid() = user_id);

-- Circle Responses: Insert own, Select if submitted for that week
CREATE POLICY "Users can insert own circle response" ON circle_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
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
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can view their messages" ON messages FOR SELECT USING (auth.uid() IN (sender_id, receiver_id));

-- Mentoring Extensions
CREATE POLICY "Users can view their mentor matches" ON mentor_matches FOR SELECT USING (auth.uid() IN (student_id, mentor_id));
CREATE POLICY "Users can view their mentor sessions" ON mentor_sessions FOR SELECT
  USING (EXISTS (SELECT 1 FROM mentor_matches mm WHERE mm.id = mentor_sessions.match_id AND auth.uid() IN (mm.student_id, mm.mentor_id)));

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
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
