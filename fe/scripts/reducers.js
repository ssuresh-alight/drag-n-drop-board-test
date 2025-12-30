import "../types.js";
import { ActionTypes } from "./actions.js";

/**
 * @file Reducer functions for state transformations
 * All state updates are immutable - creating new objects instead of mutating
 */

/**
 * Root reducer that handles all actions and returns new state
 * @param {import('../types.js').AppState} state - Current application state
 * @param {import('../types.js').Action} action - Action to process
 * @returns {import('../types.js').AppState} - New state (immutable)
 */
export function rootReducer(state, action) {
  switch (action.type) {
    case ActionTypes.MOVE_TASK:
      return moveTaskReducer(state, action.payload);

    case ActionTypes.ADD_TASK:
      return addTaskReducer(state, action.payload);

    case ActionTypes.UPDATE_TASK:
      return updateTaskReducer(state, action.payload);

    case ActionTypes.DELETE_TASK:
      return deleteTaskReducer(state, action.payload);

    case ActionTypes.ADD_BOARD:
      return addBoardReducer(state, action.payload);

    case ActionTypes.SELECT_BOARD:
      return selectBoardReducer(state, action.payload);

    case ActionTypes.UPDATE_BOARD:
      return updateBoardReducer(state, action.payload);

    case ActionTypes.DELETE_BOARD:
      return deleteBoardReducer(state, action.payload);

    case ActionTypes.SET_STATE:
      return action.payload.state;

    default:
      return state;
  }
}

/**
 * Move a task to a new status and position
 * @param {import('../types.js').AppState} state
 * @param {{taskId: string, newStatus: import('../types.js').Status, newIndex: number}} payload
 * @returns {import('../types.js').AppState}
 */
function moveTaskReducer(state, { taskId, newStatus, newIndex }) {
  const board = state.selectedBoardId
    ? state.boards.find((b) => b.id === state.selectedBoardId)
    : state.boards[0];

  if (!board) return state;

  const taskIndex = board.tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return state;

  const task = board.tasks[taskIndex];
  const oldStatus = task.status;

  // Create new tasks array without the moved task
  const tasksWithoutMoved = [...board.tasks.slice(0, taskIndex), ...board.tasks.slice(taskIndex + 1)];

  // Update the task immutably
  const updatedTask = {
    ...task,
    status: newStatus,
    updatedAt: Date.now(),
  };

  // Find all tasks with the target status (after removing the moved task)
  const tasksWithTargetStatus = tasksWithoutMoved.filter((t) => t.status === newStatus);

  // Clamp newIndex to valid range
  const clampedIndex = Math.max(0, Math.min(newIndex, tasksWithTargetStatus.length));

  // Build new tasks array with task inserted at the correct position
  let newTasks;
  if (tasksWithTargetStatus.length === 0) {
    // No tasks with target status - add to end
    newTasks = [...tasksWithoutMoved, updatedTask];
  } else {
    // Find the insertion point in the full array
    const targetTask = tasksWithTargetStatus[clampedIndex];

    if (!targetTask) {
      // Insert after the last task with target status
      const lastTargetTask = tasksWithTargetStatus[tasksWithTargetStatus.length - 1];
      const lastTargetIndex = tasksWithoutMoved.indexOf(lastTargetTask);
      newTasks = [
        ...tasksWithoutMoved.slice(0, lastTargetIndex + 1),
        updatedTask,
        ...tasksWithoutMoved.slice(lastTargetIndex + 1),
      ];
    } else {
      // Insert before the target task
      const targetIndex = tasksWithoutMoved.indexOf(targetTask);
      newTasks = [
        ...tasksWithoutMoved.slice(0, targetIndex),
        updatedTask,
        ...tasksWithoutMoved.slice(targetIndex),
      ];
    }
  }

  // Create new board object immutably
  const updatedBoard = {
    ...board,
    tasks: newTasks,
  };

  // Create new boards array immutably
  const updatedBoards = state.boards.map((b) => (b.id === board.id ? updatedBoard : b));

  // Return new state immutably
  return {
    ...state,
    boards: updatedBoards,
  };
}

/**
 * Add a new task to a board
 * @param {import('../types.js').AppState} state
 * @param {{boardId: string, task: import('../types.js').Task}} payload
 * @returns {import('../types.js').AppState}
 */
