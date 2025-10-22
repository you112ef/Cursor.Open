#!/bin/bash

# Install dependencies for all projects in the monorepo

echo "🚀 Setting up Cursor.Open monorepo..."

# Root project (Vite/React)
echo "📦 Installing root project dependencies..."
npm install

# AI Agent Platform (Next.js)
echo "📦 Installing ai-agent-platform dependencies..."
cd ai-agent-platform
npm install
cd ..

# Cursor Agents (Electron)
echo "📦 Installing cursor-agents dependencies..."
cd cursor-agents
npm install
cd ..

# AI Assistant (Python)
echo "🐍 Setting up Python AI Assistant..."
cd ai_assistant
pip3 install -r requirements.txt -r requirements-dev.txt
cd ..

echo "✅ All dependencies installed successfully!"
echo "🎯 Ready to start development!"
