-- Create mentor_conversations table for storing AI mentor chat history
-- This replaces the file-based SQLiteSession approach

CREATE TABLE IF NOT EXISTS mentor_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups by user and chronological order
CREATE INDEX IF NOT EXISTS idx_mentor_conv_user ON mentor_conversations(user_id, created_at DESC);

-- Comment for documentation
COMMENT ON TABLE mentor_conversations IS 'Stores conversation history for AI Mentor chatbot, replacing file-based storage';
COMMENT ON COLUMN mentor_conversations.user_id IS 'Clerk user ID from UserProfile table';
COMMENT ON COLUMN mentor_conversations.role IS 'Message role: either "user" or "assistant"';
COMMENT ON COLUMN mentor_conversations.content IS 'Message content (text)';
