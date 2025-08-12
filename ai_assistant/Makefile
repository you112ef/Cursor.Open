PYTHONpath=src

.PHONY: install dev run api test lint fmt precommit docker-build docker-run

install:
	pip install -r requirements.txt

dev:
	pip install -r requirements.txt -r requirements-dev.txt

run:
	PYTHONPATH=src python3 -m assistant.cli chat

api:
	PYTHONPATH=src python3 -m assistant.server

lint:
	ruff check . && black --check . && mypy src || true

fmt:
	black . && ruff check . --fix

test:
	PYTHONPATH=src pytest -q

precommit:
	pre-commit install

docker-build:
	docker build -t open-assistant-safe:latest .

docker-run:
	docker run -p 8000:8000 --env-file .env open-assistant-safe:latest