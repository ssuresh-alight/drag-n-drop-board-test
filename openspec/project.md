# Project Context

## Purpose

This is a small progress tracker application with a kanban-board like UI.
Users can create tasks, move them between states, update task details, and delete tasks.
There is a backend and frontend component to this application. The backend exposes a REST API for task management, while the frontend provides an interactive UI for users to interact with their tasks.

## Tech Stack

- Frontend
  - HTML
  - Vanilla JavaScript
  - JSDocs and JSConfig for type safety
  - Javascript modules
  - POC: Browser storage for persistence
- Backend
  - Node.js
  - Express.js
  - REST API
  - File-based storage (JSON files) in v1

## Project Conventions

### Code Style

Frontend:
The code for frontend lives in `/fe/` directory.
The project follows standard JavaScript conventions with a focus on readability and maintainability.
ES6+ features are used where appropriate. Use Javascript classes and modules to organize code.
Prettier is used as the code formatter with settings configured in `/prettierrc` file.
JS config for stricter type checking is provided in `/jsconfig.json`.
JSDocs comments must be provided where types cannot be inferred.
Separation of concerns is maintained by organizing code into modules based on functionality (e.g., UI components, Input/interaction management, data management, API clients).
Javascript classes can be to encapsulate related functionality and state.
Utility functions are placed in separate modules for reuse - only create utility functions when there is repeated use case in multiple places. Otherwise class methods or code that lives close to the usage is preferred.
UI should be mobile responsive.

Backend:
The code for backend lives in `/be/` directory.
Backend code is TBD and not a concern at the moment.

### Architecture Patterns

The FE is structured using a modular approach with separation of concerns between the various components (UI, kanban elements, input handling, data management, API interaction). No build system is used, but Javascript modules are utilized for better organization.
The BE is TBD, but will be using a REST API. No need to create or worry about this yet.

### Testing Strategy

Initially, there are no tests. Testing strategy will be defined as the project evolves.

### Git Workflow

Initially, we commit directly to main using a semantic commit style and commits are to be made on a per-feature or fix basis.

## Domain Context

Tasks can be created, updated, moved between states (e.g., To Do, In Progress, Done), and deleted.
User is able to create multiple boards, multiple tasks per board, multiple subtasks per task (which are tasks of themselves), clone tasks, change the title and description of tasks, and see progress of subtasks within a task.

## Important Constraints

No build systems are to be used for the frontend. The application should run in modern browsers without additional tooling.
JSDocs and JSConfig should be used to provide type safety and better developer experience in the frontend.

## External Dependencies

None at the moment.
