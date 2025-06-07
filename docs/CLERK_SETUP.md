# Clerk Authentication Setup Guide

**Following [Clerk's Official React (Vite) Quickstart](https://clerk.com/docs/quickstarts/react)**

## Quick Setup Checklist

- [ ] Create Clerk application with Google OAuth
- [ ] Configure JWT template for Convex
- [ ] Set environment variables in `.env.local`
- [ ] Update React app architecture
- [ ] Test authentication flow

## 1. Create Clerk Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Choose **"Google"** as your OAuth provider
4. Note your Application ID from the dashboard

## 2. Configure JWT Template for Convex

**Critical**: This step is required for Convex integration.

1. In Clerk Dashboard, go to **JWT Templates**
2. Create a new template named **"convex"** (exact name required)
3. **Claims**: Leave default or add custom claims as needed
4. **Token lifetime**: Use default (1 hour)

## 3. Environment Variables

**Correct variable names** (learned from integration):

```env
# .env.local - Add these exact variable names

# From Clerk Dashboard > API Keys
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk issuer URL for Convex JWT validation
# Format: https://[your-app-name].clerk.accounts.dev
CLERK_ISSUER_URL=https://your-app.clerk.accounts.dev

# Existing Convex variables
VITE_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=your-deployment-name
```

**Common Mistakes to Avoid:**
- ❌ `VITE_CLERK_FRONTEND_API_URL` (old/incorrect)
- ✅ `CLERK_ISSUER_URL` (correct)

## 4. React App Integration

### Install Dependencies
```bash
npm install @clerk/clerk-react
```

### Update main.tsx (Vite Pattern)
```typescript
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </React.StrictMode>
);
```

### Add Authentication UI Components
```typescript
// In your App.tsx or main component
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";

function App() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Hui Hui Manaʻo</h1>
          <SignInButton mode="modal">
            <button className="bg-blue-500 text-white px-6 py-2 rounded">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Hui Hui Manaʻo</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      {/* Your main app content */}
    </div>
  );
}
```

## 5. Convex Integration Requirements

### User ID Handling
**Important**: Clerk returns string user IDs, not Convex table IDs.

```typescript
// ✅ Correct: Use v.string() for user IDs
export const createEntity = mutation({
  args: {
    userId: v.string(), // Not v.id("users")
    name: v.string(),
    // ...
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx); // Returns string
    // ...
  },
});
```

### Authentication in Convex Functions
```typescript
import { getAuthUserId } from "@convex-dev/auth/server";

export const myQuery = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    // userId is a string like "user_2yAeaqugU9TCatkH79eUK9Cl7l2"
    return await ctx.db.query("myTable")
      .filter(q => q.eq(q.field("userId"), userId))
      .collect();
  },
});
```

## 6. Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable **Google+ API** and **Google Identity API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
5. **Application type**: Web application
6. **Authorized redirect URIs**: Add Clerk's redirect URLs:
   ```
   https://your-app.clerk.accounts.dev/v1/oauth_callback
   ```
7. Copy **Client ID** and **Client Secret** to Clerk Dashboard

## 7. Common CLI Commands

### Clerk CLI (Optional)
```bash
# Install Clerk CLI
npm install -g @clerk/clerk-cli

# Login to Clerk
clerk login

# List applications
clerk applications list

# Get environment variables
clerk env
```

### Development Workflow
```bash
# Start development with auth
npm run dev

# Check environment variables
echo $VITE_CLERK_PUBLISHABLE_KEY
echo $CLERK_SECRET_KEY

# Test Convex with auth
npx convex dev
```

## 8. Testing Authentication Flow

1. **Start development**: `npm run dev`
2. **Visit app**: Should show sign-in screen for unauthenticated users
3. **Sign in with Google**: Test the OAuth flow
4. **Check Convex data**: User should be created automatically
5. **Test user-specific data**: Create entities, submit thoughts

## 9. Troubleshooting

### Common Errors and Solutions

**"User ID validation error"**
```
ArgumentValidationError: Value does not match validator.
Path: .userId
Value: "user_2yAe..."
Validator: v.id("users")
```
**Solution**: Use `v.string()` instead of `v.id("users")` for user IDs

**"Authentication required"**
- Check if user is signed in: `useUser()` hook
- Verify environment variables are loaded
- Restart development server after adding `.env.local`

**"CLERK_ISSUER_URL not found"**
```env
# ❌ Wrong variable name
VITE_CLERK_FRONTEND_API_URL=https://...

# ✅ Correct variable name  
CLERK_ISSUER_URL=https://your-app.clerk.accounts.dev
```

**"Google OAuth not working"**
- Check redirect URIs in Google Console match Clerk's requirements
- Verify Google OAuth is enabled in Clerk Dashboard
- Make sure Google+ API is enabled in Google Cloud Console

**"Convex functions not authenticated"**
- Ensure you're using `ConvexProviderWithClerk`, not `ConvexProvider`
- Check JWT template is named exactly "convex"
- Verify `CLERK_ISSUER_URL` matches your Clerk app domain

### Development vs Production

**Development**:
- Use `pk_test_...` and `sk_test_...` keys
- OAuth redirect works with `localhost:5173`

**Production**:
- Switch to `pk_live_...` and `sk_live_...` keys
- Update Google OAuth redirect URLs to production domain
- Update `CLERK_ISSUER_URL` if using custom domain

## 10. User Experience Flow

1. **Unauthenticated**: Show sign-in modal with Google OAuth button
2. **First sign-in**: User created automatically in Convex database
3. **Authenticated**: Show main app with UserButton for sign-out
4. **Data isolation**: All user data automatically scoped by Clerk user ID
5. **Sign-out**: Return to sign-in screen, all local state cleared

## Status Checklist

- ✅ **Clerk React SDK**: Installed and configured
- ✅ **ConvexProviderWithClerk**: Integrated with useAuth hook
- ✅ **Environment Variables**: Correct naming and setup
- ✅ **User ID Handling**: String-based user IDs throughout system
- ✅ **Authentication Required**: All Convex functions require auth
- ✅ **UI Components**: Sign-in modal and UserButton added
- ✅ **Google OAuth**: Complete integration flow
- ✅ **Error Handling**: Comprehensive troubleshooting guide

This guide contains all practical knowledge gained from real integration experience. 