from pydantic import BaseModel
from typing import Optional


class ConversationResponse(BaseModel):
    id: str
    name: str
    created_at: str
    updated_at: str


class ConversationUpdate(BaseModel):
    name: str