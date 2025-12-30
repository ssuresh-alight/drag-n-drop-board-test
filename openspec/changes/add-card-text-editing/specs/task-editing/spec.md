# Spec Delta: Task Editing

This spec defines inline task editing capabilities for task cards.

---

## ADDED Requirements

### Requirement: Edit Button Visibility

Each task card SHALL display an edit button that allows users to enter edit mode.

**Rationale**: Provides discoverable entry point for editing task details without cluttering the UI.

**Priority**: P0 (Critical)

#### Scenario: Edit button appears on desktop

**Given** the kanban board is displayed on a desktop viewport  
**When** the user hovers over a task card  
**Then** an edit button (pencil icon) appears on the card  
**And** the button is positioned in a consistent location (top-right corner)  
**And** the button has clear hover state (background color change or scale)

#### Scenario: Edit button visible on mobile

**Given** the kanban board is displayed on a mobile viewport (≤768px width)  
**When** a task card is rendered  
**Then** the edit button is always visible (not hidden behind hover state)  
**And** the button has minimum 44px touch target area  
**And** the button is easily tappable without accidentally triggering drag

---

### Requirement: Edit Mode Activation

Clicking the edit button SHALL transform the task card into edit mode with editable input fields.

**Rationale**: Enables users to modify task details inline without opening a separate modal or navigating away.

**Priority**: P0 (Critical)

#### Scenario: User enters edit mode

**Given** a task card is displayed with title "Original Title" and description "Original Description"  
**When** the user clicks the edit button  
**Then** the card enters edit mode  
**And** the static title text is replaced with an `<input>` field containing "Original Title"  
**And** the static description text is replaced with a `<textarea>` field containing "Original Description"  
**And** the title input receives keyboard focus automatically  
**And** the title input text is selected for easy replacement  
**And** Save and Cancel buttons appear  
**And** the edit button is hidden

#### Scenario: User enters edit mode on card with no description

**Given** a task card has title "Task Title" and no description  
**When** the user clicks the edit button  
**Then** the card enters edit mode  
**And** the title input contains "Task Title"  
**And** the description textarea is empty but visible  
**And** the user can add a description if desired

---

### Requirement: Title Validation

The title field SHALL be required and cannot be saved when empty.

**Rationale**: Every task must have a title to be identifiable and meaningful.

**Priority**: P0 (Critical)

#### Scenario: Save button disabled with empty title

**Given** a task card is in edit mode  
**When** the user deletes all text from the title input  
**Then** the Save button becomes disabled  
**And** visual feedback indicates the title is required (e.g., red border)  
**And** clicking Save button does nothing

#### Scenario: Save button enabled with valid title

**Given** a task card is in edit mode  
**And** the title input is empty  
**When** the user types at least one character into the title input  
**Then** the Save button becomes enabled  
**And** the validation error state is cleared

---

### Requirement: Save Changes

Users SHALL be able to save edited task details using Save button or Enter key.

**Rationale**: Provides clear action to commit changes with both mouse and keyboard.

**Priority**: P0 (Critical)

#### Scenario: Save changes with Save button

**Given** a task card is in edit mode with title "Updated Title" and description "Updated Description"  
**And** the title is not empty  
**When** the user clicks the Save button  
**Then** the card exits edit mode  
**And** the card displays the updated title "Updated Title"  
**And** the card displays the updated description "Updated Description"  
**And** the UPDATE_TASK action is dispatched with updated task data  
**And** the changes persist to localStorage  
**And** the task's `updatedAt` timestamp is set to current time

#### Scenario: Save changes with Enter key in title input

**Given** a task card is in edit mode  
**And** the title input has focus  
**And** the title is not empty  
**When** the user presses the Enter key  
**Then** the changes are saved  
**And** the card exits edit mode  
**And** the card displays the updated content

#### Scenario: Save changes with Enter key in description textarea

**Given** a task card is in edit mode  
**And** the description textarea has focus  
**When** the user presses Enter key  
**Then** a newline is inserted in the textarea  
**And** the card remains in edit mode (Enter does not save from textarea)

Note: To save from textarea, user must use Save button or Ctrl+Enter (implementation choice).

#### Scenario: Save with empty description

**Given** a task card is in edit mode with non-empty title  
**When** the user clears the description textarea  
**And** saves the changes  
**Then** the task is saved with empty description  
**And** the card displays only the title (no description section)

