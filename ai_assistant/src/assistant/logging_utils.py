from __future__ import annotations

import json
import logging
import sys
import time
import uuid
from typing import Any, Dict, Optional


class JsonLogFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:  # type: ignore[override]
        base: Dict[str, Any] = {
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "time": int(time.time() * 1000),
        }
        if hasattr(record, "request_id"):
            base["request_id"] = getattr(record, "request_id")
        if record.exc_info:
            base["exc_info"] = self.formatException(record.exc_info)
        return json.dumps(base, ensure_ascii=False)


def configure_json_logging(level: str = "INFO") -> None:
    log_level = getattr(logging, level.upper(), logging.INFO)
    root = logging.getLogger()
    root.setLevel(log_level)
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonLogFormatter())
    root.handlers = [handler]


def get_request_id(existing: Optional[str] = None) -> str:
    return existing or uuid.uuid4().hex