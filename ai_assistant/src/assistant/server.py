from __future__ import annotations

import asyncio
from typing import Any, Dict, Iterable
from pathlib import Path

from fastapi import Depends, FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from starlette.responses import Response, StreamingResponse

from .engine import AssistantEngine
from .config import load_settings
from .logging_utils import configure_json_logging
from .middleware import RequestIdMiddleware, RateLimitMiddleware, SecurityHeadersMiddleware, RedisRateLimitMiddleware
from .auth import api_key_auth

settings = load_settings()
configure_json_logging(settings.log_level)

# Optional Sentry
try:  # pragma: no cover
    if settings.sentry_dsn:
        import sentry_sdk
        from sentry_sdk.integrations.fastapi import FastApiIntegration

        sentry_sdk.init(dsn=settings.sentry_dsn, integrations=[FastApiIntegration()])
except Exception:
    pass

# Optional OTLP tracing
try:  # pragma: no cover
    if settings.otlp_endpoint:
        from opentelemetry import trace
        from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
        from opentelemetry.sdk.resources import SERVICE_NAME, Resource
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor
        from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

        resource = Resource(attributes={SERVICE_NAME: "open-assistant-safe"})
        provider = TracerProvider(resource=resource)
        exporter = OTLPSpanExporter(endpoint=settings.otlp_endpoint)
        provider.add_span_processor(BatchSpanProcessor(exporter))
        trace.set_tracer_provider(provider)
        # Instrument FastAPI after app created
except Exception:
    pass

REQUEST_COUNT = Counter("assistant_requests_total", "Total HTTP requests", ["path", "method", "status"])
REQUEST_LATENCY = Histogram("assistant_request_latency_seconds", "Latency", ["path", "method"])


class ChatRequest(BaseModel):
    session_id: str = "default"
    message: str


class ChatResponse(BaseModel):
    content: str


app = FastAPI(title="Open Assistant", version="0.4.0")

app.add_middleware(RequestIdMiddleware)
app.add_middleware(SecurityHeadersMiddleware)

# Rate limit: Redis if configured, else in-memory
try:
    if settings.redis_url:
        import redis  # type: ignore

        redis_client = redis.from_url(settings.redis_url)
        app.add_middleware(RedisRateLimitMiddleware, redis_client=redis_client, rate=120, per_seconds=60)
    else:
        app.add_middleware(RateLimitMiddleware, rate=120, per_seconds=60)
except Exception:
    app.add_middleware(RateLimitMiddleware, rate=120, per_seconds=60)

allow_origins = settings.allowed_origins if settings.allowed_origins else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instrument FastAPI for OTLP if available
try:  # pragma: no cover
    if settings.otlp_endpoint:
        from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

        FastAPIInstrumentor.instrument_app(app)
except Exception:
    pass

# Static and index
static_dir = Path(__file__).resolve().parent / "web"
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

@app.get("/")
async def index() -> FileResponse:
    return FileResponse(static_dir / "index.html")


@app.middleware("http")
async def enforce_body_size(request: Request, call_next):
    if request.method in {"POST", "PUT", "PATCH"}:
        body = await request.body()
        if len(body) > settings.request_max_bytes:
            return Response("request too large", status_code=413)
        request._body = body  # type: ignore[attr-defined]
    return await call_next(request)


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


@app.post("/chat", response_model=ChatResponse, dependencies=[Depends(api_key_auth)])
async def chat(req: ChatRequest) -> ChatResponse:
    engine = AssistantEngine(session_id=req.session_id)
    content = await engine.chat_once(req.message)
    return ChatResponse(content=content)


@app.post("/chat/stream", dependencies=[Depends(api_key_auth)])
async def chat_stream(req: ChatRequest):
    engine = AssistantEngine(session_id=req.session_id)
    content = await engine.chat_once(req.message)

    def event_stream(text: str) -> Iterable[bytes]:
        words = text.split()
        for w in words:
            yield f"data: {w} \n\n".encode("utf-8")
        yield b"data: [DONE]\n\n"

    return StreamingResponse(event_stream(content), media_type="text/event-stream")


@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            data = await ws.receive_text()
            engine = AssistantEngine(session_id="ws")
            reply = await engine.chat_once(data)
            await ws.send_text(reply)
    except WebSocketDisconnect:
        await ws.close()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "assistant.server:app",
        host=settings.server_host,
        port=settings.server_port,
        reload=False,
        access_log=False,
    )