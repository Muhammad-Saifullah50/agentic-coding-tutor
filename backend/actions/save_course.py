from utils.supabase_client import supabase
from schemas.full_course import FullCourse


async def save_course(course: FullCourse, user_id: str) -> dict:
    """Save the generated course to Supabase."""
    response = (
        supabase.table("Course")
        .insert(
            {
                "user_id": user_id,
                "title": course.title,
                "slug": course.slug,
                "course_data": course.model_dump(),
            }
        )
        .execute()
    )

    if response.error:
        raise Exception(f"Failed to save course: {response.error.message}")

    return response.data[0]
