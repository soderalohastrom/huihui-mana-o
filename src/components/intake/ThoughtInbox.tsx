import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ThoughtCard from "./ThoughtCard";

export default function ThoughtInbox() {
  const thoughts = useQuery(api.intake.getThoughtsWithAugmentation, { limit: 20 });

  if (thoughts === undefined) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          🌺 Thought Garden
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">Growing thoughts...</p>
      </div>
    );
  }

  if (thoughts === null) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          🌺 Thought Garden
        </h2>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2 text-4xl">🌫️</div>
          <p className="text-gray-600">Unable to connect to the thought garden.</p>
          <p className="text-sm text-gray-500 mt-1">Please check your connection and refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          🌺 Thought Garden
        </h2>
        <div className="text-sm text-gray-500">
          {thoughts.length} thought{thoughts.length !== 1 ? 's' : ''} growing
        </div>
      </div>
      
      {thoughts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🌱</div>
          <p className="text-gray-600 text-lg">Your thought garden is ready to grow.</p>
          <p className="text-sm text-gray-500 mt-2">Plant your first thought above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {thoughts.map((thought) => (
            <ThoughtCard
              key={thought._id}
              thought={{
                _id: thought._id,
                content: thought.content,
                _creationTime: thought.metadata.timestamp,
                augmented: thought.augmented ? {
                  content: thought.augmented.augmentedContent,
                  zone: thought.augmented.zone,
                  confidence: thought.augmented.confidence,
                  entities: thought.augmented.entities,
                  keywords: thought.augmented.keywords,
                } : undefined,
              }}
            />
          ))}
        </div>
      )}
      
      {thoughts.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            💡 Click any card to flip between raw thought and AI insights
          </p>
        </div>
      )}
    </div>
  );
}