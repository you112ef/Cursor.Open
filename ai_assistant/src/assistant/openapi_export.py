from __future__ import annotations

import json
from .server import app


def export_openapi(path: str = "openapi.json") -> None:
    spec = app.openapi()
    with open(path, "w", encoding="utf-8") as f:
        json.dump(spec, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    export_openapi()