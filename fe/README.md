FE skeleton modules

Overview

- All modules are ES modules using `export default` for the main class.
- Persistence: `localStorage` hooks are present in `scripts/store.js`.
- Type system: JSDoc type definitions in `types.js` for editor type checking.

Type Definitions

All classes use JSDoc annotations referencing `types.js`:

- `@param {Type}` for constructor and method parameters
- `@type {Type}` for class properties
- `@returns {Type}` for method return types
- Import `types.js` at the top of each module

Files

- `types.js` — Centralized JSDoc type definitions (Task, Board, AppState, etc.)
- `scripts/app.js` — `App` top-level orchestrator.
- `scripts/store.js` — `Store` with `persist()`/`load()` using `localStorage`.
- `scripts/api.js` — `ApiClient` placeholder for future REST integration.
- `scripts/eventBus.js` — `EventBus` simple pub/sub.
- `scripts/input.js` — `InputHandler` for form/keyboard handling.
- `scripts/ui/kanbanBoard.js` — `KanbanBoard` component.
- `scripts/ui/taskCard.js` — `TaskCard` component.
- `scripts/ui/modal.js` — `Modal` component.

Next steps

- Implement rendering and event wiring in each component.
- Add tests and expand API client when backend is available.

# Frontend

## About

Frontend code for the drag and drop kanban board application.
This application is built using HTML and vanilla JavaScript.

## Running Locally

To run the frontend locally, you can use the Live Server extension in VSCode.
