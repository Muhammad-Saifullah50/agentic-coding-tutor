from typing import List
from pydantic import BaseModel

class Lesson(BaseModel):
    title: str
    description: str

class Module(BaseModel):
    title: str
    description: str
    lessons: List[Lesson]
    duration: str

class CurriculumOutline(BaseModel):
    title: str
    slug: str
    modules: List[Module]
