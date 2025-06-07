import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import DemoApp from './DemoApp.tsx'
import './index.css'

// Use demo app if Convex URL is not configured  
const convexUrl = import.meta.env.VITE_CONVEX_URL;
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const AppComponent = (convexUrl && clerkKey) ? App : DemoApp;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppComponent />
  </React.StrictMode>,
)