#!/bin/bash

# Cursor Agents - Cross-platform Build and Distribution Script

set -e

echo "🚀 Starting Cursor Agents build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ and try again.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
if [ "$MAJOR_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ is required. Current version: v$NODE_VERSION${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: v$NODE_VERSION${NC}"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Run type check
echo -e "${BLUE}🔍 Running type check...${NC}"
npm run type-check
echo -e "${GREEN}✅ Type check passed${NC}"

# Build the application
echo -e "${BLUE}🏗️  Building application...${NC}"
npm run build:main
npm run build:renderer
echo -e "${GREEN}✅ Build completed${NC}"

# Package for distribution
echo -e "${BLUE}📦 Packaging for distribution...${NC}"

# Function to build for specific platform
build_platform() {
    local platform=$1
    local arch=$2
    echo -e "${YELLOW}Building for $platform-$arch...${NC}"
    
    case $platform in
        "win")
            npm run dist:win
            ;;
        "mac")
            npm run dist:mac
            ;;
        "linux")
            npm run dist:linux
            ;;
        "all")
            npm run dist
            ;;
        *)
            echo -e "${RED}Unknown platform: $platform${NC}"
            return 1
            ;;
    esac
}

# Check command line arguments
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}No platform specified, building for current platform...${NC}"
    # Detect current platform
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        build_platform "linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        build_platform "mac"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        build_platform "win"
    else
        echo -e "${YELLOW}Unknown OS, building for all platforms...${NC}"
        build_platform "all"
    fi
else
    case $1 in
        "--all")
            build_platform "all"
            ;;
        "--win")
            build_platform "win"
            ;;
        "--mac")
            build_platform "mac"
            ;;
        "--linux")
            build_platform "linux"
            ;;
        "--help")
            echo "Usage: $0 [--all|--win|--mac|--linux|--help]"
            echo "  --all     Build for all platforms"
            echo "  --win     Build for Windows"
            echo "  --mac     Build for macOS"
            echo "  --linux   Build for Linux"
            echo "  --help    Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
fi

echo -e "${GREEN}🎉 Build process completed successfully!${NC}"
echo -e "${BLUE}📁 Check the 'release' directory for the built packages.${NC}"

# List generated files
if [ -d "release" ]; then
    echo -e "${YELLOW}Generated files:${NC}"
    ls -la release/
fi