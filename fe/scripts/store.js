import "../types.js";

export default class Store {
  /**
   * @param {import('../types.js').AppState} [initial]
   */
  constructor(initial = { boards: [], selectedBoardId: null }) {
    /** @type {import('../types.js').AppState} */
    this.state = initial;
    /** @type {Set<import('../types.js').StateListener>} */
    this.listeners = new Set();
  }

  /**
   * @param {import('../types.js').StateListener} fn
   * @returns {import('../types.js').UnsubscribeFn}
   */
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /**
   * @param {Partial<import('../types.js').AppState>} patch
   * @returns {void}
   */
  dispatch(patch) {
    // Placeholder: apply patch to state and notify listeners
    Object.assign(this.state, patch);
    for (const l of this.listeners) l(this.state);
    this.persist();
  }

  /**
   * @returns {void}
   */
  persist() {
    try {
      const raw = JSON.stringify(this.state);
      localStorage.setItem("app_state", raw);
    } catch (e) {
      // ignore for now
    }
  }

  /**
   * @returns {void}
   */
  load() {
    try {
      const raw = localStorage.getItem("app_state");
      if (!raw) return;
      this.state = JSON.parse(raw);
      for (const l of this.listeners) l(this.state);
    } catch (e) {
      // ignore parse errors
    }
  }
}
