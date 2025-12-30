# Change: Refactor Codebase Architecture

## Why

The current codebase has tight coupling between UI, interaction, and state management layers, making it difficult to add new features, test code, and maintain consistency. Components mix concerns (e.g., KanbanBoard handles both rendering and drag-drop logic), state updates happen through inconsistent mechanisms, and there are no clear extension points for new input methods or interaction patterns.

## What Changes

- **State management refactoring**: Replace direct state mutation with action-based updates using action creators and reducers
- **Separate storage layer**: Extract persistence logic from Store into a dedicated StorageService
- **Extract DragDropController**: Move all drag-drop interaction logic from KanbanBoard into a dedicated controller class
- **Refactor UI components**: Make KanbanBoard and TaskCard purely presentational, receiving data via props
- **Implement InputHandler**: Create a proper input handling system that coordinates multiple interaction controllers
- **Reorganize module structure**: Create layered directory structure (core, interaction, ui, services) with clear dependencies
- **Immutable state updates**: Ensure all state transformations create new objects rather than mutating existing ones

## Impact

- **Affected specs**: Adds new capability `code-organization` (no existing specs to modify)
- **Affected code**: All frontend modules will be refactored
  - `scripts/store.js` - Add action system and use reducer pattern
  - `scripts/ui/kanbanBoard.js` - Extract interaction logic, make purely presentational
  - `scripts/ui/taskCard.js` - Simplify to pure presentation
  - `scripts/input.js` - Implement proper input handling
  - New files: `core/actions.js`, `core/reducers.js`, `core/selectors.js`, `interaction/dragDrop.js`, `services/storage.js`
  - Module reorganization across entire `fe/scripts/` directory
- **Benefits**:
  - Easier to add new features (editing, keyboard shortcuts, accessibility)
  - Better code maintainability and testability
  - Clear separation of concerns
  - Predictable data flow
- **Risks**:
  - Large refactoring scope requires careful incremental implementation
  - Temporary coexistence of old and new patterns during migration
- **Timeline**: Estimated 2-3 days of focused development work

## Background

The current architecture emerged organically during rapid prototyping. While functional, it has accumulated technical debt that will slow down future development. Key issues include:

1. **Mixed responsibilities**: KanbanBoard handles DOM rendering, event delegation, drag state, FLIP animations, and placeholder management all in one class
2. **Inconsistent state updates**: The Store has both `dispatch(patch)` and specialized methods like `moveTask()`, with some code directly mutating state
3. **Underutilized abstractions**: InputHandler and EventBus classes exist but aren't properly used
4. **No clear contracts**: Components access store.state directly without defined interfaces
5. **Limited extensibility**: Adding keyboard shortcuts, touch support, or accessibility features would require modifying multiple tightly-coupled files

## Goals

1. Establish clear separation between presentation, interaction, and data management layers
2. Standardize state management with a single, action-based update mechanism
3. Create clear extension points for new features (editing, keyboard shortcuts, accessibility)
4. Reduce coupling between modules
5. Make codebase easier to understand, test, and modify

## Non-Goals

- Adding new features (this is refactoring only)
- Introducing build tools or frameworks
- Rewriting from scratch
- Changing visual appearance or user experience
- Adding tests (though refactored code will be more testable)

## Implementation Approach

The refactoring will be done in phases, with each phase leaving the codebase in a working state:

**Phase 1**: State management (actions, reducers, immutable updates)  
**Phase 2**: Extract storage layer  
**Phase 3**: Extract DragDropController  
**Phase 4**: Refactor UI components to pure presentation  
**Phase 5**: Implement proper InputHandler  
**Phase 6**: Reorganize module structure  
**Phase 7**: Update app orchestration  
**Phase 8**: Documentation and validation

## Success Criteria

- All existing functionality works identically to before
- State updates go through single action-based mechanism
- Drag-drop logic is isolated from rendering
- Components have clear, single responsibilities
- Module dependencies are explicit and unidirectional
- Code organization follows documented patterns
- No console errors or regressions

## Future Capabilities Enabled

This refactoring creates a foundation for:

- Task and lane editing with modal controllers
- Keyboard navigation and shortcuts via KeyboardController
- Touch and gesture support via TouchController
- Accessibility features via dedicated controller
- Multi-select and bulk operations
- Undo/redo using action history
- Real-time sync by serializing actions
