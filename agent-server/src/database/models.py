from typing import Dict, Any
from datetime import datetime


class ConversationModel:
    def __init__(self, _id: str, name: str, created_at: str = None, updated_at: str = None):
        self._id = _id
        self.name = name
        self.created_at = created_at or datetime.utcnow().isoformat()
        self.updated_at = updated_at or datetime.utcnow().isoformat()
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "_id": self._id,
            "name": self.name,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }


class MessageModel:
    def __init__(self, _id: str, conversation_id: str, content: str, sender: str, timestamp: str = None):
        self._id = _id
        self.conversation_id = conversation_id
        self.content = content
        self.sender = sender
        self.timestamp = timestamp or datetime.utcnow().isoformat()
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "_id": self._id,
            "conversation_id": self.conversation_id,
            "content": self.content,
            "sender": self.sender,
            "timestamp": self.timestamp
        }