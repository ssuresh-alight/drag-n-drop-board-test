# Implementation Tasks: Add Card Text Editing

## Checklist

- [x] **Update TaskCard component** - Add edit mode state and UI elements

  - [x] Add edit button (pencil icon) to card render method
  - [x] Create method to render edit mode UI with input fields
  - [x] Create method to switch between display and edit modes
  - [x] Add event listeners for edit button click
  - [x] Add event listeners for save/cancel buttons
  - [x] Add keyboard event handlers (Enter to save, Escape to cancel)
  - [x] Implement focus management (auto-focus title input on edit)
  - [x] Add input validation (title required)
  - [x] Wire up save action to dispatch UPDATE_TASK
  - [x] Ensure card re-renders after state update

- [x] **Add styles for edit mode** - Create CSS for edit UI components

  - [x] Style edit button (pencil icon, hover states, positioning)
  - [x] Style edit mode container and input fields
  - [x] Style title input field (font, padding, border, focus states)
  - [x] Style description textarea (font, padding, border, focus states, auto-resize)
  - [x] Style action buttons (Save and Cancel)
  - [x] Add transitions for smooth mode switching
  - [x] Ensure mobile responsiveness (touch targets ≥44px)
  - [x] Add proper focus indicators for accessibility

- [x] **Verify store integration** - Ensure UPDATE_TASK action and reducer work correctly

  - [x] Verify UPDATE_TASK action creator in actions.js
  - [x] Verify UPDATE_TASK reducer case in reducers.js properly updates task
  - [x] Test that store updates trigger component re-renders
  - [x] Verify localStorage persistence after task update

- [x] **Add accessibility features** - Ensure keyboard and screen reader support

  - [x] Add ARIA labels to edit button ("Edit task")
  - [x] Add labels for input fields (title, description)
  - [x] Ensure keyboard navigation works (Tab order logical)
  - [x] Test screen reader announcements for mode changes

- [x] **Test and validate** - Manual testing across scenarios
  - [x] Test editing task title only
  - [x] Test editing task description only
  - [x] Test editing both title and description
  - [x] Test save with Enter key
  - [x] Test cancel with Escape key
  - [x] Test cancel with Cancel button discards changes
  - [x] Test validation prevents saving empty title
  - [x] Test edit mode on mobile (touch targets, keyboard)
  - [x] Test that edits persist after page reload
  - [x] Test editing multiple cards in sequence
  - [x] Test accessibility with keyboard-only navigation
  - [x] Test with screen reader (if available)

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
