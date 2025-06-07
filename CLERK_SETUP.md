# Clerk Authentication Setup Guide

## 1. Create Clerk Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Choose "Google" as your OAuth provider
4. Configure your application settings

## 2. Configure JWT Template

1. In Clerk Dashboard, go to **JWT Templates**
2. Create a new template named **"convex"**
3. Add any custom claims you need

## 3. Environment Variables

Add these to your `.env.local` file:

```env
# Get these from: https://dashboard.clerk.com/last-active?path=api-keys
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Your Clerk frontend API URL (usually your-app.clerk.accounts.dev)
VITE_CLERK_FRONTEND_API_URL=https://your-app.clerk.accounts.dev
```

## 4. Google OAuth Setup

1. In Clerk Dashboard, go to **User & Authentication > Social Connections**
2. Enable **Google** provider
3. Configure your Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs from Clerk

## 5. Test Authentication

1. Start your development server: `npm run dev`
2. Visit your app - you should see the sign-in screen
3. Click "Sign In with Google" to test the flow

## 6. User Data Integration

Once authenticated, users will be automatically created in your Convex database with:
- Unique user ID from Clerk
- Profile information from Google
- Proper data isolation per user

## Current Status

✅ **Clerk React SDK**: Installed and configured  
✅ **ConvexProviderWithClerk**: Integrated with useAuth hook  
✅ **Authentication Required**: All Convex functions now require auth  
✅ **UI Components**: Sign-in modal and UserButton added  
🔄 **Next**: Add your Clerk credentials to `.env.local`

## Troubleshooting

- **"Authentication required" errors**: Make sure you're signed in
- **Environment variables not loading**: Restart your dev server
- **Google OAuth not working**: Check your redirect URIs in Google Console 