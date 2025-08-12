from __future__ import annotations

import base64
import sqlite3
from pathlib import Path
from typing import Any, Dict, List, Tuple
import os

try:
    from cryptography.fernet import Fernet
except Exception:  # pragma: no cover
    Fernet = None  # type: ignore


class ConversationMemory:
    def __init__(self, db_path: str) -> None:
        self.db_path = db_path
        self._ensure_tables()
        self._fernet = self._init_fernet()

    def _init_fernet(self):
        key_b64 = os.getenv("ASSISTANT_MEMORY_ENCRYPTION_KEY")
        if not key_b64 or not Fernet:
            return None
        try:
            return Fernet(key_b64.encode("utf-8"))
        except Exception:
            return None

    def _encode(self, text: str) -> bytes:
        data = text.encode("utf-8")
        if self._fernet:
            return self._fernet.encrypt(data)
        return data

    def _decode(self, blob: bytes) -> str:
        data = blob
        if self._fernet:
            try:
                data = self._fernet.decrypt(blob)
            except Exception:
                pass
        return data.decode("utf-8", errors="replace")

    def _ensure_tables(self) -> None:
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    role TEXT NOT NULL,
                    content BLOB NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            conn.commit()

    def append(self, session_id: str, role: str, content: str) -> None:
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)",
                (session_id, role, self._encode(content)),
            )
            conn.commit()

    def fetch(self, session_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        with sqlite3.connect(self.db_path) as conn:
            rows: List[Tuple[Any, ...]] = conn.execute(
                "SELECT role, content FROM messages WHERE session_id = ? ORDER BY id DESC LIMIT ?",
                (session_id, limit),
            ).fetchall()
        messages = [{"role": role, "content": self._decode(content)} for role, content in reversed(rows)]
        return messages