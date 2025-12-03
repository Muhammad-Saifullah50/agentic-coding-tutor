"""Supabase-backed Store implementation for ChatKit."""
from dataclasses import dataclass
from datetime import datetime
from typing import AsyncIterator, Literal

from chatkit.store import Store
from chatkit.types import (
    Page,
    Thread,
    ThreadMetadata,
    ThreadItem,
)
from utils.supabase_client import supabase


@dataclass
class MentorRequestContext:
    """Context passed through ChatKit requests."""
    user_id: str


class SupabaseStore(Store[MentorRequestContext]):
    """ChatKit Store backed by Supabase."""
    
    async def load_thread(
        self, thread_id: str, context: MentorRequestContext
    ) -> ThreadMetadata:
        """Load thread metadata from Supabase."""
        response = supabase.table("chatkit_threads") \
            .select("data") \
            .eq("id", thread_id) \
            .eq("user_id", context.user_id) \
            .execute()
        
        if not response.data:
            from chatkit.errors import NotFoundError
            raise NotFoundError(f"Thread {thread_id} not found")
        
        return ThreadMetadata.model_validate(response.data[0]["data"])
    
    async def save_thread(
        self, thread: ThreadMetadata, context: MentorRequestContext
    ) -> None:
        """Save thread metadata to Supabase."""
        payload = thread.model_dump(mode="json")
        
        supabase.table("chatkit_threads").upsert({
            "id": thread.id,
            "user_id": context.user_id,
            "created_at": thread.created_at.isoformat(),
            "data": payload,
        }).execute()
    
    async def list_threads(
        self,
        before: str | None,
        after: str | None,
        limit: int,
        context: MentorRequestContext,
    ) -> Page[Thread]:
        """List threads for a user."""
        query = supabase.table("chatkit_threads") \
            .select("data") \
            .eq("user_id", context.user_id) \
            .order("created_at", desc=True) \
            .limit(limit)
        
        response = query.execute()
        
        threads = [Thread.model_validate(row["data"]) for row in response.data]
        
        return Page(
            data=threads,
            has_more=len(threads) == limit,
        )
    
    async def delete_thread(
        self, thread_id: str, context: MentorRequestContext
    ) -> None:
        """Delete a thread."""
        supabase.table("chatkit_threads") \
            .delete() \
            .eq("id", thread_id) \
            .eq("user_id", context.user_id) \
            .execute()
    
    async def load_thread_items(
        self,
        thread_id: str,
        before: str | None,
        after: str | None,
        limit: int,
        order: Literal["asc", "desc"],
        context: MentorRequestContext,
    ) -> Page[ThreadItem]:
        """Load thread items (messages, tools, etc) from Supabase."""
        query = supabase.table("chatkit_items") \
            .select("data") \
            .eq("thread_id", thread_id) \
            .eq("user_id", context.user_id) \
            .order("created_at", desc=(order == "desc")) \
            .limit(limit)
        
        response = query.execute()
        
        items = [ThreadItem.model_validate(row["data"]) for row in response.data]
        
        return Page(
            data=items,
            has_more=len(items) == limit,
        )
    
    async def save_thread_item(
        self, thread_id: str, item: ThreadItem, context: MentorRequestContext
    ) -> None:
        """Save a thread item to Supabase."""
        payload = item.model_dump(mode="json")
        
        supabase.table("chatkit_items").upsert({
            "id": item.id,
            "thread_id": thread_id,
            "user_id": context.user_id,
            "created_at": item.created_at.isoformat(),
            "data": payload,
        }).execute()
    
    async def delete_thread_item(
        self, thread_id: str, item_id: str, context: MentorRequestContext
    ) -> None:
        """Delete a thread item."""
        supabase.table("chatkit_items") \
            .delete() \
            .eq("id", item_id) \
            .eq("thread_id", thread_id) \
            .eq("user_id", context.user_id) \
            .execute()
