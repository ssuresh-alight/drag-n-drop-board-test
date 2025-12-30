# Spec: Code Organization

**Capability ID:** `code-organization`  
**Status:** Delta (ADDED)

---

## ADDED Requirements

### Requirement: Modular Architecture

The frontend codebase SHALL be organized into distinct layers with clear separation of concerns, where each layer has specific responsibilities and well-defined boundaries.

**Acceptance Criteria:**

- Code is organized into layers: core (state management), interaction (input handling), ui (presentation), services (external interfaces)
- Each layer has a single, well-defined responsibility
- Dependencies between layers follow a unidirectional flow
- Module boundaries are enforced through file organization

#### Scenario: Developer adds new feature

**Given** the codebase follows modular architecture  
**When** a developer wants to add a new feature  
**Then** they can identify which layer(s) need changes  
**And** they can make changes without affecting unrelated modules  
**And** the change follows established patterns

#### Scenario: Developer reviews code organization

**Given** the codebase uses layered architecture  
**When** a developer opens the fe/scripts directory  
**Then** they see subdirectories: core/, interaction/, ui/, services/, utils/  
**And** each directory contains related modules  
**And** the purpose of each layer is clear from the organization

### Requirement: Action-Based State Management

All state modifications SHALL go through a centralized action-based system using action creators and reducers to ensure predictable state updates.

**Acceptance Criteria:**

- All state changes are initiated by dispatching actions
- Actions are plain objects with `type` and `payload` properties
- A reducer function handles all state transformations
- State updates are immutable (new objects created, not mutated)
- Action types are defined as constants

#### Scenario: Moving a task between lanes

**Given** a user drags a task to a different lane  
**When** the task is dropped  
**Then** an action with type "MOVE_TASK" is dispatched  
**And** the reducer creates a new state with the task in the new position  
**And** the original state object is not mutated  
**And** all subscribers are notified of the state change

#### Scenario: Multiple state updates

**Given** the application needs to update multiple parts of state  
**When** actions are dispatched sequentially  
**Then** each action goes through the same dispatch → reducer flow  
**And** state changes are predictable and debuggable  
**And** all updates follow the same pattern

### Requirement: Separated Storage Layer

Persistence logic SHALL be isolated from state management in a dedicated storage service that handles reading from and writing to browser storage.

**Acceptance Criteria:**

- StorageService class encapsulates all persistence logic
- Store class delegates persistence to StorageService
- Storage implementation can be swapped without changing Store
- Storage operations are decoupled from state management

#### Scenario: Persisting application state

**Given** the application state changes  
**When** the Store needs to persist the state  
**Then** it calls StorageService.save() with the current state  
**And** StorageService handles localStorage interaction  
**And** Store doesn't know about localStorage implementation details

#### Scenario: Loading persisted state

**Given** the application starts  
**When** initial state needs to be loaded  
**Then** StorageService.load() is called  
**And** it returns the persisted state from localStorage  
**And** Store uses the returned state to initialize

### Requirement: Separated Interaction Controllers

User interaction logic SHALL be extracted into dedicated controller classes that handle specific interaction patterns (drag-drop, keyboard, touch) independently of UI rendering.

**Acceptance Criteria:**

- DragDropController handles all drag-and-drop interaction logic
- Controllers manage their own event listeners
- Controllers dispatch actions to update state
- Controllers don't manipulate DOM directly (except for visual feedback)
- UI components are decoupled from interaction logic

#### Scenario: Drag-and-drop interaction

**Given** DragDropController is initialized with the board element  
**When** a user drags a task card  
**Then** the controller handles dragstart, dragover, drop events  
**And** it calculates drop position and target lane  
**And** it dispatches MOVE_TASK action to Store  
**And** it manages placeholder element for visual feedback  
**And** KanbanBoard is only responsible for rendering

#### Scenario: Adding keyboard shortcuts

**Given** the application supports keyboard navigation  
**When** KeyboardController is added to the system  
**Then** it can be registered with InputHandler  
**And** it handles keyboard events independently  
**And** it dispatches appropriate actions  
**And** no changes are needed to UI components

