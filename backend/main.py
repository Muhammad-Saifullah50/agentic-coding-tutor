import os
import json
import uuid
import asyncio
from contextlib import asynccontextmanager
from utils.stripe_utils import create_checkout_session, handle_webhook

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from utils.repair_json import repair_json

from temporalio.client import Client
from temporalio.worker import Worker
from temporalio.common import WorkflowIDReusePolicy
from temporalio.contrib.openai_agents import OpenAIAgentsPlugin

from openai import AsyncOpenAI

# Initialize clients
temporal_client = None
worker_task = None

# Workflows / Activities
from workflows.course_workflow import CourseAgent
from activities.course_activities import generate_outline_activity, generate_course_activity

# Business logic
from actions.save_course import save_course
from config.payment_constants import COURSE_GENERATION_COST
from schemas.full_course import FullCourse
from schemas.code_review_schemas import CodeReviewRequest, CodeReviewResponse

from agents import Runner, InputGuardrailTripwireTriggered
from ai_agents.code_review_agent import code_review_agent, generate_instructions

from schemas.mentor_schemas import MentorChatRequest, MentorChatResponse
from ai_agents.mentor_agent import mentor_agent
from utils.mentor_utils import get_mentor_session, build_context_message

# External services
from utils.supabase_client import supabase
import stripe
from utils.stripe_utils import create_checkout_session, handle_webhook

@asynccontextmanager
async def lifespan(app: FastAPI):
    global temporal_client, worker_task
    print("🚀 Starting up FastAPI application...")

    # 1. Setup Gemini
    base_url = os.getenv('GEMINI_BASE_URL')
    api_key = os.getenv('GEMINI_API_KEY')
    if not base_url or not api_key:
        raise ValueError("GEMINI env vars missing")
    gemini_client = AsyncOpenAI(api_key=api_key, base_url=base_url)

    # 2. Check Environment
    temporal_addr = os.getenv("TEMPORAL_ADDRESS")
    
    # --- SIMPLIFIED CONNECTION LOGIC ---
    if temporal_addr:
        print(f"☁️ Cloud Mode: Connecting to {temporal_addr}")
        temporal_ns = os.getenv("TEMPORAL_NAMESPACE")
        temporal_api_key = os.getenv("TEMPORAL_API_KEY") # <--- NEW

        if not all([temporal_ns, temporal_api_key]):
             raise ValueError("Missing TEMPORAL_NAMESPACE or TEMPORAL_API_KEY")

        # Connect using API Key (No cert files needed!)
        temporal_client = await Client.connect(
            temporal_addr,
            namespace=temporal_ns,
            api_key=temporal_api_key, # <--- The magic part
            tls=True,                 # <--- Required for Cloud
            plugins=[OpenAIAgentsPlugin(model_provider=gemini_client)],
        )

    else:
        print("💻 Local Mode: Connecting to Localhost")
        temporal_client = await Client.connect(
            "localhost:7233",
            namespace="default", 
            plugins=[OpenAIAgentsPlugin(model_provider=gemini_client)],
        )

    print(f"✅ Connected to Temporal successfully")

    # 3. Start Worker
    worker = Worker(
        temporal_client,
        task_queue="my-task-queue",
        workflows=[CourseAgent],
        activities=[generate_outline_activity, generate_course_activity],
    )
    worker_task = asyncio.create_task(worker.run())
    print("✅ Worker started")

    yield

    if worker_task:
        worker_task.cancel()
        try:
            await worker_task
        except asyncio.CancelledError:
            pass
app = FastAPI(lifespan=lifespan)

