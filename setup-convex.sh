#!/bin/bash

# Hui Hui Manaʻo - Convex Setup Script
# Run this script in an interactive terminal to configure Convex

echo "🌺 Setting up Hui Hui Manaʻo with Convex..."
echo ""

# Check if we're in the right directory
if [ ! -f "convex.json" ]; then
    echo "❌ Error: convex.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Convex CLI is available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found. Please install Node.js first."
    exit 1
fi

echo "📋 Current project structure:"
echo "   ✅ convex.json found"
echo "   ✅ convex/ directory with schema and functions"
echo "   ✅ Authentication bypass for development"
echo ""

# Check if already configured
if grep -q "CONVEX_DEPLOYMENT=" .env.local && [ -s .env.local ]; then
    echo "⚠️  Convex appears to already be configured in .env.local"
    echo "   Current CONVEX_DEPLOYMENT: $(grep CONVEX_DEPLOYMENT .env.local)"
    echo "   Current VITE_CONVEX_URL: $(grep VITE_CONVEX_URL .env.local)"
    echo ""
    read -p "Do you want to reconfigure? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "👍 Keeping existing configuration."
        exit 0
    fi
fi

echo "🚀 Starting Convex configuration..."
echo "   When prompted:"
echo "   - Project name: huihui-mana-o"
echo "   - Choose your team or create a new one"
echo "   - Deployment type: cloud (recommended)"
echo ""

# Run Convex configuration
npx convex dev --configure new

# Check if configuration was successful
if grep -q "CONVEX_DEPLOYMENT=" .env.local && grep -q "VITE_CONVEX_URL=" .env.local; then
    echo ""
    echo "✅ Convex configuration successful!"
    echo ""
    echo "📊 Configuration details:"
    echo "   CONVEX_DEPLOYMENT: $(grep CONVEX_DEPLOYMENT .env.local | cut -d'=' -f2)"
    echo "   VITE_CONVEX_URL: $(grep VITE_CONVEX_URL .env.local | cut -d'=' -f2)"
    echo ""
    echo "🎯 Next steps:"
    echo "   1. Run 'npm run dev' to start both frontend and backend"
    echo "   2. Visit http://localhost:5173 to see the app"
    echo "   3. Test thought submission and Ahupuaʻa zone classification"
    echo "   4. Check real-time updates in the inbox"
    echo ""
    echo "🔮 Future enhancements:"
    echo "   - Set up Clerk authentication (see CONVEX_SETUP.md)"
    echo "   - Integrate real AI with OpenAI/Claude"
    echo "   - Deploy to production"
    echo ""
    echo "📚 Documentation:"
    echo "   - Full setup guide: CONVEX_SETUP.md"
    echo "   - Project overview: hui-hui-overview.md"
    echo "   - Progress tracking: memory-bank/progress.md"
else
    echo ""
    echo "❌ Configuration may have failed. Please check:"
    echo "   1. Run the script in an interactive terminal"
    echo "   2. Ensure you have Convex account access"
    echo "   3. Check .env.local for configuration values"
    echo ""
    echo "💡 Manual setup: npx convex dev --configure new"
fi