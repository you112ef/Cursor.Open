from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


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
        # Silently ignore dotenv parse errors in stdlib mode
        pass


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
    )