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
   * @returns {void}
   */
  start() {
    // Application start hook — implement mounting and initial render here.
  }
}
