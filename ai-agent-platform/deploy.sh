#!/bin/bash

# AI Agent Integration Platform Deployment Script

echo "🚀 Building AI Agent Integration Platform..."

# Build the application
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📦 Your application is ready for deployment!"
    echo ""
    echo "🌐 Deploy to Vercel:"
    echo "   npx vercel --prod"
    echo ""
    echo "🌐 Deploy to Netlify:"
    echo "   npx netlify deploy --prod --dir=.next"
    echo ""
    echo "🌐 Deploy to any static host:"
    echo "   Upload the .next folder to your hosting provider"
    echo ""
    echo "🎉 Happy coding!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi