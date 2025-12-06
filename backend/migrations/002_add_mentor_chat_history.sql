-- Add mentor_chat_history column to UserProfile table
-- This stores the conversation history for the AI Mentor chatbot

ALTER TABLE "UserProfile" 
ADD COLUMN IF NOT EXISTS mentor_chat_history JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Comment for documentation
COMMENT ON COLUMN "UserProfile".mentor_chat_history IS 'JSON array of conversation items (messages, tool calls, etc.) for the AI Mentor';
