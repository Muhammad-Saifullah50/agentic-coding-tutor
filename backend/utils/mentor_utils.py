from agents import SQLiteSession
from typing import List
from schemas.user_profile_context import UserProfile


def build_context_message(profile: UserProfile, courses: List[dict]) -> str:
    """Build context string from user profile and courses for the AI Mentor."""
    
    # Format goals
    goals_str = ', '.join(profile.goals) if profile.goals else 'Not specified'
    
    # Build course summary
    course_summary = ""
    if courses and len(courses) > 0:
        course_summary = f"\n\nCurrent Courses ({len(courses)} enrolled):"
        for idx, course in enumerate(courses[:5], 1):  # Show max 5 courses
            course_title = course.get('title', 'Untitled Course')
            course_summary += f"\n  {idx}. {course_title}"
        if len(courses) > 5:
            course_summary += f"\n  ... and {len(courses) - 5} more"
    else:
        course_summary = "\n\nNo courses enrolled yet."
    
    context = f"""You are helping {profile.username}, a student with the following profile:

**Student Profile:**
- Age Range: {profile.ageRange}
- Education Level: {profile.educationLevel}
- Tech Background: {profile.techBackground}
- Coding Experience: {profile.codingExperience}
- Learning Goals: {goals_str}
- Learning Speed: {profile.learningSpeed}
- Learning Mode: {profile.learningMode}
- Time Per Week: {profile.timePerWeek}
- Preferred Language: {profile.preferredLanguage}{course_summary}

**Your Role:**
You are a supportive AI Mentor. Provide personalized academic assistance based on this student's profile. 
Be encouraging, educational, and adapt your explanations to their experience level.
"""
    
    return context


def get_mentor_session(user_id: str) -> SQLiteSession:
    """Get or create a SQLiteSession for the user's mentor conversations."""
    session_id = f"mentor_user_{user_id}"
    return SQLiteSession(session_id, "mentor_sessions.db")
