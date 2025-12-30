import "../types.js";

export default class InputHandler {
  /**
   * @param {Partial<import('../types.js').ComponentOptions>} [options]
   */
  constructor({ container, store, bus } = {}) {
    /** @type {HTMLElement|undefined} */
    this.container = container;
    /** @type {import('./store.js').default|undefined} */
    this.store = store;
    /** @type {import('./eventBus.js').default|undefined} */
    this.bus = bus;
  }

  /**
   * @returns {void}
   */
  attach() {
    // Attach form handlers, keyboard shortcuts, etc.
  }
}
