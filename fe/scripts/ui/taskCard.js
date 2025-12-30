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
    /** @type {import('../eventBus.js').default|undefined} */
    this.bus = bus;
  }

  /**
   * @returns {HTMLElement|null}
   */
  render() {
    // Return DOM node for a task card
    return null;
  }
}
