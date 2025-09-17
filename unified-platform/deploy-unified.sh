#!/bin/bash

# 🚀 Unified Platform Deployment Script
# Deploy the complete unified platform to Vercel

set -e

echo "🎯 UNIFIED PLATFORM DEPLOYMENT"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}🔄 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Install dependencies
print_step "Installing dependencies..."
npm install --silent
print_success "Dependencies installed"

# Step 2: Check Vercel CLI
print_step "Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    print_warning "Installing Vercel CLI..."
    npm install -g vercel@latest --silent
fi
print_success "Vercel CLI ready"

# Step 3: Build application
print_step "Building unified platform..."
npm run build
print_success "Application built successfully"

# Step 4: Deploy to Vercel
print_step "Deploying to Vercel..."
echo ""
echo "🚀 Starting deployment process..."
echo ""

# Check if logged in
if ! vercel whoami &> /dev/null; then
    print_warning "Please log in to Vercel..."
    vercel login
fi

# Deploy
print_step "Deploying unified platform to production..."
vercel --prod --yes

echo ""
print_success "🎉 UNIFIED PLATFORM DEPLOYMENT COMPLETED!"
echo ""
echo "📋 What's Included:"
echo "✅ Agenticseek - AI-powered development"
echo "✅ Dish Platform - Advanced IDE and tools"
echo "✅ AI Assistant - Intelligent coding assistant"
echo "✅ VibeCode Clone - 100% authentic replica"
echo "✅ Agent CLI Terminal - AI-powered commands"
echo "✅ Real-time Collaboration - Team features"
echo "✅ Secure Sandbox - Code execution"
echo "✅ Auto Deployment - One-click deployment"
echo ""
echo "🔗 Your unified platform is now live on Vercel!"
echo ""

# Get deployment URL
deployment_url=$(vercel ls | grep -E "unified-platform|vite-template" | head -1 | awk '{print $2}' 2>/dev/null || echo "Check Vercel dashboard")
if [ ! -z "$deployment_url" ] && [ "$deployment_url" != "Check Vercel dashboard" ]; then
    echo "🌐 Deployment URL: https://$deployment_url"
else
    echo "🌐 Check your Vercel dashboard for the deployment URL"
fi

echo ""
print_success "Unified Platform is now running on Vercel! 🚀"
echo ""
echo "🎯 Available Features:"
echo "  • /dashboard - Main dashboard"
echo "  • /ide - Advanced IDE"
echo "  • /agent - Agent CLI Terminal"
echo "  • /collaboration - Real-time collaboration"
echo "  • /builder - AI App Builder"
echo "  • /vibe - VibeCode Clone"
echo "  • /sandbox - Secure code execution"
echo ""
echo "🎊 Everything is integrated and ready to use!"