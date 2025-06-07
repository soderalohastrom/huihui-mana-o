# Active Context: Foundational Build Kick-off

## 1. Current Focus: Phase 1 - Core Pipeline Implementation

The immediate goal is to build the foundational, end-to-end pipeline for **Hui Hui Manaʻo**. This involves creating a minimal, yet fully functional, version of the `Capture -> Augment -> Present` data flow.

All efforts are currently directed at the tasks outlined in the **Phase 1 Implementation Plan** within the [`systemPatterns.md`](memory-bank/systemPatterns.md:1) document.

## 2. Next Immediate Steps

1.  **Initialize Project**: Set up the Next.js + Convex + TypeScript + Tailwind CSS project structure.
2.  **Define Schema**: Create the initial `thoughts` table in [`convex/schema.ts`](convex/schema.ts:1).
3.  **Implement Capture**:
    -   Write the `thoughts.create` mutation in Convex.
    -   Create the `/api/injest` Next.js API route to call this mutation.
4.  **Implement Augment**:
    -   Write the `agent.enrich` action in Convex.
    -   Ensure the `thoughts.create` mutation schedules this action.
5.  **Implement Present**:
    -   Write the `thoughts.list` query in Convex.
    -   Create a basic React component that uses `useQuery` to display the results in real-time.

## 3. Key Decisions & Considerations

-   **Keep it Simple**: For this initial phase, we are not implementing any complex UI from `Tab-Magic` or `Drag-drop-simple`. The presentation layer will be a simple, unstyled list of thoughts to verify the real-time pipeline is working.
-   **Mock Augmentation**: The initial version of the `agent.enrich` action can use a simple mock function (e.g., appending a timestamp or a static string to the thought) to simulate the augmentation process. We will integrate with a real LLM in a later phase.
-   **Focus on the "Happy Path"**: We are currently focused on the successful flow of data. Error handling and edge cases will be addressed after the core pipeline is validated.

## 4. State of PoCs

The various Proof-of-Concept projects (`send-to-convex`, `teleport-note`, etc.) are to be used as **reference implementations only**. We are not directly importing their code but are re-implementing their core logic within the new, unified architecture.