from agents import Agent, ModelSettings
from models.gemini import gemini_model
from ai_agents.flashcards_agent import flashcards_agent
from ai_agents.questions_agent import questions_agent
from ai_agents.explanation_agent import explanation_agent

triage_agent = Agent(
    name="triage_agent",
    instructions="""
    You are a triage agent for an AI powered education application.
    Your job is to route to the correct agent to fulfill the users request.

    You have three agents. If the learning stage is 'explain', handoff to the explanation agent.

    If the learning stage is 'quiz', handoff to the questions agent.
    If the learning stage is 'review', handoff to the flashcards agent.

""",
    model=gemini_model,
    handoffs=[explanation_agent, questions_agent, flashcards_agent],
    
    # forcing handoff
    model_settings=ModelSettings(temperature=0.1, tool_choice="required"),
)
