from pydantic import BaseModel
from typing import Optional


class MentorChatRequest(BaseModel):
    user_id: str
    message: str


class MentorChatResponse(BaseModel):
    status: str  # "success" or "failure"
    message: Optional[str] = None
    error_message: Optional[str] = None
