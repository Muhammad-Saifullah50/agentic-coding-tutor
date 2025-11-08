from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from agents import enable_verbose_stdout_logging
from agents import Runner
import os
from dotenv import load_dotenv
from utils.supabase_client import supabase
from ai_agents.curriculum_outline_agent import curriculum_outline_agent

import mlflow


mlflow.openai.autolog()
mlflow.set_tracking_uri("http://localhost:5000")

load_dotenv()


backend_url = os.getenv("BACKEND_URL")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # Adjust the origins as needed for your frontend application
    allow_origins=[
        "http://localhost:3000",
        backend_url
    ],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "welcome to api"}



@app.post("/create-curriculum-outline")
async def create_course(request: Request):
    try:
        body = await request.json()
        preferences = body.get("preferences")
        user_profile = body.get("userProfile")

        language = preferences.get("language")
        focus = preferences.get("focus", )

        enable_verbose_stdout_logging()       
        
        result = await Runner.run(
            curriculum_outline_agent,
            input=f"Generate a curriculum outline on {language} for {focus}.",
            context=user_profile
            )

        return result.final_output

    except Exception as e:
        import traceback

        print("Server error:", e)
        print(traceback.format_exc())
        return {"error": str(e)}
