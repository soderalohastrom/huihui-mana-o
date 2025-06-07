import { useState } from "react";
import DemoThoughtInbox from "./components/intake/DemoThoughtInbox";
import DemoThoughtSubmission from "./components/intake/DemoThoughtSubmission";
import type { DemoThought } from "./lib/demoData";

function DemoApp() {
  const [newThoughts, setNewThoughts] = useState<DemoThought[]>([]);

  const handleThoughtSubmitted = (newThought: DemoThought) => {
    setNewThoughts(prev => [newThought, ...prev]);
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
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span className="text-xs text-gray-500">
              Demo Mode - Convex setup required for full functionality
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <DemoThoughtSubmission onSubmitted={handleThoughtSubmitted} />
          </div>
          
          <div className="space-y-6">
            <DemoThoughtInbox newThoughts={newThoughts} />
          </div>
        </div>
        
        <footer className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🌺 Hawaiian Ahupuaʻa Zones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-1">🌋</div>
                <div className="font-medium">Mauka</div>
                <div className="text-gray-600">Visionary &amp; Aspirational</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🌱</div>
                <div className="font-medium">Kula</div>
                <div className="text-gray-600">Practical &amp; Actionable</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🌊</div>
                <div className="font-medium">Makai</div>
                <div className="text-gray-600">Emotional &amp; Relational</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🌫️</div>
                <div className="font-medium">Kapu</div>
                <div className="text-gray-600">Sacred &amp; Protected</div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default DemoApp;