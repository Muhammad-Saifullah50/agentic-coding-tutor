import asyncio
import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agents import Runner, InputGuardrailTripwireTriggered
from ai_agents.code_review_agent import code_review_agent, generate_instructions
from ai_agents.guardrails import code_input_guardrail_agent
from schemas.code_review_schemas import CodeReviewRequest, CodeReviewResponse
import pytest
import httpx


# ===== Guardrail Tests =====

@pytest.mark.asyncio
async def test_code_input_guardrail_valid_python():
    """Test that valid Python code passes the guardrail."""
    print("\n--- Testing Valid Python Code ---")
    
    valid_code = """
def add(a, b):
    return a + b

result = add(5, 3)
print(result)
"""
    
    result = await Runner.run(code_input_guardrail_agent, valid_code)
    validation = result.final_output
    
    print(f"Result: {validation}")
    assert validation.is_valid_code_input == True, "Valid Python code should pass"


@pytest.mark.asyncio
async def test_code_input_guardrail_valid_javascript():
    """Test that valid JavaScript code passes the guardrail."""
    print("\n--- Testing Valid JavaScript Code ---")
    
    valid_code = """
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
"""
    
    result = await Runner.run(code_input_guardrail_agent, valid_code)
    validation = result.final_output
    
    print(f"Result: {validation}")
    assert validation.is_valid_code_input == True, "Valid JavaScript code should pass"


@pytest.mark.asyncio
async def test_code_input_guardrail_conversational_text():
    """Test that conversational text fails the guardrail."""
    print("\n--- Testing Conversational Text ---")
    
    conversational = "Hello, how do I learn to code in Python? Can you help me get started?"
    
    result = await Runner.run(code_input_guardrail_agent, conversational)
    validation = result.final_output
    
    print(f"Result: {validation}")
    assert validation.is_valid_code_input == False, "Conversational text should fail"
    assert "conversational" in validation.reason.lower() or "text" in validation.reason.lower()


@pytest.mark.asyncio
async def test_code_input_guardrail_empty_input():
    """Test that empty input fails the guardrail."""
    print("\n--- Testing Empty Input ---")
    
    empty_code = "   \n  \n   "
    
    result = await Runner.run(code_input_guardrail_agent, empty_code)
    validation = result.final_output
    
    print(f"Result: {validation}")
    # Empty input should likely fail
    assert validation.is_valid_code_input == False, "Empty input should fail"


@pytest.mark.asyncio
async def test_code_input_guardrail_too_long():
    """Test that code exceeding 500 lines fails the guardrail."""
    print("\n--- Testing Code Over 500 Lines ---")
    
    # Generate code with over 500 lines
    long_code = "# Line {}\n" * 501
    long_code = long_code.format(*range(501))
    
    result = await Runner.run(code_input_guardrail_agent, long_code)
    validation = result.final_output
    
    print(f"Result: {validation}")
    assert validation.is_valid_code_input == False, "Code over 500 lines should fail"
    assert "500" in validation.reason, "Reason should mention 500 line limit"


# ===== Code Review Agent Tests =====

@pytest.mark.asyncio
async def test_code_review_agent_python_buggy():
    """Test code review agent with buggy Python code."""
    print("\n--- Testing Code Review with Buggy Python ---")
    
    buggy_code = """
def divide(a, b):
    return a / b

result = divide(10, 0)
"""
    
    code_with_context = f"Language: Python\n\nCode:\n{buggy_code}"
    
    # Set dynamic instructions
    instructions = generate_instructions("Python")
    code_review_agent.instructions = instructions
    
    # This should pass guardrail but provide corrections
    result = await Runner.run(code_review_agent, code_with_context)
    analysis = result.final_output
    
    print(f"Corrected Code:\n{analysis.corrected_code}")
    print(f"\nFeedback:\n{analysis.feedback_explanation}")
    
    assert analysis.corrected_code is not None
    assert analysis.feedback_explanation is not None
    assert "error" in analysis.feedback_explanation.lower() or "exception" in analysis.feedback_explanation.lower()


