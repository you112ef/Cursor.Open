from __future__ import annotations

from typing import Any, Dict

from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError


WEB_FETCH_SCHEMA: Dict[str, Any] = {
    "description": "Fetch text content from a public HTTP(S) URL. Limits: 100KB, 10s timeout.",
    "parameters": {
        "type": "object",
        "properties": {
            "url": {
                "type": "string",
                "description": "HTTP or HTTPS URL to fetch",
            }
        },
        "required": ["url"],
        "additionalProperties": False,
    },
}


def fetch_url_text(arguments: Dict[str, Any]) -> Dict[str, Any]:
    url = str(arguments.get("url", ""))
    if not (url.startswith("http://") or url.startswith("https://")):
        raise ValueError("Only http(s) URLs are allowed")
    req = Request(url, headers={"User-Agent": "OpenAssistant/1.0"})
    try:
        with urlopen(req, timeout=10) as resp:
            charset = resp.headers.get_content_charset() or "utf-8"
            data = resp.read(100_000 + 1)
            if len(data) > 100_000:
                data = data[:100_000]
            text = data.decode(charset, errors="replace")
    except HTTPError as e:
        raise ValueError(f"HTTP error: {e.code}")
    except URLError as e:
        raise ValueError(f"Network error: {e.reason}")
    return {"url": url, "text": text}