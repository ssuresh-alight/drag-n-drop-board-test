import "../../types.js";

export default class TaskCard {
  /**
   * @param {Partial<import('../../types.js').TaskCardData>} [options]
   */
  constructor({ data, store, bus } = {}) {
    /** @type {Partial<import('../../types.js').Task>} */
    this.data = data || {};
    /** @type {import('../store.js').default|undefined} */
    this.store = store;
    /** @type {import('../eventBus.js').default|null|undefined} */
    this.bus = bus;

    // Bind event handlers
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  /**
   * Handle drag start event
   * @param {DragEvent} e
   */
  handleDragStart(e) {
    if (!this.data.id || !e.dataTransfer) return;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", this.data.id);

    // Add dragging class to card
    if (e.target instanceof HTMLElement) {
      e.target.classList.add("dragging");
    }
  }

  /**
   * Handle drag end event
   * @param {DragEvent} e
   */
  handleDragEnd(e) {
    // Remove dragging class
    if (e.target instanceof HTMLElement) {
      e.target.classList.remove("dragging");
    }
  }

  /**
   * @returns {HTMLElement|null}
   */
  render() {
    const t = this.data;
    if (!t || !t.title) return null;

    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.dataset.taskId = t.id || "";

    // Attach drag event listeners
    card.addEventListener("dragstart", this.handleDragStart);
    card.addEventListener("dragend", this.handleDragEnd);

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = String(t.title);
    card.appendChild(title);

    if (t.description) {
      const desc = document.createElement("p");
      desc.className = "card-desc";
      desc.textContent = String(t.description);
      card.appendChild(desc);
    }

    return card;
  }
}
