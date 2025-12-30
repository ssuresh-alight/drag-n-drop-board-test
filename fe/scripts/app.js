import "../types.js";

export default class App {
  /**
   * @param {import('../types.js').AppOptions} options
   */
  constructor({ container, store, api = null, bus = null }) {
    /** @type {HTMLElement} */
    this.container = container;
    /** @type {import('./store.js').default} */
    this.store = store;
    /** @type {*} */
    this.api = api;
    /** @type {import('./eventBus.js').default|null} */
    this.bus = bus;
  }

  /**
   * @returns {Promise<void>}
   */
  async start() {
    if (!this.container || !this.store) return;

    // Render the kanban board into the root container
    const { default: KanbanBoard } = await import("./ui/kanbanBoard.js");
    const board = new KanbanBoard({ container: this.container, store: this.store, bus: this.bus });
    board.render();

    // Subscribe to store updates to re-render on changes
    this.store.subscribe(() => {
      board.render();
    });
  }
}
