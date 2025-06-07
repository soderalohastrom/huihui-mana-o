import React, { useState } from 'react';
import { format } from 'date-fns';

interface ThoughtCardProps {
  thought: {
    _id: string;
    content: string;
    _creationTime: number;
    augmented?: {
      content: string;
      zone: 'mauka' | 'kula' | 'makai' | 'kapu';
      confidence: number;
      entities: Array<{
        name: string;
        type: string;
        isNew: boolean;
      }>;
      keywords: string[];
    };
  };
}

const zoneInfo = {
  mauka: { emoji: '🌋', name: 'Mauka', description: 'Mountain/Visionary', color: 'from-red-400 to-orange-500' },
  kula: { emoji: '🌱', name: 'Kula', description: 'Plains/Practical', color: 'from-green-400 to-emerald-500' },
  makai: { emoji: '🌊', name: 'Makai', description: 'Ocean/Emotional', color: 'from-blue-400 to-cyan-500' },
  kapu: { emoji: '🌫️', name: 'Kapu', description: 'Sacred/Protected', color: 'from-purple-400 to-indigo-500' },
};

export default function ThoughtCard({ thought }: ThoughtCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const zone = thought.augmented?.zone || 'kula';
  const zoneData = zoneInfo[zone];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="perspective-1000 w-full h-64">
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
      >
        {/* Front of Card - Raw Thought */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full p-6 flex flex-col">
            {/* Front Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-xs text-gray-500 font-medium">RAW THOUGHT</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 text-gray-400">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs text-gray-400">FLIP</span>
              </div>
            </div>

            {/* Raw Content */}
            <div className="flex-1 flex items-center justify-center">
              <p className="text-lg text-gray-800 text-center leading-relaxed font-handwriting">
                "{thought.content}"
              </p>
            </div>

            {/* Front Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                {format(new Date(thought._creationTime), 'MMM d, h:mm a')}
              </span>
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                Original STT
              </span>
            </div>
          </div>
        </div>

        {/* Back of Card - Augmented Thought */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className={`bg-gradient-to-br ${zoneData.color} rounded-xl shadow-lg h-full p-6 flex flex-col text-white`}>
            {/* Back Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{zoneData.emoji}</span>
                <div>
                  <div className="text-sm font-semibold">{zoneData.name} Zone</div>
                  <div className="text-xs opacity-80">{zoneData.description}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs opacity-80">FLIP</span>
              </div>
            </div>

            {/* Augmented Content */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <p className="text-base leading-relaxed text-center bg-black bg-opacity-10 rounded-lg p-4">
                {thought.augmented?.content || 'Processing...'}
              </p>

              {/* Confidence Meter */}
              {thought.augmented && (
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xs opacity-80">Confidence:</span>
                  <div className="w-20 h-2 bg-black bg-opacity-20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${thought.augmented.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {Math.round(thought.augmented.confidence * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Back Footer - Entities & Keywords */}
            <div className="space-y-3 mt-4 pt-4 border-t border-white border-opacity-20">
              {/* Entities */}
              {thought.augmented?.entities && thought.augmented.entities.length > 0 && (
                <div>
                  <div className="text-xs opacity-80 mb-2">Entities:</div>
                  <div className="flex flex-wrap gap-1">
                    {thought.augmented.entities.slice(0, 3).map((entity, index) => (
                      <span
                        key={index}
                        className={`text-xs px-2 py-1 rounded-full bg-white bg-opacity-20 ${
                          entity.isNew ? 'ring-1 ring-white ring-opacity-50' : ''
                        }`}
                      >
                        {entity.name}
                        {entity.isNew && <span className="ml-1 text-xs">✨</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords */}
              {thought.augmented?.keywords && thought.augmented.keywords.length > 0 && (
                <div>
                  <div className="text-xs opacity-80 mb-2">Keywords:</div>
                  <div className="flex flex-wrap gap-1">
                    {thought.augmented.keywords.slice(0, 4).map((keyword, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded-full bg-black bg-opacity-20"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 