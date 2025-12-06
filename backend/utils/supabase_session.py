import json
import asyncio
from typing import List, Optional, Any
from agents.memory.session import SessionABC
from utils.supabase_client import supabase

class SupabaseSession(SessionABC):
    """
    A session implementation that stores chat history in the UserProfile table
    in Supabase, specifically in the 'mentor_chat_history' JSONB column.
    """

    def __init__(self, user_id: str):
        self.user_id = user_id

    async def get_items(self) -> List[Any]:
        """Get all items from the conversation history."""
        try:
            response = await asyncio.to_thread(
                lambda: supabase.table("UserProfile")
                .select("mentor_chat_history")
                .eq("userId", self.user_id)
                .execute()
            )
            
            if response.data and len(response.data) > 0:
                history = response.data[0].get("mentor_chat_history", [])
                # Ensure it's a list
                if isinstance(history, str):
                    try:
                        return json.loads(history)
                    except json.JSONDecodeError:
                        return []
                return history if isinstance(history, list) else []
            return []
        except Exception as e:
            print(f"Error getting items from Supabase: {e}")
            return []

    async def add_items(self, items: List[Any]) -> None:
        """Add new items to the conversation history."""
        if not items:
            return

        try:
            # First get existing items
            current_items = await self.get_items()
            
            # Append new items
            updated_items = current_items + items
            
            # Update Supabase
            await asyncio.to_thread(
                lambda: supabase.table("UserProfile")
                .update({"mentor_chat_history": updated_items})
                .eq("userId", self.user_id)
                .execute()
            )
        except Exception as e:
            print(f"Error adding items to Supabase: {e}")

    async def pop_item(self) -> Optional[Any]:
        """Remove and return the most recent item from the session."""
        try:
            current_items = await self.get_items()
            if not current_items:
                return None
            
            item = current_items.pop()
            
            # Update Supabase with removed item
            await asyncio.to_thread(
                lambda: supabase.table("UserProfile")
                .update({"mentor_chat_history": current_items})
                .eq("userId", self.user_id)
                .execute()
            )
            
            return item
        except Exception as e:
            print(f"Error popping item from Supabase: {e}")
            return None

    async def clear_session(self) -> None:
        """Clear all items for this session."""
        try:
            await asyncio.to_thread(
                lambda: supabase.table("UserProfile")
                .update({"mentor_chat_history": []})
                .eq("userId", self.user_id)
                .execute()
            )
        except Exception as e:
            print(f"Error clearing session in Supabase: {e}")

    def close(self) -> None:
        """Close the session (no-op for Supabase client as it manages its own connection)."""
        pass
