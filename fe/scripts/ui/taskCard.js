import "../../types.js";

/**
 * Pure presentational component for rendering a task card
 * Does not handle events directly - cards are made draggable and events are handled by DragDropController
 */
export default class TaskCard {
  /**
   * @param {Object} options
   * @param {import('../../types.js').Task} options.data - Task data to render
   */
  constructor({ data }) {
    /** @type {import('../../types.js').Task} */
    this.data = data;
  }

  /**
   * Render the task card element
   * @returns {HTMLElement|null}
   */
  render() {
    const t = this.data;
    if (!t || !t.title) return null;

    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.dataset.taskId = t.id || "";

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
