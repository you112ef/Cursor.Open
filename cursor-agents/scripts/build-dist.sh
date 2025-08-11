#!/bin/bash

# Build and Distribution Script for Cursor Agents
# Author: yousef shtiwe

echo "🚀 Starting Cursor Agents build and distribution process..."

# Check prerequisites
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the application
echo "🏗️ Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Package for distribution
echo "📦 Creating distribution packages..."

# Detect OS and build accordingly
OS="$(uname -s)"
case "${OS}" in
    Linux*)     
        echo "🐧 Building for Linux..."
        npm run dist:linux
        ;;
    Darwin*)    
        echo "🍎 Building for macOS..."
        npm run dist:mac
        ;;
    CYGWIN*|MINGW32*|MSYS*|MINGW*)
        echo "🪟 Building for Windows..."
        npm run dist:win
        ;;
    *)          
        echo "❓ Unknown OS: ${OS}. Building for all platforms..."
        npm run dist
        ;;
esac

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Distribution packages created successfully!"
    echo "📁 Check the 'release' folder for your packages."
    echo ""
    echo "📦 Available packages:"
    ls -la release/ 2>/dev/null || echo "No packages found in release folder"
    echo ""
    echo "✨ Cursor Agents is ready for distribution!"
else
    echo "❌ Packaging failed!"
    exit 1
fi