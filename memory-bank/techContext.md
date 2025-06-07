# Technology Context: Hui Hui Manaʻo

## 1. Core Technologies

-   **Backend & Database**: [Convex](https://convex.dev/)
    -   **Role**: The central nervous system of the application. It serves as the database, backend logic layer, and real-time communication hub.
    -   **Usage**: We will use Convex for schema definition, data mutations (creating thoughts), queries (reading thoughts), and actions (asynchronous processing for AI augmentation). Its reactive nature is critical for the real-time UI.

-   **Frontend Framework**: [Next.js](https://nextjs.org/) (v14+ with App Router)
    -   **Role**: The primary framework for building the user interface and handling API requests.
    -   **Usage**: We will use the App Router for structuring the application. Server Components will be used for fetching initial data, and Client Components for interactive UI elements that hook into Convex's real-time queries. Next.js API Routes will provide the public-facing endpoint for thought ingestion.

-   **Language**: [TypeScript](https://www.typescriptlang.org/)
    -   **Role**: The language for the entire stack.
    -   **Usage**: We will leverage TypeScript for end-to-end type safety, from the Convex schema and functions to the React components. This is crucial for maintainability and reducing runtime errors.

-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
    -   **Role**: A utility-first CSS framework for styling the application.
    -   **Usage**: Tailwind will be used for rapidly building and styling components. Its utility-based nature allows for easy creation of the various visual metaphors (tabs, canvas, etc.) required by the project.

## 2. Development & Tooling

-   **Package Manager**: `npm` will be used for managing project dependencies.
-   **Convex CLI**: The `npx convex` command will be used for running the Convex development server, deploying functions, and managing the backend environment.
-   **Code Formatting**: [Prettier](https://prettier.io/) will be used to maintain a consistent code style across the project.

## 3. Integration Patterns

-   **Convex-Next.js Integration**: The `convex/react` package will be the primary bridge between the frontend and backend. The `ConvexReactClient` will be set up in a provider to make the Convex instance available throughout the React component tree.
-   **API Ingestion**: A standard `fetch` request will be made from external services (or a simple UI form) to a Next.js API Route, which will then use the Convex server-side client to execute the `create` mutation.