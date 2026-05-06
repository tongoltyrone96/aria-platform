-- Migration: Add sessions table for call/coding session tracking
-- Run this in Supabase SQL Editor

-- 1. Create the session_type enum
CREATE TYPE session_type AS ENUM ('interview', 'coding');

-- 2. Create the sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  device_id     UUID REFERENCES devices(id),
  type          session_type NOT NULL DEFAULT 'interview',
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at      TIMESTAMPTZ,
  answer_count  INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT sessions_answer_count_non_negative CHECK (answer_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_ts ON sessions(user_id, started_at);

-- 3. Enable Row Level Security (match pattern of other tables)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Service role has full access (API uses service role)
CREATE POLICY "service_role_all" ON sessions
  FOR ALL USING (auth.role() = 'service_role');

-- 4. Also update existing trial subscriptions to free/active
--    (optional — run if you want to convert existing test accounts)
-- UPDATE subscriptions
--   SET plan = 'free', status = 'active', trial_ends_at = NULL
-- WHERE plan = 'trial';
