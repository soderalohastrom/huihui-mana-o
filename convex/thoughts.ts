import { internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Get recent augmented thoughts for pattern recognition
export const getRecentThoughts = internalQuery({
  args: {
    userId: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const thoughts = await ctx.db
      .query("augmentedThoughts")
      .withIndex("by_userId_and_zone", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit);

    return thoughts;
  },
});