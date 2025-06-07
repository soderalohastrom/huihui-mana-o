# Project Brief: Hui Hui Manaʻo

## 1. Project Vision

To create a unified thought capture and organization system named **Hui Hui Manaʻo**. This application will integrate several proof-of-concept (PoC) projects into a single, cohesive "mother app." It aims to transform raw, stream-of-consciousness inputs into a living, interconnected knowledge ecosystem, guided by Hawaiian Ahupuaʻa principles and powered by memory-augmented AI.

## 2. Core Objective

The primary objective is to build a robust and scalable foundation for the Hui Hui Manaʻo application. This foundation will serve as the central platform to incrementally integrate and unify the features from various PoCs, including:

- `convex-graph` (Memory Engine)
- `send-to-convex` (Input Funnel)
- `teleport-note` (Real-time Inbox)
- `tab-magic` (Visual Organization)
- `drag-drop-simple` (Canvas Interaction)
- `profile-onboarder` (Initial Memory Seeding)

## 3. Scope of Work: Foundational Build (Phase 1)

The initial phase of work will focus on establishing the core end-to-end pipeline of the application:

1.  **Project Initialization**: Set up a new Next.js application with TypeScript, Tailwind CSS, and Convex integration.
2.  **Capture Service**: Implement an API endpoint to receive and store raw thoughts, replacing the `send-to-convex` PoC.
3.  **Augmentation Service**: Port the enrichment logic from `convex-graph` into an asynchronous Convex action.
4.  **Presentation View**: Create a real-time inbox view that displays thoughts as they are created and augmented, replacing the `teleport-note` PoC.

## 4. Success Criteria for Phase 1

- A new thought can be submitted via an API endpoint.
- The submitted thought is saved to the Convex database.
- An asynchronous process augments the thought with additional context.
- The new and augmented thought appears in a real-time UI without requiring a page refresh.