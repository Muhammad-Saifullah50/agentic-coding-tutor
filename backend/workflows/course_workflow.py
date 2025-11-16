from temporalio import workflow
from temporalio.common import RetryPolicy
from datetime import timedelta
import json


@workflow.defn
class CourseAgent:
    def __init__(self):
        self.outline = None
        self.status = "STARTING"
        self.user_approval = None

    @workflow.update
    async def approve_outline(self, approved: bool) -> dict:
        """Update method called when user approves/rejects the outline."""
        workflow.logger.info(f"Approval update received: {approved}")
        self.user_approval = approved
        return {"status": "approved" if approved else "rejected"}

    @workflow.query
    def get_status(self) -> dict:
        """Query method for the frontend to get the current state and outline."""
        return {
            "status": self.status,
            "outline": self.outline
        }

    @workflow.run
    async def create_course(self, language: str, focus: str, user_profile: dict) -> str:
        """Runs the full curriculum generation with a human-in-the-loop step."""
        
        # --- Step 1: Generate Outline (as Activity) ---
        workflow.logger.info(f"Starting outline generation for {language} on {focus}")
        self.status = "GENERATING_OUTLINE"
        
        outline_str = await workflow.execute_activity(
            "generate_outline_activity",
            args=[language, focus, user_profile],
            start_to_close_timeout=timedelta(minutes=10),
            heartbeat_timeout=timedelta(seconds=30),
            retry_policy=RetryPolicy(
                maximum_attempts=3,
                initial_interval=timedelta(seconds=1),
            ),
        )
        
        # Parse JSON string to dict for the query response
        try:
            self.outline = json.loads(outline_str)
            workflow.logger.info("Parsed outline JSON successfully")
        except (json.JSONDecodeError, TypeError):
            # If it's not valid JSON, store as-is
            self.outline = outline_str
            workflow.logger.info("Stored outline as string (not JSON)")
        
        self.status = "OUTLINE_READY"
        workflow.logger.info("Outline generated. Waiting for user approval.")

        # --- Step 2: Wait for Human Approval ---
        await workflow.wait_condition(lambda: self.user_approval is not None)
        
        if not self.user_approval:
            workflow.logger.info("User rejected the outline")
            self.status = "REJECTED"
            return "Course generation cancelled by user"

        # --- Step 3: Generate Full Course (as Activity) ---
        self.status = "GENERATING_COURSE"
        workflow.logger.info("Approval received. Generating full course...")
        
        # Pass the original string, not the parsed dict
        final_course = await workflow.execute_activity(
            "generate_course_activity",
            args=[outline_str, user_profile],  # Use outline_str, not self.outline
            start_to_close_timeout=timedelta(minutes=15),
            heartbeat_timeout=timedelta(seconds=30),
            retry_policy=RetryPolicy(
                maximum_attempts=3,
                initial_interval=timedelta(seconds=1),
            ),
        )

        self.status = "COMPLETED"
        return final_course