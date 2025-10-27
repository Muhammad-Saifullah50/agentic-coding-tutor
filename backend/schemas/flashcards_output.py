
from pydantic import BaseModel
from typing import List
class FlashCardOutput(BaseModel):
    id: str
    front: str
    back: str
    remembered: bool = False


class FlashCardsOutput(BaseModel):
    flashcards: List[FlashCardOutput]
    stage: str = "review"