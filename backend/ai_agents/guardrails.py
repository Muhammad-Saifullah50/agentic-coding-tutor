from pydantic import BaseModel, Field
from agents import (
    Agent,
    GuardrailFunctionOutput,
    RunContextWrapper,
    Runner,
    input_guardrail,
    output_guardrail,
)
from models.gemini import  gemini_lite_model
from schemas.curriculum_outline import CurriculumOutline
from schemas.full_course import FullCourse
from schemas.code_review_schemas import CodeInputValidation

# --- Mentor Guardrail Models ---

class MentorInputSafetyCheck(BaseModel):
    is_safe: bool = Field(description="True if the input is safe and does not contain harmful content.")
    is_appropriate: bool = Field(description="True if the request is appropriate for academic assistance (not cheating, plagiarism, etc.).")
    is_relevant: bool = Field(description="True if the input is related to learning, studying, or career development.")
    reason: str = Field(description="Brief user-friendly explanation (max 15 words) for the safety assessment.")

class MentorOutputSafetyCheck(BaseModel):
    is_safe: bool = Field(description="True if the response is safe, educational, and supportive.")
    is_appropriate: bool = Field(description="True if the response is age-appropriate and contains no harmful advice.")
    no_false_guarantees: bool = Field(description="True if the response avoids false promises about career success or exam results.")
    reasoning: str = Field(description="Explanation for the safety assessment.")

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
    
    The reasoning should be in a tone which can direclty be displayed to the user, like : 'Your input conatins illegal activities (hacking). Please correct you request. The reasoning should not exceed 15 words'
    Return a JSON object with is_safe, is_relevant, and reasoning.
    """,
    output_type=InputSafetyCheck,
    model=gemini_lite_model,
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
    model=gemini_lite_model,
)

code_input_guardrail_agent = Agent(
    name="Code Input Validation Guardrail",
    instructions="""You are a code input validation guardrail for a code review system.
    Analyze the provided text and determine if it appears to be valid programming code.
    
    1. Valid Code Check:
    - Contains programming syntax, keywords, functions, variables, or control structures.
    - Belongs to common programming languages (Python, JavaScript, Java, C++, etc.).
    - May have bugs or issues (that's expected - it's for review).
    
    2. Invalid Input (reject these):
    - Conversational text or questions (e.g., "How do I sort an array?").
    - Random gibberish or nonsense text.
    - URLs or links.
    - Political propaganda or extremist content.
    - Plain text stories or essays.
    
    3. Malicious/Inappropriate Code (reject these):
    - Code attempting malware generation, hacking, or exploitation.
    - Code with highly offensive or hateful comments.
    - Code attempting dangerous system calls without educational context.
    
    4. Length Check:
    - The code must NOT exceed 500 lines. Count the number of newline characters.
    - If code is longer than 500 lines, set is_valid_code_input to false.
    - Reason should mention "Code exceeds 500 line limit" if too long.
    
    Return a user-friendly reason (max 15 words) that can be displayed directly to the user.
    Examples:
    - "Input appears to be conversational text, not code."
    - "Code exceeds 500 line limit. Please submit shorter snippets."
    - "Input contains inappropriate or malicious content."
    
    Return JSON with is_valid_code_input (boolean) and reason (string).
    """,
    output_type=CodeInputValidation,
    model=gemini_lite_model,
)

mentor_input_guardrail_agent = Agent(
    name="Mentor Input Safety Guardrail",
    instructions="""You are a safety checker for an AI Mentor system that helps students with learning.
    Analyze the user's message to the AI Mentor.
    
    1. Safety Check:
    - Reject violence, self-harm, hate speech, harassment, discrimination.
    - Reject political propaganda or extremist content.
    - Reject sexual or NSFW content.
    
    2. Appropriateness Check:
    - Reject requests for exam answers, cheating assistance, or plagiarism.
    - Reject requests to do homework/assignments for the student.
    - Allow requests for concept explanation, study help, career guidance.
    
    3. Relevance Check:
    - Ensure the topic is related to learning, studying, career development, or education.
    - Reject completely off-topic requests (e.g., cooking recipes, sports scores).
    
    The reason should be user-friendly and can be displayed directly to the user.
    Keep it concise (max 15 words).
    
    Examples:
    - "Request involves cheating. I'm here to help you learn, not provide answers."
    - "Input contains inappropriate content. Please ask education-related questions."
    - "Topic not related to learning. Ask about studying, courses, or career guidance."
    
    Return JSON with is_safe, is_appropriate, is_relevant, and reason.
    """,
    output_type=MentorInputSafetyCheck,
    model=gemini_lite_model,
)

mentor_output_guardrail_agent = Agent(
    name="Mentor Output Safety Guardrail",
    instructions="""You are a quality assurance specialist for AI Mentor responses.
    Analyze the mentor's response to ensure it's safe and educational.
    
    1. Safety Check:
    - Ensure NO harmful advice (e.g., dangerous study methods, unhealthy habits).
    - Ensure NO NSFW content, political bias, or extremism.
    - Ensure supportive, non-judgmental tone.
    
    2. Appropriateness Check:
    - Ensure age-appropriate content.
    - Ensure educational and helpful advice.
    - Ensure NO personal attacks or harsh criticism.
    
    3. False Guarantees Check:
    - Ensure NO promises about exam success (e.g., "You'll definitely ace the test").
    - Ensure NO career guarantees (e.g., "You'll get a job at Google").
    - Allow realistic encouragement and guidance.
    
    4. Hallucination Check:
    - Ensure NO fabricated personal data about the user.
    - Ensure NO made-up course content or deadlines.
    
    Return JSON with is_safe, is_appropriate, no_false_guarantees, and reasoning.
    """,
    output_type=MentorOutputSafetyCheck,
    model=gemini_lite_model,
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

@input_guardrail
async def validate_code_input(
    ctx: RunContextWrapper, agent: Agent, input_data: str
) -> GuardrailFunctionOutput:
    """
    Guardrail to validate code input before running code review.
    Checks for valid code vs conversational text, length limits, and malicious content.
    """
    text_input = str(input_data)

    # Manual line count check
    if text_input.count('\n') > 500:
        return GuardrailFunctionOutput(
            output_info=CodeInputValidation(
                is_valid_code_input=False,
                reason="Code exceeds 500 line limit. Please submit shorter snippets."
            ),
            tripwire_triggered=True,
        )
    
    result = await Runner.run(code_input_guardrail_agent, text_input)
    validation: CodeInputValidation = result.final_output
    
    # Trip if input is not valid code
    tripwire = not validation.is_valid_code_input
    
    return GuardrailFunctionOutput(
        output_info=validation,
        tripwire_triggered=tripwire,
    )

@input_guardrail
async def validate_mentor_input(
    ctx: RunContextWrapper, agent: Agent, input_data: str
) -> GuardrailFunctionOutput:
    """
    Guardrail to validate user input before processing by the AI Mentor.
    Checks for safety, appropriateness, and relevance to learning/education.
    """
    text_input = str(input_data)
    
    result = await Runner.run(mentor_input_guardrail_agent, text_input)
    safety_check: MentorInputSafetyCheck = result.final_output
    
    # Trip if unsafe OR inappropriate OR irrelevant
    tripwire = not (
        safety_check.is_safe 
        and safety_check.is_appropriate 
        and safety_check.is_relevant
    )
    
    return GuardrailFunctionOutput(
        output_info=safety_check,
        tripwire_triggered=tripwire,
    )

@output_guardrail
async def validate_mentor_output(
    ctx: RunContextWrapper, agent: Agent, output: str
) -> GuardrailFunctionOutput:
    """
    Guardrail to validate the AI Mentor's response.
    Ensures safety, appropriateness, and no false guarantees.
    """
    # Convert output to string if needed
    output_str = str(output)
    
    result = await Runner.run(mentor_output_guardrail_agent, output_str)
    safety_check: MentorOutputSafetyCheck = result.final_output
    
    # Trip if unsafe OR inappropriate OR contains false guarantees
    tripwire = not (
        safety_check.is_safe 
        and safety_check.is_appropriate 
        and safety_check.no_false_guarantees
    )
    
    return GuardrailFunctionOutput(
        output_info=safety_check,
        tripwire_triggered=tripwire,
    )
