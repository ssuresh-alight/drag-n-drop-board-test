# Spec Delta: Board Interaction

This spec defines drag-and-drop task interaction capabilities.

---

## ADDED Requirements

### Requirement: Task Draggability

Task cards SHALL be draggable using mouse or trackpad input.

**Rationale**: Enables users to move tasks between lanes and reorder within lanes, core functionality for kanban workflow.

**Priority**: P0 (Critical)

#### Scenario: User initiates drag on task card

**Given** the kanban board is displayed with task cards  
**When** the user clicks and holds on a task card  
**And** begins to move the mouse  
**Then** the drag operation starts  
**And** the card cursor changes to indicate dragging  
**And** the card visual appearance changes to indicate it is being dragged (opacity reduced to 0.5)

#### Scenario: User cancels drag operation

**Given** a task card is being dragged  
**When** the user presses ESC key or drags outside the browser window and releases  
**Then** the drag operation is cancelled  
**And** the task card returns to its original position  
**And** no state changes occur  
**And** the dragging visual state is removed

---

### Requirement: Drop Zone Identification

Lanes SHALL provide visual feedback indicating valid drop zones during drag operations.

**Rationale**: Users need clear feedback about where tasks can be dropped and where they will be inserted.

**Priority**: P0 (Critical)

#### Scenario: Dragging over a lane

**Given** a task card is being dragged  
**When** the user drags the card over a lane  
**Then** the lane provides visual feedback (highlight or border change)  
**And** potential insertion points between cards are indicated

#### Scenario: Dragging over empty lane

**Given** a task card is being dragged  
**When** the user drags the card over a lane with no tasks  
**Then** the entire lane area shows as a valid drop zone  
**And** visual feedback indicates the task will become the first item in that lane

#### Scenario: Dragging outside valid drop zones

**Given** a task card is being dragged  
**When** the user drags outside all lane areas  
**Then** no drop zone visual feedback is shown  
**And** the cursor indicates an invalid drop target

---

### Requirement: Task Insertion Between Cards

Users SHALL be able to insert dragged tasks at any position between existing tasks within lanes.

**Rationale**: Enables precise task ordering, allowing users to prioritize and sequence tasks as needed.

**Priority**: P0 (Critical)

#### Scenario: Drop task between two existing tasks

**Given** a lane contains tasks ["Task A", "Task B", "Task C"] in order  
**When** the user drags "Task X" from another lane  
**And** positions it between "Task A" and "Task B"  
**And** releases the mouse button  
**Then** "Task X" is inserted at that position  
**And** the resulting order is ["Task A", "Task X", "Task B", "Task C"]  
**And** the state persists to localStorage

#### Scenario: Drop task at top of lane

**Given** a lane contains tasks in order  
**When** the user drags a task and positions it before the first card  
**And** releases the mouse button  
**Then** the task is inserted at the beginning (index 0) of the lane  
**And** existing tasks shift down to maintain their relative order

#### Scenario: Drop task at bottom of lane

**Given** a lane contains tasks in order  
**When** the user drags a task and positions it after the last card  
**And** releases the mouse button  
**Then** the task is appended to the end of the lane  
**And** existing tasks remain in their positions

#### Scenario: Reorder task within same lane

**Given** a task "Task B" at position 1 in the "In Progress" lane  
**When** the user drags "Task B" to position 3 in the same lane  
**And** releases the mouse button  
**Then** "Task B" moves to the new position  
**And** intermediate tasks shift to fill the gap  
**And** the task's status remains "in-progress"

---

### Requirement: Drop Preview Placeholder

A visual placeholder SHALL appear at the insertion point while dragging to show where the task will be dropped.

**Rationale**: Provides clear, immediate feedback about drop position before user commits to the action.

**Priority**: P0 (Critical)

#### Scenario: Placeholder appears during drag-over

**Given** a task is being dragged over a lane  
**When** the drag position hovers over a valid insertion point  
**Then** a placeholder element appears at that position  
**And** the placeholder has the same width as task cards  
**And** the placeholder uses distinct styling (dashed border, semi-transparent background)

#### Scenario: Placeholder moves as drag position changes

**Given** a placeholder is showing at insertion point A  
**When** the user moves the drag position to insertion point B  
**Then** the placeholder smoothly repositions to insertion point B  
**And** only one placeholder is visible at any time

#### Scenario: Placeholder removed on drop or cancel

**Given** a placeholder is visible during drag  
**When** the user drops the task or cancels the drag  
**Then** the placeholder element is immediately removed from the DOM  
**And** no residual placeholder elements remain

#### Scenario: Placeholder prevents drop on self

**Given** a task is being dragged  
**When** the drag position hovers over the task's own current position  
**Then** no placeholder appears  
**Or** the placeholder indicates no change will occur  
**And** dropping the task at this position has no effect

---

### Requirement: Smooth Card Animation

Cards SHALL smoothly animate their positions when making room for a dropped task using CSS transitions.

**Rationale**: Smooth animations provide polished UX and help users understand the reordering action visually.

**Priority**: P1 (High)

#### Scenario: Cards shift down when placeholder appears

**Given** a lane contains cards ["Card A", "Card B", "Card C"]  
**When** a placeholder appears between "Card A" and "Card B"  
**Then** "Card B" and "Card C" smoothly translate downward  
**And** the translation animation duration is approximately 200ms  
**And** the animation uses ease timing function  
**And** the animation is GPU-accelerated (uses CSS transform)

#### Scenario: Cards shift up when placeholder moves away

**Given** cards have shifted down to make room for a placeholder  
**When** the placeholder moves to a different position or is removed  
**Then** the previously shifted cards smoothly return to their original positions  
**And** the animation matches the same duration and easing as shift-down

