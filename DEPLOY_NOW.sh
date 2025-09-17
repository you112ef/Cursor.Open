#!/bin/bash

# 🚀 Agenticseek Immediate Vercel Deployment
# Run this script to deploy your project to Vercel RIGHT NOW!

set -e

echo "🎯 AGENTICSEEK VERCEL DEPLOYMENT - IMMEDIATE DEPLOYMENT"
echo "=================================================="
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

# Step 1: Quick Setup
print_step "Setting up Next.js configuration..."
cp package-nextjs.json package.json
print_success "Next.js configuration applied"

# Step 2: Install dependencies
print_step "Installing dependencies..."
npm install --silent
print_success "Dependencies installed"

# Step 3: Check Vercel CLI
print_step "Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    print_warning "Installing Vercel CLI..."
    npm install -g vercel@latest --silent
fi
print_success "Vercel CLI ready"

# Step 4: Build application
print_step "Building application..."
npm run build
print_success "Application built successfully"

# Step 5: Deploy to Vercel
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
print_step "Deploying to production..."
vercel --prod --yes

echo ""
print_success "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo ""
echo "📋 Next Steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Configure your AI provider API keys"
echo "3. Test all functionality"
echo "4. Set up monitoring and analytics"
echo ""
echo "🔗 Your application is now live on Vercel!"
echo ""

# Get deployment URL
deployment_url=$(vercel ls | grep -E "agenticseek|vite-template" | head -1 | awk '{print $2}' 2>/dev/null || echo "Check Vercel dashboard")
if [ ! -z "$deployment_url" ] && [ "$deployment_url" != "Check Vercel dashboard" ]; then
    echo "🌐 Deployment URL: https://$deployment_url"
else
    echo "🌐 Check your Vercel dashboard for the deployment URL"
fi

echo ""
print_success "Agenticseek is now running on Vercel! 🚀"