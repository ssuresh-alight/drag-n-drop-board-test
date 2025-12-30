import "../types.js";
import { rootReducer } from "./reducers.js";
import StorageService from "./services/storage.js";

export default class Store {
  /**
   * @param {import('../types.js').AppState} [initial]
   * @param {StorageService} [storageService]
   */
  constructor(initial = { boards: [], selectedBoardId: null }, storageService) {
    /** @type {import('../types.js').AppState} */
    this.state = initial;
    /** @type {Set<import('../types.js').StateListener>} */
    this.listeners = new Set();
    /** @type {StorageService} */
    this.storage = storageService || new StorageService();
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
   * Dispatch an action to update state
   * @param {import('../types.js').Action|Partial<import('../types.js').AppState>} actionOrPatch
   * @returns {void}
   */
  dispatch(actionOrPatch) {
    // Handle both old-style patches and new-style actions for backward compatibility
    // @ts-ignore - Check for type property to distinguish actions from patches
    if (actionOrPatch.type) {
      // New action-based dispatch
      const action = /** @type {import('../types.js').Action} */ (actionOrPatch);
      this.state = rootReducer(this.state, action);
    } else {
      // Legacy patch-based dispatch (deprecated, for backward compatibility)
      const patch = /** @type {Partial<import('../types.js').AppState>} */ (actionOrPatch);
      this.state = { ...this.state, ...patch };
    }

    // Notify all listeners with new state
    for (const l of this.listeners) l(this.state);
    this.persist();
  }

  /**
   * @returns {void}
   */
  persist() {
    this.storage.save(this.state);
  }

  /**
   * @returns {void}
   */
  load() {
    const loadedState = this.storage.load();
    if (loadedState) {
      this.state = loadedState;
      for (const l of this.listeners) l(this.state);
    }
  }
}
