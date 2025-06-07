import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import DemoApp from './DemoApp.tsx'
import './index.css'

// Get environment variables
const convexUrl = import.meta.env.VITE_CONVEX_URL;
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Use demo app if Convex URL or Clerk key is not configured  
const AppComponent = (convexUrl && clerkKey) ? App : DemoApp;

// Clerk publishable key validation
if (!clerkKey && convexUrl) {
  throw new Error("Missing Clerk Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {clerkKey && convexUrl ? (
      <ClerkProvider publishableKey={clerkKey} afterSignOutUrl="/">
        <AppComponent />
      </ClerkProvider>
    ) : (
      <AppComponent />
    )}
  </React.StrictMode>,
)