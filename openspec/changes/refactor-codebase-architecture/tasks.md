# Tasks: Refactor Codebase Architecture

**Change ID:** `refactor-codebase-architecture`

## Checklist

### Phase 1: State Management Refactoring

- [ ] Create action type constants
- [ ] Implement action creator functions
- [ ] Create reducer function with immutable updates
- [ ] Update Store class to use reducer pattern
- [ ] Migrate moveTask to action-based approach (MOVE_TASK action)
- [ ] Create selector functions for common state queries
- [ ] Update Store.dispatch to handle action objects
- [ ] Test state management changes

### Phase 2: Extract Storage Layer

- [ ] Create StorageService class in services directory
- [ ] Move persist logic from Store to StorageService
- [ ] Move load logic from Store to StorageService
- [ ] Update Store to use StorageService
- [ ] Test persistence functionality

### Phase 3: Extract DragDropController

- [ ] Create DragDropController class in interaction directory
- [ ] Move drag state management from KanbanBoard to controller
- [ ] Move handleDragStart logic to controller
- [ ] Move handleDragOver logic to controller
- [ ] Move handleDrop logic to controller
- [ ] Move handleDragLeave logic to controller
- [ ] Move placeholder management to controller
- [ ] Update controller to dispatch MOVE_TASK action
- [ ] Update KanbanBoard to instantiate controller
- [ ] Remove drag-drop logic from KanbanBoard
- [ ] Test drag-drop functionality

### Phase 4: Refactor KanbanBoard Component

- [ ] Extract rendering logic to separate methods
- [ ] Remove direct state access, use passed data
- [ ] Simplify render method to pure presentation
- [ ] Remove state management concerns
- [ ] Add lifecycle methods (mount/unmount)
- [ ] Test board rendering

### Phase 5: Refactor TaskCard Component

- [ ] Remove drag event handlers from TaskCard
- [ ] Make TaskCard purely presentational
- [ ] Accept event callbacks as props
- [ ] Simplify render method
- [ ] Test card rendering

### Phase 6: Implement InputHandler

- [ ] Create proper InputHandler class
- [ ] Add controller registration mechanism
- [ ] Register DragDropController with InputHandler
- [ ] Add keyboard event handling
- [ ] Add touch event handling
- [ ] Add event delegation
- [ ] Update App to use InputHandler
- [ ] Test input handling

### Phase 7: Reorganize Module Structure

- [ ] Create new directory structure (core, interaction, ui, services, utils)
- [ ] Create core directory and move store-related files
- [ ] Create actions.js in core directory
- [ ] Create reducers.js in core directory
- [ ] Create selectors.js in core directory
- [ ] Move store.js to core directory
- [ ] Create interaction directory
- [ ] Move input.js to interaction directory
- [ ] Move DragDropController to interaction directory
- [ ] Create services directory
- [ ] Move StorageService to services directory
- [ ] Move api.js to services directory
- [ ] Ensure ui directory contains only presentation components
- [ ] Create utils directory if needed
- [ ] Update all import paths in all files
- [ ] Update types.js with new import paths
- [ ] Test all functionality after reorganization

### Phase 8: Update App Orchestration

- [ ] Update App class to coordinate new architecture
- [ ] Initialize services in App
- [ ] Initialize controllers in App
- [ ] Connect components to store
- [ ] Ensure proper lifecycle management
- [ ] Test app initialization

### Phase 9: Documentation

- [ ] Update code comments with JSDoc
- [ ] Document action types and creators
- [ ] Document reducer behavior
- [ ] Document component interfaces
- [ ] Document controller responsibilities
- [ ] Update README if needed

### Phase 10: Final Validation

- [ ] Verify all drag-drop functionality works
- [ ] Verify localStorage persistence works
- [ ] Check for console errors
- [ ] Verify no regression in existing features
- [ ] Run OpenSpec validation
- [ ] Clean up any unused code
- [ ] Clean up any unused dependencies

## Notes

- Each task should leave the codebase in a working state
- Test functionality after completing each phase
- Commit after each major phase completion
- Keep old code patterns until fully migrated to avoid breaking changes
