from pydantic import BaseModel
from typing import List, Optional, Literal, Union


# ---------- QUIZ MODELS ----------
class QuizQuestion(BaseModel):
    id: str
    question: str
    options: List[str]
    correctAnswer: int
    explanation: str


class QuizLesson(BaseModel):
    id: str
    title: str
    type: Literal["quiz"]
    duration: str
    completed: bool
    locked: bool
    questions: List[QuizQuestion]


# ---------- CONTENT LESSON ----------
class ContentLesson(BaseModel):
    id: str
    title: str
    type: Literal["content"]
    duration: str
    completed: bool
    locked: bool
    content: str
    codeExample: Optional[str] = None


# ---------- PLAYGROUND LESSON ----------
class PlaygroundLesson(BaseModel):
    id: str
    title: str
    type: Literal["playground"]
    duration: str
    completed: bool
    locked: bool
    description: str
    language: str
    starterCode: str
    challenge: str
    hints: List[str]


# Union of all lesson types
Lesson = Union[
    ContentLesson,
    QuizLesson,
    PlaygroundLesson,
]


# ---------- MODULE ----------
class Module(BaseModel):
    title: str
    description: Optional[str] = None
    lessons: List[Lesson]


# ---------- FULL COURSE ----------
class FullCourse(BaseModel):
    title: str
    slug: str
    modules: List[Module]
