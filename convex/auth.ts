// Development authentication helpers
// This file provides utilities for development mode authentication
// Will be replaced with Clerk integration in production

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a development user (temporary for testing)
export const createDevUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if dev user already exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email || "dev@huihui.local"))
      .first();
    
    if (existingUser) {
      return existingUser._id;
    }

    // Create new dev user
    const userId = await ctx.db.insert("users", {
      name: args.name || "Dev User",
      email: args.email || "dev@huihui.local",
      emailVerificationTime: Date.now(),
      image: "",
    });

    return userId;
  },
});

// Get or create development user
export const getOrCreateDevUser = query({
  args: {},
  handler: async (ctx) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), "dev@huihui.local"))
      .first();
    
    if (existingUser) {
      return existingUser;
    }

    return null; // User needs to be created via mutation
  },
});

// List all users (development only)
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Development helper to clear all data (dangerous!)
export const clearAllDevData = mutation({
  args: {
    confirm: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.confirm !== "CLEAR_ALL_DATA") {
      throw new Error("Must provide confirmation string");
    }

    // Clear all thoughts and related data
    const thoughts = await ctx.db.query("thoughts").collect();
    for (const thought of thoughts) {
      await ctx.db.delete(thought._id);
    }

    const augmented = await ctx.db.query("augmentedThoughts").collect();
    for (const aug of augmented) {
      await ctx.db.delete(aug._id);
    }

    const entities = await ctx.db.query("entities").collect();
    for (const entity of entities) {
      await ctx.db.delete(entity._id);
    }

    const relationships = await ctx.db.query("relationships").collect();
    for (const rel of relationships) {
      await ctx.db.delete(rel._id);
    }

    const hui = await ctx.db.query("hui").collect();
    for (const h of hui) {
      await ctx.db.delete(h._id);
    }

    const logs = await ctx.db.query("intakeLogs").collect();
    for (const log of logs) {
      await ctx.db.delete(log._id);
    }

    return { cleared: thoughts.length + augmented.length + entities.length };
  },
});