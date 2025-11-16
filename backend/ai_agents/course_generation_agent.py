from agents import Agent, RunContextWrapper
from schemas.curriculum_outline import CurriculumOutline
from schemas.full_course import FullCourse
from schemas.user_profile_context import UserProfile
from models.gemini import gemini_model

async def dynamic_instructions(
    context: RunContextWrapper, agent: Agent
) -> str:
    """Generate instructions for detailed course generation with balanced quiz and coding lessons."""

    base_instructions = """You are an expert course content creator.
Your task is to expand a curriculum outline into a complete, detailed course.
Make sure the final course is balanced with a fair number of:
- **Quiz lessons** (to test understanding)
- **Coding lessons / playground lessons** (hands-on learning)
"""

    if not context or not context.context:
        return base_instructions + "\nGenerate comprehensive course content based on the outline."

    # Extract context data
    ctx_data = context.context
    
    outline_data = ctx_data.get("outline", {})
    user_profile_data = ctx_data.get("user_profile", {})

    outline = CurriculumOutline(**outline_data)

    # Personalized guidance
    profile_instructions = ""
    if user_profile_data:
        try:
            profile = UserProfile(**user_profile_data)
            profile_instructions = f"""
Personalize the course for a student with:
- Experience Level: {profile.codingExperience}
- Learning Style: {profile.learningMode}
- Learning Pace: {profile.learningSpeed}
- Time Commitment: {profile.timePerWeek}
- Goals: {', '.join(profile.goals)}
"""
        except Exception as e:
            print(f"Could not parse user profile: {e}")

    # ---------- NEW: QUIZ + CODING LESSON BALANCING RULES ----------
    quiz_and_coding_guidelines = """
Lesson Type Requirements:
- For every **3–4 content lessons**, generate **1 quiz lesson**.
- For every **2–3 modules**, include **1 advanced coding lesson**.
- Each coding lesson must include:
  • A problem description  
  • Starter code  
  • Challenge  
  • Hints  
  • Expected output example  
- Each quiz lesson must include:
  • 4–6 questions  
  • Each question must have: (id, question, options, correctAnswer, explanation)
"""

    return f"""{base_instructions}

{profile_instructions}

Course Outline to Expand:
Title: {outline.title}
Modules: {len(outline.modules)}

{quiz_and_coding_guidelines}

For each module and lesson in the outline, generate:
1. Full detailed lesson content and explanations
2. Code examples and optional exercises
3. Hands-on coding challenges
4. Quiz lessons placed logically throughout the module
5. Additional resources and tips
6. Assessments that match the learner’s profile.

⚠️ Allowed lesson types are ONLY:
- "content"
- "quiz"
- "playground"

Do NOT create lessons with any other type such as:
- "advanced_coding"
- "project"
- "exercise"
- "lab"
- "coding_challenge"

If you want to include an advanced coding lesson, generate it using:
type: "playground"


Maintain the structure from the outline, but enhance each lesson with rich, actionable educational content.
"""


course_generation_agent = Agent(
    name="course_generation_agent",
    instructions=dynamic_instructions,
    output_type=FullCourse,
    model=gemini_model,
)

