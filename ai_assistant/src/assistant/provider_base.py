from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional


class ProviderBase(ABC):
    @abstractmethod
    async def generate(
        self,
        messages: List[Dict[str, Any]],
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_choice: str | None = None,
        temperature: float = 0.2,
    ) -> Dict[str, Any]:
        """Return a response dict with potential tool calls.
        Expected keys: {"content": str, "tool_calls": list|None}
        """
        raise NotImplementedError