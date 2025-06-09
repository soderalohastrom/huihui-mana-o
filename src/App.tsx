import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth, SignInButton, SignOutButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useState } from "react";
import ThoughtInbox from "./components/intake/ThoughtInbox";
import ThoughtSubmission from "./components/intake/ThoughtSubmission";
import EntityManager from "./components/memory/EntityManager";

// For development - will show connection status  
const convexUrl = import.meta.env.VITE_CONVEX_URL || "";
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

function AppContent() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleThoughtSubmitted = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white bg-opacity-80 backdrop-blur-sm border-b border-white border-opacity-20 sticky top-0 z-50">
        <div className="w-full px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Hui Hui Manaʻo
              </h1>
              <p className="text-sm text-gray-600">
                Unified thought capture and organization system
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${convexUrl ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-500">
                  {convexUrl ? 'Convex: Connected' : 'Convex: Not configured'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <UserButton />
                <SignOutButton>
                  <button className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded transition-colors">
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Full Width Stacked Layout */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Capture Your Thought</h2>
              <ThoughtSubmission onSubmitted={handleThoughtSubmitted} />
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Memory Graph Entities</h2>
              <EntityManager />
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Thought Garden</h2>
              <ThoughtInbox key={refreshKey} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  if (!convex || !clerkKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-8">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Setup Required</h1>
          <p className="text-gray-600 mb-4">
            Please configure your Convex deployment and Clerk authentication.
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Set VITE_CONVEX_URL in your .env.local file</p>
            <p>Set VITE_CLERK_PUBLISHABLE_KEY in your .env.local file</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <Authenticated>
        <AppContent />
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-8">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Hui Hui Manaʻo</h1>
            <p className="text-gray-600 mb-6">
              Sign in to start capturing and organizing your thoughts with Hawaiian Ahupuaʻa wisdom.
            </p>
            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Sign In with Google
              </button>
            </SignInButton>
          </div>
        </div>
      </Unauthenticated>
      <AuthLoading>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-8">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 mb-4">Loading...</p>
            <SignOutButton>
              <button className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition-colors">
                Sign Out (if stuck)
              </button>
            </SignOutButton>
          </div>
        </div>
      </AuthLoading>
    </ConvexProviderWithClerk>
  );
}

export default App;