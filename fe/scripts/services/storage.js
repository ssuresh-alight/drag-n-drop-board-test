import "../../types.js";

/**
 * @file Storage service for persisting application state
 * Handles reading from and writing to browser localStorage
 */

export default class StorageService {
  /**
   * @param {string} [key] - Storage key to use (defaults to "app_state")
   */
  constructor(key = "app_state") {
    /** @type {string} */
    this.key = key;
  }

  /**
   * Save application state to localStorage
   * @param {import('../../types.js').AppState} state - State to persist
   * @returns {boolean} - True if save was successful, false otherwise
   */
  save(state) {
    try {
      const raw = JSON.stringify(state);
      localStorage.setItem(this.key, raw);
      return true;
    } catch (e) {
      console.error("Failed to save state to localStorage:", e);
      return false;
    }
  }

  /**
   * Load application state from localStorage
   * @returns {import('../../types.js').AppState|null} - Loaded state or null if not found/invalid
   */
  load() {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return null;

      const state = JSON.parse(raw);
      return state;
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
      return null;
    }
  }

  /**
   * Clear persisted state from localStorage
   * @returns {boolean} - True if clear was successful
   */
  clear() {
    try {
      localStorage.removeItem(this.key);
      return true;
    } catch (e) {
      console.error("Failed to clear state from localStorage:", e);
      return false;
    }
  }

  /**
   * Check if there is persisted state available
   * @returns {boolean} - True if state exists in storage
   */
  hasPersistedState() {
    try {
      return localStorage.getItem(this.key) !== null;
    } catch (e) {
      return false;
    }
  }
}
