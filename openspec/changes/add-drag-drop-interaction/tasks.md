# Implementation Tasks: Add Drag-and-Drop Task Interaction

## 1. Type Definitions

- [x] 1.1 Add `DragState` typedef to `fe/types.js` with `taskId`, `sourceLane`, `sourceIndex` fields
- [x] 1.2 Add `DropTarget` typedef to `fe/types.js` with `lane` and `index` fields
- [x] 1.3 Add JSDoc annotations for drag event handler types

## 2. CSS Styling and Animations

- [x] 2.1 Add CSS variables to `fe/style.css`: `--card-height`, `--gap`, `--transition-duration`, `--transition-easing`
- [x] 2.2 Add `.card` transition rule: `transition: transform 0.2s ease`
- [x] 2.3 Add `.card.dragging` style with `opacity: 0.5` and `cursor: grabbing`
- [x] 2.4 Add `.card:not(.dragging)` hover style with `cursor: grab`
- [x] 2.5 Add `.card-placeholder` styles with dashed border, semi-transparent background, and same dimensions as cards
- [x] 2.6 Add `.lane.drag-over` style for visual feedback when dragging over a lane
- [x] 2.7 Add `.card.shifted-down` style using `transform: translateY(calc(var(--card-height) + var(--gap)))`

## 3. TaskCard Drag Events

- [x] 3.1 Make TaskCard render method add `draggable="true"` attribute to card element
- [x] 3.2 Implement `handleDragStart` method in TaskCard that sets `dataTransfer.effectAllowed = 'move'`
- [x] 3.3 In `handleDragStart`, set `dataTransfer.setData('text/plain', this.data.id)` to pass task ID
- [x] 3.4 In `handleDragStart`, add `dragging` class to card element
- [x] 3.5 Implement `handleDragEnd` method in TaskCard that removes `dragging` class
- [x] 3.6 Attach `dragstart` and `dragend` event listeners to card element in render method

## 4. Store Methods for Task Reordering

- [x] 4.1 Add `moveTask(taskId, newStatus, newIndex)` method to Store class
- [x] 4.2 Implement logic in `moveTask` to find task in current board's tasks array
- [x] 4.3 Update task status if changed (e.g., from "todo" to "in-progress")
- [x] 4.4 Remove task from array and re-insert at `newIndex` (accounting for status change)
- [x] 4.5 Update task's `updatedAt` timestamp
- [x] 4.6 Call `this.persist()` to save to localStorage
- [x] 4.7 Notify all listeners with updated state

## 5. KanbanBoard Drop Zone Logic

- [x] 5.1 Add `draggedTaskId`, `placeholderElement`, `dropTarget` properties to KanbanBoard class
- [x] 5.2 Implement `handleDragOver` method that prevents default and calculates insertion point
- [x] 5.3 In `handleDragOver`, determine which lane and index the drag is over (using `event.clientY` and card positions)
- [x] 5.4 Create or update placeholder element at calculated insertion point
- [x] 5.5 Add `drag-over` class to target lane element
- [x] 5.6 Apply `shifted-down` class to cards below insertion point
- [x] 5.7 Implement `handleDrop` method that reads task ID from `dataTransfer`
- [x] 5.8 In `handleDrop`, call `store.moveTask(taskId, targetLane, targetIndex)` with calculated position
- [x] 5.9 In `handleDrop`, remove placeholder and clean up drag classes
- [x] 5.10 Implement `handleDragLeave` method that removes placeholder when dragging leaves lane
- [x] 5.11 Add logic to prevent drop on self (same position, same lane)

## 6. KanbanBoard Event Listener Attachment

- [x] 6.1 Attach `dragover` event listener to each lane element in render method
- [x] 6.2 Attach `drop` event listener to each lane element in render method
- [x] 6.3 Attach `dragleave` event listener to each lane element in render method
- [x] 6.4 Bind event handler methods to correct `this` context

## 7. Placeholder Element Creation

- [x] 7.1 Create `createPlaceholder()` method in KanbanBoard that returns a styled div element
- [x] 7.2 Set placeholder class to `card-placeholder`
- [x] 7.3 Set placeholder height to approximate card height (or measure dragged card height)
- [x] 7.4 Create `insertPlaceholder(lane, index)` method that inserts placeholder at correct position in DOM
- [x] 7.5 Create `removePlaceholder()` method that removes placeholder from DOM and clears reference

## 8. Drag State Cleanup

- [x] 8.1 Ensure `dragend` event cleans up all drag state (remove classes, clear properties)
- [x] 8.2 Ensure `drop` event cleans up drag state before updating store
- [x] 8.3 Ensure `dragleave` on document level removes placeholder if drag exits window
- [x] 8.4 Test cancelling drag (ESC key) properly resets state

## 9. Animation and Visual Polish

- [x] 9.1 Verify CSS transitions apply to card movements
- [x] 9.2 Test that animations complete smoothly without glitches
- [x] 9.3 Verify placeholder appearance is distinct and clear
- [x] 9.4 Test drag cursor feedback (grab vs. grabbing)
- [x] 9.5 Verify lane drop-zone highlighting is visible and appropriate

## 10. Integration Testing

- [x] 10.1 Test dragging task between different lanes (todo → in-progress → done)
- [x] 10.2 Test reordering task within same lane (move up and down)
- [x] 10.3 Test dropping task at top, middle, and bottom of lanes
- [x] 10.4 Test dropping task in empty lane
- [x] 10.5 Test cancelling drag (ESC or drag outside window)
- [x] 10.6 Test rapid repeated drags for race conditions
- [x] 10.7 Verify state persistence by performing drag-drop, then reloading page
- [x] 10.8 Verify no console errors during any drag operation
- [x] 10.9 Test responsive behavior (ensure works on desktop viewports)
- [x] 10.10 Verify localStorage updates correctly after each drop

## 11. Code Quality and Documentation

- [x] 11.1 Add JSDoc comments to all new methods (params, return types)
- [x] 11.2 Ensure all type annotations reference types.js definitions
- [x] 11.3 Run code through Prettier formatter
- [x] 11.4 Review code for unnecessary complexity or duplication
- [x] 11.5 Add inline comments explaining complex drag-over calculations

## 12. Browser Compatibility

- [x] 12.1 Test in Chrome/Chromium
- [x] 12.2 Test in Firefox
- [x] 12.3 Test in Safari (if available)
- [x] 12.4 Test in Edge
- [x] 12.5 Document any browser-specific quirks or limitations