#### Scenario: Animation completes before next interaction

**Given** cards are animating due to placeholder movement  
**When** the user moves the placeholder again before animation completes  
**Then** a new animation starts from the current animated position  
**And** no visual glitches or jumps occur  
**And** the transition remains smooth

---

### Requirement: Task Status Update on Lane Change

When a task is dropped in a different lane, its status SHALL update to match the target lane.

**Rationale**: Task status must correspond to lane (todo, in-progress, done) to maintain data consistency.

**Priority**: P0 (Critical)

#### Scenario: Move task from "To Do" to "In Progress"

**Given** a task with status "todo" in the "To Do" lane  
**When** the user drags the task to the "In Progress" lane and drops it  
**Then** the task's status updates to "in-progress"  
**And** the task appears in the "In Progress" lane  
**And** the state persists to localStorage

#### Scenario: Move task from "In Progress" to "Done"

**Given** a task with status "in-progress" in the "In Progress" lane  
**When** the user drags the task to the "Done" lane and drops it  
**Then** the task's status updates to "done"  
**And** the task appears in the "Done" lane  
**And** the state persists to localStorage

#### Scenario: Move completed task back to "In Progress"

**Given** a task with status "done" in the "Done" lane  
**When** the user drags the task back to the "In Progress" lane and drops it  
**Then** the task's status updates to "in-progress"  
**And** the task appears in the "In Progress" lane  
**And** this represents reopening or un-completing the task

---

### Requirement: State Persistence After Drop

Task position and status changes SHALL persist to localStorage after successful drop operations.

**Rationale**: Ensures user changes are not lost on page reload, maintaining data integrity.

**Priority**: P0 (Critical)

#### Scenario: Task order persists after page reload

**Given** a user reorders tasks via drag-and-drop  
**And** tasks are in order ["Task A", "Task B", "Task C"] in the "To Do" lane  
**When** the user reloads the page  
**Then** tasks appear in the same order ["Task A", "Task B", "Task C"]  
**And** positions are restored from localStorage

#### Scenario: Task status persists after page reload

**Given** a user moves a task from "To Do" to "Done"  
**When** the user reloads the page  
**Then** the task still appears in the "Done" lane  
**And** the task's status is "done"  
**And** the data is restored from localStorage

---

### Requirement: Desktop-Only Interaction (Touch Deferred)

Drag-and-drop SHALL work with mouse and trackpad input on desktop browsers.

**Rationale**: Focuses initial implementation on primary use case; touch support adds complexity and will be addressed in future iteration.

**Priority**: P0 (Critical)

#### Scenario: Drag-and-drop works on desktop browsers

**Given** the application is accessed on a desktop browser (Chrome, Firefox, Safari, Edge)  
**When** the user uses a mouse or trackpad to drag tasks  
**Then** all drag-and-drop functionality works as specified  
**And** no console errors or warnings occur

#### Scenario: Touch devices have limited interaction

**Given** the application is accessed on a touch device (smartphone, tablet)  
**When** the user attempts to drag a task using touch  
**Then** the drag operation may not work (HTML5 drag-and-drop limitation)  
**And** a future change will address touch support  
**And** the application remains usable for viewing tasks

---

### Requirement: No Drag-and-Drop Errors

Drag-and-drop operations SHALL complete without visual glitches, console errors, or state corruption.

**Rationale**: Ensures robust, production-quality implementation with proper error handling.

**Priority**: P0 (Critical)

#### Scenario: Successful drag-and-drop produces no errors

**Given** a task is dragged and dropped successfully  
**When** the operation completes  
**Then** no JavaScript errors appear in the console  
**And** no visual glitches occur (layout jumps, phantom elements)  
**And** the state accurately reflects the new task position and status

#### Scenario: Cancelled drag produces no side effects

**Given** a task drag is cancelled (ESC key or drag outside window)  
**When** the drag operation ends  
**Then** no state changes occur  
**And** no errors are logged  
**And** the UI returns to its original state  
**And** no placeholder elements remain in the DOM

#### Scenario: Rapid repeated drags remain stable

**Given** a user performs multiple drag-and-drop operations in quick succession  
**When** the user drags different tasks rapidly  
**Then** each operation completes correctly  
**And** the state remains consistent and accurate  
**And** no race conditions or corrupted state occur  
**And** animations do not conflict or create visual artifacts

---

## MODIFIED Requirements

### Requirement: Task Card Display

Each task SHALL be displayed as a draggable card element with title and optional description.

**Rationale**: Extends existing static card display to support drag interaction.

**Priority**: P0 (Critical)

#### Scenario: Task card shows content (unchanged)

**Given** a task with title "Fix navigation bug"  
**And** description "Update the routing logic to handle edge cases"  
**When** the task card renders  
**Then** the title is displayed prominently  
**And** the description is displayed below the title  
**And** both elements are readable and well-formatted

#### Scenario: Task card without description (unchanged)

**Given** a task with title "Review PR" and no description  
**When** the task card renders  
**Then** only the title is displayed  
**And** no empty description element is present  
**And** the card layout remains clean

#### Scenario: Task card is draggable

**Given** a task card is rendered  
**Then** the card has the `draggable="true"` attribute  
**And** the card shows a grab cursor on hover  
**And** the card responds to drag events

---

## REMOVED Requirements

### Requirement: Non-Interactive Cards

**Reason**: This requirement is being replaced by interactive drag-and-drop functionality. Cards are no longer display-only.

**Migration**: Existing code that relies on cards being non-interactive does not need migration; the addition of interactivity is purely additive and does not break existing behavior when drag is not initiated.

---
