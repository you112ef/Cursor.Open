from __future__ import annotations

from fastapi.testclient import TestClient

from assistant.server import app


def test_sse():
    client = TestClient(app)
    r = client.post("/chat/stream", json={"session_id": "t1", "message": "hello"}, headers={"X-API-Key": "dev"})
    # When API key auth not configured, dependency is a no-op -> should work
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("text/event-stream")


def test_ws():
    client = TestClient(app)
    with client.websocket_connect("/ws") as ws:
        ws.send_text("hello")
        data = ws.receive_text()
        assert isinstance(data, str)