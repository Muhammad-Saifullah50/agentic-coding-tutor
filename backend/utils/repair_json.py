import json
import re

def repair_json(bad_json: str) -> str:
    """Attempt to fix truncated or invalid JSON so it can be parsed."""

    # 1. Remove everything before the first { and after the last }
    start = bad_json.find("{")
    end = bad_json.rfind("}")
    if start != -1:
        bad_json = bad_json[start:]
    if end != -1:
        bad_json = bad_json[:end+1]

    # 2. Fix unclosed quotation marks
    quotes = bad_json.count('"')
    if quotes % 2 != 0:
        bad_json += '"'

    # 3. Fix dangling trailing commas
    bad_json = re.sub(r",\s*([}\]])", r"\1", bad_json)

    # 4. Auto-close brackets if missing
    open_braces = bad_json.count("{")
    close_braces = bad_json.count("}")
    if close_braces < open_braces:
        bad_json += "}" * (open_braces - close_braces)

    open_brackets = bad_json.count("[")
    close_brackets = bad_json.count("]")
    if close_brackets < open_brackets:
        bad_json += "]" * (open_brackets - close_brackets)

    return bad_json
