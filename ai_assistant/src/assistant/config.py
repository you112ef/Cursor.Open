from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional


@dataclass
class Settings:
    openai_api_key: str | None = None
    openai_model: str = "gpt-4o-mini"

    ollama_host: str | None = None
    ollama_model: str = "llama3.1:8b"

    assistant_db_path: str = "./assistant_memory.sqlite3"
    log_level: str = "INFO"

    server_host: str = "0.0.0.0"
    server_port: int = 8000

    allowed_origins: List[str] | None = None
    api_keys: List[str] | None = None
    request_max_bytes: int = 1_000_000

    sentry_dsn: str | None = None
    otlp_endpoint: str | None = None

    redis_url: str | None = None


def _load_dotenv_if_present(env_path: Path) -> None:
    if not env_path.exists():
        return
    try:
        with env_path.open("r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" not in line:
                    continue
                key, value = line.split("=", 1)
                key = key.strip()
                value = value.strip()
                if key and key not in os.environ:
                    os.environ[key] = value
    except Exception:
        pass


def _split_env_list(value: Optional[str]) -> Optional[List[str]]:
    if not value:
        return None
    items = [x.strip() for x in value.split(",") if x.strip()]
    return items or None


def load_settings() -> Settings:
    env_path = Path(__file__).resolve().parents[2] / ".env"
    _load_dotenv_if_present(env_path)
    return Settings(
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        openai_model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        ollama_host=os.getenv("OLLAMA_HOST"),
        ollama_model=os.getenv("OLLAMA_MODEL", "llama3.1:8b"),
        assistant_db_path=os.getenv("ASSISTANT_DB_PATH", "./assistant_memory.sqlite3"),
        log_level=os.getenv("LOG_LEVEL", "INFO"),
        server_host=os.getenv("SERVER_HOST", "0.0.0.0"),
        server_port=int(os.getenv("SERVER_PORT", "8000")),
        allowed_origins=_split_env_list(os.getenv("ALLOWED_ORIGINS")),
        api_keys=_split_env_list(os.getenv("API_KEYS")),
        request_max_bytes=int(os.getenv("REQUEST_MAX_BYTES", "1000000")),
        sentry_dsn=os.getenv("SENTRY_DSN"),
        otlp_endpoint=os.getenv("OTLP_ENDPOINT"),
        redis_url=os.getenv("REDIS_URL"),
    )