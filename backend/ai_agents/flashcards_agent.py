from agents import Agent, ModelSettings
from models.gemini import gemini_model
from schemas.flashcards_output import FlashCardsOutput

flashcards_agent = Agent(
    name='flashcards_agent',
instructions="""
You are a 'flashcards agent' for an AI powered education application. Your job is to generate flashcards for any requested topic. Set the stage field to flashcards and rest of the data according to the schema provided.
""",
    model=gemini_model,
    handoff_description='You will handle the generation of flashcards for the AI education app.',
    model_settings=ModelSettings(temperature=0.1),
    output_type=FlashCardsOutput,
)
