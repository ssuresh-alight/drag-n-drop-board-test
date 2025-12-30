# Change: Add Task Deletion

## Why

Currently, users can create and edit tasks but have no way to remove tasks they no longer need. To provide a complete task management experience, users need the ability to permanently delete tasks from the kanban board using a delete button on each card. This addresses a fundamental CRUD operation gap (Create, Read, Update, but no Delete).

## What Changes

- **Delete button**: Add a delete icon button to each task card that triggers task removal
- **Confirmation dialog**: Show a confirmation prompt before deleting to prevent accidental deletions
- **Visual feedback**: Provide clear visual indication when hovering over delete button
- **Immediate removal**: Task is removed from the board immediately after confirmation
- **State synchronization**: Store updates to remove task data and persists changes to localStorage
- **Keyboard support**: Support keyboard interaction with delete button and confirmation dialog

### Key Features

1. **Delete button**: Trash icon button positioned on each task card (visible on hover on desktop, always visible on mobile)
2. **Confirmation modal**: Browser-native confirm dialog or custom modal asking "Are you sure you want to delete this task?"
3. **Instant removal**: After confirmation, task disappears from board with optional fade-out animation
4. **Store action**: New `DELETE_TASK` action removes task from state and triggers re-render
5. **Persistence**: Deletion persists to localStorage immediately
6. **Button positioning**: Delete button positioned separately from edit button to prevent mis-clicks
7. **Accessibility**: Proper ARIA labels and keyboard navigation support

## Impact

### Affected Specs

- **task-deletion** (NEW): Spec delta defining delete button, confirmation dialog, state removal, and persistence

### Affected Code

- **fe/scripts/ui/taskCard.js**: Add delete button, handle delete click, show confirmation, dispatch delete action
- **fe/scripts/actions.js**: Add `deleteTask` action creator for DELETE_TASK action
- **fe/scripts/reducers.js**: Add `DELETE_TASK` reducer case to filter out deleted task from state
- **fe/scripts/eventBus.js**: May need "task-deleted" event for coordination if needed
- **fe/style.css**: Add styles for delete button, hover states, fade-out animation (optional)
- **fe/types.js**: Add types for delete event payloads if needed

### Non-Breaking Changes

All changes are additive. Existing card display and edit functionality remain unchanged. Card rendering adds delete button but does not modify existing display or edit logic.

## Dependencies

None - uses standard browser confirm dialog (or can build custom modal using existing patterns) and existing state management infrastructure.

## Risks

- **Accidental deletion**: Users might accidentally delete tasks; mitigated by confirmation dialog
- **No undo**: Once deleted, task is permanently removed; acceptable for MVP, undo feature can be added later
- **Button confusion**: Delete and edit buttons near each other could cause mis-clicks; mitigated by clear visual distinction and spacing
- **Touch targets**: Delete button must be large enough for mobile but not overwhelming; will use minimum 44px touch target
- **Accessibility**: Must ensure screen reader announces delete button purpose clearly; addressed with proper ARIA labels

## Success Metrics

- User can click delete button (trash icon) on any task card
- Confirmation dialog appears asking "Are you sure you want to delete this task?"
- Clicking "OK" removes task from board immediately
- Clicking "Cancel" dismisses dialog without deleting task
- Deleted task is removed from store state
- Deletion persists to localStorage (task does not reappear on page reload)
- Delete button is easily discoverable but visually distinct from edit button
- Delete button has clear danger styling (red color or similar)
- Keyboard navigation works with delete button (can be activated with Enter/Space when focused)
- Screen readers announce delete button as "Delete task" or similar
- Optional: Task fades out smoothly before being removed from DOM

## Timeline

Small-sized change - estimated 2-3 hours implementation time.

## Notes

This change focuses on basic task deletion with confirmation. Future enhancements could include:

- Undo/restore deleted tasks (trash bin with recovery)
- Soft delete (archive instead of permanent deletion)
- Batch deletion (delete multiple tasks at once)
- Delete animation improvements (slide out, scale down)
- Custom confirmation modal instead of browser confirm dialog

The implementation will add new `DELETE_TASK` action and reducer case. The delete button will be positioned alongside the edit button but with distinct danger styling to prevent confusion.
