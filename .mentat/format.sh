#!/bin/bash

# Format and fix code for all projects in the monorepo

echo "🔧 Formatting code across all projects..."

# Root project - ESLint with --fix (only auto-fixable rules)
echo "🔍 Formatting root project..."
npx eslint . --fix --ext .ts,.tsx --quiet || true

# AI Agent Platform - Next.js ESLint (run from project directory)
echo "🔍 Formatting ai-agent-platform..."
cd ai-agent-platform
npx eslint . --fix --quiet || true
cd ..

# Cursor Agents - ESLint with --fix (only auto-fixable rules)
echo "🔍 Formatting cursor-agents..."
cd cursor-agents
npx eslint src --ext .ts,.tsx --fix --quiet || true
cd ..

# AI Assistant - Python formatting with black and ruff (using python -m)
echo "🐍 Formatting Python AI Assistant..."
cd ai_assistant
if python3 -c "import black" 2>/dev/null; then
    python3 -m black . || true
else
    echo "⚠️  black not installed, skipping Python formatting"
fi
if python3 -c "import ruff" 2>/dev/null; then
    python3 -m ruff check . --fix || true
else
    echo "⚠️  ruff not installed, skipping Python linting"
fi
cd ..

echo "✅ Code formatting completed!"
