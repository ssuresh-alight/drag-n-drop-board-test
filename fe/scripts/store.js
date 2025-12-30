import "../types.js";

export default class Store {
  /**
   * @param {import('../types.js').AppState} [initial]
   */
  constructor(initial = { boards: [], selectedBoardId: null }) {
    /** @type {import('../types.js').AppState} */
    this.state = initial;
    /** @type {Set<import('../types.js').StateListener>} */
    this.listeners = new Set();
  }

  /**
   * @param {import('../types.js').StateListener} fn
   * @returns {import('../types.js').UnsubscribeFn}
   */
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /**
   * @param {Partial<import('../types.js').AppState>} patch
   * @returns {void}
   */
  dispatch(patch) {
    // Placeholder: apply patch to state and notify listeners
    Object.assign(this.state, patch);
    for (const l of this.listeners) l(this.state);
    this.persist();
  }

  /**
   * @returns {void}
   */
  persist() {
    try {
      const raw = JSON.stringify(this.state);
      localStorage.setItem("app_state", raw);
    } catch (e) {
      // ignore for now
    }
  }

  /**
   * @returns {void}
   */
  load() {
    try {
      const raw = localStorage.getItem("app_state");
      if (!raw) return;
      this.state = JSON.parse(raw);
      for (const l of this.listeners) l(this.state);
    } catch (e) {
      // ignore parse errors
    }
  }

  /**
   * Move a task to a new status and position
   * @param {string} taskId - ID of task to move
   * @param {import('../types.js').Status} newStatus - Target lane status
   * @param {number} newIndex - Target position index in lane
   * @returns {void}
   */
  moveTask(taskId, newStatus, newIndex) {
    const board = this.state.selectedBoardId
      ? this.state.boards.find((b) => b.id === this.state.selectedBoardId)
      : this.state.boards[0];

    if (!board) return;

    // Find the task
    const taskIndex = board.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    const task = board.tasks[taskIndex];
    const oldStatus = task.status;

    // Remove task from current position
    board.tasks.splice(taskIndex, 1);

    // Update task status and timestamp
    task.status = newStatus;
    task.updatedAt = Date.now();

    // Find insertion point in the tasks array
    // Tasks are not necessarily sorted by status, so we need to:
    // 1. Get all tasks with the target status
    // 2. Find the correct insertion point
    // 3. Insert the task there

    const tasksWithTargetStatus = board.tasks.filter((t) => t.status === newStatus);

    // Clamp newIndex to valid range
    const clampedIndex = Math.max(0, Math.min(newIndex, tasksWithTargetStatus.length));

    if (tasksWithTargetStatus.length === 0) {
      // No tasks with target status, add to end
      board.tasks.push(task);
    } else if (clampedIndex === 0) {
      // Insert before first task with target status
      const firstTaskIndex = board.tasks.findIndex((t) => t.status === newStatus);
      board.tasks.splice(firstTaskIndex, 0, task);
    } else if (clampedIndex >= tasksWithTargetStatus.length) {
      // Insert after last task with target status
      const lastTask = tasksWithTargetStatus[tasksWithTargetStatus.length - 1];
      const lastTaskIndex = board.tasks.findIndex((t) => t.id === lastTask.id);
      board.tasks.splice(lastTaskIndex + 1, 0, task);
    } else {
      // Insert before the task at clampedIndex in the filtered list
      const targetTask = tasksWithTargetStatus[clampedIndex];
      const targetTaskIndex = board.tasks.findIndex((t) => t.id === targetTask.id);
      board.tasks.splice(targetTaskIndex, 0, task);
    }

    // Notify listeners and persist
    for (const l of this.listeners) l(this.state);
    this.persist();
  }
}
