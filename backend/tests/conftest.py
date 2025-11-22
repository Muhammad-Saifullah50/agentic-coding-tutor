import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
dotenv_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=dotenv_path)

# Add the backend directory to sys.path
sys.path.append(str(Path(__file__).parent.parent))

import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
# Import app after setting up path
from main import app
from unittest.mock import MagicMock, AsyncMock

# Set environment variables for testing
os.environ["DATABASE_URL"] = "postgresql+asyncpg://user:password@localhost:5432/test_db"
os.environ["OPENAI_API_KEY"] = "test-api-key"
os.environ["STRIPE_SECRET_KEY"] = "test-stripe-key"
os.environ["STRIPE_WEBHOOK_SECRET"] = "test-webhook-secret"

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
async def client():
    """Async client for testing FastAPI endpoints."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac

@pytest.fixture
def mock_supabase():
    """Mock Supabase client."""
    with pytest.MonkeyPatch.context() as m:
        mock_client = MagicMock()
        m.setattr("main.supabase", mock_client)
        yield mock_client

@pytest.fixture
def mock_temporal():
    """Mock Temporal client."""
    with pytest.MonkeyPatch.context() as m:
        mock_client = AsyncMock()
        m.setattr("main.temporal_client", AsyncMock(return_value=mock_client))
        yield mock_client
