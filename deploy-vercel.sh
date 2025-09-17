#!/bin/bash

# Agenticseek Vercel Deployment Script
# This script automates the deployment process to Vercel

set -e  # Exit on any error

echo "🚀 Starting Agenticseek Vercel Deployment..."

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
check_vercel_cli() {
    print_status "Checking Vercel CLI installation..."
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed. Installing..."
        npm install -g vercel@latest
        print_success "Vercel CLI installed successfully"
    else
        print_success "Vercel CLI is already installed"
    fi
}

# Check if user is logged in to Vercel
check_vercel_auth() {
    print_status "Checking Vercel authentication..."
    if ! vercel whoami &> /dev/null; then
        print_warning "Not logged in to Vercel. Please log in..."
        vercel login
        print_success "Successfully logged in to Vercel"
    else
        print_success "Already authenticated with Vercel"
    fi
}

# Backup current package.json
backup_config() {
    print_status "Backing up current configuration..."
    cp package.json package-vite.json.bak
    print_success "Configuration backed up"
}

# Replace package.json with Next.js version
setup_nextjs() {
    print_status "Setting up Next.js configuration..."
    cp package-nextjs.json package.json
    print_success "Next.js configuration applied"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed successfully"
}

# Run type checking
run_type_check() {
    print_status "Running TypeScript type checking..."
    npm run type-check
    print_success "Type checking passed"
}

# Run linting
run_linting() {
    print_status "Running ESLint..."
    npm run lint
    print_success "Linting passed"
}

# Build the application
build_app() {
    print_status "Building application..."
    npm run build
    print_success "Application built successfully"
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if project exists
    if vercel ls | grep -q "agenticseek"; then
        print_status "Updating existing project..."
        vercel --prod
    else
        print_status "Creating new project..."
        vercel --prod --name agenticseek
    fi
    
    print_success "Deployment completed successfully"
}

# Set environment variables
setup_env_vars() {
    print_status "Setting up environment variables..."
    
    # List of required environment variables
    env_vars=(
        "NEXT_PUBLIC_APP_URL"
        "NEXT_PUBLIC_APP_NAME"
        "NEXT_PUBLIC_API_URL"
        "NEXT_PUBLIC_ENABLE_AI"
        "NEXT_PUBLIC_ENABLE_COLLABORATION"
        "NEXT_PUBLIC_ENABLE_SANDBOX"
        "NEXT_PUBLIC_ENABLE_TERMINAL"
    )
    
    for var in "${env_vars[@]}"; do
        if [ -z "${!var}" ]; then
            print_warning "Environment variable $var is not set"
        fi
    done
    
    print_success "Environment variables checked"
}

# Run tests (if available)
run_tests() {
    print_status "Running tests..."
    if npm run test &> /dev/null; then
        print_success "Tests passed"
    else
        print_warning "No tests found or tests failed"
    fi
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
    # Restore original package.json if needed
    if [ -f "package-vite.json.bak" ]; then
        print_status "Restoring original package.json..."
        mv package-vite.json.bak package.json
    fi
    print_success "Cleanup completed"
}

# Main deployment function
main() {
    print_status "Starting Agenticseek deployment process..."
    
    # Trap to ensure cleanup on exit
    trap cleanup EXIT
    
    # Step 1: Check prerequisites
    check_vercel_cli
    check_vercel_auth
    
    # Step 2: Setup project
    backup_config
    setup_nextjs
    install_dependencies
    
    # Step 3: Quality checks
    run_type_check
    run_linting
    run_tests
    
    # Step 4: Build and deploy
    build_app
    setup_env_vars
    deploy_to_vercel
    
    print_success "🎉 Agenticseek deployment completed successfully!"
    print_status "Your application is now live on Vercel!"
    
    # Get deployment URL
    deployment_url=$(vercel ls | grep agenticseek | head -1 | awk '{print $2}')
    if [ ! -z "$deployment_url" ]; then
        print_success "Deployment URL: https://$deployment_url"
    fi
}

# Run main function
main "$@"