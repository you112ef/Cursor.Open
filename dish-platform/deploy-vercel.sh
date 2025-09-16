#!/bin/bash

# Dish Platform - Vercel Deployment Script
# This script deploys the Dish Platform to Vercel

set -e

echo "🚀 Starting Dish Platform deployment to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged in to Vercel. Please log in:"
    vercel login
fi

print_status "Building frontend..."
cd frontend
npm run build

print_status "Deploying to Vercel..."
vercel --prod

print_success "Frontend deployed successfully!"

# Deploy backend separately if needed
print_status "Setting up backend environment..."
cd ../backend

# Create vercel.json for backend if it doesn't exist
if [ ! -f "vercel.json" ]; then
    cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/src/index.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "src/index.ts": {
      "maxDuration": 30
    }
  }
}
EOF
fi

print_status "Deploying backend..."
vercel --prod

print_success "Backend deployed successfully!"

# Set up environment variables
print_status "Setting up environment variables..."
print_warning "Please set the following environment variables in your Vercel dashboard:"
echo ""
echo "Frontend Environment Variables:"
echo "- NEXT_PUBLIC_API_URL"
echo "- NEXT_PUBLIC_WS_URL"
echo "- NEXT_PUBLIC_APP_NAME"
echo ""
echo "Backend Environment Variables:"
echo "- DATABASE_URL"
echo "- REDIS_URL"
echo "- JWT_SECRET"
echo "- OPENAI_API_KEY"
echo "- ANTHROPIC_API_KEY"
echo "- GOOGLE_API_KEY"
echo ""

print_success "🎉 Dish Platform deployment completed!"
print_status "Your application is now live on Vercel!"
print_status "Frontend: https://your-frontend-url.vercel.app"
print_status "Backend: https://your-backend-url.vercel.app"

echo ""
print_status "Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Configure your database (PostgreSQL)"
echo "3. Set up Redis for caching"
echo "4. Configure AI provider API keys"
echo "5. Test your deployment"

echo ""
print_success "Deployment script completed successfully! 🚀"