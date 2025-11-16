from typing import List,Optional
from datetime import datetime
from pydantic import BaseModel


class UserProfile(BaseModel):
    id: int
    created_at: datetime 
    username: str
    email: str
    ageRange: str
    educationLevel: str
    techBackground: str
    codingExperience: str
    goals: List[str]
    learningSpeed: str
    learningMode: str
    timePerWeek: str
    preferredLanguage: str
    userId: str
    courses: Optional[int] = None
    onBoarded: bool
    imageUrl: str

   

