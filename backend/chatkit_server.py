"""ChatKit server implementation for AI Mentor."""
from collections.abc import AsyncIterator

from agents import Runner
from chatkit.server import ChatKitServer
from chatkit.agents import AgentContext, simple_to_agent_input, stream_agent_response
from chatkit.types import ThreadMetadata, ThreadStreamEvent, UserMessageItem

from ai_agents.mentor_agent import mentor_agent
from chatkit_store import MentorRequestContext, SupabaseStore
from utils.mentor_utils import build_context_message
from utils.supabase_client import supabase
from schemas.user_profile_context import UserProfile


class MentorChatKitServer(ChatKitServer[MentorRequestContext]):
    """ChatKit server for AI Mentor with Supabase storage."""
    
    async def respond(
        self,
        thread: ThreadMetadata,
        input: UserMessageItem | None,
        context: MentorRequestContext,
    ) -> AsyncIterator[ThreadStreamEvent]:
        """Stream response events for a user message."""
        
        if not input:
            return
        
        # Load recent thread items for context
        items_page = await self.store.load_thread_items(
            thread.id,
            after=None,
            before=None,
            limit=20,
            order="desc",
            context=context,
        )
        items = list(reversed(items_page.data))
        
        # Add user profile context for first message
        if not items:
            profile_data = supabase.table("UserProfile") \
                .select("*") \
                .eq("userId", context.user_id) \
                .execute()
            
            if profile_data.data:
                profile = UserProfile(**profile_data.data[0])
                courses_data = supabase.table("Course") \
                    .select("id, title, course_data") \
                    .eq("user_id", context.user_id) \
                    .execute()
                courses = courses_data.data if courses_data.data else []
                
                # Build context and prepend to message
                profile_context = build_context_message(profile, courses)
                # Store as thread metadata for future reference
                thread.metadata["profile_context"] = profile_context
        
        # Convert thread items to agent input
        input_items = await simple_to_agent_input(items + [input])
        
        # Add profile context if available
        if "profile_context" in thread.metadata and not items:
            # Prepend context as system message for first turn
            from agents import Message
            from agents.types.response_model import ResponseInputTextParam
            
            context_message = Message(
                role="user",
                type="message",
                content=[
                    ResponseInputTextParam(
                        type="input_text",
                        text=thread.metadata["profile_context"]
                    )
                ]
            )
            input_items.insert(0, context_message)
        
        # Create agent context
        agent_context = AgentContext(
            thread=thread,
            store=self.store,
            request_context=context,
        )
        
        # Run agent and stream responses
        result = Runner.run_streamed(
            mentor_agent,
            input_items,
            context=agent_context,
        )
        
        # Stream events back to client
        async for event in stream_agent_response(agent_context, result):
            yield event


# Create global server instance with Supabase store
supabase_store = SupabaseStore()
mentor_chatkit_server = MentorChatKitServer(store=supabase_store)
