# Design: Drag-and-Drop Task Interaction

## Context

The kanban board currently displays tasks statically without user interaction. Users need to move tasks between lanes (todo, in-progress, done) and reorder tasks within lanes. This design establishes the technical approach for implementing drag-and-drop using HTML5 APIs, managing drop zones, inserting tasks at specific positions, and animating card movements.

### Constraints

- No build system or frameworks - vanilla JavaScript only
- Must work in modern browsers (Chrome, Firefox, Safari, Edge)
- Use existing Store and EventBus architecture
- CSS-only animations (no JavaScript animation libraries)
- Mobile responsive (though touch support deferred to future work)

### Stakeholders

- Users: Need intuitive drag-and-drop for task management
- Developers: Need maintainable, testable interaction code
- Project: Keep complexity minimal, avoid premature optimization

## Goals / Non-Goals

### Goals

- Enable dragging task cards between lanes and positions
- Show clear visual feedback during drag operations
- Smoothly animate cards making room for dropped task
- Persist task order and status changes to localStorage
- Maintain separation of concerns (UI, state, events)

### Non-Goals

- Touch device drag-and-drop (deferred to separate change)
- Keyboard-based reordering (deferred to separate change)
- Undo/redo functionality (deferred)
- Multi-task selection and bulk operations (deferred)
- Drag-and-drop between different boards (future enhancement)

## Decisions

### 1. Use HTML5 Drag-and-Drop API

**Decision**: Implement drag-and-drop using native HTML5 `draggable` attribute and drag events.

**Rationale**:

- Native browser support (no libraries needed)
- Works seamlessly with mouse/trackpad
- Provides standard drag-and-drop behavior users expect
- Built-in cursor feedback and drag images

**Alternatives Considered**:

- **Custom mouse event handling**: More control but significantly more complex; would need to handle all edge cases manually
- **Touch-first approach**: Would require polyfill for desktop; HTML5 works better for mouse, can add touch layer later

**Trade-offs**:

- ✅ Simple implementation for desktop
- ✅ Standard browser behavior
- ❌ Limited touch device support (acceptable - desktop-first, will enhance later)
- ❌ Less control over drag image appearance (acceptable for MVP)

### 2. Drop Zone Strategy: Card-Level Insertion Points

**Decision**: Treat the space between cards as drop zones rather than treating entire lanes as drop targets.

**Rationale**:

- Enables precise positioning between tasks
- Matches user mental model ("I want to put this task between these two")
- Simplifies visual feedback (show placeholder at exact insertion point)
- Allows for both prepend (top of lane) and append (bottom of lane) operations

**Implementation**:

```
Lane structure:
  [Lane Header]
  [Drop Zone: before first card] ← placeholder can appear here
  [Task Card 1]
  [Drop Zone: between cards 1 & 2] ← or here
  [Task Card 2]
  [Drop Zone: after last card] ← or here
```

**Alternatives Considered**:

- **Lane-level drop only**: Would append to end of lane; loses ability to insert between tasks
- **Pixel-based calculation**: Could determine insertion point by Y-coordinate; more complex and fragile

### 3. Placeholder Element for Drop Preview

**Decision**: Insert a temporary placeholder element (`<div class="card-placeholder">`) at the insertion point during drag-over.

**Rationale**:

- Provides clear visual feedback of where task will land
- Uses same dimensions as actual cards for accurate preview
- Can be styled distinctly (dashed border, semi-transparent background)
- Easy to insert/remove from DOM without affecting state

**Alternatives Considered**:

- **Highlight target card**: Less precise; doesn't show insertion point
- **Overlay element**: Would need absolute positioning; harder to integrate with flow
- **CSS-only pseudo-elements**: Cannot dynamically position between arbitrary elements

### 4. CSS Transitions for Animation

**Decision**: Use CSS `transition: transform 0.2s ease` to animate cards moving apart when placeholder appears.

**Rationale**:

- Performant (GPU-accelerated transforms)
- Simple to implement (no JavaScript animation code)
- Smooth, predictable motion
- Automatically handles interruptions (can start new transition mid-animation)

**CSS Strategy**:

```css
.card {
  transition: transform 0.2s ease;
}

.card.shifted-down {
  transform: translateY(calc(var(--card-height) + var(--gap)));
}
```

**Alternatives Considered**:

- **JavaScript animation**: More control but adds complexity; CSS sufficient for this use case
- **Keyframe animations**: Overkill for simple translate; transitions are simpler
- **No animation**: Jarring UX; smooth transitions significantly improve feel

### 5. State Management: Task Order Array

**Decision**: Add task order/position tracking in Store, update after successful drop.

**Data Structure**:

```javascript
// Each board stores tasks in order
Board {
  id: string,
  name: string,
  tasks: Task[], // already ordered array
  // no separate "order" property needed
}

// Task positions determined by array index
// Status determines which lane (todo, in-progress, done)
```

**State Update Flow**:

1. User drops task
2. Calculate new position (index) and status (lane)
3. Store.dispatch({ type: 'MOVE_TASK', taskId, newStatus, newIndex })
4. Store updates task array: remove task, insert at new position
5. Store persists to localStorage
6. Components re-render with new order

**Alternatives Considered**:

- **Explicit order property**: Would add `task.order` field; unnecessary since array order is sufficient
- **Separate position map**: Would maintain `{ taskId: position }` map; redundant with array indices

### 6. Event Handling Architecture

**Decision**: TaskCard handles `dragstart`/`dragend`, KanbanBoard handles `dragover`/`drop`/`dragleave`.

**Rationale**:

- Clear separation: cards know when they're being dragged, board knows where they can be dropped
- Board component owns the lane structure and drop zone logic
- Reduces coupling between TaskCard and lane structure

