# Product Roadmap

**Last Updated:** 2025-12-29

This document tracks long-term goals and future features for the kanban progress tracker application.

## Vision

Create a flexible, intuitive kanban-style progress tracker that supports multiple input methods (mouse, touch, keyboard) and provides a rich set of features for managing tasks and boards.

## Architectural Foundation (Q1 2025)

**Goal:** Establish a solid architectural foundation that makes future features easy to implement.

### Completed

- ✅ Basic kanban board display
- ✅ Drag-and-drop interaction (in progress)

### In Progress

- 🔄 Code architecture refactoring (proposal stage)

### Planned

- Clean separation of concerns (UI, interaction, state management)
- Action-based state management
- Modular interaction controllers
- Unified input handling system

**Why this matters:** A well-architected codebase will make all future features faster and easier to implement, with fewer bugs and better maintainability.

---

## Core Task Management Features

### Task Editing

**Priority:** High  
**Estimated Complexity:** Medium

**Features:**

- Edit task title inline or in modal
- Edit task description in modal
- Quick edit with keyboard shortcuts
- Auto-save changes
- Validation and error handling

**Dependencies:**

- Refactored architecture (modal controller, action system)

### Card Actions & Management

**Priority:** High  
**Estimated Complexity:** Medium

**Features:**

- Add new cards to any lane
- Delete/archive cards
- Duplicate/clone cards
- Hide cards temporarily
- Restore hidden cards
- Bulk operations (select multiple cards)

**Dependencies:**

- Action-based state management
- Modal system for confirmations

### Rich Task Details

**Priority:** Medium  
**Estimated Complexity:** High

**Features:**

- Full task modal with multiple sections
- Rich text description editor
- Due dates and reminders
- Tags and labels
- Priority levels
- Attachments/links
- Subtasks with progress tracking
- Comments and activity log

**Dependencies:**

- Modal system
- Additional state management
- Possibly rich text library (or stick with plain text)

---

## Board Customization Features

### Lane Management

**Priority:** High  
**Estimated Complexity:** Low-Medium

**Features:**

- Edit lane names
- Add new lanes dynamically
- Remove lanes
- Reorder lanes (drag-and-drop lanes themselves)
- Customize lane colors
- Set WIP limits per lane
- Collapse/expand lanes

**Dependencies:**

- Refactored architecture
- Lane state management

### Multiple Boards

**Priority:** Medium  
**Estimated Complexity:** Medium

**Features:**

- Create multiple boards
- Switch between boards
- Board templates
- Clone boards
- Archive boards
- Board settings and metadata

**Dependencies:**

- Board-level state management
- Navigation/routing (if needed)

### Board Views & Filters

**Priority:** Low  
**Estimated Complexity:** Medium

**Features:**

- Filter tasks by tags, priority, assignee
- Search tasks
- Sort within lanes
- Timeline/calendar view
- List view alternative
- Saved filter presets

**Dependencies:**

- Selector functions
- Additional UI components

---

## Input & Interaction Features

### Keyboard Support

**Priority:** High  
**Estimated Complexity:** Medium

**Features:**

- Navigate between cards with arrow keys
- Move cards between lanes with keyboard
- Quick add card with shortcut
- Quick edit with Enter key
- Delete with Delete/Backspace
- Search focus with / key
- Undo/redo with Ctrl+Z/Ctrl+Y
- Keyboard shortcuts help modal

**Dependencies:**

- KeyboardController implementation
- Action history for undo/redo

### Touch & Mobile Support

**Priority:** High  
**Estimated Complexity:** High

**Features:**

- Touch drag-and-drop
- Swipe gestures
- Long-press for context menu
- Pinch to zoom (if multi-board view)
- Touch-optimized UI elements
- Mobile-responsive layouts
- Pull to refresh

**Dependencies:**

- TouchController implementation
- Responsive CSS updates
- Touch event handling

### Accessibility

**Priority:** High  
**Estimated Complexity:** High

**Features:**

- Screen reader support
- Keyboard-only navigation
- Focus management
- ARIA labels and roles
- High contrast mode
- Reduced motion option
- Announcement of state changes

**Dependencies:**

- AccessibilityController
- Semantic HTML
- ARIA attributes

### Advanced Interactions

**Priority:** Low  
**Estimated Complexity:** Medium-High

**Features:**

- Multi-select cards (Shift+click, Ctrl+click)
- Bulk move selected cards
- Context menus (right-click)
- Hover previews
- Quick actions toolbar
- Drag to scroll
- Auto-scroll when dragging near edge

**Dependencies:**

- SelectionController
- Interaction system refactoring

---

## Collaboration & Sync Features

### Real-time Collaboration

**Priority:** Low  
**Estimated Complexity:** Very High

**Features:**

- Multiple users on same board
- Live cursor positions
- Real-time updates
- Conflict resolution
- User presence indicators
- Activity feed

**Dependencies:**

- Backend WebSocket support
- CRDT or OT for conflict resolution
- Authentication system

### Backend Integration

**Priority:** Medium  
**Estimated Complexity:** High

**Features:**

- API for task CRUD operations
- User authentication
- Data synchronization
- Offline mode with sync
- Cloud storage
- Data export/import

**Dependencies:**

- Backend API implementation
- Authentication system
- Sync strategy

---

## Power User Features

### Automation & Templates

**Priority:** Low  
**Estimated Complexity:** Medium

**Features:**

- Recurring tasks
- Task templates
- Automation rules (e.g., auto-move on date)
- Checklists
- Card age indicators
- Due date warnings

**Dependencies:**

- Rule engine
- Template system
- Time-based triggers

### Analytics & Reports

**Priority:** Low  
**Estimated Complexity:** Medium

**Features:**

- Task completion metrics
- Time in each status
- Burndown charts
- Velocity tracking
- Export reports
- Custom dashboards

**Dependencies:**

- Analytics data collection
- Charting library
- Report generation

---

## Technical Improvements

### Performance

- Virtual scrolling for large boards
- Lazy loading of cards
- Optimistic updates
- Service worker caching
- Code splitting

### Developer Experience

- Unit tests
- Integration tests
- E2E tests
- Storybook for components
- TypeScript migration (optional)
- CI/CD pipeline

### User Experience

- Onboarding tutorial
- Tooltips and hints
- Loading states
- Error boundaries
- Offline indicators
- Progressive Web App (PWA)

---

## Implementation Strategy

### Phase 1: Foundation (Current)

1. Complete drag-drop interaction
2. Refactor architecture
3. Implement input handling system

### Phase 2: Core Features

1. Task editing in modal
2. Add/delete cards
3. Lane management (edit names, add lanes)
4. Keyboard shortcuts (basic navigation and actions)

### Phase 3: Rich Interactions

1. Touch support
2. Advanced keyboard shortcuts
3. Accessibility improvements
4. Context menus and quick actions

### Phase 4: Expansion

1. Rich task details
2. Multiple boards
3. Filters and search
4. Templates

### Phase 5: Polish & Scale

1. Performance optimizations
2. Advanced features (automation, analytics)
3. Backend integration
4. Real-time collaboration

---

## Notes

- Features are prioritized based on user value and dependency order
- Architecture refactoring is foundational for all future features
- Mobile and accessibility should be considered for every feature
- Backend integration can be deferred by using localStorage effectively
- Start simple and iterate based on usage patterns

## Related Documents

- [openspec/changes/refactor-codebase-architecture/proposal.md](./changes/refactor-codebase-architecture/proposal.md) - Current refactoring proposal
- [openspec/project.md](./project.md) - Project context and conventions
