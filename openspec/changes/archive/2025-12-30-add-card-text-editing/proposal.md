# Change: Add Card Text Editing

## Why

Currently, task cards display title and description text in a read-only format. Users cannot modify task details after creation without deleting and recreating tasks. To provide a complete task management experience, users need the ability to edit task text (both title and description) directly from the kanban board interface by clicking an edit button on each card.

## What Changes

- **Edit button**: Add a pencil icon button to each task card that enables editing mode
- **Inline editing**: When clicked, card text becomes editable with input fields replacing static text
- **Save/Cancel actions**: Provide clear actions to save changes or discard edits
- **Visual feedback**: Show editing state clearly with different styling and focused input fields
- **Validation**: Ensure title is not empty before saving
- **State synchronization**: Update store with modified task data and persist to localStorage
- **Keyboard shortcuts**: Support Enter to save, Escape to cancel during editing

### Key Features

1. **Edit button**: Small pencil icon button positioned on each task card (visible on hover or always visible on mobile)
2. **Edit mode toggle**: Clicking edit button transforms static text into editable input fields
3. **Form inputs**: Title uses `<input>` element, description uses `<textarea>` element
4. **Action buttons**: "Save" and "Cancel" buttons appear during edit mode
5. **Input validation**: Title field is required (cannot be empty)
6. **Focus management**: Title input receives focus automatically when entering edit mode
7. **Store action**: New `UPDATE_TASK` action updates task data and triggers re-render
8. **Accessibility**: Proper ARIA labels and keyboard navigation support

## Impact

### Affected Specs

- **task-editing** (NEW): Spec delta defining edit button, inline editing UI, validation, and state updates

### Affected Code

- **fe/scripts/ui/taskCard.js**: Add edit button, create edit mode UI with input fields, handle edit/save/cancel logic
- **fe/scripts/actions.js**: Ensure `updateTask` action creator exists (appears to already exist based on ActionTypes)
- **fe/scripts/reducers.js**: Ensure `UPDATE_TASK` reducer case properly handles task updates
- **fe/scripts/eventBus.js**: May need events for "edit-started" and "edit-completed" for coordination
- **fe/style.css**: Add styles for edit button, edit mode state, input fields, action buttons, and focus states
- **fe/types.js**: May add types for edit state and edit event payloads if needed

### Non-Breaking Changes

All changes are additive. Existing card display functionality remains unchanged. Card rendering adds edit button but does not modify existing display logic. `UPDATE_TASK` action type already exists in actions.js, so this change primarily extends UI capabilities.

## Dependencies

None - uses standard HTML form elements and existing state management infrastructure.

## Risks

- **UX complexity**: Edit mode might feel jarring if transitions aren't smooth; mitigated by CSS transitions and clear visual feedback
- **Concurrent edits**: Multiple users editing same task could cause conflicts; acceptable for MVP since localStorage is single-user
- **Input validation**: Need to prevent empty titles; handled with form validation and disabled save button
- **Touch targets**: Edit button must be large enough for mobile; will use minimum 44px touch target
- **Accessibility**: Must ensure screen reader support and keyboard navigation; addressed with proper ARIA labels

## Success Metrics

- User can click edit button (pencil icon) on any task card
- Card enters edit mode with title and description as editable input fields
- Title input is auto-focused when entering edit mode
- Save button is disabled when title is empty
- User can save changes with Save button or Enter key
- User can cancel changes with Cancel button or Escape key
- Task data updates in store and persists to localStorage
- Card returns to display mode after save/cancel with updated or original text
- Edit button is easily discoverable (visible on hover on desktop, always visible on mobile)
- Keyboard navigation works throughout edit flow (Tab, Enter, Escape)
- Screen readers announce edit mode and provide proper labels for inputs

## Timeline

Small-to-medium sized change - estimated 3-4 hours implementation time.

## Notes

This change focuses on basic inline editing functionality. Future enhancements could include:

- Auto-save on blur (instead of explicit save button)
- Rich text editing for description field
- Undo/redo for edits
- Field-level validation messages
- Edit history tracking

The implementation leverages existing `UPDATE_TASK` action and reducer infrastructure, so the primary work is UI-focused in TaskCard component.
