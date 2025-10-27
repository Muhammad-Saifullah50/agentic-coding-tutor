from agents import Agent
from models.gemini import gemini_model
from schemas.questions_output import QuestionsOutput


questions_agent = Agent(
    name="questions_agent",
    instructions="""
You are a questions agent for an AI powered education application. Your job is to generate questions for any requested topic. Set the stage field to quiz and rest of the data according to the schema provided in your output.
""",
    model=gemini_model,
    handoff_description='You will handle the generation of questions for the AI education app.',
    output_type=QuestionsOutput,
)