origins = ['http://localhost:3000', 'https://codequora.vercel.app']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def health_check():
    return {"status": "ok"}


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

        # Credit Check & Deduction
        user_id = user_profile.get("userId")
        if not user_id:
             # Try getting from preferences if not in userProfile, or fail
             user_id = preferences.get("userId")

        if user_id:
            print(f"💰 Checking credits for user: {user_id}")
            response = supabase.table("UserProfile").select("credits").eq("userId", user_id).execute()
            if response.data:
                credits = response.data[0].get("credits", 0)  # Handle None as 0
                if credits is None: credits = 0 # Double safety
                
                print(f"💳 Current credits: {credits}")
                
                if credits < COURSE_GENERATION_COST:
                    print(f"🚫 Insufficient credits: {credits} < {COURSE_GENERATION_COST}")
                    raise HTTPException(
                        status_code=402, 
                        detail=f"Insufficient credits. Required: {COURSE_GENERATION_COST}, Available: {credits}. Please upgrade your plan."
                    )
                
                # Deduct credits
                new_balance = credits - COURSE_GENERATION_COST
                print(f"📉 Deducting credits: {credits} -> {new_balance}")
                try:
                    supabase.table("UserProfile").update({"credits": new_balance}).eq("userId", user_id).execute()
                    print("✅ Credits deducted successfully")
                except Exception as e:
                    print(f"❌ Failed to deduct credits: {e}")
                    raise HTTPException(status_code=500, detail="Transaction failed. Please try again.")
            else:
                print(f"⚠️ User profile not found for credit check: {user_id}")
                # Decide if we allow or block. Let's block to be safe.
                raise HTTPException(status_code=404, detail="User profile not found.")
        else:
             print("⚠️ No userId provided for credit check. Skipping (dev mode?)")

        workflow_id = f"course-gen-{uuid.uuid4()}"
        print(f"🚀 Starting workflow: {workflow_id}")

        # agentops.start_trace(tags=[f"Course Generation {workflow_id}"])

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
        # ---- 🔥 REPAIR RAW JSON BEFORE PARSING 🔥 ----
        if isinstance(final_course_json, str):
            fixed_json = repair_json(final_course_json)

            try:
                final_course_dict = json.loads(fixed_json)
            except Exception as e:
                print("❌ JSON STILL BROKEN after repair. Dumping output:")
                print(fixed_json)
                raise e
        else:
            # If Temporal returned already-parsed dict
            final_course_dict = final_course_json

        # ---- Validate with Pydantic ----
        final_course = FullCourse(**final_course_dict)

        
        # Save to Supabase
        print(f"💾 Saving course to database for user: {user_id}")
        saved_course = await save_course(final_course, user_id)
        print(f"✅ Course saved with ID: {saved_course['course_id']}")
        
        # Update Gamification (XP & Streak)
        from utils.gamification import update_user_gamification
        await update_user_gamification(user_id, xp_reward=50) # 50 XP for completing a course
        
        return {
            "course_id": saved_course['course_id'],
            "message": "Course generated and saved successfully!"
        }
    
    except Exception as e:
        print(f"❌ Error executing update/getting result: {e}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))



# --- API Endpoint 4: Code Review ---
@app.post("/code-review")
async def review_code(request: CodeReviewRequest):
    """
    Executes the Code Review pipeline with input validation guardrail and code review agent.
    """
    try:
        # Start AgentOps tracing
        # agentops.start_trace(tags=[f"Code Review {request.session_id}"])
        
        # Validate inputs
        if not request.code or not request.code.strip():
            return CodeReviewResponse(
                status="failure",
                error_message="Code input is empty. Please provide code to review."
            )
        
        if not request.language or not request.language.strip():
            return CodeReviewResponse(
                status="failure",
                error_message="Language is required. Please specify the programming language."
            )
        
        # Prepare input for agent (include language context)
        code_with_context = f"Language: {request.language}\n\nCode:\n{request.code}"
        
        # Generate dynamic instructions
        instructions = generate_instructions(request.language, request.challenge)
        
        # Update agent instructions dynamically
        code_review_agent.instructions = instructions
        
        print(f"🔍 Starting code review for session: {request.session_id}")
        print(f"📝 Language: {request.language}")
        print(f"📏 Code length: {len(request.code)} characters, {request.code.count(chr(10)) + 1} lines")
        
        # Run the agent (guardrail will be executed automatically)
        try:
            result = await Runner.run(code_review_agent, code_with_context)
            analysis = result.final_output
            
            print(f"✅ Code review completed successfully")
            
            # Return success response
            return CodeReviewResponse(
                status="success",
                corrected_code=analysis.corrected_code,
                feedback_explanation=analysis.feedback_explanation
            )
            
        except InputGuardrailTripwireTriggered as e:
            # Guardrail was triggered
            print(f"🚫 Guardrail triggered: {e}")
            print(f"DEBUG: Exception dir: {dir(e)}")
            
            # Extract the reason from guardrail output
            error_msg = "Invalid code input."
            if hasattr(e, 'guardrail_result') and hasattr(e.guardrail_result, 'output_info'):
                output_info = e.guardrail_result.output_info
                print(f"DEBUG: output_info type: {type(output_info)}")
                print(f"DEBUG: output_info content: {output_info}")
                if hasattr(output_info, 'reason') and output_info.reason:
                    error_msg = output_info.reason
            
            return CodeReviewResponse(
                status="failure",
                error_message=error_msg
            )
    
    except Exception as e:
        print(f"❌ Error in code review: {e}")
        import traceback
        print(traceback.format_exc())
        
        return CodeReviewResponse(
            status="failure",
            error_message="The AI Reviewer encountered an internal error. Please try again."
        )


from fastapi.responses import StreamingResponse
from openai.types.responses import ResponseTextDeltaEvent

# --- API Endpoint 5: Mentor Chat (Streaming) ---
@app.post("/mentor/chat")
async def mentor_chat(request: MentorChatRequest):
    """
    AI Mentor chat endpoint with streaming support.
    Maintains conversation history and provides personalized academic assistance.
    """
    # Validate inputs
    if not request.user_id or not request.user_id.strip():
        raise HTTPException(status_code=400, detail="User ID is required.")
    
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    
    print(f"💬 Mentor chat request from user: {request.user_id}")
    
    # Retrieve user profile and courses (simplified for brevity, assume helper functions work)
    try:
        # TEST BYPASS: Allow testing with specific ID
        if request.user_id == "user_2pM3p4q5r6s7t8u9v0w1x2y3z4":
            print("🧪 Using TEST PROFILE for verification")
            from schemas.user_profile_context import UserProfile
            profile = UserProfile(
                id=12345,
                userId=request.user_id,
                username="Test Student",
                email="test@example.com",
                imageUrl="https://example.com/avatar.png",
                onBoarded=True,
                created_at="2023-01-01T00:00:00Z",
                ageRange="18-24",
                educationLevel="Undergraduate",
                techBackground="Intermediate",
                codingExperience="Intermediate",
                goals=["Learn Python", "Master Algorithms"],
                learningSpeed="Moderate",
                learningMode="Visual",
                timePerWeek="10-20 hours",
                preferredLanguage="Python"
            )
            courses = []
        else:
            profile_response = supabase.table("UserProfile").select("*").eq("userId", request.user_id).execute()
            if not profile_response.data:
                print(f"❌ User profile not found for: {request.user_id}")
                raise HTTPException(status_code=404, detail="User profile not found.")
            profile_data = profile_response.data[0]
            
            from schemas.user_profile_context import UserProfile
            profile = UserProfile(**profile_data)
            
            courses_response = supabase.table("Course").select("id, title, course_data").eq("user_id", request.user_id).execute()
            courses = courses_response.data if courses_response.data else []
        
        context = build_context_message(profile, courses)
        session = get_mentor_session(request.user_id)
        
        items = await session.get_items()
        
        # Inject context as a system message if this is the first interaction
        if len(items) == 0:
            print("✨ Injecting system context...")
            await session.add_items([{"role": "system", "content": context}])
        
        user_input = request.message
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error preparing context: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to prepare chat context: {str(e)}")

    async def event_generator():
        try:
            print("🤖 Starting streaming response...")
            result = Runner.run_streamed(mentor_agent, user_input, session=session)
            
            async for event in result.stream_events():
                if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
                    if event.data.delta:
                        yield f"data: {json.dumps({'content': event.data.delta})}\n\n"
                elif event.type == "run_item_stream_event":
                    # Handle guardrail tripwires if exposed via events, or other item updates
                    pass
            
            yield "data: [DONE]\n\n"
            
        except InputGuardrailTripwireTriggered as e:
            print(f"🚫 Mentor guardrail triggered: {e}")
            error_msg = "I can't help with that request. Please ask about learning or studying."
            if hasattr(e, 'guardrail_result') and hasattr(e.guardrail_result, 'output_info'):
                output_info = e.guardrail_result.output_info
                if hasattr(output_info, 'reason'):
                    error_msg = output_info.reason
            yield f"data: {json.dumps({'error': error_msg})}\n\n"
            
        except Exception as e:
            print(f"❌ Streaming error: {e}")
            import traceback
            traceback.print_exc()
            yield f"data: {json.dumps({'error': f'An error occurred: {str(e)}'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/mentor/history/{user_id}")
