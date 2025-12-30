import "../types.js";
import { getSelectedBoard } from "./selectors.js";

/**
 * Main application class that coordinates all components, controllers, and services
 */
export default class App {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.container - Root container element
   * @param {import('./store.js').default} options.store - Store instance
   * @param {*} [options.api] - Optional API client
   * @param {import('./eventBus.js').default|null} [options.bus] - Optional event bus
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

    /** @type {import('./ui/kanbanBoard.js').default|null} */
    this.board = null;
    /** @type {import('./input.js').default|null} */
    this.inputHandler = null;
    /** @type {typeof import('./input.js').default|null} */
    this.InputHandler = null;
    /** @type {typeof import('./interaction/dragDrop.js').default|null} */
    this.DragDropController = null;
  }

  /**
   * Initialize and start the application
   * @returns {Promise<void>}
   */
  async start() {
    if (!this.container || !this.store) return;

    // Import components and controllers
    const { default: KanbanBoard } = await import("./ui/kanbanBoard.js");
    const { default: InputHandler } = await import("./input.js");
    const { default: DragDropController } = await import("./interaction/dragDrop.js");

    // Store imported classes for later use
    this.InputHandler = InputHandler;
    this.DragDropController = DragDropController;

    // Initialize the kanban board (pure presentation)
    this.board = new KanbanBoard({ container: this.container });

    // Initial render with current board data
    const initialBoard = getSelectedBoard(this.store.state) || null;
    this.board.render(initialBoard);

    // Subscribe to store updates to re-render on changes
    this.store.subscribe((state) => {
      const board = getSelectedBoard(state) || null;
      if (this.board) {
        this.board.render(board);

        // Re-initialize DragDropController after re-render since DOM is rebuilt
        this.initializeDragDrop();
      }
    });

    // Initialize input handling and controllers
    this.initializeInputHandling();
  }

  /**
   * Initialize input handling and register controllers
   * @returns {void}
   */
  initializeInputHandling() {
    if (!this.InputHandler) return;

    // Create input handler
    this.inputHandler = new this.InputHandler({ store: this.store });

    // Initialize drag-drop controller
    this.initializeDragDrop();
  }

  /**
   * Initialize or re-initialize drag-drop controller
   * @returns {void}
   */
  initializeDragDrop() {
    if (!this.board || !this.inputHandler || !this.DragDropController) return;

    const boardElement = this.board.getBoardElement();
    if (!boardElement) return;

    // Unregister existing controller if present
    if (this.inputHandler.has("dragDrop")) {
      this.inputHandler.unregister("dragDrop");
    }

    // Create and register new drag-drop controller
    const dragDropController = new this.DragDropController({
      boardElement,
      store: this.store,
    });

    this.inputHandler.register("dragDrop", dragDropController);
  }

  /**
   * Clean up and destroy the application
   * @returns {void}
   */
  destroy() {
    // Destroy input handler and all controllers
    if (this.inputHandler) {
      this.inputHandler.destroy();
      this.inputHandler = null;
    }

    // Destroy board component
    if (this.board) {
      this.board.destroy();
      this.board = null;
    }
  }
}
