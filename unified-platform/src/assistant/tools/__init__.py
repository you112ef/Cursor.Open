from __future__ import annotations

import json
from typing import Any, Callable, Dict, List, Tuple

from .math_tools import add_numbers, MATH_ADD_SCHEMA
from .time_tools import get_current_time, TIME_NOW_SCHEMA
from .web_fetch import fetch_url_text, WEB_FETCH_SCHEMA


ToolFunc = Callable[[Dict[str, Any]], Any]


def get_tools() -> Dict[str, Tuple[ToolFunc, Dict[str, Any]]]:
    return {
        "add_numbers": (add_numbers, MATH_ADD_SCHEMA),
        "get_current_time": (get_current_time, TIME_NOW_SCHEMA),
        "fetch_url_text": (fetch_url_text, WEB_FETCH_SCHEMA),
    }


def export_tool_schemas_for_openai() -> List[Dict[str, Any]]:
    tools = []
    for name, (_func, schema) in get_tools().items():
        tools.append(
            {
                "type": "function",
                "function": {
                    "name": name,
                    "description": schema.get("description", ""),
                    "parameters": schema.get("parameters", {"type": "object", "properties": {}}),
                },
            }
        )
    return tools


def call_tool(name: str, arguments_json: str) -> Any:
    tools = get_tools()
    if name not in tools:
        raise ValueError(f"Unknown tool: {name}")
    func, _schema = tools[name]
    try:
        args = json.loads(arguments_json) if arguments_json else {}
    except Exception:
        args = {}
    return func(args)