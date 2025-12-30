import "../../types.js";

export default class Modal {
  /**
   * @param {Partial<import('../../types.js').ModalOptions>} [options]
   */
  constructor({ container } = {}) {
    /** @type {HTMLElement|undefined} */
    this.container = container;
  }

  /**
   * @param {string|HTMLElement} content
   * @returns {void}
   */
  open(content) {
    // Show modal with content
  }

  /**
   * @returns {void}
   */
  close() {
    // Close modal
  }
}
