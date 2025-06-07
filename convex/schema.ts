import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// Ahupuaʻa zones for thought classification
const ahupuaaZone = v.union(
  v.literal("mauka"),    // Mountain - visionary/aspirational
  v.literal("kula"),     // Plains - practical/actionable  
  v.literal("makai"),    // Ocean - emotional/relational
  v.literal("kapu")      // Sacred - protected/incubating
);

const applicationTables = {
  // Raw thoughts as they come in
  thoughts: defineTable({
    userId: v.id("users"),
    content: v.string(),
    source: v.string(), // "web", "mobile", "voice", "api"
    metadata: v.object({
      timestamp: v.number(),
      location: v.optional(v.string()),
      audioUrl: v.optional(v.string()),
      imageUrls: v.optional(v.array(v.string())),
      sourceDeviceId: v.optional(v.string()),
    }),
    // Processing status
    status: v.union(
      v.literal("pending"),
      v.literal("processing"), 
      v.literal("completed"),
      v.literal("error")
    ),
    processingError: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_userId_and_status", ["userId", "status"]),

  // Augmented thoughts with memory context
  augmentedThoughts: defineTable({
    thoughtId: v.id("thoughts"),
    userId: v.id("users"),
    originalContent: v.string(),
    augmentedContent: v.string(),
    zone: ahupuaaZone,
    confidence: v.float64(),
    entities: v.array(v.object({
      entityId: v.optional(v.id("entities")),
      name: v.string(),
      type: v.string(),
      isNew: v.boolean(),
    })),
    keywords: v.array(v.string()),
    embedding: v.optional(v.array(v.float64())),
  })
    .index("by_thoughtId", ["thoughtId"])
    .index("by_userId_and_zone", ["userId", "zone"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
    }),

  // Memory graph entities
  entities: defineTable({
    userId: v.id("users"),
    name: v.string(),
    type: v.string(), // "person", "place", "project", etc.
    description: v.string(),
    aliases: v.optional(v.array(v.string())),
    attributes: v.optional(v.any()),
    embedding: v.optional(v.array(v.float64())),
    firstSeen: v.number(),
    lastSeen: v.number(),
    frequency: v.number(),
  })
    .index("by_userId_and_name", ["userId", "name"])
    .index("by_userId_and_type", ["userId", "type"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding", 
      dimensions: 1536,
    }),

  // Relationships between entities
  relationships: defineTable({
    userId: v.id("users"),
    fromEntity: v.id("entities"),
    toEntity: v.id("entities"),
    type: v.string(), // "owns", "likes", "works_with", etc.
    strength: v.float64(), // 0.0 to 1.0
    examples: v.array(v.string()), // Example contexts
    firstSeen: v.number(),
    lastSeen: v.number(),
  })
    .index("by_from", ["fromEntity"])
    .index("by_to", ["toEntity"])
    .index("by_userId", ["userId"]),

  // Hui (groups) for organizing thoughts
  hui: defineTable({
    userId: v.id("users"),
    name: v.string(),
    emoji: v.string(),
    zone: ahupuaaZone,
    thoughtIds: v.array(v.id("augmentedThoughts")),
    position: v.object({
      x: v.float64(),
      y: v.float64(),
    }),
    color: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_zone", ["userId", "zone"]),

  // Agent memory patterns for learning
  agentPatterns: defineTable({
    userId: v.id("users"),
    pattern: v.string(),
    zoneRules: v.array(v.object({
      keywords: v.array(v.string()),
      emotionalTone: v.optional(v.string()),
      zone: ahupuaaZone,
      confidence: v.float64(),
    })),
    entityPatterns: v.array(v.object({
      name: v.string(),
      aliases: v.array(v.string()),
      defaultContext: v.object({
        type: v.string(),
        attributes: v.any(),
      }),
    })),
    lastUpdated: v.number(),
  })
    .index("by_userId", ["userId"]),

  // Intake logs for debugging and analytics
  intakeLogs: defineTable({
    userId: v.optional(v.id("users")),
    source: v.string(),
    timestamp: v.number(),
    success: v.boolean(),
    error: v.optional(v.string()),
    metadata: v.optional(v.any()),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_source", ["source"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
