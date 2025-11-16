import asyncio
import json
from typing import Dict, Any, Union
from temporalio import activity
from agents import Runner
from ai_agents.curriculum_outline_agent import curriculum_outline_agent
from ai_agents.course_generation_agent import course_generation_agent


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


@activity.defn
async def generate_outline_activity(language: str, focus: str, user_profile: Dict[str, Any]) -> str:
    """Generate curriculum outline using AI agent."""
    activity.logger.info(f"🚀 Generating outline for {language} - {focus}")
    
    heartbeat_task = asyncio.create_task(periodic_heartbeat(10))
    
    try:
        # Run the agent
        outline_result = await Runner.run(
            curriculum_outline_agent,
            input=f"Generate a curriculum outline on {language} for {focus}.",
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


@activity.defn
async def generate_course_activity(outline: Union[str, Dict[str, Any]], user_profile: Dict[str, Any]) -> str:
    """Generate full course content using AI agent."""
    activity.logger.info("🚀 Generating full course from outline")
    activity.logger.info(f"Outline type: {type(outline)}")
    
    heartbeat_task = asyncio.create_task(periodic_heartbeat(10))
    
    try:
        # Ensure outline is a string
        outline_str = outline if isinstance(outline, str) else json.dumps(outline)
        activity.logger.info(f"Outline string length: {len(outline_str)}")
        
        # Run the agent
        final_course_result = await Runner.run(
            course_generation_agent,
            input=f"Generate a detailed course using this outline: {outline_str}",
            context=user_profile,
        )
        
        activity.logger.info("✅ Agent execution completed")
        
        # The final_output should be a Pydantic model
        output = final_course_result.final_output
        activity.logger.info(f"final_output type: {type(output)}")
        activity.logger.info(f"final_output class name: {output.__class__.__name__}")
        
        # Convert Pydantic model to JSON
        json_output = pydantic_to_json(output)
        
        # Verify it's valid JSON
        parsed = json.loads(json_output)
        activity.logger.info(f"✅ Valid JSON produced")
        
        return json_output
        
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