# Convex Setup Guide for Hui Hui Manaʻo

## Quick Setup Commands

### 1. Initialize Convex Deployment
```bash
# In the project directory
cd /Users/soderstrom/Documents/huihui-mana-o

# Create new deployment (interactive)
npx convex dev --configure new
# When prompted:
# - Project name: huihui-mana-o
# - Team: [choose your team]
# - Deployment type: cloud (recommended)
```

### 2. Environment Variables Setup
After running `npx convex dev`, your `.env.local` will be populated with:
```env
CONVEX_DEPLOYMENT=your-deployment-name
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

### 3. Start Development
```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run dev:frontend  # Vite frontend
npm run dev:backend   # Convex backend
```

## Current Schema Features

Our schema includes:
- ✅ **thoughts** table with Ahupuaʻa zone classification
- ✅ **augmentedThoughts** with AI enhancements  
- ✅ **entities** for entity relationship graph
- ✅ **relationships** between entities
- ✅ **hui** (groups) for organizing thoughts
- ✅ **agentPatterns** for AI learning
- ✅ **intakeLogs** for analytics
- ✅ **authTables** for Clerk integration

## Authentication Setup (Future)

### Clerk Integration Steps:
1. **Create Clerk Account**: Sign up at clerk.com
2. **JWT Template**: Create "convex" JWT template in Clerk dashboard
3. **Environment Variables**:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```
4. **Update React Components**: Replace `ConvexProvider` with `ConvexProviderWithClerk`

## Development Authentication Bypass

Currently implemented for local development:
- Auto-creates "Dev User" when no authentication present
- Allows testing without Clerk setup
- Can be removed when Clerk is configured

## Project Structure
```
convex/
├── schema.ts           # Database schema with Ahupuaʻa zones
├── intake.ts           # Thought submission and retrieval
├── augmentation.ts     # AI enhancement processing
└── _generated/         # Auto-generated types (after npx convex dev)

src/
├── App.tsx            # Main app with Convex integration
├── DemoApp.tsx        # Standalone demo mode
├── components/intake/ # Thought capture components
└── lib/demoData.ts   # Demo data for testing
```

## Commands Reference

```bash
# Development
npx convex dev              # Start development with auto-config
npx convex dev --once       # Run once without watching
npx convex codegen          # Generate types only

# Environment Variables
npx convex env list         # List all environment variables
npx convex env set KEY val  # Set environment variable
npx convex env get KEY      # Get environment variable

# Deployment
npx convex deploy           # Deploy to production
npx convex dashboard        # Open web dashboard
npx convex logs             # View deployment logs

# Data Management
npx convex data             # List tables and data
npx convex export           # Export data to ZIP
npx convex import file.zip  # Import data from file
```

## Troubleshooting

### "Cannot prompt for input in non-interactive terminals"
- Run commands in a regular terminal, not through automated scripts
- Use `--once` flag for CI environments
- Set environment variables manually if needed

### "No CONVEX_DEPLOYMENT set"
- Run `npx convex dev` first to configure the project
- Check that `.env.local` contains the deployment variables

### TypeScript Errors
- Run `npx convex codegen` to regenerate types
- Ensure `convex/_generated/` is not in `.gitignore`

## Next Steps After Convex Setup

1. ✅ Test thought submission and retrieval
2. ✅ Verify Ahupuaʻa zone classification is working
3. ✅ Check real-time updates in UI
4. 🔄 Integrate OpenAI for real AI augmentation
5. 🔄 Add Clerk authentication
6. 🔄 Deploy to production

## Status: Ready for Convex Configuration

All code is prepared for Convex integration. Run the setup commands above to activate the backend and switch from demo mode to full functionality.