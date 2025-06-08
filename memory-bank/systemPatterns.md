# System Patterns: Hui Hui Manaʻo

## 1. Core Architecture: Vite + React Frontend with a Centralized Convex Backend

The system is designed with a clear separation of concerns:

1.  **`src` (Vite + React Frontend)**: A Vite-powered React application that serves as the user-facing interface. It handles all rendering, user interaction, and state management via Convex hooks.
2.  **`convex` (Convex Backend)**: The backend-as-a-service that manages all data, business logic, and real-time communication.

This pattern keeps frontend and backend code logically separate but co-located in the same repository, simplifying dependency management and ensuring consistency.

## 2. Data Flow Pattern: Capture -> Augment -> Organize -> Present

The application's data flow is linear and unidirectional, ensuring a predictable and scalable process for handling thoughts.

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
-   **Augment**: A Convex **action** (`convex/augmentation.ts`) is triggered *after* a thought is created. Using an action allows for asynchronous, long-running processes (like calling an LLM) without blocking the initial data-saving mutation.
-   **Present**: The UI is built with reactive components that subscribe directly to Convex **queries**. This means the UI will automatically update in real-time as data changes on the backend, without needing manual state management or re-fetching.

## 3. UI/Layout Pattern: Responsive Two-Column Grid

The primary user interface follows a responsive two-column grid pattern for desktop, which collapses into a single column on smaller screens.

-   **Desktop Layout (`lg` screens and up)**:
    -   **Left Column (1/3 width)**: Contains the primary action components: `ThoughtSubmission` and `EntityManager`. This keeps input controls grouped together.
    -   **Right Column (2/3 width)**: Contains the main content display: `ThoughtInbox`. This provides ample space for viewing the "Thought Garden."
-   **Mobile Layout**: The columns stack vertically, preserving a logical top-to-bottom flow for smaller viewports.
-   **Implementation**: Achieved using Tailwind CSS responsive prefixes (e.g., `grid`, `lg:grid-cols-3`, `lg:col-span-1`, `lg:col-span-2`).

## 4. Key Technical Decisions

-   **Convex as the Single Source of Truth**: All application state resides in Convex. The React frontend is intentionally kept "thin," primarily handling rendering and user events.
-   **Asynchronous Augmentation**: Decoupling the initial save (mutation) from the enrichment process (action) provides immediate user feedback.
-   **Two-Card Data Metaphor**: Each thought has a `rawText` (front) and `augmentedData` (back), preserving authenticity while adding rich context.
-   **Real-time by Default**: Leveraging Convex's `useQuery` and `useMutation` hooks makes the entire application reactive with minimal boilerplate.