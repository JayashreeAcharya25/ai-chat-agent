from pydantic import BaseModel
from typing import Optional


class MessagePayload(BaseModel):
    message: str
    conversation_id: Optional[str] = None


class MessageResponse(BaseModel):
    id: str
    content: str
    sender: str
    timestamp: str


class AgentResponse(BaseModel):
    response: str
    conversation_id: str