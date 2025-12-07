import json

# Sample data provided by user (representing one item or the list structure)
# Case A: Item is a dict with text/type
sample_item_A = {
    "text": "Hello again from dict...", 
    "type": "output_text", 
    "logprobs": [], 
    "annotations": []
}

# Case B: Item is a list containing the dict (common in some agent frameworks)
sample_item_B = [
    {
        "text": "Hello again from list...", 
        "type": "output_text", 
        "logprobs": [], 
        "annotations": []
    }
]

# Case C: Item is a STRINGIFIED list (Probable cause of the issue)
sample_item_C = json.dumps([
    {
        "text": "Hello again from STRINGIFIED list...", 
        "type": "output_text", 
        "logprobs": [], 
        "annotations": []
    }
])

# Sample history containing mixed items
mock_history = [
    {"role": "user", "content": "Who am I?"},  # Standard
    sample_item_A,                             # Complex Dict
    sample_item_B,                             # Complex List
    sample_item_C                              # Complex Stringified List
]

def parse_history(items):
    history = []
    for item in items:
        role = None
        content = None
        
        # --- NEW LOGIC START ---
        # 0. Handle Stringified JSON
        if isinstance(item, str):
            try:
                # Try to parse string as JSON
                parsed = json.loads(item)
                # Note: valid JSON could be a dict, list, string, etc.
                if isinstance(parsed, (dict, list)):
                    item = parsed
            except json.JSONDecodeError:
                # Not a JSON string, treat as normal format? 
                # Actually if it's a string in 'items', it's likely invalid unless it's a message content itself?
                # But 'items' is a list of message objects. A string item implies malformed data or stringified object.
                pass
        # --- NEW LOGIC END ---

        # 1. Standard dict format: {"role": "...", "content": "..."}
        if isinstance(item, dict):
            if "role" in item and "content" in item:
                role = item.get("role")
                content = item.get("content")
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
        
        if role == "system":
            continue

        if role and content:
            history.append({"role": role, "content": content})
            
    return history

print("Parsed History:")
print(json.dumps(parse_history(mock_history), indent=2))
