import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useState } from "react";
import ThoughtInbox from "./components/intake/ThoughtInbox";
import ThoughtSubmission from "./components/intake/ThoughtSubmission";

// For development - will show connection status  
const convexUrl = import.meta.env.VITE_CONVEX_URL || "";
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

function AppContent() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleThoughtSubmitted = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Hui Hui Manaʻo
          </h1>
          <p className="text-gray-600 mb-2">
            Unified thought capture and organization system
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${convexUrl ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-gray-500">
              {convexUrl ? 'Convex: Connecting...' : 'Convex: Not configured'}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ThoughtSubmission onSubmitted={handleThoughtSubmitted} />
          </div>
          
          <div className="space-y-6">
            <ThoughtInbox key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  if (!convex) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Convex Setup Required</h1>
          <p className="text-gray-600 mb-4">
            Please configure your Convex deployment to use the full application.
          </p>
          <p className="text-sm text-gray-500">
            Set VITE_CONVEX_URL in your .env.local file
          </p>
        </div>
      </div>
    );
  }

  return (
    <ConvexProvider client={convex}>
      <AppContent />
    </ConvexProvider>
  );
}

export default App;