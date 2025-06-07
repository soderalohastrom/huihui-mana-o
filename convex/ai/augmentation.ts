"use node";
import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import OpenAI from "openai";
import {
  ZONE_CLASSIFICATION_PROMPT,
  ENTITY_CONTEXT_PROMPT,
  AUGMENTATION_PROMPT,
  MEMORY_RECALL_PROMPT
} from "./prompts";

export const augmentThoughtWithAI = internalAction({
  args: {
    thoughtId: v.id("thoughts"),
    userId: v.string(),
    content: v.string(),
    entities: v.array(v.object({
      _id: v.id("entities"),
      name: v.string(),
      type: v.string(),
      description: v.string(),
    })),
    recentThoughts: v.array(v.object({
      originalContent: v.string(),
      zone: v.optional(v.string()),
      _creationTime: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    try {
      // Initialize OpenAI client with API key
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

              // 3. Build the AI prompt with full context
        const systemPrompt = `${ZONE_CLASSIFICATION_PROMPT}

${ENTITY_CONTEXT_PROMPT(args.entities)}

${AUGMENTATION_PROMPT}`;

        const userPrompt = `Thought to augment: "${args.content}"

${MEMORY_RECALL_PROMPT(args.recentThoughts.map((t: any) => ({
  content: t.originalContent,
  zone: t.zone || 'unknown',
  date: new Date(t._creationTime).toLocaleDateString()
})))}`;

        // 4. Call OpenAI for augmentation
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error("No response from AI");
      }

      const augmented = JSON.parse(response);

      // 5. Process any new entities mentioned
      for (const newEntity of augmented.new_entities || []) {
        await ctx.runMutation(internal.entities.createEntity, {
          userId: args.userId,
          name: newEntity.name,
          type: newEntity.type,
          description: newEntity.description,
        });
      }

      // 6. Return the augmented data
      return {
        content: augmented.augmented,
        zone: augmented.zone as "mauka" | "kula" | "makai" | "kapu",
        confidence: augmented.confidence,
        entities: augmented.entities_mentioned.map((name: string) => ({
          name,
          type: "mentioned",
          isNew: !args.entities.some((e: any) => e.name.toLowerCase() === name.toLowerCase())
        })),
        keywords: augmented.keywords,
        connections: augmented.connections || [],
      };

    } catch (error) {
      console.error("AI augmentation error:", error);
      
      // Fallback to simple mock augmentation
      return {
        content: `🌱 Practical thought - grows in the fertile plains of action: ${args.content}`,
        zone: "kula" as const,
        confidence: 0.6,
        entities: [],
        keywords: [],
        connections: [],
      };
    }
  },
});