async def get_mentor_history(user_id: str):
    """
    Retrieve the chat history for a user.
    """
    try:
        session = get_mentor_session(user_id)
        items = await session.get_items()
        
        history = []
        for item in items:
            # Handle different item structures if necessary
            # The agents library typically stores items as dicts
            role = None
            content = None

            # 0. Handle Stringified JSON (Fix for double-encoded messages)
            if isinstance(item, str):
                try:
                    parsed = json.loads(item)
                    if isinstance(parsed, (dict, list)):
                        item = parsed
                except json.JSONDecodeError:
                    pass

            # 1. Standard dict format: {"role": "...", "content": "..."}
            if isinstance(item, dict):
                if "role" in item and "content" in item:
                    role = item.get("role")
                    raw_content = item.get("content")
                    
                    # Check if content is a list of objects (common in LangChain/Agent output)
                    if isinstance(raw_content, list) and len(raw_content) > 0 and isinstance(raw_content[0], dict):
                        first = raw_content[0]
                        if "text" in first:
                            content = first.get("text")
                        else:
                            content = str(raw_content)
                    else:
                        content = raw_content

                # 2. Complex dict format: {"text": "...", "type": "output_text"}
                elif "text" in item and "type" in item:
                    msg_type = item.get("type")
                    if msg_type == "output_text":
                        role = "assistant"
                    elif msg_type == "input_text":
                        role = "user"
                    content = item.get("text")

            # 3. List format (common in some agent frameworks): [{"text": "...", ...}]
            elif isinstance(item, list) and len(item) > 0 and isinstance(item[0], dict):
                 first = item[0]
                 if "text" in first and "type" in first:
                    msg_type = first.get("type")
                    if msg_type == "output_text":
                        role = "assistant"
                    elif msg_type == "input_text":
                        role = "user"
                    content = first.get("text")

            # Normalize roles
            if role == "model":
                role = "assistant"
            
            # Filter system messages
            if role == "system":
                continue
            
            if role and content:
                history.append({"role": role, "content": content})
        
        return {"history": history}
    except Exception as e:
        print(f"❌ Error fetching history: {e}")
        raise HTTPException(status_code=500, detail=str(e))





# --- API Endpoint: Stripe Checkout Session ---
@app.post("/stripe/create-checkout")
async def stripe_create_checkout(request: Request):
    body = await request.json()
    user_id = body.get("user_id")
    email = body.get("email")
    plan = body.get("plan")
    success_url = body.get("success_url")
    cancel_url = body.get("cancel_url")
    if not user_id or not email or not plan:
        raise HTTPException(status_code=400, detail="Missing required fields")
    try:
        result = create_checkout_session(user_id, email, plan, success_url, cancel_url)
        return {"sessionId": result["session_id"], "url": result["url"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- API Endpoint: Stripe Webhook ---
@app.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    if not webhook_secret:
        raise HTTPException(status_code=500, detail="Stripe webhook secret not configured")
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    handle_webhook(event)
    return {"status": "success"}
