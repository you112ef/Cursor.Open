#!/bin/bash

# Format and fix root project (Vite/React/TypeScript)
echo "Formatting root project..."
npx eslint . --fix --ext .ts,.tsx,.js,.jsx || true

# Format ai-agent-platform (Next.js)
echo "Formatting ai-agent-platform..."
cd ai-agent-platform
npx eslint . --fix || true
cd ..

# Format Python code in ai_assistant
echo "Formatting Python code in ai_assistant..."
cd ai_assistant
black . || true
ruff check . --fix || true
cd ..

# Format cursor-agents (Electron)
echo "Formatting cursor-agents..."
cd cursor-agents
npx eslint src --ext .ts,.tsx --fix || true
cd ..

echo "Formatting completed!"
