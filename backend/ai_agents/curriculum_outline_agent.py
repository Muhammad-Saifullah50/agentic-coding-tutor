from agents import Agent, RunContextWrapper
from schemas.user_profile_context import UserProfile
from schemas.curriculum_outline import CurriculumOutline
from models.gemini import gemini_model
from ai_agents.guardrails import validate_course_request


async def dynamic_instructions(
    context: RunContextWrapper[UserProfile], agent: Agent
) -> str:
    """Generate personalized course creation instructions based on user profile."""

    base_instructions = """You are an expert curriculum designer specializing in creating personalized programming courses.
Your task is to create a detailed course outline that precisely matches the student's background, learning style, and goals."""

    if not context or not context.context:
        return (
            base_instructions
            + """
Create a balanced curriculum that:
1. Progresses from fundamentals to advanced concepts
2. Includes practical exercises and projects
3. Has clear learning objectives for each section
4. Provides estimated time commitments
5. Lists prerequisites clearly"""
        )

    profile = UserProfile(**context.context)

    # Map experience levels to instructional approaches
    experience_level = {
        "Beginner": "Start with absolute basics and fundamentals. Include many examples and hands-on practice.",
        "Intermediate": "Focus on intermediate concepts. Review basics briefly if needed.",
        "Advanced": "Emphasize advanced patterns and best practices. Include complex real-world scenarios.",
    }.get(profile.codingExperience, "Adapt difficulty progressively")

    # Map learning speeds to content pacing
    learning_pace = {
        "Slow": "Break concepts into smaller, digestible chunks. Include more practice exercises.",
        "Moderate": "Maintain a balanced pace with regular checkpoints.",
        "Fast": "Cover concepts efficiently. Include optional advanced materials.",
    }.get(profile.learningSpeed, "Provide flexible learning options")

    # Map learning modes to content delivery
    learning_style = {
        "Visual": "Include diagrams, flowcharts, and visual representations.",
        "Interactive": "Focus on interactive exercises and hands-on projects.",
        "Theory": "Include detailed explanations and theoretical foundations.",
    }.get(profile.learningMode, "Mix different learning approaches")

    time_commitment = f"Structure sections to fit within {profile.timePerWeek} of study time per week."

    goals_instruction = "Focus on achieving these specific goals: " + ", ".join(
        profile.goals
    )

    tech_context = f"""Consider the student's background:
- Education Level: {profile.educationLevel}
- Technical Background: {profile.techBackground}
- Prior Programming Experience: {profile.codingExperience}"""

    return f"""{base_instructions}

{tech_context}

Personalization Instructions:
1. Experience Level Adaptation:
   {experience_level}

2. Learning Pace:
   {learning_pace}

3. Learning Style:
   {learning_style}

4. Time Management:
   {time_commitment}

5. Goal Orientation:
   {goals_instruction}

Course Design Requirements:
1. Make content progression logical and connected
2. Include practical examples that relate to the student's background in {profile.techBackground}
3. Provide clear prerequisites for each section
4. Add extra resources for areas that might need reinforcement
5. Structure sections to build towards the student's specific goals
6. Include assessments that match their {profile.learningMode} learning style
7. Maintain engagement through their preferred learning mode
8. Design for their {profile.learningSpeed} learning pace

Your outline must:
- Be technically accurate and current
- Fit within {profile.timePerWeek} weekly time commitment
- Follow modern industry practices
- Focus on practical skill development
- Allow for flexible pace adjustments
- Match their {profile.codingExperience} experience level

Generate a structured course outline following the provided schema with clear sections, 
learning objectives, and time estimates that align with the student's weekly availability of {profile.timePerWeek}."""


curriculum_outline_agent = Agent(
    name="curriculum_outline_agent",
    instructions=dynamic_instructions,
    output_type=CurriculumOutline,
    model=gemini_model,
    input_guardrails=[validate_course_request],
    )
