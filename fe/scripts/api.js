import "../types.js";

/**
 * API client for backend communication.
 * Placeholder for future REST API integration.
 */
export default class ApiClient {
  constructor() {
    // Future: configure base URL, auth tokens, etc.
  }

  /**
   * Fetch tasks from the backend
   * @returns {Promise<import('../types.js').Task[]>}
   */
  async getTasks() {
    // Placeholder implementation
    return [];
  }

  /**
   * Create a new task
   * @param {Partial<import('../types.js').Task>} taskData
   * @returns {Promise<import('../types.js').Task>}
   */
  async createTask(taskData) {
    // Placeholder implementation
    throw new Error("Not implemented");
  }

  /**
   * Update an existing task
   * @param {string} id
   * @param {Partial<import('../types.js').Task>} updates
   * @returns {Promise<import('../types.js').Task>}
   */
  async updateTask(id, updates) {
    // Placeholder implementation
    throw new Error("Not implemented");
  }

  /**
   * Delete a task
   * @param {string} id
   * @returns {Promise<void>}
   */
  async deleteTask(id) {
    // Placeholder implementation
    throw new Error("Not implemented");
  }
}
