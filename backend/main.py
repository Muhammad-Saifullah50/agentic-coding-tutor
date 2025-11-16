import asyncio
import uuid
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from temporalio.client import Client
from temporalio.common import WorkflowIDReusePolicy

from workflows.course_workflow import CourseAgent

app = FastAPI()
temporal_client = None

origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    global temporal_client
    # ⚠️ REMOVED OpenAIAgentsPlugin - it should only be in the worker!
    temporal_client = await Client.connect(
        "localhost:7233",
    )
    print("✅ FastAPI connected to Temporal server")

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

        if not language or not focus:
            raise HTTPException(status_code=400, detail="Missing 'language' or 'focus'")

        workflow_id = f"course-gen-{uuid.uuid4()}"
        print(f"🚀 Starting workflow: {workflow_id}")

        await temporal_client.start_workflow(
            CourseAgent.create_course,
            args=(language, focus, user_profile),
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
        
        print(f"📝 Getting handle for workflow: {workflow_id}")
        handle = temporal_client.get_workflow_handle(workflow_id)

        print(f"✅ Sending approval update: {approved}")
        update_result = await handle.execute_update(
            "approve_outline",
            args=(approved,)
        )
        print(f"✅ Update acknowledged: {update_result}")

        print("⏳ Waiting for final course generation...")
        final_course = await handle.result()

        
        print("🎉 Final course generated successfully!")
        return {"course": final_course}
    
    except Exception as e:
        print(f"❌ Error executing update/getting result: {e}")
        raise HTTPException(status_code=500, detail=str(e))