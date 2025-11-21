import asyncio
import json
from typing import Dict, Any
from temporalio import activity
from agents import Runner, InputGuardrailTripwireTriggered, OutputGuardrailTripwireTriggered
from ai_agents.curriculum_outline_agent import curriculum_outline_agent
from ai_agents.course_generation_agent import course_generation_agent
import mlflow


async def periodic_heartbeat(interval: int = 10):
    """Send periodic heartbeats while long-running task executes."""
    try:
        while True:
            await asyncio.sleep(interval)
            activity.heartbeat("Still working...")
    except asyncio.CancelledError:
        pass


def pydantic_to_json(obj: Any) -> str:
    """
    Convert a Pydantic model or any object to JSON string.
    """
    # Check for Pydantic v2 model_dump method
    if hasattr(obj, 'model_dump'):
        activity.logger.info("✅ Using Pydantic v2 model_dump()")
        return json.dumps(obj.model_dump(), indent=2, default=str)
    
    # Check for Pydantic v1 dict method
    if hasattr(obj, 'dict'):
        activity.logger.info("✅ Using Pydantic v1 dict()")
        return json.dumps(obj.dict(), indent=2, default=str)
    
    # Already a dict or list
    if isinstance(obj, (dict, list)):
        activity.logger.info("✅ Already dict/list")
        return json.dumps(obj, indent=2, default=str)
    
    # Already a string
    if isinstance(obj, str):
        # Check if it's valid JSON
        try:
            json.loads(obj)
            activity.logger.info("✅ Already valid JSON string")
            return obj
        except json.JSONDecodeError:
            activity.logger.warning("⚠️ String is not valid JSON, wrapping it")
            return json.dumps({"content": obj}, indent=2)
    
    # Fallback: try __dict__
    if hasattr(obj, '__dict__'):
        activity.logger.info("✅ Using __dict__")
        return json.dumps(obj.__dict__, indent=2, default=str)
    
    # Last resort
    activity.logger.warning(f"⚠️ Could not serialize {type(obj)}, wrapping as string")
    return json.dumps({"content": str(obj)}, indent=2)

@mlflow.trace
@activity.defn
async def generate_outline_activity(language: str, focus: str, user_profile: Dict[str, Any], additionalNotes:str) -> str:
    """Generate curriculum outline using AI agent."""
    activity.logger.info(f"🚀 Generating outline for {language} - {focus}")
    
    heartbeat_task = asyncio.create_task(periodic_heartbeat(10))
    
    try:
        # Run the agent
        outline_result = await Runner.run(
            curriculum_outline_agent,
            input=f"Generate a curriculum outline on {language} for {focus}. Keep in mind these additional notes: {additionalNotes}",
            context=user_profile,
        )
        
        activity.logger.info("✅ Agent execution completed")
        activity.logger.info(f"Result type: {type(outline_result)}")
        
        # The final_output should be a CurriculumOutline Pydantic model
        output = outline_result.final_output
        activity.logger.info(f"final_output type: {type(output)}")
        activity.logger.info(f"final_output class name: {output.__class__.__name__}")
        
        # Convert Pydantic model to JSON
        json_output = pydantic_to_json(output)
        
        # Verify it's valid JSON
        parsed = json.loads(json_output)
        activity.logger.info(f"✅ Valid JSON produced with {len(parsed)} keys")
        activity.logger.info(f"JSON keys: {list(parsed.keys()) if isinstance(parsed, dict) else 'N/A'}")
        activity.logger.info(f"First 300 chars: {json_output[:300]}")
        
        return json_output
        
    except InputGuardrailTripwireTriggered as e:
        activity.logger.error(f"⛔ Input guardrail tripped: {e}")
        # Return a structured error or raise a specific application error
        # For now, let's return a JSON with error info so the workflow can handle it
        return json.dumps({
            "error": "Input guardrail triggered",
            "message": "Your request contains disallowed content or is not relevant to programming.",
            "details": str(e)
        })
    except Exception as e:
        activity.logger.error(f"❌ Error in generate_outline_activity: {e}")
        import traceback
        activity.logger.error(traceback.format_exc())
        raise
    finally:
        heartbeat_task.cancel()
        try:
            await heartbeat_task
        except asyncio.CancelledError:
            pass

@mlflow.trace
@activity.defn
async def generate_course_activity(outline_json: str, user_profile: Dict[str, Any], additionalNotes:str) -> str:
    """Generate full course content using AI agent."""
    activity.logger.info("🚀 Generating full course from outline")
    activity.logger.info(f"Outline length: {len(outline_json)}")
    activity.logger.info(f"User profile keys: {list(user_profile.keys())}")
    
    heartbeat_task = asyncio.create_task(periodic_heartbeat(10))
    
    try:
        # Parse the outline JSON to pass as structured data
        outline_dict = json.loads(outline_json)
        activity.logger.info(f"Parsed outline with keys: {list(outline_dict.keys())}")
        
        # Create a combined context with BOTH outline and user profile
        context_data = {
            "outline": outline_dict,
            "user_profile": user_profile,
            "additionalNotes": additionalNotes
        }
        
        # Run the agent with the combined context
        final_course_result = await Runner.run(
            course_generation_agent,
            input=f"Generate a detailed course using the outline provided in the context.",
            context=context_data,  # Pass combined context
        )
        
        activity.logger.info("✅ Agent execution completed")
        
        # The final_output should be a Pydantic model
        output = final_course_result.final_output
        activity.logger.info(f"final_output type: {type(output)}")
        activity.logger.info(f"final_output class name: {output.__class__.__name__}")
        
        # Lock all lessons by default
        if hasattr(output, 'modules'):
            for module in output.modules:
                if hasattr(module, 'lessons'):
                    for lesson in module.lessons:
                        if hasattr(lesson, 'locked'):
                            lesson.locked = True
        
        # Unlock the first lesson
        if hasattr(output, 'modules') and output.modules and hasattr(output.modules[0], 'lessons') and output.modules[0].lessons:
            if hasattr(output.modules[0].lessons[0], 'locked'):
                output.modules[0].lessons[0].locked = False
        
        # Convert Pydantic model to JSON
        json_output = pydantic_to_json(output)
        
        # Verify it's valid JSON
        parsed = json.loads(json_output)
        activity.logger.info(f"✅ Valid JSON produced")
        
        return json_output
        
    except OutputGuardrailTripwireTriggered as e:
        activity.logger.error(f"⛔ Output guardrail tripped: {e}")
        return json.dumps({
            "error": "Output guardrail triggered",
            "message": "The generated content did not meet safety or quality standards.",
            "details": str(e)
        })
    except Exception as e:
        activity.logger.error(f"❌ Error in generate_course_activity: {e}")
        import traceback
        activity.logger.error(traceback.format_exc())
        raise
    finally:
        heartbeat_task.cancel()
        try:
            await heartbeat_task
        except asyncio.CancelledError:
            pass