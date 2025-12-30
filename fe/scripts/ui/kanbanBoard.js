import "../../types.js";
import TaskCard from "./taskCard.js";

/**
 * Pure presentational component for rendering the Kanban board
 * Does not manage state or handle interactions - only renders what it receives
 */
export default class KanbanBoard {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.container - Container element for the board
   * @param {Function} [options.dispatch] - Optional dispatch function for task updates
   */
  constructor({ container, dispatch }) {
    /** @type {HTMLElement} */
    this.container = container;
    /** @type {import('../../types.js').Board|null} */
    this.currentBoard = null;
    /** @type {Function} */
    this.dispatch = dispatch || (() => {});
  }

  /**
   * Render the board with given data
   * @param {import('../../types.js').Board|null} board - Board data to render
   * @returns {void}
   */
  render(board) {
    if (!this.container) return;

    this.currentBoard = board;

    /** @type {import('../../types.js').Task[]} */
    const tasks = board ? board.tasks : [];

    /** @type {{
     *  todo: import('../../types.js').Task[],
     *  'in-progress': import('../../types.js').Task[],
     *  done: import('../../types.js').Task[]
     * }} */
    const byStatus = {
      todo: [],
      "in-progress": [],
      done: [],
    };
    for (const t of tasks) {
      if (t && t.status && byStatus[t.status]) byStatus[t.status].push(t);
    }

    const boardEl = document.createElement("div");
    boardEl.className = "board";

    /** @type {{key: 'todo'|'in-progress'|'done', label: string}[]} */
    const lanes = [
      { key: "todo", label: "To Do" },
      { key: "in-progress", label: "In Progress" },
      { key: "done", label: "Done" },
    ];

    for (const lane of lanes) {
      const laneEl = document.createElement("section");
      laneEl.className = "lane";
      laneEl.dataset.status = lane.key;

      const header = document.createElement("header");
      header.className = "lane-header";
      header.textContent = lane.label;
      laneEl.appendChild(header);

      const list = document.createElement("div");
      list.className = "cards";
      for (const t of byStatus[lane.key]) {
        const card = new TaskCard({ data: t, dispatch: this.dispatch }).render();
        if (card) list.appendChild(card);
      }
      laneEl.appendChild(list);

      boardEl.appendChild(laneEl);
    }

    // Clear and mount
    this.container.innerHTML = "";
    this.container.appendChild(boardEl);
  }

  /**
   * Get the board element (useful for attaching controllers)
   * @returns {HTMLElement|null}
   */
  getBoardElement() {
    return this.container ? this.container.querySelector(".board") : null;
  }

  /**
   * Destroy the board component
   * @returns {void}
   */
  destroy() {
    if (this.container) {
      this.container.innerHTML = "";
    }
    this.currentBoard = null;
  }
}
