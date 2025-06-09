# Phase 8 Roadmap: Deepening Intelligence & Visualization

## 1. Evaluation of Current State (End of Phase 7)

The application has successfully reached a major milestone. The core end-to-end pipeline is robust, polished, and feature-complete for initial thought capture.

**Key Achievements:**
-   **Frictionless Intake**: A stable and intuitive UI for submitting thoughts.
-   **Intelligent Augmentation**: AI-powered enrichment with memory context (entities) and Hawaiian Ahupuaʻa zone classification.
-   **Polished UI**: The "Thought Garden" provides a clean, real-time, and animated view of captured thoughts, including a functional edit/discard mode.
-   **Solid Foundation**: The architecture (Vite, React, Convex, Clerk) is production-ready and scalable.

The current system excels at **capturing** and **displaying** individual, augmented thoughts. The next logical evolution is to deepen the **connections between thoughts** and provide more powerful ways to **organize and visualize** them.

## 2. Next Focus: Phase 8 Strategic Goals

Phase 8 will focus on transforming the "Thought Garden" from a simple list into a true, interconnected knowledge ecosystem. This will be achieved through three parallel work streams:

1.  **Semantic Memory**: Enable the system to understand the *meaning* of thoughts, not just their text.
2.  **Relational Memory**: Start building the explicit graph structure between memory entities.
3.  **Visual Organization**: Introduce a spatial, canvas-based interface for thought organization.

## 3. Phase 8 Work Streams & Actionable Tasks

### Work Stream 1: Semantic Memory (Vector Search)

**Goal**: Allow users to find semantically similar thoughts, uncovering hidden connections.

-   **[ ] Backend: Generate Vector Embeddings**:
    -   In the `augmentation` action, use OpenAI's embedding API (`text-embedding-3-small`) to generate a vector for each new thought.
    -   Store this vector in a new `embedding` field on the `thoughts` table.

-   **[ ] Backend: Create Vector Index**:
    -   Define a vector index on the `embedding` field in `convex/schema.ts`.
    -   `thoughts.vector("embedding", { vectorField: "embedding", filterFields: ["userId"] })`

-   **[ ] Backend: Implement Similarity Search**:
    -   Create a new query, `getSimilarThoughts`, that takes a thought's embedding and uses `ctx.db.vectorSearch` to find the top N most similar thoughts.

-   **[ ] Frontend: Display Similar Thoughts**:
    -   On the back of the `ThoughtCard`, add a section for "Related Thoughts".
    -   When a card is flipped, use the new query to fetch and display links to the top 3 related thoughts.

### Work Stream 2: Relational Memory (Entity Connections)

**Goal**: Move from a simple list of entities to a true graph of interconnected knowledge.

-   **[ ] Backend: Create `relationships` Table**:
    -   In `convex/schema.ts`, define a new `relationships` table to store edges between entities.
    -   Fields: `{ from: v.id("entities"), to: v.id("entities"), type: v.string(), userId: v.string() }`

-   **[ ] Backend: Extract Relationships**:
    -   Update the AI augmentation prompt to suggest relationships between entities mentioned in a thought (e.g., `{"from": "George", "to": "Project X", "type": "is_inspiration_for"}`).
    -   Update the augmentation action to parse and store these relationships.

-   **[ ] Frontend: Visualize Relationships (Simple)**:
    -   In the `EntityManager`, display a list of relationships for each entity.

### Work Stream 3: Visual Canvas (Proof of Concept)

**Goal**: Implement the foundational layer for the "infinite canvas" vision.

-   **[ ] Backend: Add Position to Thoughts**:
    -   Add optional `position: v.object({ x: v.number(), y: v.number() })` to the `thoughts` table schema.

-   **[ ] Frontend: Create Canvas Page**:
    -   Create a new page/route (e.g., `/canvas`).
    -   Use a simple drag-and-drop library (or native browser APIs) to render `ThoughtCard` components on a 2D plane.

-   **[ ] Frontend/Backend: Persist Positions**:
    -   When a card is moved, call a new Convex mutation `updateThoughtPosition` to save the new x/y coordinates.
    -   The canvas should fetch thoughts with their positions and render them accordingly.

By focusing on these three areas, we will significantly advance the application's core value proposition: transforming scattered ideas into a powerful, interconnected, and explorable personal knowledge base.