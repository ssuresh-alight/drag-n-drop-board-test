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
  }

  /**
   * @returns {HTMLElement|null}
   */
  render() {
    const t = this.data;
    if (!t || !t.title) return null;

    const card = document.createElement("div");
    card.className = "card";

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
