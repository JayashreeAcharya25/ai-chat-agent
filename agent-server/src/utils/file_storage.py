import json
import os
from typing import List, Dict, Any
from src.config import settings


class FileStorage:
    def __init__(self):
        os.makedirs(settings.data_dir, exist_ok=True)
        self.conversations_file = os.path.join(settings.data_dir, settings.conversations_file)
        self.messages_file = os.path.join(settings.data_dir, settings.messages_file)
    
    def load_data(self, filename: str) -> List[Dict[str, Any]]:
        if os.path.exists(filename):
            with open(filename, 'r') as f:
                return json.load(f)
        return []
    
    def save_data(self, filename: str, data: List[Dict[str, Any]]) -> None:
        with open(filename, 'w') as f:
            json.dump(data, f, default=str, indent=2)
    
    def get_conversations(self) -> List[Dict[str, Any]]:
        return self.load_data(self.conversations_file)
    
    def save_conversations(self, conversations: List[Dict[str, Any]]) -> None:
        self.save_data(self.conversations_file, conversations)
    
    def get_messages(self) -> List[Dict[str, Any]]:
        return self.load_data(self.messages_file)
    
    def save_messages(self, messages: List[Dict[str, Any]]) -> None:
        self.save_data(self.messages_file, messages)


storage = FileStorage()