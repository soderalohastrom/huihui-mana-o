# AI Augmentation Testing Guide

## 🚀 Quick Start

1. **Ensure you're on the right branch:**
   ```bash
   git checkout feature/ai-augmentation
   ```

2. **Install dependencies (if needed):**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Test the AI Integration:**

### Step 1: Add Memory Entities
Use the "Memory Graph Entities" panel to add some entities:
- Name: "George", Type: "pet", Description: "My golden retriever who loves to bark"
- Name: "Project X", Type: "project", Description: "The secret app I'm building"
- Name: "Hawaii", Type: "place", Description: "Where I learned about Ahupuaʻa"

### Step 2: Submit Test Thoughts
Try these thoughts to see different zones and entity recognition:

**Mauka (Mountain) 🌋:**
- "I dream of Project X becoming the next big thing in tech"
- "My vision is to create an app that transforms how people think"

**Kula (Plains) 🌱:**
- "Need to finish the API integration for Project X by Friday"
- "Task: Take George to the vet for his checkup"

**Makai (Ocean) 🌊:**
- "Feeling grateful for George's companionship during long coding sessions"
- "Missing the peaceful vibes of Hawaii"

**Kapu (Sacred) 🌫️:**
- "Personal reflection: Am I building Project X for the right reasons?"
- "Private thought about my spiritual journey in Hawaii"

### Step 3: Observe the Augmentation
Watch for:
- ✅ Zone classification with confidence scores
- ✅ Entity recognition (George, Project X, Hawaii)
- ✅ Enhanced context in the augmented text
- ✅ Keywords extraction
- ✅ New entities being suggested

## 🔍 What to Look For

1. **Memory Context Integration:**
   - When you mention "George", the AI should recognize it's your dog
   - References to "Project X" should maintain context

2. **Zone Accuracy:**
   - Visionary thoughts → Mauka
   - Task-oriented → Kula
   - Emotional → Makai
   - Personal/Sacred → Kapu

3. **Graceful Fallback:**
   - If OpenAI fails, the mock augmentation should still work
   - Check console for any API errors

## 🐛 Troubleshooting

- **No augmentation appearing?** Check browser console for errors
- **Generic augmentation?** Verify OpenAI API key is set in .env.local
- **Entities not recognized?** Make sure to add them first in Memory Graph
- **Zone seems wrong?** The AI considers multiple factors - check confidence score

## 📊 Success Metrics

- [ ] Thoughts are augmented within 2-3 seconds
- [ ] Entities from memory graph are recognized
- [ ] Zone classification feels accurate
- [ ] Augmented text adds value without losing authenticity
- [ ] New entities are suggested when appropriate

## 🎯 Next Steps After Testing

1. **Fine-tune prompts** in `convex/ai/prompts.ts`
2. **Adjust confidence thresholds** if needed
3. **Add more sophisticated entity relationship detection**
4. **Implement vector embeddings for semantic search**

Happy testing! 🌺