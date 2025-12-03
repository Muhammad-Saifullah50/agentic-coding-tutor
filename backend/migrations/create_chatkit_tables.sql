-- ChatKit Threads and Items tables for Supabase
-- This stores ChatKit conversation state

CREATE TABLE IF NOT EXISTS chatkit_threads (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    data JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chatkit_threads_user ON chatkit_threads(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS chatkit_items (
    id TEXT PRIMARY KEY,
    thread_id TEXT NOT NULL REFERENCES chatkit_threads(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    data JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chatkit_items_thread ON chatkit_items(thread_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chatkit_items_user ON chatkit_items(user_id, created_at DESC);

COMMENT ON TABLE chatkit_threads IS 'ChatKit conversation threads';
COMMENT ON TABLE chatkit_items IS 'ChatKit thread items (messages, tools, widgets, etc)';
