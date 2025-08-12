from __future__ import annotations

from typing import Any, Dict, List, Optional

from openai import OpenAI


class OpenAIProvider:
    def __init__(self, api_key: str, model: str) -> None:
        self.client = OpenAI(api_key=api_key)
        self.model = model

    async def generate(
        self,
        messages: List[Dict[str, Any]],
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_choice: str | None = None,
        temperature: float = 0.2,
    ) -> Dict[str, Any]:
        params: Dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
        }
        if tools:
            params["tools"] = tools
            if tool_choice:
                params["tool_choice"] = tool_choice
        chat = self.client.chat.completions.create(**params)
        choice = chat.choices[0]
        message = choice.message
        content = message.content or ""
        tool_calls = []
        if message.tool_calls:
            for call in message.tool_calls:
                tool_calls.append(
                    {
                        "id": call.id,
                        "name": call.function.name,
                        "arguments": call.function.arguments,
                    }
                )
        return {"content": content, "tool_calls": tool_calls or None}