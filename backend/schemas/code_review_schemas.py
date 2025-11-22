from typing import Optional
from pydantic import BaseModel, Field


# --- API Request/Response Models ---

class CodeReviewRequest(BaseModel):
    """Request schema for code review endpoint."""
    code: str = Field(..., description="The raw code string provided by the user")
    challenge: Optional[str] = Field(None, description="Optional prompt or challenge the user was attempting")
    language: str = Field(..., description="Programming language (e.g., 'JavaScript', 'Python')")
    session_id: str = Field(..., description="Unique identifier for tracking the conversation/request session")


class CodeReviewResponse(BaseModel):
    """Response schema for code review endpoint."""
    status: str = Field(..., description="'success' or 'failure'")
    corrected_code: Optional[str] = Field(None, description="The improved or corrected code block in markdown format")
    feedback_explanation: Optional[str] = Field(None, description="Detailed explanation of changes, errors, and suggestions")
    error_message: Optional[str] = Field(None, description="Present only on failure - message from Guardrail or Agent")


# --- Guardrail Models ---

class CodeInputValidation(BaseModel):
    """Schema for code input guardrail validation."""
    is_valid_code_input: bool = Field(description="True if input appears to be valid code, not conversational text")
    reason: str = Field(description="Brief explanation of the decision (max 15 words, user-facing)")


# --- Agent Output Models ---

class CodeQualityAnalysis(BaseModel):
    """Schema for code review agent output."""
    corrected_code: str = Field(description="The corrected and improved code wrapped in markdown code fences")
    feedback_explanation: str = Field(description="Detailed explanation with sections: Summary, Bugs Fixed, Best Practices, Performance, Challenge Adherence")
