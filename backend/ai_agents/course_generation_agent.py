from agents import Agent, RunContextWrapper
from schemas.curriculum_outline import CurriculumOutline
from schemas.full_course import FullCourse
from models.gemini import gemini_model

async def dynamic_instructions(
    context: RunContextWrapper[CurriculumOutline], agent: Agent
) -> str:
    """Generate course content based on a curriculum outline."""

    base_instructions = """You are an expert course content creator.
Your task is to generate the full content for a programming course based on the provided curriculum outline.
For each lesson, provide a detailed explanation of the concepts, code examples, and a short exercise.
The output should be in Markdown format."""

    if not context or not context.context:
        return base_instructions

    outline = CurriculumOutline(**context.context)

    outline_str = ""
    for module in outline.modules:
        outline_str += f"Module: {module.title}\n"
        for lesson in module.lessons:
            outline_str += f"  - Lesson: {lesson.title}\n"

    return f"""{base_instructions}

Here is the curriculum outline to follow:
{outline_str}

Generate the full course content based on this outline.
"""

course_generation_agent = Agent(
    name="course_generation_agent",
    instructions=dynamic_instructions,
    output_type=FullCourse,
    model=gemini_model,
)

