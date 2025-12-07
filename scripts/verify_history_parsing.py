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

# Sample history containing mixed items
mock_history = [
    {"role": "user", "content": "Who am I?"},  # Standard
    sample_item_A,                             # Complex Dict
    sample_item_B                              # Complex List
]

def parse_history(items):
    history = []
    for item in items:
        role = None
        content = None
        
        # Standard format
        if isinstance(item, dict):
            if "role" in item and "content" in item:
                role = item.get("role")
                content = item.get("content")
            elif "text" in item and "type" in item:
                # Handle text/type format
                msg_type = item.get("type")
                if msg_type == "output_text":
                    role = "assistant"
                elif msg_type == "input_text":
                    role = "user"
                content = item.get("text")
        
        # Handle list format (if item is a list of parts)
        elif isinstance(item, list) and len(item) > 0 and isinstance(item[0], dict):
             # Try first element
             first = item[0]
             if "text" in first and "type" in first:
                msg_type = first.get("type")
                if msg_type == "output_text":
                    role = "assistant"
                elif msg_type == "input_text":
                    role = "user"
                content = first.get("text")

        if role == "model":
            role = "assistant"
        
        if role == "system":
            continue

        if role and content:
            history.append({"role": role, "content": content})
            
    return history

print("Parsed History:")
print(json.dumps(parse_history(mock_history), indent=2))
