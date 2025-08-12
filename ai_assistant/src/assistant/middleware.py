from __future__ import annotations

import time
from typing import Callable, Dict, Optional

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse

from .logging_utils import get_request_id


class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:  # type: ignore[override]
        req_id = request.headers.get("X-Request-ID") or get_request_id()
        request.state.request_id = req_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = req_id
        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:  # type: ignore[override]
        response = await call_next(request)
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "no-referrer")
        response.headers.setdefault("X-XSS-Protection", "0")
        # Note: Set HSTS only behind HTTPS
        if request.url.scheme == "https":
            response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, rate: int = 60, per_seconds: int = 60):
        super().__init__(app)
        self.rate = rate
        self.per = per_seconds
        self.bucket: Dict[str, list[float]] = {}

    async def dispatch(self, request: Request, call_next: Callable) -> Response:  # type: ignore[override]
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        window_start = now - self.per
        timestamps = self.bucket.get(client_ip, [])
        timestamps = [t for t in timestamps if t >= window_start]
        if len(timestamps) >= self.rate:
            return JSONResponse({"detail": "rate limit exceeded"}, status_code=429)
        timestamps.append(now)
        self.bucket[client_ip] = timestamps
        return await call_next(request)


class RedisRateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, redis_client, rate: int = 120, per_seconds: int = 60):
        super().__init__(app)
        self.redis = redis_client
        self.rate = rate
        self.per = per_seconds

    async def dispatch(self, request: Request, call_next: Callable) -> Response:  # type: ignore[override]
        client_ip = request.client.host if request.client else "unknown"
        key = f"ratelimit:{client_ip}:{int(time.time() // self.per)}"
        try:
            pipe = self.redis.pipeline()
            pipe.incr(key, 1)
            pipe.expire(key, self.per + 1)
            count, _ = pipe.execute()
            if int(count) > self.rate:
                return JSONResponse({"detail": "rate limit exceeded"}, status_code=429)
        except Exception:
            pass
        return await call_next(request)