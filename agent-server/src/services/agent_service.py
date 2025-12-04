from pydantic_ai import Agent
from pydantic_ai.exceptions import ModelHTTPError
from src.config import settings


class AgentService:
    def __init__(self):
        self.chat_agent = None
    
    def _get_agent(self):
        if self.chat_agent is None:
            self.chat_agent = Agent(
                model='openai:gpt-4o',
                system_prompt="You are a helpful assistant."
            )
        return self.chat_agent
    
    async def run_agent(self, message: str) -> str:
        try:
            agent = self._get_agent()
            result = await agent.run(message)
            return result.output
        except ModelHTTPError as e:
            raise e
        except Exception as e:
            raise e


agent_service = AgentService()