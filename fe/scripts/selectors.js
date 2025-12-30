import "../types.js";

/**
 * @file Selector functions for querying application state
 * Selectors provide a clean interface to query state without directly accessing its structure
 */

/**
 * Get the currently selected board
 * @param {import('../types.js').AppState} state
 * @returns {import('../types.js').Board|undefined}
 */
export function getSelectedBoard(state) {
  if (!state.selectedBoardId) {
    return state.boards[0]; // Default to first board if none selected
  }
  return state.boards.find((b) => b.id === state.selectedBoardId);
}

/**
 * Get a board by ID
 * @param {import('../types.js').AppState} state
 * @param {string} boardId
 * @returns {import('../types.js').Board|undefined}
 */
export function getBoardById(state, boardId) {
  return state.boards.find((b) => b.id === boardId);
}

/**
 * Get all boards
 * @param {import('../types.js').AppState} state
 * @returns {import('../types.js').Board[]}
 */
export function getAllBoards(state) {
  return state.boards;
}

/**
 * Get a task by ID from any board
 * @param {import('../types.js').AppState} state
 * @param {string} taskId
 * @returns {import('../types.js').Task|undefined}
 */
export function getTaskById(state, taskId) {
  for (const board of state.boards) {
    const task = board.tasks.find((t) => t.id === taskId);
    if (task) return task;
  }
  return undefined;
}

/**
 * Get all tasks from the selected board grouped by status
 * @param {import('../types.js').AppState} state
 * @returns {{todo: import('../types.js').Task[], 'in-progress': import('../types.js').Task[], done: import('../types.js').Task[]}}
 */
export function getTasksByStatus(state) {
  const board = getSelectedBoard(state);
  if (!board) {
    return { todo: [], "in-progress": [], done: [] };
  }

  return {
    todo: board.tasks.filter((t) => t.status === "todo"),
    "in-progress": board.tasks.filter((t) => t.status === "in-progress"),
    done: board.tasks.filter((t) => t.status === "done"),
  };
}

/**
 * Get tasks from a specific board by status
 * @param {import('../types.js').AppState} state
 * @param {string} boardId
 * @returns {{todo: import('../types.js').Task[], 'in-progress': import('../types.js').Task[], done: import('../types.js').Task[]}}
 */
export function getTasksByStatusForBoard(state, boardId) {
  const board = getBoardById(state, boardId);
  if (!board) {
    return { todo: [], "in-progress": [], done: [] };
  }

  return {
    todo: board.tasks.filter((t) => t.status === "todo"),
    "in-progress": board.tasks.filter((t) => t.status === "in-progress"),
    done: board.tasks.filter((t) => t.status === "done"),
  };
}

/**
 * Get the count of tasks in each status for the selected board
 * @param {import('../types.js').AppState} state
 * @returns {{todo: number, 'in-progress': number, done: number}}
 */
export function getTaskCounts(state) {
  const tasks = getTasksByStatus(state);
  return {
    todo: tasks.todo.length,
    "in-progress": tasks["in-progress"].length,
    done: tasks.done.length,
  };
}
