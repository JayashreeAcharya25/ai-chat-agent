from pydantic_ai import Agent
from pydantic_ai.exceptions import ModelHTTPError
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from datetime import datetime
from typing import List, Optional
import uuid
import json
import os

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False
)

api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("OPENAI_API_KEY is missing")

chat_agent = Agent(
    model='openai:gpt-4o',
    system_prompt="You are a helpful assistant."
)

DATA_DIR = 'data'
CONVERSATIONS_FILE = os.path.join(DATA_DIR, 'conversations.json')
MESSAGES_FILE = os.path.join(DATA_DIR, 'messages.json')

os.makedirs(DATA_DIR, exist_ok=True)

def load_data(filename):
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            return json.load(f)
    return []

def save_data(filename, data):
    with open(filename, 'w') as f:
        json.dump(data, f, default=str, indent=2)

def get_conversations():
    return load_data(CONVERSATIONS_FILE)

def save_conversations(conversations):
    save_data(CONVERSATIONS_FILE, conversations)

def get_messages():
    return load_data(MESSAGES_FILE)

def save_messages(messages):
    save_data(MESSAGES_FILE, messages)

class MessagePayload(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class AgentResponse(BaseModel):
    response: str
    conversation_id: str

class ConversationResponse(BaseModel):
    id: str
    name: str
    created_at: str
    updated_at: str

class MessageResponse(BaseModel):
    id: str
    content: str
    sender: str
    timestamp: str

class ConversationUpdate(BaseModel):
    name: str

@app.post('/conversations')
async def create_conversation():
    conversation_id = str(uuid.uuid4())
    conversations = get_conversations()
    conversation = {
        "_id": conversation_id,
        "name": "New Chat",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    conversations.append(conversation)
    save_conversations(conversations)
    return {"conversation_id": conversation_id}

@app.get('/conversations')
async def get_conversations_list():
    conversations = get_conversations()
    conversations.sort(key=lambda x: x["updated_at"], reverse=True)
    return [{
        "id": conv["_id"],
        "name": conv["name"],
        "created_at": conv["created_at"],
        "updated_at": conv["updated_at"]
    } for conv in conversations]

@app.get('/conversations/{conversation_id}/messages')
async def get_conversation_messages(conversation_id: str):
    messages = get_messages()
    conv_messages = [msg for msg in messages if msg["conversation_id"] == conversation_id]
    conv_messages.sort(key=lambda x: x["timestamp"])
    return [{
        "id": msg["_id"],
        "content": msg["content"],
        "sender": msg["sender"],
        "timestamp": msg["timestamp"]
    } for msg in conv_messages]

@app.patch('/conversations/{conversation_id}')
async def update_conversation(conversation_id: str, data: ConversationUpdate):
    conversations = get_conversations()
    for conv in conversations:
        if conv["_id"] == conversation_id:
            conv["name"] = data.name
            conv["updated_at"] = datetime.utcnow().isoformat()
            save_conversations(conversations)
            return {"message": "Conversation updated successfully"}
    raise HTTPException(status_code=404, detail="Conversation not found")

@app.delete('/conversations/{conversation_id}')
async def delete_conversation(conversation_id: str):
    conversations = get_conversations()
    messages = get_messages()
    
    conversations = [conv for conv in conversations if conv["_id"] != conversation_id]
    save_conversations(conversations)
    
    messages = [msg for msg in messages if msg["conversation_id"] != conversation_id]
    save_messages(messages)
    
    return {"message": "Conversation deleted successfully"}

@app.get('/chat/{conversation_id}')
async def get_shared_chat(conversation_id: str):
    conversations = get_conversations()
    messages = get_messages()
    
    conversation = None
    for conv in conversations:
        if conv["_id"] == conversation_id:
            conversation = conv
            break
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conv_messages = [msg for msg in messages if msg["conversation_id"] == conversation_id]
    conv_messages.sort(key=lambda x: x["timestamp"])
    
    return {
        "conversation": {
            "id": conversation["_id"],
            "name": conversation["name"],
            "created_at": conversation["created_at"],
            "updated_at": conversation["updated_at"]
        },
        "messages": [{
            "id": msg["_id"],
            "content": msg["content"],
            "sender": msg["sender"],
            "timestamp": msg["timestamp"]
        } for msg in conv_messages]
    }

@app.post('/agent')
async def run_agent(data: MessagePayload):
    try:

        if not data.conversation_id:
            conversation_id = str(uuid.uuid4())
            conversations = get_conversations()
            conversation = {
                "_id": conversation_id,
                "name": data.message[:50] + "..." if len(data.message) > 50 else data.message,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            conversations.append(conversation)
            save_conversations(conversations)
        else:
            conversation_id = data.conversation_id
            conversations = get_conversations()
            for conv in conversations:
                if conv["_id"] == conversation_id:
                    conv["updated_at"] = datetime.utcnow().isoformat()
                    break
            save_conversations(conversations)
        
        messages = get_messages()
        user_message = {
            "_id": str(uuid.uuid4()),
            "conversation_id": conversation_id,
            "content": data.message,
            "sender": "user",
            "timestamp": datetime.utcnow().isoformat()
        }
        messages.append(user_message)
        save_messages(messages)
        
        result = await chat_agent.run(data.message)
        
        messages = get_messages()
        agent_message = {
            "_id": str(uuid.uuid4()),
            "conversation_id": conversation_id,
            "content": result.output,
            "sender": "agent",
            "timestamp": datetime.utcnow().isoformat()
        }
        messages.append(agent_message)
        save_messages(messages)
        
        return AgentResponse(response=result.output, conversation_id=conversation_id)
    except ModelHTTPError as e:
        if e.status_code == 429:
            raise HTTPException(status_code=429, detail="OpenAI API quota exceeded. Please check your billing.")
        raise HTTPException(status_code=500, detail=f"Model error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")