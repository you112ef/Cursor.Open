from __future__ import annotations

import asyncio
from typing import Any, Dict

import orjson
from fastapi import FastAPI
from pydantic import BaseModel

from .engine import AssistantEngine
from .config import load_settings


class ChatRequest(BaseModel):
    session_id: str = "default"
    message: str


class ChatResponse(BaseModel):
    content: str


app = FastAPI(title="Open Assistant", version="0.1.0")


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest) -> ChatResponse:
    engine = AssistantEngine(session_id=req.session_id)
    content = await engine.chat_once(req.message)
    return ChatResponse(content=content)


if __name__ == "__main__":
    from .config import load_settings
    import uvicorn

    settings = load_settings()
    uvicorn.run(
        "assistant.server:app",
        host=settings.server_host,
        port=settings.server_port,
        reload=False,
        access_log=False,
    )