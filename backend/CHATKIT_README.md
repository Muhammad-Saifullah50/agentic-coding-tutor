# Chatkit Integration - Incomplete

This directory contains an incomplete attempt to integrate OpenAI Chatkit.

## Why Incomplete?

The `openai-chatkit` package has a significantly more complex API than initially expected:

1. **Requires Custom Store Implementation**: ChatKitServer needs a `Store` object for thread/message persistence
2. **Different Architecture**: Uses `ThreadItemConverter` and custom input/output transformations
3. **No Simple Session API**: No straightforward `chatkit.sessions.create()` method found
4. **Complex Integration**: Would require rewriting substantial parts of the mentor chat logic

## Current Status

- ✅ SQL migration created (`migrations/create_mentor_conversations.sql`) for Supabase storage
- ✅ Dependencies installed (`openai-chatkit`, `@openai/chatkit-react`)
- ❌ Server implementation incomplete (`chatkit_server.py`)
- ❌ Integration endpoint disabled in `main.py`
- ❌ Frontend component not functional (`MentorChat.tsx`)

## Files

- `chatkit_server.py` - Incomplete Chatkit server wrapper
- `migrations/create_mentor_conversations.sql` - Database schema for conversation history
- Frontend: `frontend/src/components/MentorChat.tsx` - Incomplete React component

## Recommendation

The existing `MentorChatbox.tsx` works well and provides:

- ✅ Streaming responses
- ✅ Markdown rendering
- ✅ Session persistence (SQLiteSession)
- ✅ Guardrails integration
- ✅ Clean UI matching app design

**Decision**: Continue using `MentorChatbox.tsx` unless there's a specific Chatkit feature requirement that justifies the integration complexity.

## If Resuming Chatkit Integration

Would need to:

1. Study official Chatkit advanced samples
2. Implement custom `Store` class for Supabase
3. Create proper `ThreadItemConverter` subclass
4. Update `respond()` method to match actual API signature
5. Implement proper session management
6. Test extensively

Estimated effort: 8-12 hours of development + testing.
