/**
 * Centralized JSDoc type definitions for the frontend application.
 * Import this file in modules that need type references.
 */

// Export empty object to make this a valid ES module
export {};
/**
 * Canonical status union for tasks/lanes.
 * @typedef {'todo'|'in-progress'|'done'} Status
 */

/**
 * @typedef {*} ApiClient - API client class (defined in scripts/api.js)
 */

/**
 * @typedef {Object} Task
 * @property {string} id - Unique task identifier
 * @property {string} title - Task title
 * @property {string} [description] - Optional description
 * @property {Status} status - Task status
 * @property {number} createdAt - Unix timestamp
 * @property {number} [updatedAt] - Last update timestamp
 */

/**
 * @typedef {Object} Board
 * @property {string} id - Unique board identifier
 * @property {string} name - Board name
 * @property {Task[]} tasks - List of tasks
 */

/**
 * @typedef {Object} AppState
 * @property {Board[]} boards - List of boards
 * @property {string|null} selectedBoardId - Currently selected board ID
 */

/**
 * @typedef {Object} AppOptions
 * @property {HTMLElement} container - Root container element
 * @property {import('./scripts/store.js').default} store - Application store instance
 * @property {import('./scripts/eventBus.js').default|null} [bus] - Event bus instance
 * @property {ApiClient|null} [api] - Optional API client
 */

/**
 * @typedef {Object} ComponentOptions
 * @property {HTMLElement} container - Container element
 * @property {import('./scripts/store.js').default} store - Store instance
 * @property {import('./scripts/eventBus.js').default|null} bus - Event bus instance (nullable)
 */

/**
 * @typedef {Object} TaskCardData
 * @property {Task} data - Task data
 * @property {import('./scripts/store.js').default} store - Store instance
 * @property {import('./scripts/eventBus.js').default|null} bus - Event bus instance (nullable)
 */

/**
 * @typedef {Object} ModalOptions
 * @property {HTMLElement} container - Container element
 */

/**
 * @callback EventHandler
 * @param {*} payload - Event payload
 * @returns {void}
 */

/**
 * @callback StateListener
 * @param {AppState} state - Current application state
 * @returns {void}
 */

/**
 * @callback UnsubscribeFn
 * @returns {void}
 */

/**
 * @typedef {Object} DragState
 * @property {string} taskId - ID of the task being dragged
 * @property {Status} sourceLane - Source lane status (todo|in-progress|done)
 * @property {number} sourceIndex - Original index in source lane
 */

/**
 * @typedef {Object} DropTarget
 * @property {Status} lane - Target lane status (todo|in-progress|done)
 * @property {number} index - Target insertion index in lane
 */
