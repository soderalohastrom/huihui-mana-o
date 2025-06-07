# Hui Hui Manaʻo - Unified Intake System

## Project Overview

Hui Hui Manaʻo is a thought capture and organization system that transforms raw, stream-of-consciousness inputs into a living, interconnected knowledge ecosystem using Hawaiian Ahupuaʻa principles and memory-augmented AI.

This repository implements the **Unified Intake System** - the central funnel that receives thoughts from multiple sources, processes them through memory augmentation, and delivers them to various display interfaces.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Input Sources                          │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│   Web App   │ Mobile App  │  Browser    │   Voice/Audio   │
│             │             │  Extension  │                 │
└──────┬──────┴──────┬──────┴──────┬──────┴──────┬──────────┘
       │             │             │             │
       └─────────────┴─────────────┴─────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Unified Intake API                         │
│  • Authentication  • Rate Limiting  • Validation            │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Convex Backend                           │
│  • Real-time subscriptions  • Vector search                │
│  • Memory graph  • Augmentation pipeline                    │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Processing Pipeline                        │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│   Memory    │    Zone     │     Hui     │  Positioning    │
│ Augmentation│Classification│  Formation  │  Calculation    │
└─────────────┴─────────────┴─────────────┴─────────────────┘
```

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Convex
- **UI Components**: Tailwind CSS + shadcn/ui
- **Authentication**: Convex Auth
- **AI/ML**: OpenAI API for augmentation
- **Real-time**: Convex subscriptions

## Features

### Phase 1: Core Intake (Current Focus)
- [ ] Universal API endpoint for thought submission
- [ ] Multi-format support (text, audio URL, images)
- [ ] Real-time inbox view with live updates
- [ ] Basic memory augmentation
- [ ] User authentication and data isolation

### Phase 2: Enhanced Processing
- [ ] Ahupuaʻa zone classification (Mauka/Kula/Makai/Kapu)
- [ ] Entity extraction and relationship mapping
- [ ] Confidence scoring
- [ ] Batch processing for multiple thoughts
- [ ] Webhook support for external integrations

### Phase 3: Rich Visualization
- [ ] Canvas view with drag-and-drop
- [ ] Tab-based organization
- [ ] Kanban board layout
- [ ] Sticky notes clustering
- [ ] Export capabilities

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- A Convex account (free tier works)
- OpenAI API key (for augmentation features)

### Installation

1. Clone this repository:
```bash
cd /Users/soderstrom/Documents/huihui-mana-o
```

2. Install dependencies:
```bash
npm install
```

3. Set up Convex:
```bash
npx convex dev
```
Choose "Create a new project" when prompted.

4. Create `.env.local` file:
```env
# Convex (automatically populated by 'convex dev')
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Optional: for voice features
DEEPGRAM_API_KEY=your_deepgram_key
```

5. Run the development server:
```bash
npm run dev
```

## Project Structure

```
huihui-mana-o/
├── convex/                    # Backend functions and schema
│   ├── schema.ts             # Database schema
│   ├── thoughts.ts           # Thought CRUD operations
│   ├── entities.ts           # Memory graph entities
│   ├── relationships.ts      # Entity relationships
│   ├── augmentation.ts       # AI augmentation logic
│   ├── classification.ts     # Zone classification
│   └── intake.ts            # Universal intake API
├── src/
│   ├── components/
│   │   ├── intake/          # Intake UI components
│   │   ├── memory/          # Memory graph components
│   │   ├── canvas/          # Canvas view components
│   │   └── shared/          # Shared UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── pages/               # Route pages
│   └── types/               # TypeScript types
├── public/                   # Static assets
├── tests/                    # Test files
└── docs/                     # Documentation
```

## API Reference

### Submit Thought
```typescript
POST /api/intake/thought
{
  "content": string,          // Raw thought text
  "source": string,           // "web" | "mobile" | "voice" | "api"
  "metadata": {
    "location"?: string,      // Optional location context
    "audioUrl"?: string,      // For voice inputs
    "timestamp": number       // Unix timestamp
  }
}
```

### Batch Submit
```typescript
POST /api/intake/batch
{
  "thoughts": Array<{
    "content": string,
    "metadata": object
  }>,
  "groupLabel"?: string       // Optional group identifier
}
```

## Development Workflow

1. **Input Sources** submit thoughts via the intake API
2. **Convex Backend** receives and stores raw thoughts
3. **Memory Augmentation** enriches thoughts with context
4. **Zone Classification** assigns Ahupuaʻa zones
5. **Real-time Updates** push changes to all connected clients
6. **Display Views** render organized thoughts

## Integration Guide

### For Web Applications
```javascript
import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient(CONVEX_URL);
await client.mutation(api.intake.submitThought, {
  content: "Meeting with team about Q2 goals",
  source: "web",
  metadata: { timestamp: Date.now() }
});
```

### For Mobile Apps
```javascript
// React Native example
const submitThought = async (text) => {
  const response = await fetch(`${API_URL}/api/intake/thought`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      content: text,
      source: 'mobile',
      metadata: { timestamp: Date.now() }
    })
  });
  return response.json();
};
```

## Memory Graph Schema

The system maintains a knowledge graph for each user:

```typescript
// Entities (nodes in the graph)
{
  name: string,              // "George", "Paris", "Project X"
  type: string,              // "person", "place", "project"
  description: string,
  attributes: object,        // Flexible metadata
  embedding: number[]        // Vector for semantic search
}

// Relationships (edges in the graph)
{
  fromEntity: EntityId,
  toEntity: EntityId,
  type: string,              // "owns", "located_at", "works_on"
  strength: number,          // 0.0 to 1.0
  metadata: object
}
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Roadmap

### Q1 2025
- [x] Project setup and structure
- [ ] Basic intake API
- [ ] Memory augmentation MVP
- [ ] Real-time inbox view

### Q2 2025
- [ ] Zone classification
- [ ] Multiple view types
- [ ] Mobile app
- [ ] Voice integration

### Q3 2025
- [ ] Advanced AI features
- [ ] Collaboration tools
- [ ] Public API
- [ ] Plugin system

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Inspired by Hawaiian Ahupuaʻa land management principles
- Built with Convex for real-time, reactive data
- Uses OpenAI for intelligent augmentation

---

## Quick Links

- [Convex Documentation](https://docs.convex.dev)
- [Project Overview](/docs/overview.md)
- [API Documentation](/docs/api.md)
- [Contributing Guidelines](/docs/contributing.md)

## Contact

Questions? Ideas? Reach out:
- GitHub Issues: [Create an issue](https://github.com/yourusername/huihui-mana-o/issues)
- Email: your.email@example.com

Mahalo for your interest in Hui Hui Manaʻo! 🌺
