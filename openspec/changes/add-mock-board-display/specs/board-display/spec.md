# Spec Delta: Board Display

This spec defines the initial static board display capability.

---

## ADDED Requirements

### Requirement: Initial Board Rendering

The application SHALL render a kanban board with three status lanes on page load.

**Rationale**: Provides visual structure and foundation for the task management interface.

**Priority**: P0 (Critical)

#### Scenario: Application loads with mock board

**Given** the application starts  
**When** the page loads  
**Then** a kanban board is displayed with three vertical lanes  
**And** lanes are labeled "To Do", "In Progress", and "Done"  
**And** lanes are arranged horizontally on desktop  
**And** lanes stack vertically on mobile viewports

---

### Requirement: Mock Task Data

The application SHALL initialize with hardcoded sample tasks across all status lanes.

**Rationale**: Provides immediate visual feedback and validates component structure without requiring API or storage.

**Priority**: P0 (Critical)

#### Scenario: Board displays mock tasks

**Given** the application loads with mock data  
**When** the board renders  
**Then** the "To Do" lane contains at least 2 sample tasks  
**And** the "In Progress" lane contains at least 2 sample tasks  
**And** the "Done" lane contains at least 2 sample tasks  
**And** tasks have varied content (different title lengths, some with descriptions)

---

### Requirement: Task Card Display

Each task SHALL be displayed as a card element with title and optional description.

**Rationale**: Establishes the basic visual unit for tasks in the kanban board.

**Priority**: P0 (Critical)

#### Scenario: Task card shows content

**Given** a task with title "Fix navigation bug"  
**And** description "Update the routing logic to handle edge cases"  
**When** the task card renders  
**Then** the title is displayed prominently  
**And** the description is displayed below the title  
**And** both elements are readable and well-formatted

#### Scenario: Task card without description

**Given** a task with title "Review PR" and no description  
**When** the task card renders  
**Then** only the title is displayed  
**And** no empty description element is present  
**And** the card layout remains clean

---

### Requirement: Non-Interactive Cards

Task cards SHALL be display-only with no interactive behavior.

**Rationale**: Limits scope to visual foundation before adding complex interactions.

**Priority**: P0 (Critical)

#### Scenario: Cards do not respond to clicks

**Given** the board is displayed with task cards  
**When** a user clicks on any task card  
**Then** no action occurs  
**And** no handlers are triggered  
**And** card appearance does not change

#### Scenario: Cards are not draggable

**Given** the board is displayed with task cards  
**When** a user attempts to drag a card  
**Then** the card does not move  
**And** no drag-and-drop behavior occurs

---

### Requirement: Minimal Styling

The board and cards SHALL use a minimal design with white and gray color scheme.

**Rationale**: Establishes clean, professional baseline styling that can be enhanced later.

**Priority**: P1 (High)

#### Scenario: Card styling

**Given** a task card is rendered  
**Then** the card has a white or light gray background  
**And** the card has a visible gray border  
**And** the card has appropriate padding and spacing  
**And** typography is clean and readable  
**And** no colors other than whites and grays are used

#### Scenario: Board layout styling

**Given** the kanban board is displayed  
**Then** lanes have clear visual separation  
**And** headers are visually distinct from content  
**And** spacing between cards is consistent  
**And** overall layout is clean and uncluttered

---

### Requirement: Responsive Layout

The board SHALL adapt to different screen sizes maintaining usability.

**Rationale**: Ensures application works on both mobile and desktop devices per project requirements.

**Priority**: P1 (High)

#### Scenario: Desktop layout

**Given** the application is viewed on a desktop viewport (>768px width)  
**When** the board renders  
**Then** lanes are arranged horizontally side-by-side  
**And** all lanes are visible simultaneously  
**And** cards are easily scannable

#### Scenario: Mobile layout

**Given** the application is viewed on a mobile viewport (<768px width)  
**When** the board renders  
**Then** lanes stack vertically  
**And** each lane is fully visible in width  
**And** cards remain readable and well-formatted  
**And** no horizontal scrolling is required

---

## Technical Notes

### Tech Stack Constraints

- **Vanilla JavaScript only** - No TypeScript, no transpilation
- **JSDocs for types** - Use JSDoc comments for type safety (JSConfig is configured)
- **No build process** - Code must run directly in browsers without bundling/compilation
- **Plain HTML/CSS** - No preprocessors, no frameworks
- **ES6+ modules** - Use native JavaScript modules for organization

### Implementation Details

- KanbanBoard component is responsible for lane rendering and layout
- TaskCard component handles individual card rendering
- Mock data should be defined as a simple JavaScript object/array
- CSS should use flexbox or grid for responsive layouts

### Type Safety Notes (JSDoc)

- Define a reusable `Status` union (`'todo'|'in-progress'|'done'`) and reference it from `Task.status`.
- Type status maps explicitly as `Record<Status, Task[]>` (or equivalent JSDoc object literal) to avoid `never[]` inference.
- Ensure lane definitions use `key: Status` so `byStatus[lane.key]` is correctly typed.
- Annotate arrays and dynamic keys with precise JSDoc to prevent implicit `any` and index signature errors.
- For async functions, document with `@returns {Promise<void>}` in JSDoc to match implementation.
- No state management complexity needed for this display-only feature
- Components should accept data via constructor options following existing patterns
