from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from agents import enable_verbose_stdout_logging

from agents import Runner
from ai_agents.triage_agent import triage_agent
import agentops
import os

from dotenv import load_dotenv

load_dotenv()


agentops_api_key = os.getenv("AGENTOPS_API_KEY")
backend_url = os.getenv("BACKEND_URL")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # Adjust the origins as needed for your frontend application
    allow_origins=[
        "http://localhost:3000",
        backend_url
    ],  # add the vercel url
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "welcome fast api"}


@app.post("/send-message")
async def send_message(request: Request):
    try:
        body = await request.json()
        prompt = body.get("prompt")
        mode = body.get("mode")
        
        
        enable_verbose_stdout_logging()

        agentops.init(agentops_api_key)
        result = await Runner.run(
            triage_agent,
            input=prompt,
            context=f'The user is seeking help in the domain of "{mode} mode". Provide assistance accordingly.',
            )

        return result.final_output

    except Exception as e:
        import traceback

        print("❌ Server error:", e)
        print(traceback.format_exc())
        return {"error": str(e)}
