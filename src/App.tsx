import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useState } from "react";
import ThoughtInbox from "./components/intake/ThoughtInbox";
import ThoughtSubmission from "./components/intake/ThoughtSubmission";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL || "");

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
          <p className="text-gray-600">
            Unified thought capture and organization system
          </p>
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
  return (
    <ConvexProvider client={convex}>
      <AppContent />
    </ConvexProvider>
  );
}

export default App;