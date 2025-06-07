import { internalMutation, internalQuery, query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// Get user's entities for memory context
export const getUserEntities = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("entities")
      .withIndex("by_userId_and_type", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Create a new entity
export const createEntity = internalMutation({
  args: {
    userId: v.string(),
    name: v.string(),
    type: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if entity already exists
    const existing = await ctx.db
      .query("entities")
      .withIndex("by_userId_and_name", (q) => 
        q.eq("userId", args.userId).eq("name", args.name)
      )
      .first();

    if (existing) {
      // Update the last seen time
      await ctx.db.patch(existing._id, {
        lastSeen: Date.now(),
        frequency: existing.frequency + 1,
      });
      return existing._id;
    }

    // Create new entity
    return await ctx.db.insert("entities", {
      userId: args.userId,
      name: args.name,
      type: args.type,
      description: args.description,
      firstSeen: Date.now(),
      lastSeen: Date.now(),
      frequency: 1,
    });
  },
});

// Public query to get user's entities (for UI)
export const getUserEntitiesPublic = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    return await ctx.db
      .query("entities")
      .withIndex("by_userId_and_type", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Public mutation to create entity (for UI)
export const createEntityPublic = mutation({
  args: {
    name: v.string(),
    type: v.string(), 
    description: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.runMutation(internal.entities.createEntity, {
      userId,
      ...args,
    });
  },
});