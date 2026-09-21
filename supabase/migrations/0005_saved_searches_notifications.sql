-- ============================================================
-- FEATURE: Search & Filter — Saved Searches & Notifications
-- ============================================================

-- 1. saved_searches Table
-- Stores user's saved filter combinations for alert notifications
CREATE TABLE IF NOT EXISTS saved_searches (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    label TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, query)
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);

ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved searches."
  ON saved_searches FOR ALL
  USING (auth.uid() = user_id);

-- 2. saved_search_alerts Table
-- Tracks which listings have already triggered an alert (prevents duplicates)
CREATE TABLE IF NOT EXISTS saved_search_alerts (
    id SERIAL PRIMARY KEY,
    saved_search_id INT REFERENCES saved_searches(id) ON DELETE CASCADE,
    listing_id INT REFERENCES listings(listing_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(saved_search_id, listing_id)
);

ALTER TABLE saved_search_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only system can read alerts."
  ON saved_search_alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM saved_searches
      WHERE saved_searches.id = saved_search_alerts.saved_search_id
        AND saved_searches.user_id = auth.uid()
    )
  );

-- 3. notifications Table
-- General-purpose in-app notification inbox for all users
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications."
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark their own notifications as read."
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);
