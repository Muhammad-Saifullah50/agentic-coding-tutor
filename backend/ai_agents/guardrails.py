from pydantic import BaseModel, Field
from agents import (
    Agent,
    GuardrailFunctionOutput,
    RunContextWrapper,
    Runner,
    input_guardrail,
    output_guardrail,
)
from models.gemini import gemini_model
from schemas.curriculum_outline import CurriculumOutline
from schemas.full_course import FullCourse

# --- Input Guardrail Models ---

class InputSafetyCheck(BaseModel):
    is_safe: bool = Field(description="True if the input is safe and appropriate for a coding course generator.")
    is_relevant: bool = Field(description="True if the input is related to programming or computer science.")
    reasoning: str = Field(description="Explanation for the safety and relevance assessment.")

# --- Output Guardrail Models ---

class OutputQualityCheck(BaseModel):
    is_safe: bool = Field(description="True if the content is safe, neutral, and free of harmful bias.")
    is_valid_structure: bool = Field(description="True if the content follows the required structure (no empty modules/lessons).")
    is_quality_content: bool = Field(description="True if the content is educational, clear, and age-appropriate.")
    reasoning: str = Field(description="Explanation for the quality assessment.")

# --- Guardrail Agents ---

input_guardrail_agent = Agent(
    name="Input Safety Guardrail",
    instructions="""You are a safety and relevance checker for a coding course generator.
    Analyze the user's request.
    
    1. Safety Check:
    - Reject violence, self-harm, weapons, illegal activities.
    - Reject hate speech, harassment, discrimination.
    - Reject political propaganda or extremist content.
    - Reject malware generation, hacking, exploitation.
    
    2. Relevance Check:
    - Ensure the topic is an actual programming-related topic (e.g., Python, HTML, JavaScript, C++).
    - Reject requests not related to course generation.
    
    Return a JSON object with is_safe, is_relevant, and reasoning.
    """,
    output_type=InputSafetyCheck,
    model=gemini_model,
)

output_guardrail_agent = Agent(
    name="Output Quality Guardrail",
    instructions="""You are a quality assurance specialist for educational content.
    Analyze the generated course content.
    
    1. Safety Check:
    - Ensure NO NSFW content, political charge, extremism, violence, hate, or bias.
    - Ensure NO harmful advice.
    
    2. Structural Validation:
    - Ensure NO empty modules or blank lesson titles.
    - Ensure NO hallucinated fields.
    
    3. Quality Check:
    - Ensure content is age-appropriate and beginner-friendly.
    - Ensure tone is neutral and educational.
    - Ensure all lessons are related to the chosen topic.
    
    Return a JSON object with is_safe, is_valid_structure, is_quality_content, and reasoning.
    """,
    output_type=OutputQualityCheck,
    model=gemini_model,
)

# --- Guardrail Functions ---

@input_guardrail
async def validate_course_request(
    ctx: RunContextWrapper, agent: Agent, input_data: str
) -> GuardrailFunctionOutput:
    """
    Guardrail to validate user input before generating a course outline.
    """
    # The input might be a string or a list of messages. We need a string for the guardrail agent.
    # If it's a complex object, we might need to extract the text.
    # For this specific agent, input is expected to be a string prompt.
    
    text_input = str(input_data)
    
    result = await Runner.run(input_guardrail_agent, text_input)
    safety_check: InputSafetyCheck = result.final_output
    
    # Trip if unsafe OR irrelevant
    tripwire = not (safety_check.is_safe and safety_check.is_relevant)
    
    return GuardrailFunctionOutput(
        output_info=safety_check,
        tripwire_triggered=tripwire,
    )

@output_guardrail
async def validate_course_content(
    ctx: RunContextWrapper, agent: Agent, output: FullCourse
) -> GuardrailFunctionOutput:
    """
    Guardrail to validate the generated course content.
    """
    # We need to pass the output content to the guardrail agent.
    # Since FullCourse is a Pydantic model, we can dump it to JSON/string.
    # However, passing the ENTIRE course might be too large for the context window or unnecessary.
    # For now, let's pass a summary or the full thing if it fits. 
    # Given it's a text-based course, it might fit. Let's try passing the string representation.
    
    # To avoid huge context, maybe we check structure programmatically and content via LLM?
    # The prompt asks for an LLM check. Let's try passing the model dump.
    
    content_str = str(output.model_dump())
    
    # Truncate if absolutely necessary, but for now assume it fits or the model handles it.
    # If it's too large, we might need to check module by module, but that's complex.
    
    result = await Runner.run(output_guardrail_agent, content_str)
    quality_check: OutputQualityCheck = result.final_output
    
    # Trip if unsafe OR invalid structure OR poor quality
    tripwire = not (
        quality_check.is_safe 
        and quality_check.is_valid_structure 
        and quality_check.is_quality_content
    )
    
    return GuardrailFunctionOutput(
        output_info=quality_check,
        tripwire_triggered=tripwire,
    )
