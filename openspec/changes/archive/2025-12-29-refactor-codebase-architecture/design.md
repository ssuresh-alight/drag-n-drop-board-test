# Design Document: Codebase Architecture Refactoring

## Overview

This document describes the technical approach for refactoring the frontend architecture to improve separation of concerns, maintainability, and extensibility.

## Architecture Layers

```
┌─────────────────────────────────────────┐
│           UI Components                 │  <- Pure presentation
│  (KanbanBoard, TaskCard, Modal)         │
└─────────────────────────────────────────┘
               ↓ events
┌─────────────────────────────────────────┐
│      Interaction Controllers            │  <- Handle user input
│   (DragDropController, InputHandler)    │
└─────────────────────────────────────────┘
               ↓ actions
┌─────────────────────────────────────────┐
│         State Management                │  <- Business logic
│    (Store, Actions, Selectors)          │
└─────────────────────────────────────────┘
               ↓ persistence
┌─────────────────────────────────────────┐
│       Storage Layer                     │  <- Persistence
│      (StorageService)                   │
└─────────────────────────────────────────┘
```

## State Management Design

### Action-Based Updates

Replace direct state mutation with action-based updates:

```javascript
// Before
store.moveTask(taskId, newStatus, newIndex);

// After
store.dispatch({
  type: "MOVE_TASK",
  payload: { taskId, status: newStatus, index: newIndex },
});
```

### Reducer Pattern

Introduce a reducer to handle all state transformations:

```javascript
function reducer(state, action) {
  switch (action.type) {
    case "MOVE_TASK":
      return moveTaskReducer(state, action.payload);
    case "UPDATE_TASK":
      return updateTaskReducer(state, action.payload);
    // ... other actions
    default:
      return state;
  }
}
```

### Immutable Updates

All state updates should create new objects rather than mutating existing ones:

```javascript
// Before (mutation)
task.status = newStatus;
board.tasks.splice(index, 1);

// After (immutable)
const updatedTask = { ...task, status: newStatus };
const updatedTasks = [
  ...board.tasks.slice(0, index),
  ...board.tasks.slice(index + 1),
];
```

## Component Architecture

### Separation of Concerns

**UI Components** (Pure presentation):

- Render DOM based on props/data
- Emit events for user interactions
- No direct state access
- No business logic

**Controllers** (Interaction logic):

- Listen to UI events
- Coordinate complex interactions (drag-drop, keyboard navigation)
- Dispatch actions to store
- No DOM manipulation

**Store** (State management):

- Hold application state
- Process actions through reducer
- Notify subscribers of changes
- No UI logic

### DragDropController

Extract all drag-drop logic from `KanbanBoard` into a dedicated controller:

```javascript
class DragDropController {
  constructor(store, rootElement) {
    this.store = store;
    this.rootElement = rootElement;
    this.dragState = null;
    this.attachListeners();
  }

  attachListeners() {
    // Delegate all drag events
  }

  handleDragStart(e) {
    // Initialize drag state
  }

  handleDragOver(e) {
    // Calculate drop target
    // Update placeholder position
  }

  handleDrop(e) {
    // Dispatch MOVE_TASK action
    // Clean up
  }
}
```

### Component Lifecycle

Standardize component lifecycle:

```javascript
class Component {
  mount(container) {
    // Attach to DOM
    // Set up event listeners
  }

  update(data) {
    // Re-render with new data
  }

  unmount() {
    // Clean up listeners
    // Remove from DOM
  }
}
```

## Input Handling Design

### Unified Input System

Create a proper `InputHandler` that manages all input types:

```javascript
class InputHandler {
  constructor(store, bus) {
    this.store = store;
    this.bus = bus;
    this.controllers = [];
  }

  registerController(controller) {
    this.controllers.push(controller);
    controller.attach();
  }

  handleKeyboardShortcut(key, modifiers) {
    // Dispatch appropriate actions
  }

  handleTouchGesture(gesture) {
    // Map to action
  }
}
```

### Interaction Controllers

Create separate controllers for different interaction patterns:

- `DragDropController`: Mouse/touch drag-and-drop
- `KeyboardController`: Keyboard shortcuts and navigation
- `TouchController`: Touch gestures (swipe, long-press)
- `AccessibilityController`: Screen reader support, focus management

## Module Organization

### Directory Structure

```
fe/scripts/
├── core/              # Core app logic
│   ├── store.js       # State management
│   ├── actions.js     # Action creators
│   ├── reducers.js    # State reducers
│   └── selectors.js   # State selectors
├── interaction/       # Input handling
│   ├── input.js       # Main input handler
│   ├── dragDrop.js    # Drag-drop controller
│   ├── keyboard.js    # Keyboard controller
│   └── touch.js       # Touch controller
├── ui/                # UI components
│   ├── kanbanBoard.js
│   ├── taskCard.js
│   └── modal.js
├── services/          # External services
│   ├── storage.js     # LocalStorage wrapper
│   └── api.js         # API client
├── utils/             # Utilities
│   └── dom.js         # DOM utilities
├── app.js             # App orchestration
├── eventBus.js        # Event bus
└── main.js            # Entry point
```

### Module Dependencies

Establish clear dependency rules:

1. **ui/** can depend on: nothing (receive data via props)
2. **interaction/** can depend on: core, ui (via DOM queries)
3. **core/** can depend on: services
4. **services/** can depend on: nothing (external interfaces)
5. **app.js** coordinates all layers

## Data Flow

```
User Interaction (DOM Event)
    ↓
Interaction Controller
    ↓
Action Creator
    ↓
Store.dispatch(action)
    ↓
Reducer (creates new state)
    ↓
Store notifies subscribers
    ↓
UI Component re-renders
```

## Implementation Strategy

### Phase 1: State Management

1. Add action types and action creators
2. Implement reducer function
3. Update Store.dispatch to use reducer
4. Migrate moveTask to action-based approach
5. Add selectors for common queries

### Phase 2: Extract DragDropController

1. Create DragDropController class
2. Move drag handlers from KanbanBoard
3. Update to dispatch actions instead of direct calls
4. Keep KanbanBoard as pure renderer

### Phase 3: Separate Storage Layer

1. Create StorageService class
2. Move persist/load logic from Store
3. Update Store to use StorageService

### Phase 4: Reorganize Files

1. Create new directory structure
2. Move files to appropriate directories
3. Update import paths
4. Update types.js with new structure

### Phase 5: Implement InputHandler

1. Create base InputHandler class
2. Register DragDropController
3. Add keyboard shortcut support
4. Add touch event support

## Testing Considerations

While we're not adding tests as part of this refactoring, the new architecture makes testing much easier:

- **Pure functions** (reducers, selectors) can be unit tested easily
- **UI components** can be tested with mock data
- **Controllers** can be tested with mock DOM and store
- **Store** can be tested independently of UI

## Migration Notes

- All changes should be backwards compatible until fully migrated
- Existing functionality must continue to work at every step
- Old patterns will coexist with new patterns temporarily
- Complete migration of one pattern before moving to the next

## Performance Considerations

- Immutable updates may create more objects, but modern JS engines handle this well
- Action-based dispatch adds minimal overhead
- Selector memoization can optimize derived state
- FLIP animations already optimized for smooth transitions

## Future Extensions

This architecture makes future features easier:

- **Editing**: Add EDIT_TASK action and modal controller
- **Keyboard shortcuts**: Add to KeyboardController
- **Touch gestures**: Implement in TouchController
- **Undo/redo**: Action history enables time-travel debugging
- **Real-time sync**: Actions can be serialized and synced
- **Accessibility**: Dedicated controller for a11y features
