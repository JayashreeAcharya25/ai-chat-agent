import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from src.utils.file_storage import storage
from src.database.models import ConversationModel, MessageModel


class ConversationService:
    def create_conversation(self, name: str = "New Chat") -> str:
        conversation_id = str(uuid.uuid4())
        conversation = ConversationModel(_id=conversation_id, name=name)
        
        conversations = storage.get_conversations()
        conversations.append(conversation.to_dict())
        storage.save_conversations(conversations)
        
        return conversation_id
    
    def get_conversations(self) -> List[Dict[str, Any]]:
        conversations = storage.get_conversations()
        conversations.sort(key=lambda x: x["updated_at"], reverse=True)
        return [{
            "id": conv["_id"],
            "name": conv["name"],
            "created_at": conv["created_at"],
            "updated_at": conv["updated_at"]
        } for conv in conversations]
    
    def update_conversation(self, conversation_id: str, name: str) -> bool:
        conversations = storage.get_conversations()
        for conv in conversations:
            if conv["_id"] == conversation_id:
                conv["name"] = name
                conv["updated_at"] = datetime.utcnow().isoformat()
                storage.save_conversations(conversations)
                return True
        return False
    
    def delete_conversation(self, conversation_id: str) -> bool:
        conversations = storage.get_conversations()
        messages = storage.get_messages()
        
        conversations = [conv for conv in conversations if conv["_id"] != conversation_id]
        storage.save_conversations(conversations)
        
        messages = [msg for msg in messages if msg["conversation_id"] != conversation_id]
        storage.save_messages(messages)
        
        return True
    
    def get_conversation_by_id(self, conversation_id: str) -> Optional[Dict[str, Any]]:
        conversations = storage.get_conversations()
        for conv in conversations:
            if conv["_id"] == conversation_id:
                return {
                    "id": conv["_id"],
                    "name": conv["name"],
                    "created_at": conv["created_at"],
                    "updated_at": conv["updated_at"]
                }
        return None
    
    def update_conversation_timestamp(self, conversation_id: str) -> None:
        conversations = storage.get_conversations()
        for conv in conversations:
            if conv["_id"] == conversation_id:
                conv["updated_at"] = datetime.utcnow().isoformat()
                break
        storage.save_conversations(conversations)


conversation_service = ConversationService()