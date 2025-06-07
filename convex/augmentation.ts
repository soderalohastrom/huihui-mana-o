import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Mock augmentation for now - will be replaced with real AI later
export const processThought = internalAction({
  args: {
    thoughtId: v.id("thoughts"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      // Update thought status to processing
      await ctx.runMutation("augmentation:updateThoughtStatus", {
        thoughtId: args.thoughtId,
        status: "processing",
      });

      // Get the thought content
      const thought = await ctx.runQuery("augmentation:getThoughtInternal", {
        thoughtId: args.thoughtId,
      });

      if (!thought) {
        throw new Error("Thought not found");
      }

      // Mock augmentation - in real implementation this would call OpenAI
      const mockAugmented = await mockAugmentThought(thought.content);

      // Save augmented version
      await ctx.runMutation("augmentation:saveAugmentedThought", {
        thoughtId: args.thoughtId,
        userId: args.userId,
        originalContent: thought.content,
        augmentedContent: mockAugmented.content,
        zone: mockAugmented.zone,
        confidence: mockAugmented.confidence,
        entities: mockAugmented.entities,
        keywords: mockAugmented.keywords,
      });

      // Update thought status to completed
      await ctx.runMutation("augmentation:updateThoughtStatus", {
        thoughtId: args.thoughtId,
        status: "completed",
      });

    } catch (error) {
      console.error("Error processing thought:", error);
      
      await ctx.runMutation("augmentation:updateThoughtStatus", {
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
    userId: v.id("users"),
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

// Mock augmentation function - replace with real AI later
async function mockAugmentThought(content: string) {
  // Simple mock logic for demonstration
  const lowerContent = content.toLowerCase();
  
  let zone: "mauka" | "kula" | "makai" | "kapu" = "kula";
  if (lowerContent.includes("dream") || lowerContent.includes("vision") || lowerContent.includes("goal")) {
    zone = "mauka";
  } else if (lowerContent.includes("feel") || lowerContent.includes("emotion") || lowerContent.includes("love")) {
    zone = "makai";
  } else if (lowerContent.includes("private") || lowerContent.includes("secret") || lowerContent.includes("personal")) {
    zone = "kapu";
  }

  const keywords = content
    .split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 5);

  const entities = [];
  // Simple entity extraction - look for capitalized words
  const capitalizedWords = content.match(/\b[A-Z][a-z]+\b/g) || [];
  for (const word of capitalizedWords.slice(0, 3)) {
    entities.push({
      name: word,
      type: "unknown",
      isNew: true,
    });
  }

  return {
    content: `Enhanced: ${content} [Zone: ${zone}]`,
    zone,
    confidence: 0.8,
    entities,
    keywords,
  };
}