# Implementation Tasks: Add Card Text Editing

## Checklist

- [ ] **Update TaskCard component** - Add edit mode state and UI elements

  - [ ] Add edit button (pencil icon) to card render method
  - [ ] Create method to render edit mode UI with input fields
  - [ ] Create method to switch between display and edit modes
  - [ ] Add event listeners for edit button click
  - [ ] Add event listeners for save/cancel buttons
  - [ ] Add keyboard event handlers (Enter to save, Escape to cancel)
  - [ ] Implement focus management (auto-focus title input on edit)
  - [ ] Add input validation (title required)
  - [ ] Wire up save action to dispatch UPDATE_TASK
  - [ ] Ensure card re-renders after state update

- [ ] **Add styles for edit mode** - Create CSS for edit UI components

  - [ ] Style edit button (pencil icon, hover states, positioning)
  - [ ] Style edit mode container and input fields
  - [ ] Style title input field (font, padding, border, focus states)
  - [ ] Style description textarea (font, padding, border, focus states, auto-resize)
  - [ ] Style action buttons (Save and Cancel)
  - [ ] Add transitions for smooth mode switching
  - [ ] Ensure mobile responsiveness (touch targets ≥44px)
  - [ ] Add proper focus indicators for accessibility

- [ ] **Verify store integration** - Ensure UPDATE_TASK action and reducer work correctly

  - [ ] Verify UPDATE_TASK action creator in actions.js
  - [ ] Verify UPDATE_TASK reducer case in reducers.js properly updates task
  - [ ] Test that store updates trigger component re-renders
  - [ ] Verify localStorage persistence after task update

- [ ] **Add accessibility features** - Ensure keyboard and screen reader support

  - [ ] Add ARIA labels to edit button ("Edit task")
  - [ ] Add labels for input fields (title, description)
  - [ ] Ensure keyboard navigation works (Tab order logical)
  - [ ] Test screen reader announcements for mode changes

- [ ] **Test and validate** - Manual testing across scenarios
  - [ ] Test editing task title only
  - [ ] Test editing task description only
  - [ ] Test editing both title and description
  - [ ] Test save with Enter key
  - [ ] Test cancel with Escape key
  - [ ] Test cancel with Cancel button discards changes
  - [ ] Test validation prevents saving empty title
  - [ ] Test edit mode on mobile (touch targets, keyboard)
  - [ ] Test that edits persist after page reload
  - [ ] Test editing multiple cards in sequence
  - [ ] Test accessibility with keyboard-only navigation
  - [ ] Test with screen reader (if available)

## Implementation Notes

- Edit button should be a simple pencil SVG icon or Unicode character (✏️ or 🖊️)
- Edit mode should replace card content entirely with form inputs
- Title input should be a single-line `<input type="text">`
- Description should be a multi-line `<textarea>` with auto-resize if possible
- Save button should be disabled when title is empty
- Consider adding visual indication that card is in edit mode (border color change, background tint)
- Store existing `updateTask` action appears to already exist based on ActionTypes, verify it has correct signature
- Focus title input immediately when entering edit mode for better UX
- Preserve description even if empty (allow empty description but not empty title)

## Dependencies

None - uses existing state management and HTML form elements.

## Estimated Time

3-4 hours total

- TaskCard component updates: 1.5-2 hours
- CSS styling: 0.5-1 hour
- Testing and refinement: 1 hour
