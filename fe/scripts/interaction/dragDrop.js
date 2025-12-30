import "../../types.js";
import { moveTask } from "../actions.js";

/**
 * @file DragDropController - Handles all drag-and-drop interaction logic
 * Coordinates drag events, visual feedback, and dispatches actions to update state
 */

export default class DragDropController {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.boardElement - The board container element
   * @param {import('../store.js').default} options.store - Store instance for dispatching actions
   */
  constructor({ boardElement, store }) {
    /** @type {HTMLElement} */
    this.boardElement = boardElement;
    /** @type {import('../store.js').default} */
    this.store = store;

    /** @type {string|null} */
    this.draggedTaskId = null;
    /** @type {HTMLElement|null} */
    this.placeholderElement = null;
    /** @type {import('../../types.js').DropTarget|null} */
    this.dropTarget = null;

    // Bind event handlers
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDocumentDragEnd = this.handleDocumentDragEnd.bind(this);
    this.handleDocumentDrop = this.handleDocumentDrop.bind(this);

    // Initialize event listeners
    this.attachListeners();
  }

  /**
   * Attach all event listeners
   * @returns {void}
   */
  attachListeners() {
    // Document-level listeners to catch drag end anywhere
    document.addEventListener("dragend", this.handleDocumentDragEnd);
    document.addEventListener("drop", this.handleDocumentDrop);

    // Delegate card drag events using event delegation
    this.boardElement.addEventListener("dragstart", (e) => {
      if (e.target instanceof HTMLElement && e.target.classList.contains("card")) {
        this.handleDragStart(e);
      }
    });

    this.boardElement.addEventListener("dragend", (e) => {
      if (e.target instanceof HTMLElement && e.target.classList.contains("card")) {
        this.handleDragEnd(e);
      }
    });

    // Delegate lane drag events
    this.boardElement.addEventListener("dragover", (e) => {
      const laneEl = this.findParentLane(e.target);
      if (laneEl) {
        this.handleDragOver(e, laneEl);
      }
    });

    this.boardElement.addEventListener("drop", (e) => {
      const laneEl = this.findParentLane(e.target);
      if (laneEl) {
        this.handleDrop(e, laneEl);
      }
    });

    this.boardElement.addEventListener("dragleave", (e) => {
      if (e.target instanceof HTMLElement && e.target.classList.contains("lane")) {
        this.handleDragLeave(e);
      }
    });
  }

  /**
   * Find parent lane element from any child
   * @param {EventTarget|null} target
   * @returns {HTMLElement|null}
   */
  findParentLane(target) {
    if (!(target instanceof HTMLElement)) return null;
    return target.closest(".lane");
  }

  /**
   * Handle drag start on a card
   * @param {DragEvent} e
   * @returns {void}
   */
  handleDragStart(e) {
    if (!e.dataTransfer || !(e.target instanceof HTMLElement)) return;

    const taskId = e.target.dataset.taskId;
    if (!taskId) return;

    this.draggedTaskId = taskId;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);

    // Add dragging class to card
    e.target.classList.add("dragging");
  }

  /**
   * Handle drag end on a card
   * @param {DragEvent} e
   * @returns {void}
   */
  handleDragEnd(e) {
    if (!(e.target instanceof HTMLElement)) return;

    // Remove dragging class
    e.target.classList.remove("dragging");
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
   * Handle drag over event on a lane
   * @param {DragEvent} e
   * @param {HTMLElement} laneEl
   * @returns {void}
   */
  handleDragOver(e, laneEl) {
    e.preventDefault();
    if (!e.dataTransfer) return;

    e.dataTransfer.dropEffect = "move";

    // Add drag-over class to lane
    laneEl.classList.add("drag-over");

    // Get lane status from dataset
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
   * Handle drop event on a lane
   * @param {DragEvent} e
   * @param {HTMLElement} laneEl
   * @returns {void}
   */
  handleDrop(e, laneEl) {
    e.preventDefault();
    if (!e.dataTransfer) return;

    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId || !this.dropTarget) {
      this.cleanupDragState();
      return;
    }

    // Dispatch MOVE_TASK action to store
    this.store.dispatch(moveTask(taskId, this.dropTarget.lane, this.dropTarget.index));

    // Cleanup
    this.cleanupDragState();
  }

  /**
   * Handle drag leave event on a lane
   * @param {DragEvent} e
   * @returns {void}
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
   * @returns {void}
   */
  handleDocumentDragEnd(e) {
    // Clean up any drag state when drag ends anywhere
    this.cleanupDragState();
  }

  /**
   * Handle document-level drop (catches drops outside lanes)
   * @param {DragEvent} e
   * @returns {void}
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
    const lanes = this.boardElement.querySelectorAll(".lane");
    lanes.forEach((lane) => {
      lane.classList.remove("drag-over");
    });
  }

  /**
   * Destroy controller and clean up listeners
   * @returns {void}
   */
  destroy() {
    // Remove document-level listeners
    document.removeEventListener("dragend", this.handleDocumentDragEnd);
    document.removeEventListener("drop", this.handleDocumentDrop);

    // Clean up any remaining drag state
    this.cleanupDragState();

    // Note: We don't need to remove delegated listeners from boardElement
    // as they will be cleaned up when the element is removed from DOM
  }
}