function addTaskReducer(state, { boardId, task }) {
  const boardIndex = state.boards.findIndex((b) => b.id === boardId);
  if (boardIndex === -1) return state;

  const board = state.boards[boardIndex];
  const updatedBoard = {
    ...board,
    tasks: [...board.tasks, task],
  };

  const updatedBoards = [
    ...state.boards.slice(0, boardIndex),
    updatedBoard,
    ...state.boards.slice(boardIndex + 1),
  ];

  return {
    ...state,
    boards: updatedBoards,
  };
}

/**
 * Update an existing task
 * @param {import('../types.js').AppState} state
 * @param {{taskId: string, updates: Partial<import('../types.js').Task>}} payload
 * @returns {import('../types.js').AppState}
 */
function updateTaskReducer(state, { taskId, updates }) {
  let updatedBoards = state.boards;

  for (let i = 0; i < state.boards.length; i++) {
    const board = state.boards[i];
    const taskIndex = board.tasks.findIndex((t) => t.id === taskId);

    if (taskIndex !== -1) {
      const task = board.tasks[taskIndex];
      const updatedTask = {
        ...task,
        ...updates,
        updatedAt: Date.now(),
      };

      const updatedTasks = [
        ...board.tasks.slice(0, taskIndex),
        updatedTask,
        ...board.tasks.slice(taskIndex + 1),
      ];

      const updatedBoard = {
        ...board,
        tasks: updatedTasks,
      };

      updatedBoards = [...state.boards.slice(0, i), updatedBoard, ...state.boards.slice(i + 1)];

      break;
    }
  }

  return {
    ...state,
    boards: updatedBoards,
  };
}

/**
 * Delete a task from a board
 * @param {import('../types.js').AppState} state
 * @param {{taskId: string}} payload
 * @returns {import('../types.js').AppState}
 */
function deleteTaskReducer(state, { taskId }) {
  let updatedBoards = state.boards;

  for (let i = 0; i < state.boards.length; i++) {
    const board = state.boards[i];
    const taskIndex = board.tasks.findIndex((t) => t.id === taskId);

    if (taskIndex !== -1) {
      const updatedTasks = [...board.tasks.slice(0, taskIndex), ...board.tasks.slice(taskIndex + 1)];

      const updatedBoard = {
        ...board,
        tasks: updatedTasks,
      };

      updatedBoards = [...state.boards.slice(0, i), updatedBoard, ...state.boards.slice(i + 1)];

      break;
    }
  }

  return {
    ...state,
    boards: updatedBoards,
  };
}

/**
 * Add a new board
 * @param {import('../types.js').AppState} state
 * @param {{board: import('../types.js').Board}} payload
 * @returns {import('../types.js').AppState}
 */
function addBoardReducer(state, { board }) {
  return {
    ...state,
    boards: [...state.boards, board],
  };
}

/**
 * Select a board
 * @param {import('../types.js').AppState} state
 * @param {{boardId: string|null}} payload
 * @returns {import('../types.js').AppState}
 */
function selectBoardReducer(state, { boardId }) {
  return {
    ...state,
    selectedBoardId: boardId,
  };
}

/**
 * Update board properties
 * @param {import('../types.js').AppState} state
 * @param {{boardId: string, updates: Partial<import('../types.js').Board>}} payload
 * @returns {import('../types.js').AppState}
 */
function updateBoardReducer(state, { boardId, updates }) {
  const boardIndex = state.boards.findIndex((b) => b.id === boardId);
  if (boardIndex === -1) return state;

  const board = state.boards[boardIndex];
  const updatedBoard = {
    ...board,
    ...updates,
  };

  const updatedBoards = [
    ...state.boards.slice(0, boardIndex),
    updatedBoard,
    ...state.boards.slice(boardIndex + 1),
  ];

  return {
    ...state,
    boards: updatedBoards,
  };
}

/**
 * Delete a board
 * @param {import('../types.js').AppState} state
 * @param {{boardId: string}} payload
 * @returns {import('../types.js').AppState}
 */
function deleteBoardReducer(state, { boardId }) {
  const updatedBoards = state.boards.filter((b) => b.id !== boardId);

  // If we deleted the selected board, clear selection
  const updatedSelectedId = state.selectedBoardId === boardId ? null : state.selectedBoardId;

  return {
    ...state,
    boards: updatedBoards,
    selectedBoardId: updatedSelectedId,
  };
}
