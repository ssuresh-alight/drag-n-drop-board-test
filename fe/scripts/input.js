import "../types.js";

/**
 * @typedef {Object} InputController
 * @property {() => void} [destroy] - Optional cleanup method
 */

/**
 * Input handler that coordinates multiple interaction controllers
 * Provides a unified interface for managing user input across the application
 */
export default class InputHandler {
  /**
   * @param {Object} [options]
   * @param {import('./store.js').default} [options.store] - Store instance
   */
  constructor({ store } = {}) {
    /** @type {import('./store.js').default|undefined} */
    this.store = store;
    /** @type {Map<string, InputController>} */
    this.controllers = new Map();
  }

  /**
   * Register an interaction controller
   * @param {string} name - Unique name for the controller
   * @param {InputController} controller - Controller instance
   * @returns {void}
   */
  register(name, controller) {
    if (this.controllers.has(name)) {
      console.warn(`Controller "${name}" is already registered. Replacing...`);
      this.unregister(name);
    }
    this.controllers.set(name, controller);
  }

  /**
   * Unregister an interaction controller
   * @param {string} name - Name of the controller to unregister
   * @returns {boolean} - True if controller was found and unregistered
   */
  unregister(name) {
    const controller = this.controllers.get(name);
    if (controller) {
      // Call destroy if available
      if (controller.destroy) {
        controller.destroy();
      }
      this.controllers.delete(name);
      return true;
    }
    return false;
  }

  /**
   * Get a registered controller by name
   * @param {string} name - Name of the controller
   * @returns {InputController|undefined}
   */
  get(name) {
    return this.controllers.get(name);
  }

  /**
   * Check if a controller is registered
   * @param {string} name - Name of the controller
   * @returns {boolean}
   */
  has(name) {
    return this.controllers.has(name);
  }

  /**
   * Get all registered controller names
   * @returns {string[]}
   */
  getControllerNames() {
    return Array.from(this.controllers.keys());
  }

  /**
   * Destroy all controllers and clean up
   * @returns {void}
   */
  destroy() {
    for (const [name, controller] of this.controllers) {
      if (controller.destroy) {
        controller.destroy();
      }
    }
    this.controllers.clear();
  }
}
