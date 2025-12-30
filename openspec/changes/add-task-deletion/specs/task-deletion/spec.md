# Spec Delta: Task Deletion

This spec defines task deletion capabilities for task cards on the kanban board.

---

## ADDED Requirements

### Requirement: Delete Button Visibility

Each task card SHALL display a delete button that allows users to remove the task permanently.

**Rationale**: Provides discoverable entry point for deleting tasks without cluttering the UI.

**Priority**: P0 (Critical)

#### Scenario: Delete button appears on desktop

**Given** the kanban board is displayed on a desktop viewport  
**When** the user hovers over a task card  
**Then** a delete button (trash icon) appears on the card  
**And** the button is positioned near the edit button with visual separation  
**And** the button has clear hover state (red background or scale effect)  
**And** the button has danger styling (red color) to indicate destructive action

#### Scenario: Delete button visible on mobile

**Given** the kanban board is displayed on a mobile viewport (≤768px width)  
**When** a task card is rendered  
**Then** the delete button is always visible (not hidden behind hover state)  
**And** the button has minimum 44px touch target area  
**And** the button is visually distinct from edit button (red color vs pencil icon)  
**And** adequate spacing exists between edit and delete buttons to prevent mis-clicks

---

### Requirement: Delete Confirmation

Clicking the delete button SHALL display a confirmation dialog before removing the task.

**Rationale**: Prevents accidental deletion of tasks by requiring explicit user confirmation.

**Priority**: P0 (Critical)

#### Scenario: User initiates task deletion

**Given** a task card is displayed on the board  
**When** the user clicks the delete button  
**Then** a confirmation dialog appears  
**And** the dialog message asks "Are you sure you want to delete this task? This cannot be undone."  
**And** the dialog provides "OK" and "Cancel" options  
**And** the dialog is modal (blocks interaction with rest of page)

#### Scenario: User confirms deletion

**Given** the delete confirmation dialog is displayed  
**When** the user clicks "OK"  
**Then** the dialog closes  
**And** the task is immediately removed from the board  
**And** the DELETE_TASK action is dispatched with the task ID  
**And** the task is removed from store state  
**And** the deletion persists to localStorage  
**And** other tasks in the lane reflow to fill the gap

#### Scenario: User cancels deletion

**Given** the delete confirmation dialog is displayed  
**When** the user clicks "Cancel"  
**Then** the dialog closes  
**And** the task remains on the board unchanged  
**And** no DELETE_TASK action is dispatched  
**And** no changes are made to store or localStorage

---

### Requirement: Task Removal from State

When a task is deleted, it SHALL be removed from the application state and persist the change.

**Rationale**: Ensures deleted tasks are permanently removed from storage and do not reappear.

**Priority**: P0 (Critical)

#### Scenario: Task removed from store state

**Given** a task with ID "task-123" exists in the store  
**When** the DELETE_TASK action is dispatched with task ID "task-123"  
**Then** the reducer filters out the task from the tasks array  
**And** a new state object is created (immutable update)  
**And** the store notifies subscribers of state change  
**And** components re-render to reflect updated state

#### Scenario: Deletion persists to localStorage

**Given** a task with ID "task-456" exists in localStorage  
**When** the task is deleted and state updates  
**Then** localStorage is updated with the new state  
**And** the deleted task no longer exists in localStorage  
**And** refreshing the page confirms task does not reappear

#### Scenario: Deleting task from specific lane

**Given** "To Do" lane has tasks [A, B, C]  
**And** task B is deleted  
**When** the state updates  
**Then** "To Do" lane displays tasks [A, C]  
**And** tasks A and C maintain their relative order  
**And** other lanes (In Progress, Done) are unaffected

---

### Requirement: Visual Feedback on Deletion

The task card SHALL provide visual feedback during the deletion process.

**Rationale**: Smooth transitions improve user experience and prevent confusion about whether action completed.

**Priority**: P1 (Nice to have)

#### Scenario: Delete button hover state

**Given** a task card is displayed  
**When** the user hovers over the delete button  
**Then** the button changes appearance (darker red or scale effect)  
**And** cursor changes to pointer  
**And** visual feedback is immediate (no delay)

#### Scenario: Optional fade-out animation

**Given** a task is confirmed for deletion  
**When** the DELETE_TASK action is processed  
**Then** the task card MAY fade out smoothly over ~200ms  
**And** the card is removed from DOM after animation completes  
**And** surrounding cards smoothly reflow to fill the gap

Note: Animation is optional for MVP. Immediate removal is acceptable.

---

### Requirement: Accessibility for Delete Action

The delete button SHALL be accessible via keyboard and screen readers.

**Rationale**: Ensures all users can delete tasks regardless of input method or assistive technology.

**Priority**: P0 (Critical)

#### Scenario: Keyboard navigation to delete button

**Given** a task card is displayed  
**When** the user presses Tab key repeatedly  
**Then** focus moves to the delete button  
**And** the button shows clear focus indicator (outline or border)  
**And** the button can be activated with Enter or Space key

#### Scenario: Screen reader announces delete button

**Given** a screen reader is active  
**When** focus moves to the delete button  
**Then** the screen reader announces "Delete task" or "Delete task: [task title]"  
**And** the button role is announced as "button"  
**And** screen reader users understand the button's purpose

#### Scenario: Confirmation dialog accessible

**Given** the delete confirmation dialog is displayed  
**And** a screen reader is active  
**When** the dialog opens  
**Then** focus moves to the dialog  
**And** the confirmation message is announced  
**And** OK and Cancel buttons are keyboard accessible  
**And** Escape key closes dialog (same as Cancel)

---

### Requirement: Delete Button Positioning

The delete button SHALL be positioned to minimize accidental activation while remaining discoverable.

**Rationale**: Balance accessibility with safety to prevent unintended deletions.

**Priority**: P1 (High)

#### Scenario: Button separated from edit button

**Given** a task card displays both edit and delete buttons  
**When** the buttons are rendered  
**Then** adequate spacing exists between them (≥8px)  
**And** delete button is positioned to the right of edit button  
**And** both buttons remain within card boundaries  
**And** buttons don't overlap on narrow viewports

#### Scenario: Visual distinction from edit button

**Given** a task card displays edit and delete buttons  
**When** rendered  
**Then** delete button uses red/danger color  
**And** edit button uses neutral or primary color  
**And** delete button icon is clearly a trash can  
**And** buttons are not easily confused with each other

---

### Requirement: Empty Lane Handling

Deleting all tasks from a lane SHALL NOT remove or hide the lane itself.

**Rationale**: Lanes represent task states and should persist even when empty.

**Priority**: P1 (High)

#### Scenario: Last task deleted from lane

**Given** the "In Progress" lane contains exactly one task  
**When** that task is deleted  
**Then** the "In Progress" lane remains visible  
**And** the lane displays empty state or placeholder  
**And** user can still drag tasks into the empty lane  
**And** lane header and structure are unaffected

---

## MODIFIED Requirements

None - this change is purely additive and does not modify existing requirements.

---

## REMOVED Requirements

None - no existing functionality is being removed.

---

## RENAMED Requirements

None - no requirements are being renamed.
