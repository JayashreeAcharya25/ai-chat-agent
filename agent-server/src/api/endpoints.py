from fastapi import APIRouter, HTTPException
from pydantic_ai.exceptions import ModelHTTPError
from src.schemas.message import MessagePayload, AgentResponse
from src.schemas.conversation import ConversationUpdate
from src.services.agent_service import agent_service
from src.services.conversation_service import conversation_service
from src.services.message_service import message_service

router = APIRouter()


@router.post('/conversations')
async def create_conversation():
    conversation_id = conversation_service.create_conversation()
    return {"conversation_id": conversation_id}


@router.get('/conversations')
async def get_conversations_list():
    return conversation_service.get_conversations()


@router.get('/conversations/{conversation_id}/messages')
async def get_conversation_messages(conversation_id: str):
    return message_service.get_conversation_messages(conversation_id)


@router.patch('/conversations/{conversation_id}')
async def update_conversation(conversation_id: str, data: ConversationUpdate):
    success = conversation_service.update_conversation(conversation_id, data.name)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"message": "Conversation updated successfully"}


@router.delete('/conversations/{conversation_id}')
async def delete_conversation(conversation_id: str):
    conversation_service.delete_conversation(conversation_id)
    return {"message": "Conversation deleted successfully"}


@router.get('/chat/{conversation_id}')
async def get_shared_chat(conversation_id: str):
    conversation = conversation_service.get_conversation_by_id(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = message_service.get_conversation_messages(conversation_id)
    
    return {
        "conversation": conversation,
        "messages": messages
    }


@router.post('/agent')
async def run_agent(data: MessagePayload):
    try:
        if not data.conversation_id:
            conversation_name = data.message[:50] + "..." if len(data.message) > 50 else data.message
            conversation_id = conversation_service.create_conversation(conversation_name)
        else:
            conversation_id = data.conversation_id
            conversation_service.update_conversation_timestamp(conversation_id)
        
        message_service.add_message(conversation_id, data.message, "user")
        
        response = await agent_service.run_agent(data.message)
        
        message_service.add_message(conversation_id, response, "agent")
        
        return AgentResponse(response=response, conversation_id=conversation_id)
    
    except ModelHTTPError as e:
        if e.status_code == 429:
            raise HTTPException(status_code=429, detail="OpenAI API quota exceeded. Please check your billing.")
        raise HTTPException(status_code=500, detail=f"Model error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")