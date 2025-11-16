from pydantic import BaseModel, Field
from typing import List, Optional

class CodeExercise(BaseModel):
    prompt: str = Field(..., description="The coding exercise prompt.")

class QuizQuestion(BaseModel):
    question: str = Field(..., description="The quiz question.")
    options: List[str] = Field(..., description="Multiple-choice options for the question.")
    answer: str = Field(..., description="The correct answer.")

class LessonContent(BaseModel):
    title: str = Field(..., description="The title of the lesson.")
    content: str = Field(..., description="The full content of the lesson, in Markdown format.")
    estimated_duration: str = Field(..., description="The estimated time to complete the lesson.")
    code_exercises: Optional[List[CodeExercise]] = Field(default_factory=list, description="A list of coding exercises for the lesson.")
    quizzes: Optional[List[QuizQuestion]] = Field(default_factory=list, description="A list of quiz questions for the lesson.")

class ModuleContent(BaseModel):
    title: str = Field(..., description="The title of the module.")
    lessons: List[LessonContent] = Field(..., description="A list of lessons in the module.")

class FullCourse(BaseModel):
    title: str = Field(..., description="The title of the course.")
    description: str = Field(..., description="A brief description of the course.")
    modules: List[ModuleContent] = Field(..., description="A list of modules in the course.")