**Event Flow**:

```
TaskCard:
  dragstart → set dataTransfer with task ID, add dragging class
  dragend → remove dragging class

KanbanBoard:
  dragover → find drop zone, show placeholder, prevent default
  drop → read task ID from dataTransfer, calculate new position, update Store
  dragleave → hide placeholder if leaving valid drop zone
```

**Alternatives Considered**:

- **InputHandler coordinates all**: Would centralize logic but violates component ownership
- **Individual drop zones as components**: Over-engineered for current scale

### 7. Drag State Management

**Decision**: Track active drag state in KanbanBoard component (not global state).

**Rationale**:

- Drag state is transient UI state (doesn't need to persist)
- Only KanbanBoard needs to know about active drag
- Simpler than managing drag state in Store

**State Tracked**:

```javascript
class KanbanBoard {
  /** @type {string|null} */
  draggedTaskId = null;

  /** @type {HTMLElement|null} */
  placeholderElement = null;

  /** @type {{lane: Status, index: number}|null} */
  dropTarget = null;
}
```

**Alternatives Considered**:

- **Store manages drag state**: Would require actions/reducers for temporary UI state; overkill
- **EventBus for drag events**: Could emit drag events globally; unnecessary coordination overhead

## Risks / Trade-offs

### Risk: Touch Device Support

**Risk**: HTML5 drag-and-drop doesn't work well on touch devices (iOS Safari, Android Chrome).

**Mitigation**:

- Document desktop-first approach in proposal
- Plan separate change for touch event handling
- Consider touch polyfill libraries for future (e.g., drag-drop-touch)

**Impact**: Medium - limits mobile usability but acceptable for initial release

### Risk: Performance with Many Tasks

**Risk**: Frequent DOM updates during drag-over could cause jank with 100+ tasks.

**Mitigation**:

- Use CSS transforms (GPU-accelerated) instead of layout-affecting properties
- Throttle dragover event handling if needed
- Measure performance before optimizing

**Impact**: Low - unlikely to have 100+ tasks per board initially

### Risk: Accessibility

**Risk**: Drag-and-drop not accessible via keyboard or screen readers.

**Mitigation**:

- Document limitation in proposal
- Plan follow-up change for keyboard-based reordering
- Ensure ARIA attributes present for screen readers

**Impact**: Medium - limits accessibility but planned for future iteration

### Trade-off: Simple vs. Flexible

**Decision**: Start with simple, direct implementation rather than flexible abstraction.

**Reasoning**:

- Single board, three fixed lanes (no dynamic lane creation yet)
- Known task structure
- Can refactor if requirements expand

**Accepts**:

- Some code duplication in drop zone handling
- Lane-specific logic in KanbanBoard
- Less reusable than generic drag-drop library

**Gains**:

- Faster implementation
- Easier to understand and debug
- Fewer abstractions to maintain

## Migration Plan

No migration needed - this is net-new functionality. Existing data structures and display logic remain unchanged.

## Open Questions

### Q1: Should placeholder match exact task height?

**Question**: Should placeholder dynamically size to match dragged task, or use fixed height?

**Options**:

- A) Fixed height (e.g., 80px) - simpler, assumes tasks roughly same height
- B) Dynamic height - measure dragged card, set placeholder height to match

**Recommendation**: Start with fixed height (A) for simplicity. If task heights vary significantly, can enhance later.

### Q2: How to handle drag outside browser window?

**Question**: What happens if user drags task outside browser window then releases?

**Behavior**: Browser fires `dragleave` and `dragend` events. Placeholder should be removed, dragged task returns to original position (no state change).

**Implementation**: Handle `dragend` in TaskCard to clean up; handle `dragleave` on document to remove placeholder if drag exits board area.

### Q3: Visual feedback during drag?

**Question**: Should dragged card fade out or stay visible while dragging?

**Recommendation**: Apply `opacity: 0.5` to card being dragged (`.card.dragging { opacity: 0.5 }`). This provides clear feedback that card is in motion while still showing card content.

### Q4: Drop on empty lane?

**Question**: How to handle dropping task into lane with no existing tasks?

**Implementation**: Treat empty lane as having single drop zone. Placeholder should appear in lane, task becomes first item when dropped.

## Technical Notes

### JSDoc Type Additions

```javascript
/**
 * @typedef {Object} DragState
 * @property {string|null} taskId - ID of task being dragged
 * @property {Status|null} sourceLane - Lane task started from
 * @property {number|null} sourceIndex - Original index in source lane
 */

/**
 * @typedef {Object} DropTarget
 * @property {Status} lane - Target lane (todo, in-progress, done)
 * @property {number} index - Target index within lane
 */
```

### CSS Variables to Define

```css
:root {
  --card-height: 80px; /* approximate card height for animations */
  --gap: 10px; /* gap between cards */
  --transition-duration: 0.2s;
  --transition-easing: ease;
}
```

### Event Delegation Consideration

For performance, consider event delegation for dragover/drop on lane containers rather than individual cards. Since cards are dynamically created, delegation avoids repeated handler attachment.

```javascript
// In KanbanBoard.render()
laneElement.addEventListener("dragover", this.handleDragOver.bind(this));
laneElement.addEventListener("drop", this.handleDrop.bind(this));
```

## Summary

This design establishes a straightforward drag-and-drop implementation using:

- HTML5 native API for drag events
- Card-level insertion points as drop zones
- Placeholder element for drop preview
- CSS transitions for smooth animations
- Component-local drag state management
- Store updates for persistence

The approach balances simplicity with functionality, delivers the core UX requirements, and sets up a foundation that can be enhanced with touch support and keyboard accessibility in future iterations.