### Requirement: Pure Presentation Components

UI components SHALL be purely presentational, receiving data as input and emitting events for interactions, without directly accessing or modifying application state.

**Acceptance Criteria:**

- UI components receive all data through constructor/props
- Components don't access store directly
- Components emit events instead of dispatching actions
- Components focus only on rendering DOM
- Components have no business logic

#### Scenario: Rendering a kanban board

**Given** KanbanBoard component receives board data and event handlers  
**When** render() is called  
**Then** it creates DOM elements based on the data  
**And** it attaches provided event handlers to elements  
**And** it doesn't access Store directly  
**And** it doesn't contain drag-drop logic  
**And** it only renders what it receives

#### Scenario: Task card updates

**Given** TaskCard receives task data  
**When** the task data changes  
**Then** TaskCard re-renders with new data  
**And** it doesn't manage its own state  
**And** it doesn't know about drag-drop mechanics  
**And** it simply displays what it's given

### Requirement: Unified Input Handling

All user input (mouse, keyboard, touch) SHALL be managed through a unified InputHandler that coordinates multiple interaction controllers.

**Acceptance Criteria:**

- InputHandler class coordinates all input controllers
- Controllers can be registered/unregistered dynamically
- Input handling supports multiple input types simultaneously
- Event delegation is used for efficiency

#### Scenario: Application initialization

**Given** the application is starting  
**When** App.start() is called  
**Then** InputHandler is created  
**And** DragDropController is registered with InputHandler  
**And** KeyboardController is registered with InputHandler  
**And** all controllers are properly initialized  
**And** input handling works for mouse, keyboard, and touch

#### Scenario: Keyboard shortcut execution

**Given** InputHandler is managing keyboard input  
**When** a user presses a registered keyboard shortcut  
**Then** InputHandler delegates to KeyboardController  
**And** the controller dispatches appropriate action  
**And** the action updates state through the Store  
**And** UI updates to reflect the change

### Requirement: Clear Module Dependencies

Module dependencies SHALL follow a unidirectional pattern where higher-level modules depend on lower-level modules, but not vice versa.

**Acceptance Criteria:**

- UI layer depends on nothing (pure presentation)
- Interaction layer depends on core layer only
- Core layer depends on services layer only
- Services layer has no internal dependencies
- Circular dependencies are not allowed

#### Scenario: Adding a new UI component

**Given** a developer needs to add a new UI component  
**When** they create the component  
**Then** it can depend on nothing (receives data via props)  
**And** it doesn't import from core or interaction layers  
**And** it's purely presentational

#### Scenario: Adding a new controller

**Given** a developer needs to add an interaction controller  
**When** they create the controller  
**Then** it can import from core (actions, store)  
**And** it can query DOM elements  
**And** it doesn't import UI components directly  
**And** it follows the dependency rules

### Requirement: Immutable State Updates

All state transformations SHALL create new state objects rather than mutating existing ones, ensuring predictable behavior and easier debugging.

**Acceptance Criteria:**

- Reducer functions return new state objects
- Original state is never modified
- Array and object operations use spread operators or methods that return new instances
- State updates can be tracked and debugged

#### Scenario: Task status update

**Given** a reducer processes a MOVE_TASK action  
**When** it updates a task's status  
**Then** it creates a new task object with updated status  
**And** it creates a new tasks array with the updated task  
**And** it creates a new board object with the updated tasks  
**And** the original state remains unchanged  
**And** subscribers receive the new state object

#### Scenario: State history tracking

**Given** the application uses immutable updates  
**When** state changes over time  
**Then** each state version is a separate object  
**And** previous states remain unchanged  
**And** state history could be maintained for undo/redo  
**And** debugging tools can compare state snapshots

---

## Implementation Notes

- Refactoring should be done incrementally to avoid breaking existing functionality
- Each phase should leave the codebase in a working state
- Old patterns will temporarily coexist with new patterns during migration
- Testing at each step ensures no regression
- This is a foundational change that makes future features easier to implement
