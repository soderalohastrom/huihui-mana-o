import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import DemoApp from './DemoApp.tsx'
import './index.css'

// Use demo app if Convex URL is not configured
const convexUrl = import.meta.env.VITE_CONVEX_URL;
const AppComponent = convexUrl ? App : DemoApp;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppComponent />
  </React.StrictMode>,
)