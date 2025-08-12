from __future__ import annotations

from typing import Any, Dict


MATH_ADD_SCHEMA: Dict[str, Any] = {
    "description": "Add two numbers and return the sum.",
    "parameters": {
        "type": "object",
        "properties": {
            "a": {"type": "number", "description": "First number"},
            "b": {"type": "number", "description": "Second number"},
        },
        "required": ["a", "b"],
        "additionalProperties": False,
    },
}


def add_numbers(arguments: Dict[str, Any]) -> Dict[str, Any]:
    a = float(arguments.get("a"))
    b = float(arguments.get("b"))
    return {"sum": a + b}