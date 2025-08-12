from __future__ import annotations

import os
from fastapi.testclient import TestClient

os.environ.setdefault("PYTHONPATH", "src")

from assistant.server import app  # noqa: E402


def test_health():
    client = TestClient(app)
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_chat():
    client = TestClient(app)
    r = client.post("/chat", json={"session_id": "t1", "message": "Hello"})
    assert r.status_code == 200
    data = r.json()
    assert "content" in data
    assert isinstance(data["content"], str)