from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    openai_api_key: str
    data_dir: str = "data"
    conversations_file: str = "conversations.json"
    messages_file: str = "messages.json"
    
    class Config:
        env_file = ".env"


settings = Settings()