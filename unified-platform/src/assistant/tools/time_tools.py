from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict


TIME_NOW_SCHEMA: Dict[str, Any] = {
    "description": "Get the current UTC time in ISO 8601 format.",
    "parameters": {
        "type": "object",
        "properties": {},
        "additionalProperties": False,
    },
}


def get_current_time(_arguments: Dict[str, Any]) -> Dict[str, Any]:
    now = datetime.now(timezone.utc).isoformat()
    return {"utc": now}