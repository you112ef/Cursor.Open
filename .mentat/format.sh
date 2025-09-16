#!/bin/bash

# Format and fix code for all projects in the monorepo

echo "🔧 Formatting code across all projects..."

# Root project - ESLint with --fix
echo "🔍 Formatting root project..."
npx eslint . --fix --ext .ts,.tsx || true

# AI Agent Platform - Next.js ESLint
echo "🔍 Formatting ai-agent-platform..."
cd ai-agent-platform
npx eslint . --fix || true
cd ..

# Cursor Agents - ESLint with --fix
echo "🔍 Formatting cursor-agents..."
cd cursor-agents
npx eslint src --ext .ts,.tsx --fix || true
cd ..

# AI Assistant - Python formatting with black and ruff
echo "🐍 Formatting Python AI Assistant..."
cd ai_assistant
black . || true
ruff check . --fix || true
cd ..

echo "✅ Code formatting completed!"
