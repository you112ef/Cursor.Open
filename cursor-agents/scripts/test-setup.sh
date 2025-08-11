#!/bin/bash

# Cursor Agents - Initial Setup and Test Script

echo "🚀 Starting Cursor Agents setup and test..."

# Check Node.js version
echo "📋 Checking prerequisites..."
NODE_VERSION=$(node -v 2>/dev/null || echo "not installed")
if [[ "$NODE_VERSION" == "not installed" ]]; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the cursor-agents directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
if command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies."
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your API keys:"
    echo "   - OPENAI_API_KEY"
    echo "   - ANTHROPIC_API_KEY"
fi

# Type check
echo "🔍 Running TypeScript type check..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "⚠️  TypeScript type check found issues, but continuing..."
fi

# Build the application
echo "🏗️  Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed."
    exit 1
fi

echo "✅ Build completed successfully"

# Create test project directory
echo "📁 Setting up test project..."
mkdir -p test-project
cd test-project

# Create sample files for testing
cat > sample.js << 'EOF'
// Sample JavaScript file for testing Cursor Agents
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

function isPrime(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}

console.log("Fibonacci of 10:", fibonacci(10));
console.log("Is 17 prime?", isPrime(17));
EOF

cat > sample.py << 'EOF'
# Sample Python file for testing Cursor Agents
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

def is_palindrome(s):
    s = s.lower().replace(" ", "")
    return s == s[::-1]

def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

if __name__ == "__main__":
    print("Factorial of 5:", factorial(5))
    print("Is 'racecar' a palindrome?", is_palindrome("racecar"))
    print("Sorted array:", quicksort([3, 6, 8, 10, 1, 2, 1]))
EOF

cat > README.md << 'EOF'
# Test Project for Cursor Agents

This is a test project to demonstrate the capabilities of Cursor Agents.

## Files

- `sample.js` - JavaScript examples with algorithms
- `sample.py` - Python examples with algorithms  
- `package.json` - Node.js project configuration

## Testing Features

1. **File Explorer**: Navigate through project files
2. **Code Editor**: Open and edit files with syntax highlighting
3. **AI Assistant**: Ask questions about the code
4. **Terminal**: Run commands and execute scripts
5. **Search**: Find files and content within the project

## Sample AI Prompts to Try

- "Explain how the fibonacci function works"
- "Optimize the quicksort algorithm"
- "Add error handling to the factorial function"  
- "Convert the JavaScript code to TypeScript"
- "Find potential bugs in this code"
- "Add unit tests for these functions"
EOF

cat > package.json << 'EOF'
{
  "name": "cursor-agents-test-project",
  "version": "1.0.0",
  "description": "Test project for Cursor Agents",
  "main": "sample.js",
  "scripts": {
    "start": "node sample.js",
    "test": "python3 sample.py"
  },
  "keywords": ["test", "cursor-agents", "demo"],
  "author": "Cursor Agents Team",
  "license": "MIT"
}
EOF

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "🚀 To start Cursor Agents:"
echo "   npm run start"
echo ""
echo "🧪 To run in development mode:"
echo "   npm run dev"
echo ""
echo "📁 Test project created at: ./test-project"
echo ""
echo "💡 Next steps:"
echo "   1. Edit .env file with your API keys"
echo "   2. Start the application"
echo "   3. Open the test-project folder"
echo "   4. Try the AI assistant features"
echo ""
echo "✨ Happy coding with Cursor Agents!"