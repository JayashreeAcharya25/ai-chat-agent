import uuid
from typing import List, Dict, Any
from src.utils.file_storage import storage
from src.database.models import MessageModel


class MessageService:
    def add_message(self, conversation_id: str, content: str, sender: str) -> str:
        message_id = str(uuid.uuid4())
        message = MessageModel(
            _id=message_id,
            conversation_id=conversation_id,
            content=content,
            sender=sender
        )
        
        messages = storage.get_messages()
        messages.append(message.to_dict())
        storage.save_messages(messages)
        
        return message_id
    
    def get_conversation_messages(self, conversation_id: str) -> List[Dict[str, Any]]:
        messages = storage.get_messages()
        conv_messages = [msg for msg in messages if msg["conversation_id"] == conversation_id]
        conv_messages.sort(key=lambda x: x["timestamp"])
        
        return [{
            "id": msg["_id"],
            "content": msg["content"],
            "sender": msg["sender"],
            "timestamp": msg["timestamp"]
        } for msg in conv_messages]


message_service = MessageService()