import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Mock augmentation for now - will be replaced with real AI later
export const processThought = internalAction({
  args: {
    thoughtId: v.id("thoughts"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Update thought status to processing
      await ctx.runMutation(internal.augmentation.updateThoughtStatus, {
        thoughtId: args.thoughtId,
        status: "processing",
      });

      // Get the thought content
      const thought = await ctx.runQuery(internal.augmentation.getThoughtInternal, {
        thoughtId: args.thoughtId,
      });

      if (!thought) {
        throw new Error("Thought not found");
      }

      // Use AI augmentation with fallback to mock
      let augmented;
      if (process.env.OPENAI_API_KEY) {
        // Fetch entities and recent thoughts for AI context
        const entities = await ctx.runQuery(internal.entities.getUserEntities, {
          userId: args.userId,
        });
        const recentThoughts = await ctx.runQuery(internal.thoughts.getRecentThoughts, {
          userId: args.userId,
          limit: 5,
        });
        
        augmented = await ctx.runAction(internal.ai.augmentation.augmentThoughtWithAI, {
          thoughtId: args.thoughtId,
          userId: args.userId,
          content: thought.content,
          entities,
          recentThoughts,
        });
      } else {
        augmented = await mockAugmentThought(thought.content);
      }

      // Save augmented version
      await ctx.runMutation(internal.augmentation.saveAugmentedThought, {
        thoughtId: args.thoughtId,
        userId: args.userId,
        originalContent: thought.content,
        augmentedContent: augmented.content,
        zone: augmented.zone,
        confidence: augmented.confidence,
        entities: augmented.entities,
        keywords: augmented.keywords,
      });

      // Update thought status to completed
      await ctx.runMutation(internal.augmentation.updateThoughtStatus, {
        thoughtId: args.thoughtId,
        status: "completed",
      });

    } catch (error) {
      console.error("Error processing thought:", error);
      
      await ctx.runMutation(internal.augmentation.updateThoughtStatus, {
        thoughtId: args.thoughtId,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
});

// Helper mutations and queries for internal use
export const getThoughtInternal = internalQuery({
  args: { thoughtId: v.id("thoughts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.thoughtId);
  },
});

export const updateThoughtStatus = internalMutation({
  args: {
    thoughtId: v.id("thoughts"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("error")
    ),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.thoughtId, {
      status: args.status,
      ...(args.error && { processingError: args.error }),
    });
  },
});

export const saveAugmentedThought = internalMutation({
  args: {
    thoughtId: v.id("thoughts"),
    userId: v.string(),
    originalContent: v.string(),
    augmentedContent: v.string(),
    zone: v.union(
      v.literal("mauka"),
      v.literal("kula"),
      v.literal("makai"),
      v.literal("kapu")
    ),
    confidence: v.float64(),
    entities: v.array(v.object({
      name: v.string(),
      type: v.string(),
      isNew: v.boolean(),
    })),
    keywords: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("augmentedThoughts", {
      thoughtId: args.thoughtId,
      userId: args.userId,
      originalContent: args.originalContent,
      augmentedContent: args.augmentedContent,
      zone: args.zone,
      confidence: args.confidence,
      entities: args.entities,
      keywords: args.keywords,
    });
  },
});

// Enhanced mock augmentation function - demonstrates Hawaiian Ahupuaʻa zones
export async function mockAugmentThought(content: string) {
  const lowerContent = content.toLowerCase();
  
  // Ahupuaʻa zone classification with more sophisticated rules
  let zone: "mauka" | "kula" | "makai" | "kapu" = "kula";
  let confidence = 0.6;
  
  // Mauka 🌋 - Mountain/Visionary: big ideas, dreams, aspirations, strategy
  const maukaKeywords = ["dream", "vision", "goal", "future", "strategy", "big picture", "inspire", "imagine", "create", "invent", "innovate", "transform", "revolution", "breakthrough"];
  const maukaCount = maukaKeywords.filter(word => lowerContent.includes(word)).length;
  
  // Kula 🌱 - Plains/Practical: tasks, actions, work, implementation
  const kulaKeywords = ["do", "task", "work", "complete", "finish", "build", "implement", "execute", "plan", "organize", "manage", "schedule", "deadline", "project"];
  const kulaCount = kulaKeywords.filter(word => lowerContent.includes(word)).length;
  
  // Makai 🌊 - Ocean/Emotional: feelings, relationships, connections
  const makaiKeywords = ["feel", "emotion", "love", "friend", "family", "relationship", "connect", "share", "care", "support", "empathy", "heart", "soul", "experience"];
  const makaiCount = makaiKeywords.filter(word => lowerContent.includes(word)).length;
  
  // Kapu 🌫️ - Sacred/Protected: private, sensitive, personal growth
  const kapuKeywords = ["private", "secret", "personal", "sensitive", "sacred", "spiritual", "inner", "reflection", "meditation", "growth", "healing", "vulnerable"];
  const kapuCount = kapuKeywords.filter(word => lowerContent.includes(word)).length;
  
  // Determine zone based on keyword frequency
  const zoneCounts = {
    mauka: maukaCount,
    kula: kulaCount, 
    makai: makaiCount,
    kapu: kapuCount
  };
  
  const maxCount = Math.max(...Object.values(zoneCounts));
  if (maxCount > 0) {
    zone = Object.keys(zoneCounts).find(key => zoneCounts[key as keyof typeof zoneCounts] === maxCount) as typeof zone;
    confidence = Math.min(0.95, 0.5 + (maxCount * 0.15));
  }
  
  // Extract meaningful keywords (filter out common words)
  const stopWords = new Set(["the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from", "up", "about", "into", "through", "during", "before", "after", "above", "below", "between"]);
  const keywords = content
    .split(/\s+/)
    .map(word => word.replace(/[^\w]/g, '').toLowerCase())
    .filter(word => word.length > 3 && !stopWords.has(word))
    .slice(0, 6);

  // Enhanced entity extraction
  const entities = [];
  
  // Look for capitalized words (potential proper nouns)
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
  
  // Look for common entity patterns
  if (content.match(/@\w+/)) {
    const mentions = content.match(/@\w+/g) || [];
    mentions.forEach(mention => {
      entities.push({
        name: mention,
        type: "person",
        isNew: true,
      });
    });
  }

  // Zone-specific augmentation messages
  const zoneMessages = {
    mauka: "🌋 Visionary thought",
    kula: "🌱 Practical thought",
    makai: "🌊 Emotional thought",
    kapu: "🌫️ Sacred thought"
  };

  return {
    content: content, // Return original content for the mock
    zone,
    confidence,
    entities,
    keywords,
  };
}