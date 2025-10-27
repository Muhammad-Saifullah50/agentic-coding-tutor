from typing import List
from pydantic import BaseModel


class QuestionOutput(BaseModel):
    id: str
    question: str
    options: List[str]
    correct_answer: int
    explanation: str

class QuestionsOutput(BaseModel):
    questions: List[QuestionOutput]
    stage: str = 'quiz'
