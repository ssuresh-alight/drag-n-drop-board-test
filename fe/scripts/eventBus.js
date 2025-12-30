import "../types.js";

export default class EventBus {
  constructor() {
    /** @type {Map<string, Set<import('../types.js').EventHandler>>} */
    this.handlers = new Map();
  }

  /**
   * @param {string} event
   * @param {import('../types.js').EventHandler} handler
   * @returns {import('../types.js').UnsubscribeFn}
   */
  on(event, handler) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    const set = this.handlers.get(event);
    if (set) set.add(handler);
    return () => {
      const s = this.handlers.get(event);
      if (s) s.delete(handler);
    };
  }

  /**
   * @param {string} event
   * @param {*} payload
   * @returns {void}
   */
  emit(event, payload) {
    const set = this.handlers.get(event);
    if (!set) return;
    for (const h of set) h(payload);
  }
}
