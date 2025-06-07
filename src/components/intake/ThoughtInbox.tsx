import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function ThoughtInbox() {
  const thoughts = useQuery(api.intake.getThoughtsWithAugmentation, { limit: 20 });

  if (thoughts === undefined) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Thought Inbox
        </h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">Loading thoughts...</p>
      </div>
    );
  }

  if (thoughts === null) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Thought Inbox
        </h2>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-600">Unable to connect to the thought system.</p>
          <p className="text-sm text-gray-500 mt-1">Please check your connection and refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Thought Inbox ({thoughts.length})
      </h2>
      
      {thoughts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No thoughts captured yet.</p>
          <p className="text-sm mt-1">Start by capturing your first thought!</p>
        </div>
      ) : (
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
                  <div className="mb-2">
                    <p className="text-sm text-indigo-700 italic">{thought.augmented.augmentedContent}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-blue-600">
                      Zone: {thought.augmented.zone}
                    </span>
                    <span className="text-xs text-gray-500">
                      Confidence: {Math.round(thought.augmented.confidence * 100)}%
                    </span>
                  </div>
                  
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
      )}
    </div>
  );
}