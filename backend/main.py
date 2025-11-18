import asyncio
import uuid
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from temporalio.client import Client
from temporalio.worker import Worker
from temporalio.common import WorkflowIDReusePolicy
from temporalio.contrib.openai_agents import OpenAIAgentsPlugin
from openai import AsyncOpenAI

from workflows.course_workflow import CourseAgent
from activities.course_activities import generate_outline_activity, generate_course_activity
import json
from actions.save_course import save_course
from schemas.full_course import FullCourse
import agentops
load_dotenv()


AGENTOPS_API_KEY = os.getenv("AGENTOPS_API_KEY")

agentops.init()

# Global variables
temporal_client = None
worker_task = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events for FastAPI."""
    global temporal_client, worker_task
    
    # Startup: Connect to Temporal and start worker
    print("🚀 Starting up FastAPI application...")
    

    # Create Gemini client for the worker
    base_url = os.getenv('GEMINI_BASE_URL')
    api_key = os.getenv('GEMINI_API_KEY')
    
    if not base_url or not api_key:
        raise ValueError("GEMINI_BASE_URL or GEMINI_API_KEY not set in .env")
    
    gemini_client = AsyncOpenAI(
        api_key=api_key,
        base_url=base_url,
    )
    print("✅ Gemini client configured")
    
    # Connect to Temporal
    temporal_client = await Client.connect(
        "localhost:7233",
        plugins=[
            OpenAIAgentsPlugin(
                model_provider=gemini_client,
                
            )
        ],
    )
    print("✅ Connected to Temporal server")
    

    # Create and start worker in background
    worker = Worker(
        temporal_client,
        task_queue="my-task-queue",
        workflows=[CourseAgent],
        activities=[generate_outline_activity, generate_course_activity],
    )
    
    print("🔧 Starting Temporal worker...")
    print("📋 Task queue: 'my-task-queue'")
    print("🤖 Using Gemini model")
    print("📦 Workflows:", [CourseAgent.__name__])
    print("⚡ Activities:", [generate_outline_activity.__name__, generate_course_activity.__name__])
    
    # Start worker in background task
    worker_task = asyncio.create_task(worker.run())
    print("✅ Temporal worker started in background")
    
    yield  # FastAPI runs here
    
    # Shutdown: Stop worker and close connections
    print("\n🛑 Shutting down...")
    if worker_task:
        worker_task.cancel()
        try:
            await worker_task
        except asyncio.CancelledError:
            print("✅ Worker stopped")
    
    print("👋 Shutdown complete")


app = FastAPI(lifespan=lifespan)

origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- API Endpoint 1: Start Workflow ---
@app.post("/create-curriculum")
async def create_curriculum(request: Request):
    """
    Starts the course generation workflow and returns the workflow_id immediately.
    """
    if not temporal_client:
        raise HTTPException(status_code=503, detail="Temporal client not connected")

    try:
        body = await request.json()
        preferences = body.get("preferences", {})
        user_profile = body.get("userProfile", {})
        language = preferences.get("language")
        focus = preferences.get("focus")
        additionalNotes = preferences.get('additionalNotes')

        if not language or not focus:
            raise HTTPException(status_code=400, detail="Missing 'language' or 'focus'")

        workflow_id = f"course-gen-{uuid.uuid4()}"
        print(f"🚀 Starting workflow: {workflow_id}")

        agentops.start_trace(tags=[f"Course Generation {workflow_id}"])

        await temporal_client.start_workflow(
            CourseAgent.create_course,
            args=(language, focus, user_profile, additionalNotes),
            id=workflow_id,
            task_queue="my-task-queue",
            id_reuse_policy=WorkflowIDReusePolicy.TERMINATE_IF_RUNNING,
        )

        print(f"✅ Workflow {workflow_id} started successfully")
        return {"workflow_id": workflow_id}

    except Exception as e:
        print(f"❌ Error starting workflow: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# --- API Endpoint 2: Poll for Status ---
@app.get("/workflow-status/{workflow_id}")
async def get_workflow_status(workflow_id: str):
    """
    Queries the workflow for its current status.
    """
    if not temporal_client:
        raise HTTPException(status_code=503, detail="Temporal client not connected")

    try:
        handle = temporal_client.get_workflow_handle(workflow_id)
        
        try:
            status = await asyncio.wait_for(
                handle.query("get_status"),
                timeout=2.0
            )
            print(f"📊 Status for {workflow_id}: {status['status']}")
            return status
        except asyncio.TimeoutError:
            print(f"⏰ Query timeout for {workflow_id}, workflow is busy")
            return {"status": "GENERATING_OUTLINE", "outline": None}

    except Exception as e:
        print(f"❌ Error querying workflow {workflow_id}: {e}")
        return {"status": "STARTING", "outline": None}


# --- API Endpoint 3: Approve & Get Final Course ---

@app.post("/generate-course/{workflow_id}")
async def generate_course(workflow_id: str, request: Request):
    """
    Sends approval update to the workflow and returns the final generated course.
    """
    if not temporal_client:
        raise HTTPException(status_code=503, detail="Temporal client not connected")
    
    try:
        body = await request.json()
        approved = body.get("approved", True)
        user_id = body.get("userId")  # Get user_id from request
        
        if not user_id:
            raise HTTPException(status_code=400, detail="user_id is required")
        
        print(f"📝 Getting handle for workflow: {workflow_id}")
        handle = temporal_client.get_workflow_handle(workflow_id)

        print(f"✅ Sending approval update: {approved}")
        update_result = await handle.execute_update(
            "approve_outline",
            args=(approved,)
        )
        print(f"✅ Update acknowledged: {update_result}")

        print("⏳ Waiting for final course generation...")
        final_course_json = await handle.result()

        print("🎉 Final course generated successfully!")
        
        # Parse the JSON string to FullCourse object
        final_course_dict = json.loads(final_course_json) if isinstance(final_course_json, str) else final_course_json
        final_course = FullCourse(**final_course_dict)
        
        # Save to Supabase
        print(f"💾 Saving course to database for user: {user_id}")
        saved_course = await save_course(final_course, user_id)
        print(f"✅ Course saved with ID: {saved_course['course_id']}")
        
        return {
            "course_id": saved_course['course_id'],
            "message": "Course generated and saved successfully!"
        }
    
    except Exception as e:
        print(f"❌ Error executing update/getting result: {e}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