---

### Requirement: Cancel Changes

Users SHALL be able to cancel editing and discard changes using Cancel button or Escape key.

**Rationale**: Allows users to abort edits without unintended modifications to task data.

**Priority**: P0 (Critical)

#### Scenario: Cancel changes with Cancel button

**Given** a task card is in edit mode  
**And** the original title was "Original Title"  
**And** the user has modified the title to "Modified Title"  
**When** the user clicks the Cancel button  
**Then** the card exits edit mode  
**And** the card displays the original title "Original Title"  
**And** no UPDATE_TASK action is dispatched  
**And** no changes are persisted to localStorage

#### Scenario: Cancel changes with Escape key

**Given** a task card is in edit mode  
**And** the user has made modifications  
**When** the user presses the Escape key  
**Then** the card exits edit mode  
**And** all changes are discarded  
**And** the card displays original content

---

### Requirement: Visual Edit Mode Indication

Cards in edit mode SHALL have distinct visual styling to clearly indicate editing state.

**Rationale**: Users need clear feedback about which card is being edited and that they're in edit mode.

**Priority**: P1 (Important)

#### Scenario: Edit mode styling applied

**Given** a task card enters edit mode  
**Then** the card has a distinct visual treatment such as:

- Border color change (e.g., blue border)
- Background color tint (e.g., light blue background)
- Box shadow increase (e.g., raised elevation)  
  **And** the card is clearly distinguishable from non-editing cards

---

### Requirement: Keyboard Accessibility

Edit mode SHALL support full keyboard navigation without requiring a mouse.

**Rationale**: Ensures accessibility for keyboard-only users and power users who prefer keyboard shortcuts.

**Priority**: P1 (Important)

#### Scenario: Keyboard navigation through edit form

**Given** a task card is in edit mode  
**And** the title input has focus  
**When** the user presses Tab  
**Then** focus moves to the description textarea  
**When** the user presses Tab again  
**Then** focus moves to the Save button  
**When** the user presses Tab again  
**Then** focus moves to the Cancel button  
**When** the user presses Shift+Tab  
**Then** focus moves back to the Save button

#### Scenario: Screen reader announces edit mode

**Given** a screen reader is active  
**When** the user clicks the edit button  
**Then** the screen reader announces "Editing task" or similar  
**And** input fields have proper labels announced (e.g., "Title", "Description")  
**And** button labels are announced (e.g., "Save changes", "Cancel editing")

---

### Requirement: Focus Management

Focus SHALL be automatically managed when entering and exiting edit mode.

**Rationale**: Provides smooth user experience and ensures keyboard users land in the right place.

**Priority**: P1 (Important)

#### Scenario: Focus set on title input when entering edit mode

**Given** a task card is in display mode  
**When** the user clicks the edit button  
**Then** the title input field receives keyboard focus automatically  
**And** the existing title text is selected for easy replacement

#### Scenario: Focus returns to card or edit button after saving

**Given** a task card is in edit mode  
**When** the user saves changes  
**Then** focus returns to the task card or the edit button  
**And** keyboard navigation can continue from that point

#### Scenario: Focus returns after canceling

**Given** a task card is in edit mode  
**When** the user cancels editing  
**Then** focus returns to the task card or the edit button  
**And** no focus is lost to the document body

---

### Requirement: Drag Interaction During Edit Mode

Task cards in edit mode SHALL NOT be draggable to prevent conflicts between dragging and text selection.

**Rationale**: Prevents accidental drag initiation while user is selecting or editing text in input fields.

**Priority**: P1 (Important)

#### Scenario: Dragging disabled in edit mode

**Given** a task card is in edit mode  
**When** the user attempts to drag the card  
**Then** the drag operation does not initiate  
**And** the cursor remains as text cursor within input fields  
**And** text selection works normally

#### Scenario: Dragging re-enabled after exiting edit mode

**Given** a task card exits edit mode (saved or canceled)  
**When** the card returns to display mode  
**Then** the card becomes draggable again  
**And** drag-and-drop functionality works normally

---

## MODIFIED Requirements

None - this is a new capability.

---

## REMOVED Requirements

None - no existing requirements are being removed.

---

## RENAMED Requirements

None - no existing requirements are being renamed.
