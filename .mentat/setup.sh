#!/bin/bash

# Install dependencies for the main Vite/React project (root)
echo "Installing root project dependencies..."
npm install

# Install dependencies for ai-agent-platform (Next.js)
echo "Installing ai-agent-platform dependencies..."
cd ai-agent-platform
npm install
cd ..

# Install Python dependencies for ai_assistant
echo "Installing Python dependencies for ai_assistant..."
cd ai_assistant
pip3 install -r requirements.txt
pip3 install black ruff mypy pytest
cd ..

# Install dependencies for cursor-agents (Electron)
echo "Installing cursor-agents dependencies..."
cd cursor-agents
npm install
cd ..

echo "Setup completed successfully!"
