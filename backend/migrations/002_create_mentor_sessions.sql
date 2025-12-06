-- Create mentor_sessions table for storing AI mentor chat history
-- This replaces the file-based SQLiteSession approach

CREATE TABLE IF NOT EXISTS mentor_sessions (
    session_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups by session_id and user_id
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_id ON mentor_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_user_id ON mentor_sessions(user_id);

-- Comment for documentation
COMMENT ON TABLE mentor_sessions IS 'Stores conversation history for AI Mentor chatbot, replacing file-based storage';
COMMENT ON COLUMN mentor_sessions.session_id IS 'Unique session identifier (e.g., mentor_user_{user_id})';
COMMENT ON COLUMN mentor_sessions.user_id IS 'ID of the user who owns this session';
COMMENT ON COLUMN mentor_sessions.items IS 'JSON array of conversation items (messages, tool calls, etc.)';
