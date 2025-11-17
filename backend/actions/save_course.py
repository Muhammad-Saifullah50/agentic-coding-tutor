import uuid
from utils.supabase_client import supabase
from schemas.full_course import FullCourse


async def save_course(course: FullCourse, user_id: str) -> dict:
    """Save the generated course to Supabase."""
    
    # Generate a unique course_id: slug + uuid
    unique_id = str(uuid.uuid4())[:8]  # Short UUID
    course_id = f"{course.slug}-{unique_id}"
    
    course_data = {
        "course_id": course_id,
        "user_id": user_id,
        "title": course.title,
        "slug": course.slug,
        "course_data": course.model_dump(),
    }
    
    response = supabase.table("Course").insert(course_data).execute()
    
    # Check for errors in the response
    if hasattr(response, 'error') and response.error:
        raise Exception(f"Failed to save course: {response.error.message}")
    
    # Return the inserted data
    return response.data[0] if response.data else course_data