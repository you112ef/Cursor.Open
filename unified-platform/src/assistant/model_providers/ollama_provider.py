from __future__ import annotations

import json
from typing import Any, Dict, List, Optional

import httpx


class OllamaProvider:
    def __init__(self, host: str, model: str) -> None:
        self.host = host.rstrip("/")
        self.model = model
        self.client = httpx.AsyncClient(timeout=60)

    async def generate(
        self,
        messages: List[Dict[str, Any]],
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_choice: str | None = None,
        temperature: float = 0.2,
    ) -> Dict[str, Any]:
        # Ollama doesn't natively support tool-calling across all models.
        # We provide messages verbatim; if model emits JSON tool call, the engine can parse.
        payload = {
            "model": self.model,
            "messages": messages,
            "options": {"temperature": temperature},
            "stream": False,
        }
        resp = await self.client.post(f"{self.host}/api/chat", json=payload)
        resp.raise_for_status()
        data = resp.json()
        content = data.get("message", {}).get("content", "")
        return {"content": content, "tool_calls": None}