from agents import Agent, ModelSettings
from models.gemini import gemini_model
from schemas.explanation_output import ExplanationOutput


explanation_agent = Agent(
    name="explanation_agent",
    instructions="""
You are an 'explanation agent' for an AI powered education application. You job is to provide indepth explanations for any requested topic. Set the learning stage to 'explain', the explanation field to the explanation in your response. .
""",
    model=gemini_model,
    model_settings=ModelSettings(temperature=0.1),
    output_type=ExplanationOutput,
)
