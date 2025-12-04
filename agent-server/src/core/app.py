from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.endpoints import router
from src.config import settings


def create_app() -> FastAPI:
    app = FastAPI(title="Agent Server", version="1.0.0")
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=False
    )
    
    app.include_router(router)
    
    return app