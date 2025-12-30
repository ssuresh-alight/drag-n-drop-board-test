import "../../types.js";
import TaskCard from "./taskCard.js";

export default class KanbanBoard {
  /**
   * @param {Partial<import('../../types.js').ComponentOptions>} [options]
   */
  constructor({ container, store, bus } = {}) {
    /** @type {HTMLElement|undefined} */
    this.container = container;
    /** @type {import('../store.js').default|undefined} */
    this.store = store;
    /** @type {import('../eventBus.js').default|null|undefined} */
    this.bus = bus;
  }

  /**
   * @returns {void}
   */
  render() {
    if (!this.container || !this.store) return;
    const state = this.store.state;
    const board = state.selectedBoardId
      ? state.boards.find((b) => b.id === state.selectedBoardId)
      : state.boards[0];
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

      const header = document.createElement("header");
      header.className = "lane-header";
      header.textContent = lane.label;
      laneEl.appendChild(header);

      const list = document.createElement("div");
      list.className = "cards";
      for (const t of byStatus[lane.key]) {
        const card = new TaskCard({ data: t, store: this.store, bus: this.bus }).render();
        if (card) list.appendChild(card);
      }
      laneEl.appendChild(list);

      boardEl.appendChild(laneEl);
    }

    // Clear and mount
    this.container.innerHTML = "";
    this.container.appendChild(boardEl);
  }
}
