from __future__ import annotations

from typing import Optional
from fastapi import Header, HTTPException, status

from .config import load_settings


def api_key_auth(x_api_key: Optional[str] = Header(default=None)) -> None:
    settings = load_settings()
    allowed = settings.api_keys or []
    if not allowed:
        return
    if x_api_key in allowed:
        return
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid api key")