
from pydantic import BaseModel

class ExplanationOutput(BaseModel):
    explanation: str
    stage: str = "explain"