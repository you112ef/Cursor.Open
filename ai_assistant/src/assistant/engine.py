from __future__ import annotations

import asyncio
import json
from typing import Any, Dict, List

from .config import load_settings
from .memory import ConversationMemory
from .tools import call_tool, export_tool_schemas_for_openai


class AssistantEngine:
    def __init__(self, session_id: str = "default") -> None:
        self.settings = load_settings()
        self.memory = ConversationMemory(self.settings.assistant_db_path)
        self.session_id = session_id
        self.provider = self._init_provider()

    def _init_provider(self):
        # Prefer OpenAI if configured
        if self.settings.openai_api_key:
            from .model_providers.openai_provider import OpenAIProvider

            return OpenAIProvider(self.settings.openai_api_key, self.settings.openai_model)
        # Then Ollama if configured
        if self.settings.ollama_host:
            from .model_providers.ollama_provider import OllamaProvider

            return OllamaProvider(self.settings.ollama_host, self.settings.ollama_model)
        # Fallback to local provider that runs without external deps
        from .model_providers.local_provider import LocalEchoProvider

        return LocalEchoProvider()

    async def chat_once(self, user_message: str) -> str:
        self.memory.append(self.session_id, "user", user_message)
        messages = self.memory.fetch(self.session_id)

        tools = export_tool_schemas_for_openai()
        response = await self.provider.generate(messages=messages, tools=tools, tool_choice="auto")

        content = response.get("content") or ""
        tool_calls = response.get("tool_calls")

        final_content = content
        if tool_calls:
            tool_messages: List[Dict[str, Any]] = []
            for call in tool_calls:
                name = call.get("name")
                args_json = call.get("arguments") or "{}"
                try:
                    result = call_tool(name, args_json)
                    result_str = json.dumps(result)
                except Exception as exc:
                    result_str = json.dumps({"error": str(exc)})
                tool_messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": call.get("id", name),
                        "name": name,
                        "content": result_str,
                    }
                )
            # Append tool messages and ask model to finalize
            followup_messages = messages + ([{"role": "assistant", "content": content}] if content else []) + tool_messages
            follow_resp = await self.provider.generate(messages=followup_messages, tools=None)
            final_content = follow_resp.get("content") or content or ""

        self.memory.append(self.session_id, "assistant", final_content)
        return final_content