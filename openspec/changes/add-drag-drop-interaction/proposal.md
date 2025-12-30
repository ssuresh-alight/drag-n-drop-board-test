# Change: Add Drag-and-Drop Task Interaction

## Why

The current kanban board displays tasks statically across three lanes (To Do, In Progress, Done), but users cannot move tasks between lanes or reorder them within lanes. To make the application functional as a task management tool, users need the ability to drag tasks to different positions and lanes, with clear visual feedback showing where tasks will be dropped.

## What Changes

- **Drag initiation**: Task cards become draggable using native HTML5 drag-and-drop API
- **Drop zones**: Lanes accept dropped tasks and can insert tasks at specific positions between existing cards
- **Visual feedback**: A preview placeholder shows where the dragged task will be inserted
- **Task positioning**: Users can insert tasks between other tasks within the same lane or across different lanes
- **Smooth animations**: CSS transitions animate cards moving apart to make room for the drop target (driven entirely by CSS)
- **State synchronization**: Store updates to reflect task status and position changes after drops
- **Responsive interactions**: Touch and mouse events both work seamlessly

### Key Features

1. **Draggable cards**: All task cards have `draggable="true"` attribute and handle drag events
2. **Drop target detection**: Lanes and card gaps become drop zones with visual indicators
3. **Insertion preview**: A placeholder element shows exactly where the task will land
4. **CSS-driven animation**: Cards smoothly transition positions using `transition: transform 0.2s ease`
5. **State management**: Store tracks task order and status; changes persist to localStorage

## Impact

### Affected Specs

- **board-interaction** (NEW): Spec delta defining drag-and-drop, drop zones, task positioning, and preview animations

### Affected Code

- **fe/scripts/ui/taskCard.js**: Add drag event handlers (`dragstart`, `dragend`)
- **fe/scripts/ui/kanbanBoard.js**: Add drop zone logic (`dragover`, `drop`, `dragleave`), placeholder creation/positioning
- **fe/scripts/input.js**: Coordinate drag state and event handling across components
- **fe/scripts/store.js**: Add methods for reordering tasks and updating task status/position
- **fe/style.css**: Add CSS transitions, placeholder styling, drag-over states, and animation keyframes
- **fe/types.js**: Add types for drag state, drop positions, and drag event payloads

### Non-Breaking Changes

All changes are additive. Existing display functionality remains unchanged. No existing data structures are modified.

## Dependencies

None - uses standard HTML5 drag-and-drop API and CSS transitions available in all modern browsers.

## Risks

- **Touch device support**: HTML5 drag-and-drop has limited touch support; may need polyfill or touch event handling in future iterations
- **Performance**: Frequent DOM updates during drag could impact performance with many tasks; mitigated by CSS-only animations
- **Accessibility**: Keyboard-based reordering not included in this change; should be added in follow-up work

## Success Metrics

- Users can drag any task card with mouse or trackpad
- Drop zones are clearly visible when dragging over lanes
- Placeholder accurately shows insertion position between existing cards
- Tasks can be moved between any lanes (todo ↔ in-progress ↔ done)
- Cards animate smoothly when making room for dropped task (CSS transition ~200ms)
- Task order and status persist to localStorage after drop
- No visual glitches or layout jumps during drag operations
- Works on desktop viewports (mobile/touch support deferred to future work)

## Timeline

Medium-sized change - estimated 4-6 hours implementation time.

## Notes

This change focuses on mouse/trackpad drag-and-drop. Touch device support (mobile drag) will be addressed in a separate change once the core interaction model is validated. Keyboard accessibility (reordering via keyboard shortcuts) is also deferred to a future change.
