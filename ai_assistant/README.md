# Open Assistant (Safe Clone)

A safe, open-source assistant framework with:

- Chat engine with tool-calling
- Providers: OpenAI API (if key present), local Ollama, or a built-in local fallback
- FastAPI server and Typer CLI
- Memory (SQLite) and .env-based config
- Modular tools (math, time, web fetch)

## Quickstart

1. Create and activate a virtual environment (Python 3.10+), or use system Python.
2. Install dependencies (optional if you only use the local fallback provider):
   ```bash
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and set values. For OpenAI set `OPENAI_API_KEY`. For Ollama set `OLLAMA_HOST` and ensure the model is pulled.
4. Run the CLI:
   ```bash
   PYTHONPATH=src python3 -m assistant.cli --help
   PYTHONPATH=src python3 -m assistant.cli chat
   ```
5. Start the API server:
   ```bash
   PYTHONPATH=src python3 -m assistant.server
   ```

## Notes

- Without any provider config, the Local provider echoes your message and can request the time tool.
- This project does not replicate proprietary internals. It provides a similar interface using public APIs and local models only.
- Tools are constrained to safe operations.