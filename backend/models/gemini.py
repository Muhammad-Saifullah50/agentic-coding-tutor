import os
from dotenv import load_dotenv
from agents import OpenAIChatCompletionsModel, RunConfig
from openai import AsyncOpenAI
load_dotenv()

base_url = os.getenv('GEMINI_BASE_URL')
api_key = os.getenv('GEMINI_API_KEY')
model_name = os.getenv('GEMINI_MODEL_NAME')


if not base_url or not api_key:
    raise ValueError("GEMINI_BASE_URL or GEMINI_API_KEY environment variable is not set.")

external_client = AsyncOpenAI(
    api_key=api_key,
    base_url=base_url,
    
)

""""This is the model imported from this file"""

gemini_model = OpenAIChatCompletionsModel(
    model=model_name,
    openai_client=external_client,

)

config = RunConfig(
    model=gemini_model,
    model_provider=external_client,
    tracing_disabled=True,
    
)