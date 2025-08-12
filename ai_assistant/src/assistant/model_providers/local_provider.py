from __future__ import annotations

from typing import Any, Dict, List, Optional


class LocalEchoProvider:
    async def generate(
        self,
        messages: List[Dict[str, Any]],
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_choice: str | None = None,
        temperature: float = 0.0,
    ) -> Dict[str, Any]:
        # Minimal heuristic: if last user message contains 'time', request time tool.
        last = messages[-1] if messages else {"role": "user", "content": ""}
        content = last.get("content", "")
        tool_calls = None
        if tools and ("time" in content.lower() or "الوقت" in content.lower()):
            tool_calls = [
                {
                    "id": "tool_now",
                    "name": "get_current_time",
                    "arguments": "{}",
                }
            ]
            return {"content": "", "tool_calls": tool_calls}
        # Otherwise respond with a simple acknowledgment
        reply = f"[Local Assistant] You said: {content}"
        return {"content": reply, "tool_calls": None}