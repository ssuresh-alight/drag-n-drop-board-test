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

    /** @type {string|null} */
    this.draggedTaskId = null;
    /** @type {HTMLElement|null} */
    this.placeholderElement = null;
    /** @type {import('../../types.js').DropTarget|null} */
    this.dropTarget = null;

    // Bind event handlers
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDocumentDragEnd = this.handleDocumentDragEnd.bind(this);
    this.handleDocumentDrop = this.handleDocumentDrop.bind(this);

    // Add document-level listeners to catch drag end anywhere
    document.addEventListener("dragend", this.handleDocumentDragEnd);
    document.addEventListener("drop", this.handleDocumentDrop);
  }

  /**
   * Create a placeholder element for drop preview
   * @returns {HTMLElement}
   */
  createPlaceholder() {
    const placeholder = document.createElement("div");
    placeholder.className = "card-placeholder";
    return placeholder;
  }

  /**
   * Remove placeholder from DOM
   * @returns {void}
   */
  removePlaceholder() {
    if (this.placeholderElement && this.placeholderElement.parentNode) {
      this.placeholderElement.parentNode.removeChild(this.placeholderElement);
    }
    this.placeholderElement = null;
  }

  /**
   * Calculate drop position based on mouse Y coordinate
   * @param {HTMLElement} cardsContainer
   * @param {number} clientY
   * @returns {number} - Index for insertion
   */
  calculateDropIndex(cardsContainer, clientY) {
    const cards = Array.from(cardsContainer.querySelectorAll(".card:not(.dragging)"));

    if (cards.length === 0) {
      return 0;
    }

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const rect = card.getBoundingClientRect();
      const cardMiddle = rect.top + rect.height / 2;

      if (clientY < cardMiddle) {
        return i;
      }
    }

    // If we're past all cards, insert at the end
    return cards.length;
  }

  /**
   * Handle drag over event
   * @param {DragEvent} e
   */
  handleDragOver(e) {
    e.preventDefault();
    if (!e.dataTransfer) return;

    e.dataTransfer.dropEffect = "move";

    const laneEl = e.currentTarget;
    if (!(laneEl instanceof HTMLElement)) return;

    // Add drag-over class to lane
    laneEl.classList.add("drag-over");

    // Get lane status from dataset or determine from structure
    const laneStatus = laneEl.dataset.status;
    if (!laneStatus) return;

    // Find cards container
    const cardsContainer = laneEl.querySelector(".cards");
    if (!cardsContainer || !(cardsContainer instanceof HTMLElement)) return;

    // Calculate insertion index
    const dropIndex = this.calculateDropIndex(cardsContainer, e.clientY);

    // Create or reuse placeholder
    if (!this.placeholderElement) {
      this.placeholderElement = this.createPlaceholder();
    }

    // FLIP animation: Record "First" positions before layout change
    const cards = Array.from(cardsContainer.querySelectorAll(".card:not(.dragging)"));
    const firstPositions = new Map();
    cards.forEach((card) => {
      firstPositions.set(card, card.getBoundingClientRect().top);
    });

    // Insert placeholder at calculated position (causes layout change)
    if (dropIndex === 0) {
      cardsContainer.insertBefore(this.placeholderElement, cardsContainer.firstChild);
    } else if (dropIndex >= cards.length) {
      cardsContainer.appendChild(this.placeholderElement);
    } else {
      cardsContainer.insertBefore(this.placeholderElement, cards[dropIndex]);
    }

    // FLIP animation: Record "Last" positions and animate
    cards.forEach((card) => {
      if (!(card instanceof HTMLElement)) return;

      const firstTop = firstPositions.get(card);
      const lastTop = card.getBoundingClientRect().top;
      const deltaY = firstTop - lastTop;

      if (deltaY !== 0) {
        // "Invert" - Move card back to where it was
        card.style.transform = `translateY(${deltaY}px)`;
        card.style.transition = "none";

        // "Play" - Animate to new position
        requestAnimationFrame(() => {
          card.style.transition = "transform 0.1s ease-out";
          card.style.transform = "translateY(0)";
        });
      }
    });

    // Update drop target
    this.dropTarget = {
      lane: /** @type {import('../../types.js').Status} */ (laneStatus),
      index: dropIndex,
    };
  }

  /**
   * Handle drop event
   * @param {DragEvent} e
   */
  handleDrop(e) {
    e.preventDefault();
    if (!e.dataTransfer || !this.store) return;

    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId || !this.dropTarget) {
      this.cleanupDragState();
      return;
    }

    // Call store to move task
    this.store.moveTask(taskId, this.dropTarget.lane, this.dropTarget.index);

    // Cleanup
    this.cleanupDragState();
  }

  /**
   * Handle drag leave event
   * @param {DragEvent} e
   */
  handleDragLeave(e) {
    const laneEl = e.currentTarget;
    if (!(laneEl instanceof HTMLElement)) return;

    // Only remove drag-over if we're actually leaving the lane
    // (not just moving to a child element)
    if (!laneEl.contains(/** @type {Node} */ (e.relatedTarget))) {
      laneEl.classList.remove("drag-over");
      // Remove placeholder when leaving the lane
      this.removePlaceholder();
    }
  }

  /**
   * Handle document-level dragend (catches drag ending anywhere)
   * @param {DragEvent} e
   */
  handleDocumentDragEnd(e) {
    // Clean up any drag state when drag ends anywhere
    this.cleanupDragState();
  }

  /**
   * Handle document-level drop (catches drops outside lanes)
   * @param {DragEvent} e
   */
  handleDocumentDrop(e) {
    // If drop happens outside our lanes, clean up
    // The lane-specific drop handler will handle drops inside lanes
    if (!e.defaultPrevented) {
      this.cleanupDragState();
    }
  }

  /**
   * Clean up drag state
   * @returns {void}
   */
  cleanupDragState() {
    this.removePlaceholder();
    this.draggedTaskId = null;
    this.dropTarget = null;

    // Remove drag-over class from all lanes
    if (this.container) {
      const lanes = this.container.querySelectorAll(".lane");
      lanes.forEach((lane) => {
        lane.classList.remove("drag-over");
      });
    }
  }

  /**
   * Destroy the board and clean up listeners
   * @returns {void}
   */
  destroy() {
    document.removeEventListener("dragend", this.handleDocumentDragEnd);
    document.removeEventListener("drop", this.handleDocumentDrop);
    this.cleanupDragState();
  }

  /**
   * @returns {void}
   */
  render() {
    if (!this.container || !this.store) return;

    // Clean up any existing drag state before re-rendering
    this.cleanupDragState();

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
      laneEl.dataset.status = lane.key;

      // Attach drag event listeners
      laneEl.addEventListener("dragover", this.handleDragOver);
      laneEl.addEventListener("drop", this.handleDrop);
      laneEl.addEventListener("dragleave", this.handleDragLeave);

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
