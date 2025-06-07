import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// Submit a single thought
export const submitThought = mutation({
  args: {
    content: v.string(),
    source: v.string(),
    metadata: v.object({
      timestamp: v.number(),
      location: v.optional(v.string()),
      audioUrl: v.optional(v.string()),
      imageUrls: v.optional(v.array(v.string())),
      sourceDeviceId: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Validate content
    if (!args.content.trim()) {
      throw new Error("Thought content cannot be empty");
    }

    // Create thought record
    const thoughtId = await ctx.db.insert("thoughts", {
      userId,
      content: args.content,
      source: args.source,
      metadata: args.metadata,
      status: "pending",
    });

    // Log the intake
    await ctx.db.insert("intakeLogs", {
      userId,
      source: args.source,
      timestamp: Date.now(),
      success: true,
      metadata: { thoughtId },
    });

    // Schedule processing
    await ctx.scheduler.runAfter(0, internal.augmentation.processThought, {
      thoughtId,
      userId,
    });

    return { thoughtId, status: "submitted" };
  },
});

// Submit multiple thoughts at once
export const submitBatch = mutation({
  args: {
    thoughts: v.array(v.object({
      content: v.string(),
      metadata: v.optional(v.any()),
    })),
    groupLabel: v.optional(v.string()),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const thoughtIds = [];
    const timestamp = Date.now();

    for (const thought of args.thoughts) {
      if (thought.content.trim()) {
        const thoughtId = await ctx.db.insert("thoughts", {
          userId,
          content: thought.content,
          source: args.source,
          metadata: {
            timestamp,
            ...thought.metadata,
            groupLabel: args.groupLabel,
          },
          status: "pending",
        });
        thoughtIds.push(thoughtId);
      }
    }

    // Log batch intake
    await ctx.db.insert("intakeLogs", {
      userId,
      source: args.source,
      timestamp,
      success: true,
      metadata: { 
        thoughtCount: thoughtIds.length,
        groupLabel: args.groupLabel,
      },
    });

    // Schedule processing for each thought
    for (const thoughtId of thoughtIds) {
      await ctx.scheduler.runAfter(0, internal.augmentation.processThought, {
        thoughtId,
        userId,
      });
    }

    return { 
      thoughtIds, 
      count: thoughtIds.length,
      status: "submitted" 
    };
  },
});

// Get pending thoughts (inbox view)
export const getPendingThoughts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("thoughts")
      .withIndex("by_userId_and_status", (q) => 
        q.eq("userId", userId).eq("status", "pending")
      )
      .order("desc")
      .take(50);
  },
});

// Get all thoughts with their augmented versions
export const getThoughtsWithAugmentation = query({
  args: {
    limit: v.optional(v.number()),
    zone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const limit = args.limit || 100;

    // Get thoughts
    const thoughts = await ctx.db
      .query("thoughts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    // Get augmented versions
    const augmentedMap = new Map();
    for (const thought of thoughts) {
      const augmented = await ctx.db
        .query("augmentedThoughts")
        .withIndex("by_thoughtId", (q) => q.eq("thoughtId", thought._id))
        .first();
      
      if (augmented && (!args.zone || augmented.zone === args.zone)) {
        augmentedMap.set(thought._id, augmented);
      }
    }

    // Combine data
    return thoughts
      .filter(thought => !args.zone || augmentedMap.has(thought._id))
      .map(thought => ({
        ...thought,
        augmented: augmentedMap.get(thought._id),
      }));
  },
});

// Get intake statistics
export const getIntakeStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const thoughts = await ctx.db
      .query("thoughts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const byStatus = thoughts.reduce((acc, thought) => {
      acc[thought.status] = (acc[thought.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const bySource = thoughts.reduce((acc, thought) => {
      acc[thought.source] = (acc[thought.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: thoughts.length,
      byStatus,
      bySource,
      lastIntake: thoughts[0]?.metadata.timestamp,
    };
  },
});
