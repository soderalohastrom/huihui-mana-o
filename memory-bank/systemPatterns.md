# System Patterns: Hui Hui Manaʻo

## 1. Core Architecture: Vite + React Frontend with a Centralized Convex Backend

The system is designed with a clear separation of concerns:

1.  **`src` (Vite + React Frontend)**: A Vite-powered React application that serves as the user-facing interface.
2.  **`convex` (Convex Backend)**: The backend-as-a-service that manages all data, business logic, and real-time communication.

This pattern keeps frontend and backend code logically separate but co-located in the same repository.

## 2. Data Flow Pattern: Capture -> Augment -> Organize -> Present

The application's data flow is linear and unidirectional:

```mermaid
graph TD
    subgraph "Input"
        A[UI Input]
    end
    subgraph "Processing"
        B[Store Raw Thought<br/>(Convex Mutation)]
        C[Augmentation Service<br/>(Scheduled Convex Action)]
    end
    subgraph "Output"
        D[Presentation Layer<br/>(React Component with useQuery)]
    end

    A --> B
    B -- schedules --> C
    C -- updates data for --> D
    D -- subscribes to data from --> B
```

-   **Capture**: A user action in a React component directly calls a Convex **mutation**.
-   **Augment**: A Convex **action** (`convex/augmentation.ts`) is triggered *after* a thought is created.
-   **Present**: The UI is built with reactive components that subscribe directly to Convex **queries**.

## 3. UI/Layout Pattern: Full-Width, Responsive Two-Column Grid with Edit Mode

The UI follows a responsive two-column grid pattern with a stateful edit mode.

-   **Overall Container**: The main content area in `src/App.tsx` uses `w-full` for an edge-to-edge feel.
-   **Main Grid**: A two-column grid (`lg:grid-cols-3`) divides the space.
-   **Thought Garden Grid**: The `ThoughtInbox` component uses a `md:grid-cols-2` layout.
-   **Edit Mode**:
    -   A state (`editMode`) is managed in `ThoughtInbox.tsx`.
    -   `ThoughtCard.tsx` conditionally renders a "Discard" button.
    -   The "Discard" button calls the `deleteThought` mutation.

## 4. Animation Pattern: Declarative Animations with Framer Motion

To ensure smooth UI interactions and prevent rendering bugs, the application uses `framer-motion` for animations.

-   **AnimatePresence**: The `ThoughtInbox` wraps its list of cards with `<AnimatePresence>` to manage exit animations.
-   **motion Components**: The `ThoughtCard` is a `motion.div` with `initial`, `animate`, and `exit` props to define its lifecycle animations.
-   **Benefit**: This pattern provides a declarative way to handle the enter and exit of components, fixing bugs like "lingering" child elements when a parent is removed from the DOM.

## 5. Key Technical Decisions

-   **Convex as the Single Source of Truth**: All application state resides in Convex.
-   **Asynchronous Augmentation**: Decoupling the save from the enrichment provides immediate user feedback.
-   **Two-Card Data Metaphor**: Each thought has a `rawText` (front) and `augmentedData` (back).
-   **Real-time by Default**: Leveraging Convex's `useQuery` and `useMutation` hooks makes the application reactive.
-   **Stateful UI for Editing**: Client-side state (`useState`) is used to manage UI modes.