@pytest.mark.asyncio
async def test_code_review_agent_with_challenge():
    """Test code review agent with a specific challenge."""
    print("\n--- Testing Code Review with Challenge ---")
    
    code = """
function reverse(str) {
    return str.split('').reverse().join('');
}
"""
    
    challenge = "Write a function to reverse a string in JavaScript"
    code_with_context = f"Language: JavaScript\n\nCode:\n{code}"
    
    # Set dynamic instructions with challenge
    instructions = generate_instructions("JavaScript", challenge)
    code_review_agent.instructions = instructions
    
    result = await Runner.run(code_review_agent, code_with_context)
    analysis = result.final_output
    
    print(f"Corrected Code:\n{analysis.corrected_code}")
    print(f"\nFeedback:\n{analysis.feedback_explanation}")
    
    assert analysis.corrected_code is not None
    assert analysis.feedback_explanation is not None
    # Should mention challenge adherence
    assert "challenge" in analysis.feedback_explanation.lower()


# ===== Integration Tests (API Endpoint) =====

BASE_URL = "http://localhost:8000"


@pytest.mark.asyncio
async def test_api_code_review_valid():
    """Test API endpoint with valid code."""
    print("\n--- Testing API with Valid Code ---")
    
    async with httpx.AsyncClient() as client:
        request_data = {
            "code": "def greet(name):\n    print(f'Hello, {name}!')\n\ngreet('World')",
            "language": "Python",
            "session_id": "test-session-1"
        }
        
        response = await client.post(f"{BASE_URL}/code-review", json=request_data, timeout=30.0)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "corrected_code" in data
        assert "feedback_explanation" in data


@pytest.mark.asyncio
async def test_api_code_review_guardrail_failure():
    """Test API endpoint with conversational text that should trigger guardrail."""
    print("\n--- Testing API with Guardrail Failure ---")
    
    async with httpx.AsyncClient() as client:
        request_data = {
            "code": "Can you explain how to use loops in Python?",
            "language": "Python",
            "session_id": "test-session-2"
        }
        
        response = await client.post(f"{BASE_URL}/code-review", json=request_data, timeout=30.0)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "failure"
        assert "error_message" in data


@pytest.mark.asyncio
async def test_api_code_review_empty_input():
    """Test API endpoint with empty code."""
    print("\n--- Testing API with Empty Input ---")
    
    async with httpx.AsyncClient() as client:
        request_data = {
            "code": "   ",
            "language": "Python",
            "session_id": "test-session-3"
        }
        
        response = await client.post(f"{BASE_URL}/code-review", json=request_data, timeout=30.0)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "failure"
        assert "empty" in data["error_message"].lower()


@pytest.mark.asyncio
async def test_api_code_review_token_limit():
    """Test API endpoint with code exceeding line limit."""
    print("\n--- Testing API with Code Over Limit ---")
    
    # Generate code with over 500 lines
    long_code = "\n".join([f"x{i} = {i}" for i in range(501)])
    
    async with httpx.AsyncClient() as client:
        request_data = {
            "code": long_code,
            "language": "Python",
            "session_id": "test-session-4"
        }
        
        response = await client.post(f"{BASE_URL}/code-review", json=request_data, timeout=30.0)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "failure"
        assert "Code exceeds 500 line limit" in data["error_message"]


if __name__ == "__main__":
    # Run unit tests for guardrails and agents
    print("===== Running Guardrail Tests =====")
    asyncio.run(test_code_input_guardrail_valid_python())
    asyncio.run(test_code_input_guardrail_valid_javascript())
    asyncio.run(test_code_input_guardrail_conversational_text())
    asyncio.run(test_code_input_guardrail_empty_input())
    asyncio.run(test_code_input_guardrail_too_long())
    
    print("\n===== Running Agent Tests =====")
    asyncio.run(test_code_review_agent_python_buggy())
    asyncio.run(test_code_review_agent_with_challenge())
    
    print("\n===== All Unit Tests Passed =====")
    print("\nNOTE: Integration tests require the backend server to be running.")
    print("Run: uv run pytest tests/test_code_review.py -v")
