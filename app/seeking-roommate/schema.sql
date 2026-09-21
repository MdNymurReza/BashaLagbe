-- ============================================================
-- FEATURE: Seeking Room / Flatmate & Roommate Preferences
-- Core Database Schema, Types, Indexes, and RLS Policies
-- ============================================================

-- 1. Custom Enums
CREATE TYPE seeking_property_type AS ENUM ('single_room', 'shared_room', 'full_mess', 'sublet', 'any');
CREATE TYPE seeking_status AS ENUM ('active', 'fulfilled');
CREATE TYPE response_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE gender_pref AS ENUM ('any', 'male', 'female');

-- Roommate matching lifestyle enums
CREATE TYPE sleep_schedule AS ENUM ('early', 'late', 'flexible');
CREATE TYPE diet_preference AS ENUM ('veg', 'non_veg', 'any');
CREATE TYPE guest_policy AS ENUM ('allowed', 'rarely', 'never');
CREATE TYPE smoking_habit AS ENUM ('non_smoker', 'smoker', 'outdoor_only');
CREATE TYPE noise_level AS ENUM ('quiet', 'moderate', 'lively');
CREATE TYPE cleanliness_level AS ENUM ('strict', 'moderate', 'relaxed');

-- 2. seeking_posts Table
-- Allows students to broadcast what room/flatmate/budget they are looking for
CREATE TABLE seeking_posts (
    post_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    zone_id INT REFERENCES zones(zone_id),
    budget_min NUMERIC(10,2) NOT NULL,
    budget_max NUMERIC(10,2) NOT NULL,
    property_type seeking_property_type NOT NULL DEFAULT 'any',
    preferred_gender gender_pref NOT NULL DEFAULT 'any',
    move_in_date DATE,
    requirements TEXT,
    status seeking_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. seeking_responses Table
-- Connects responders (students/landlords) directly to a seeking post
CREATE TABLE seeking_responses (
    response_id SERIAL PRIMARY KEY,
    post_id INT REFERENCES seeking_posts(post_id) ON DELETE CASCADE,
    responder_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT,
    status response_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. roommate_preferences Table
-- Stores student lifestyle habits for algorithmic roommate compatibility
CREATE TABLE roommate_preferences (
    preference_id SERIAL PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    sleep_schedule sleep_schedule,
    diet_pref diet_preference,
    guest_policy guest_policy,
    smoking_habit smoking_habit,
    noise_level noise_level,
    cleanliness_level cleanliness_level
);

-- 5. Indexes for fast querying
CREATE INDEX idx_seeking_posts_user_id ON seeking_posts(user_id);
CREATE INDEX idx_seeking_posts_status ON seeking_posts(status);
CREATE INDEX idx_seeking_responses_post_id ON seeking_responses(post_id);
CREATE INDEX idx_seeking_responses_responder_id ON seeking_responses(responder_id);

-- 6. Row Level Security (RLS) Policies
ALTER TABLE seeking_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Seeking posts viewable by everyone." 
  ON seeking_posts FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage own seeking posts." 
  ON seeking_posts FOR ALL 
  USING (auth.uid() = user_id);

ALTER TABLE seeking_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Responses viewable by responder and post owner." 
  ON seeking_responses FOR SELECT 
  USING (
    auth.uid() = responder_id OR
    EXISTS (
      SELECT 1 FROM seeking_posts 
      WHERE seeking_posts.post_id = seeking_responses.post_id 
        AND seeking_posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Responders can insert responses." 
  ON seeking_responses FOR INSERT 
  WITH CHECK (responder_id = auth.uid());

CREATE POLICY "Post owners can update responses." 
  ON seeking_responses FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM seeking_posts 
      WHERE seeking_posts.post_id = seeking_responses.post_id 
        AND seeking_posts.user_id = auth.uid()
    )
  );

ALTER TABLE roommate_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Roommate preferences viewable by authenticated users." 
  ON roommate_preferences FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own roommate preferences." 
  ON roommate_preferences FOR ALL 
  USING (auth.uid() = user_id);
