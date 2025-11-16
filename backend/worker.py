import asyncio
import os
from dotenv import load_dotenv
from temporalio.client import Client
from temporalio.worker import Worker
from temporalio.contrib.openai_agents import OpenAIAgentsPlugin
from openai import AsyncOpenAI

from workflows.course_workflow import CourseAgent
from activities.course_activities import generate_outline_activity, generate_course_activity

load_dotenv()

async def main():
    print("🔌 Connecting to Temporal server...")
    
    # Create Gemini client
    base_url = os.getenv('GEMINI_BASE_URL')
    api_key = os.getenv('GEMINI_API_KEY')
    
    if not base_url or not api_key:
        raise ValueError("GEMINI_BASE_URL or GEMINI_API_KEY not set in .env")
    
    gemini_client = AsyncOpenAI(
        api_key=api_key,
        base_url=base_url,
    )
    
    print("✅ Gemini client configured")
    
    # Connect to Temporal with Gemini
    client = await Client.connect(
        "localhost:7233",
        plugins=[
            OpenAIAgentsPlugin(
                model_provider=gemini_client
            )
        ],
    )
    
    print("✅ Connected to Temporal server")

    # Create worker with both workflows AND activities
    worker = Worker(
        client,
        task_queue="my-task-queue",
        workflows=[CourseAgent],
        activities=[generate_outline_activity, generate_course_activity],  # Register activities!
    )

    print("🚀 Worker started successfully!")
    print("📋 Task queue: 'my-task-queue'")
    print("🤖 Using Gemini model")
    print("📦 Workflows:", [CourseAgent.__name__])
    print("⚡ Activities:", [generate_outline_activity.__name__, generate_course_activity.__name__])
    print("\n⏳ Waiting for workflow executions...")
    print("\nPress Ctrl+C to stop\n")
    print("-" * 60)
    
    await worker.run()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n👋 Worker stopped by user")
    except Exception as e:
        print(f"\n❌ Worker error: {e}")
        raise