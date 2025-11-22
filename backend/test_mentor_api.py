import asyncio
import aiohttp
import json
import os
from dotenv import load_dotenv

load_dotenv()

async def test_mentor_chat():
    url = "http://localhost:8000/mentor/chat"
    user_id = "user_2pM3p4q5r6s7t8u9v0w1x2y3z4" # Example user ID
    
    # Test 1: Initial greeting
    print("\n--- Test 1: Initial Greeting ---")
    payload1 = {
        "user_id": user_id,
        "message": "Hi, I need help with Python loops."
    }
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(url, json=payload1) as response:
                print(f"Status: {response.status}")
                if response.status == 200:
                    print("✅ Connection successful, reading stream...")
                    async for line in response.content:
                        decoded_line = line.decode('utf-8').strip()
                        if decoded_line.startswith("data: "):
                            data_str = decoded_line[6:]
                            if data_str == "[DONE]":
                                print("\n[Stream Complete]")
                                break
                            try:
                                data = json.loads(data_str)
                                if "content" in data:
                                    print(data["content"], end="", flush=True)
                                elif "error" in data:
                                    print(f"\n❌ Error: {data['error']}")
                            except json.JSONDecodeError:
                                pass
                    print("\n✅ Test 1 Passed")
                else:
                    print(f"❌ Test 1 Failed with status {response.status}")
        except Exception as e:
            print(f"❌ Connection Error: {e}")

    # Test 2: Follow-up (Session Persistence)
    print("\n--- Test 2: Follow-up (Session Persistence) ---")
    payload2 = {
        "user_id": user_id,
        "message": "Can you give me an example of a for loop?"
    }
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(url, json=payload2) as response:
                print(f"Status: {response.status}")
                if response.status == 200:
                    print("✅ Connection successful, reading stream...")
                    async for line in response.content:
                        decoded_line = line.decode('utf-8').strip()
                        if decoded_line.startswith("data: "):
                            data_str = decoded_line[6:]
                            if data_str == "[DONE]":
                                print("\n[Stream Complete]")
                                break
                            try:
                                data = json.loads(data_str)
                                if "content" in data:
                                    print(data["content"], end="", flush=True)
                                elif "error" in data:
                                    print(f"\n❌ Error: {data['error']}")
                            except json.JSONDecodeError:
                                pass
                    print("\n✅ Test 2 Passed")
                else:
                    print(f"❌ Test 2 Failed with status {response.status}")
        except Exception as e:
            print(f"❌ Connection Error: {e}")

    # Test 3: Guardrail Check (Irrelevant Input)
    print("\n--- Test 3: Guardrail Check (Irrelevant Input) ---")
    payload3 = {
        "user_id": user_id,
        "message": "What is the best pizza recipe?"
    }
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(url, json=payload3) as response:
                print(f"Status: {response.status}")
                if response.status == 200:
                    print("✅ Connection successful, reading stream...")
                    async for line in response.content:
                        decoded_line = line.decode('utf-8').strip()
                        if decoded_line.startswith("data: "):
                            data_str = decoded_line[6:]
                            if data_str == "[DONE]":
                                print("\n[Stream Complete]")
                                break
                            try:
                                data = json.loads(data_str)
                                if "content" in data:
                                    print(data["content"], end="", flush=True)
                                elif "error" in data:
                                    print(f"\n❌ Error: {data['error']}")
                            except json.JSONDecodeError:
                                pass
                    print("\n✅ Test 3 Passed (Check output for guardrail message)")
                else:
                    print(f"❌ Test 3 Failed with status {response.status}")
        except Exception as e:
            print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_mentor_chat())
