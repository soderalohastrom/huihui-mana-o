// Demo data for development when Convex is not available
export interface DemoThought {
  _id: string;
  content: string;
  status: "pending" | "processing" | "completed" | "error";
  metadata: {
    timestamp: number;
  };
  augmented?: {
    zone: "mauka" | "kula" | "makai" | "kapu";
    confidence: number;
    keywords: string[];
    entities: Array<{
      name: string;
      type: string;
      isNew: boolean;
    }>;
  };
}

export const demoThoughts: DemoThought[] = [
  {
    _id: "demo-1",
    content: "I dream of creating a revolutionary AI system that transforms how people organize their thoughts",
    status: "completed",
    metadata: { timestamp: Date.now() - 300000 },
    augmented: {
      zone: "mauka",
      confidence: 0.92,
      keywords: ["dream", "revolutionary", "system", "transforms", "organize", "thoughts"],
      entities: [
        { name: "AI", type: "concept", isNew: false }
      ]
    }
  },
  {
    _id: "demo-2", 
    content: "Need to finish the project presentation by Friday and organize the team meeting",
    status: "completed",
    metadata: { timestamp: Date.now() - 180000 },
    augmented: {
      zone: "kula",
      confidence: 0.88,
      keywords: ["finish", "project", "presentation", "organize", "meeting"],
      entities: [
        { name: "Friday", type: "concept", isNew: true }
      ]
    }
  },
  {
    _id: "demo-3",
    content: "Feeling grateful for the support from my family during this challenging time",
    status: "completed", 
    metadata: { timestamp: Date.now() - 60000 },
    augmented: {
      zone: "makai",
      confidence: 0.95,
      keywords: ["feeling", "grateful", "support", "family", "challenging"],
      entities: []
    }
  },
  {
    _id: "demo-4",
    content: "Personal reflection on my spiritual growth and inner healing journey",
    status: "completed",
    metadata: { timestamp: Date.now() - 30000 },
    augmented: {
      zone: "kapu", 
      confidence: 0.89,
      keywords: ["personal", "reflection", "spiritual", "growth", "healing", "journey"],
      entities: []
    }
  }
];

// Mock augmentation function for demo mode
export function mockAugmentThought(content: string) {
  const lowerContent = content.toLowerCase();
  
  // Zone classification logic (same as in Convex)
  let zone: "mauka" | "kula" | "makai" | "kapu" = "kula";
  let confidence = 0.6;
  
  const maukaKeywords = ["dream", "vision", "goal", "future", "strategy", "big picture", "inspire", "imagine", "create", "invent", "innovate", "transform", "revolution", "breakthrough"];
  const kulaKeywords = ["do", "task", "work", "complete", "finish", "build", "implement", "execute", "plan", "organize", "manage", "schedule", "deadline", "project"];
  const makaiKeywords = ["feel", "emotion", "love", "friend", "family", "relationship", "connect", "share", "care", "support", "empathy", "heart", "soul", "experience"];
  const kapuKeywords = ["private", "secret", "personal", "sensitive", "sacred", "spiritual", "inner", "reflection", "meditation", "growth", "healing", "vulnerable"];
  
  const maukaCount = maukaKeywords.filter(word => lowerContent.includes(word)).length;
  const kulaCount = kulaKeywords.filter(word => lowerContent.includes(word)).length;
  const makaiCount = makaiKeywords.filter(word => lowerContent.includes(word)).length;
  const kapuCount = kapuKeywords.filter(word => lowerContent.includes(word)).length;
  
  const zoneCounts = { mauka: maukaCount, kula: kulaCount, makai: makaiCount, kapu: kapuCount };
  const maxCount = Math.max(...Object.values(zoneCounts));
  
  if (maxCount > 0) {
    zone = Object.keys(zoneCounts).find(key => zoneCounts[key as keyof typeof zoneCounts] === maxCount) as typeof zone;
    confidence = Math.min(0.95, 0.5 + (maxCount * 0.15));
  }
  
  const stopWords = new Set(["the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from", "up", "about", "into", "through", "during", "before", "after", "above", "below", "between"]);
  const keywords = content
    .split(/\s+/)
    .map(word => word.replace(/[^\w]/g, '').toLowerCase())
    .filter(word => word.length > 3 && !stopWords.has(word))
    .slice(0, 6);

  const entities = [];
  const capitalizedWords = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
  for (const phrase of capitalizedWords.slice(0, 4)) {
    const entityType = phrase.length > 10 ? "organization" : 
                      phrase.includes(" ") ? "person" : "concept";
    entities.push({
      name: phrase,
      type: entityType,
      isNew: true,
    });
  }

  return {
    zone,
    confidence,
    keywords,
    entities,
  };
}