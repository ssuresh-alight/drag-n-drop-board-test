# Implementation Tasks: Add Task Deletion

## Checklist

- [ ] **Add delete action to store** - Create DELETE_TASK action and reducer

  - [ ] Add DELETE_TASK action type constant to actions.js
  - [ ] Create deleteTask action creator in actions.js
  - [ ] Add DELETE_TASK reducer case in reducers.js to filter out deleted task
  - [ ] Ensure reducer creates new state array (immutable update)
  - [ ] Verify localStorage persistence after deletion

- [ ] **Update TaskCard component** - Add delete button and confirmation logic

  - [ ] Add delete button (trash icon) to card render method
  - [ ] Position delete button near edit button with visual separation
  - [ ] Add event listener for delete button click
  - [ ] Implement confirmation dialog (browser confirm or custom modal)
  - [ ] Dispatch deleteTask action on confirmation
  - [ ] Add keyboard event handler for delete button (Enter/Space)
  - [ ] Ensure proper button cleanup on component destroy

- [ ] **Add styles for delete button** - Create CSS for delete button

  - [ ] Style delete button with trash icon (SVG or Unicode 🗑️)
  - [ ] Add danger styling (red color) to distinguish from edit button
  - [ ] Style hover states (darker red, scale effect)
  - [ ] Add focus indicators for accessibility
  - [ ] Ensure mobile responsiveness (touch targets ≥44px)
  - [ ] Add spacing between edit and delete buttons
  - [ ] Optional: Add fade-out animation for deleted cards

- [ ] **Add accessibility features** - Ensure keyboard and screen reader support

  - [ ] Add ARIA label to delete button ("Delete task")
  - [ ] Ensure delete button is keyboard focusable (tab order logical)
  - [ ] Test screen reader announcement for delete action
  - [ ] Verify confirmation dialog is accessible

- [ ] **Test and validate** - Manual testing across scenarios
  - [ ] Test deleting a task from To Do lane
  - [ ] Test deleting a task from In Progress lane
  - [ ] Test deleting a task from Done lane
  - [ ] Test confirmation dialog appears before deletion
  - [ ] Test clicking Cancel in confirmation preserves task
  - [ ] Test clicking OK in confirmation removes task
  - [ ] Test deletion persists after page reload
  - [ ] Test deleting multiple tasks in sequence
  - [ ] Test delete button on mobile (touch targets, no mis-clicks)
  - [ ] Test keyboard navigation (Tab to focus, Enter/Space to activate)
  - [ ] Test with screen reader (if available)
  - [ ] Verify no console errors during deletion
  - [ ] Test deleting last task in a lane (lane remains visible)

## Implementation Notes

- Delete button should use trash can icon (SVG or Unicode 🗑️)
- Confirmation should use browser `window.confirm()` for MVP (simple and accessible)
- Confirmation message: "Are you sure you want to delete this task? This cannot be undone."
- Delete button should have red/danger color to indicate destructive action
- Position delete button to the right of edit button with adequate spacing (8-12px)
- Consider adding data attribute `data-task-id` to delete button for easier event handling
- DELETE_TASK reducer should use `.filter()` to remove task by ID
- Store update should trigger re-render automatically through existing subscription mechanism
- For smoother UX, consider adding brief fade-out CSS transition before removal (optional)

## Dependencies

None - uses existing state management, browser confirm dialog, and HTML button elements.

## Estimated Time

2-3 hours total

- Store action and reducer: 0.5 hour
- TaskCard component updates: 1 hour
- CSS styling: 0.5 hour
- Testing and refinement: 0.5-1 hour
