import "../types.js";

/**
 * @file Action types and action creator functions for state management
 * All state changes go through these actions
 */

// Action type constants
export const ActionTypes = {
  MOVE_TASK: "MOVE_TASK",
  ADD_TASK: "ADD_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  DELETE_TASK: "DELETE_TASK",
  ADD_BOARD: "ADD_BOARD",
  SELECT_BOARD: "SELECT_BOARD",
  UPDATE_BOARD: "UPDATE_BOARD",
  DELETE_BOARD: "DELETE_BOARD",
  SET_STATE: "SET_STATE",
};

/**
 * Move a task to a new status and position
 * @param {string} taskId - ID of the task to move
 * @param {import('../types.js').Status} newStatus - Target lane status
 * @param {number} newIndex - Target position index in lane (0-based)
 * @returns {import('../types.js').Action}
 */
export function moveTask(taskId, newStatus, newIndex) {
  return {
    type: ActionTypes.MOVE_TASK,
    payload: { taskId, newStatus, newIndex },
  };
}

/**
 * Add a new task to a board
 * @param {string} boardId - ID of the board to add task to
 * @param {import('../types.js').Task} task - The task object to add
 * @returns {import('../types.js').Action}
 */
export function addTask(boardId, task) {
  return {
    type: ActionTypes.ADD_TASK,
    payload: { boardId, task },
  };
}

/**
 * Update an existing task
 * @param {string} taskId - ID of the task to update
 * @param {Partial<import('../types.js').Task>} updates - Properties to update
 * @returns {import('../types.js').Action}
 */
export function updateTask(taskId, updates) {
  return {
    type: ActionTypes.UPDATE_TASK,
    payload: { taskId, updates },
  };
}

/**
 * Delete a task from a board
 * @param {string} taskId - ID of the task to delete
 * @returns {import('../types.js').Action}
 */
export function deleteTask(taskId) {
  return {
    type: ActionTypes.DELETE_TASK,
    payload: { taskId },
  };
}

/**
 * Add a new board
 * @param {import('../types.js').Board} board - The board object to add
 * @returns {import('../types.js').Action}
 */
export function addBoard(board) {
  return {
    type: ActionTypes.ADD_BOARD,
    payload: { board },
  };
}

/**
 * Select a board by ID
 * @param {string|null} boardId - ID of the board to select, or null to deselect
 * @returns {import('../types.js').Action}
 */
export function selectBoard(boardId) {
  return {
    type: ActionTypes.SELECT_BOARD,
    payload: { boardId },
  };
}

/**
 * Update board properties
 * @param {string} boardId - ID of the board to update
 * @param {Partial<import('../types.js').Board>} updates - Properties to update
 * @returns {import('../types.js').Action}
 */
export function updateBoard(boardId, updates) {
  return {
    type: ActionTypes.UPDATE_BOARD,
    payload: { boardId, updates },
  };
}

/**
 * Delete a board
 * @param {string} boardId - ID of the board to delete
 * @returns {import('../types.js').Action}
 */
export function deleteBoard(boardId) {
  return {
    type: ActionTypes.DELETE_BOARD,
    payload: { boardId },
  };
}

/**
 * Replace entire application state (e.g., when loading from storage)
 * @param {import('../types.js').AppState} state - The new state to set
 * @returns {import('../types.js').Action}
 */
export function setState(state) {
  return {
    type: ActionTypes.SET_STATE,
    payload: { state },
  };
}
