from __future__ import annotations

import asyncio
from typing import Any, Dict, Iterable

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from starlette.responses import Response, StreamingResponse

from .engine import AssistantEngine
from .config import load_settings
from .logging_utils import configure_json_logging
from .middleware import RequestIdMiddleware, RateLimitMiddleware

REQUEST_COUNT = Counter("assistant_requests_total", "Total HTTP requests", ["path", "method", "status"])
REQUEST_LATENCY = Histogram("assistant_request_latency_seconds", "Latency", ["path", "method"])


class ChatRequest(BaseModel):
    session_id: str = "default"
    message: str


class ChatResponse(BaseModel):
    content: str


settings = load_settings()
configure_json_logging(settings.log_level)
app = FastAPI(title="Open Assistant", version="0.2.0")

app.add_middleware(RequestIdMiddleware)
app.add_middleware(RateLimitMiddleware, rate=120, per_seconds=60)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    path = request.url.path
    method = request.method
    with REQUEST_LATENCY.labels(path=path, method=method).time():
        response = await call_next(request)
    REQUEST_COUNT.labels(path=path, method=method, status=str(response.status_code)).inc()
    return response


@app.get("/health")
async def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/metrics")
async def metrics() -> Response:
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest) -> ChatResponse:
    engine = AssistantEngine(session_id=req.session_id)
    content = await engine.chat_once(req.message)
    return ChatResponse(content=content)


@app.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    engine = AssistantEngine(session_id=req.session_id)
    content = await engine.chat_once(req.message)

    def event_stream(text: str) -> Iterable[bytes]:
        # SSE format: data: <chunk>\n\n
        words = text.split()
        for w in words:
            yield f"data: {w} \n\n".encode("utf-8")
        yield b"data: [DONE]\n\n"

    return StreamingResponse(event_stream(content), media_type="text/event-stream")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "assistant.server:app",
        host=settings.server_host,
        port=settings.server_port,
        reload=False,
        access_log=False,
    )