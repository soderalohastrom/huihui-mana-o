import { useState, useEffect } from "react";
import { demoThoughts, type DemoThought } from "../../lib/demoData";

interface Props {
  newThoughts?: DemoThought[];
}

export default function DemoThoughtInbox({ newThoughts = [] }: Props) {
  const [thoughts, setThoughts] = useState<DemoThought[]>(demoThoughts);

  useEffect(() => {
    if (newThoughts.length > 0) {
      setThoughts(prev => [...newThoughts, ...prev]);
    }
  }, [newThoughts]);

  const getZoneEmoji = (zone: string) => {
    switch (zone) {
      case "mauka": return "🌋";
      case "kula": return "🌱"; 
      case "makai": return "🌊";
      case "kapu": return "🌫️";
      default: return "🌱";
    }
  };

  const getZoneDescription = (zone: string) => {
    switch (zone) {
      case "mauka": return "Visionary thought - aims high toward the mountain of possibility";
      case "kula": return "Practical thought - grows in the fertile plains of action";
      case "makai": return "Emotional thought - flows from the depths of human connection";
      case "kapu": return "Sacred thought - protected in the mists of inner wisdom";
      default: return "Practical thought";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Thought Inbox ({thoughts.length})
        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">DEMO</span>
      </h2>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {thoughts.map((thought) => (
          <div
            key={thought._id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <span
                className={`inline-flex px-2 py-1 text-xs rounded-full ${
                  thought.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : thought.status === "processing"
                    ? "bg-yellow-100 text-yellow-800"
                    : thought.status === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {thought.status}
              </span>
              <time className="text-xs text-gray-500">
                {new Date(thought.metadata.timestamp).toLocaleString()}
              </time>
            </div>
            
            <p className="text-gray-900 mb-2">{thought.content}</p>
            
            {thought.augmented && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-blue-600">
                    {getZoneEmoji(thought.augmented.zone)} {thought.augmented.zone.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    Confidence: {Math.round(thought.augmented.confidence * 100)}%
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mb-2 italic">
                  {getZoneDescription(thought.augmented.zone)}
                </p>
                
                {thought.augmented.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {thought.augmented.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="inline-flex px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
                
                {thought.augmented.entities.length > 0 && (
                  <div className="text-xs text-gray-600">
                    Entities: {thought.augmented.entities.map(e => e.name).join(", ")}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}