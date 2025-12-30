import "../../types.js";
import { updateTask } from "../actions.js";

/**
 * Presentational component for rendering a task card with inline editing support
 * Cards can be dragged and edited - drag events handled by DragDropController
 */
export default class TaskCard {
  /**
   * @param {Object} options
   * @param {import('../../types.js').Task} options.data - Task data to render
   * @param {Function} options.dispatch - Store dispatch function for actions
   */
  constructor({ data, dispatch }) {
    /** @type {import('../../types.js').Task} */
    this.data = data;
    /** @type {Function} */
    this.dispatch = dispatch;
    /** @type {boolean} */
    this.isEditing = false;
    /** @type {string} */
    this.editingTitle = "";
    /** @type {string} */
    this.editingDescription = "";
    /** @type {HTMLElement|null} */
    this.cardElement = null;
  }

  /**
   * Render the task card element
   * @returns {HTMLElement|null}
   */
  render() {
    const t = this.data;
    if (!t || !t.title) return null;

    const card = document.createElement("div");
    card.className = "card";
    card.draggable = !this.isEditing; // Disable dragging while editing
    card.dataset.taskId = t.id || "";

    // Store reference to card element
    this.cardElement = card;

    if (this.isEditing) {
      this._renderEditMode(card);
    } else {
      this._renderDisplayMode(card);
    }

    return card;
  }

  /**
   * Render the card in display (read-only) mode
   * @param {HTMLElement} card - Card container element
   * @private
   */
  _renderDisplayMode(card) {
    const t = this.data;

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.className = "card-edit-btn";
    editBtn.setAttribute("aria-label", "Edit task");
    editBtn.innerHTML = "✏️";
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent drag from starting
      this._enterEditMode();
    });
    card.appendChild(editBtn);

    // Title
    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = String(t.title);
    card.appendChild(title);

    // Description
    if (t.description) {
      const desc = document.createElement("p");
      desc.className = "card-desc";
      desc.textContent = String(t.description);
      card.appendChild(desc);
    }
  }

  /**
   * Render the card in edit mode with input fields
   * @param {HTMLElement} card - Card container element
   * @private
   */
  _renderEditMode(card) {
    card.classList.add("card-editing");

    // Title input
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.className = "card-edit-title";
    titleInput.value = this.editingTitle;
    titleInput.placeholder = "Task title (required)";
    titleInput.setAttribute("aria-label", "Task title");
    titleInput.addEventListener("input", (e) => {
      const target = /** @type {HTMLInputElement} */ (e.target);
      this.editingTitle = target.value;
      this._updateSaveButton(card);
    });
    titleInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && this.editingTitle.trim()) {
        e.preventDefault();
        this._saveChanges();
      } else if (e.key === "Escape") {
        e.preventDefault();
        this._cancelEdit();
      }
    });
    card.appendChild(titleInput);

    // Description textarea
    const descTextarea = document.createElement("textarea");
    descTextarea.className = "card-edit-desc";
    descTextarea.value = this.editingDescription;
    descTextarea.placeholder = "Task description (optional)";
    descTextarea.setAttribute("aria-label", "Task description");
    descTextarea.rows = 3;
    descTextarea.addEventListener("input", (e) => {
      const target = /** @type {HTMLTextAreaElement} */ (e.target);
      this.editingDescription = target.value;
    });
    descTextarea.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        this._cancelEdit();
      }
    });
    card.appendChild(descTextarea);

    // Action buttons container
    const actions = document.createElement("div");
    actions.className = "card-edit-actions";

    // Save button
    const saveBtn = document.createElement("button");
    saveBtn.className = "card-edit-save";
    saveBtn.textContent = "Save";
    saveBtn.setAttribute("aria-label", "Save changes");
    saveBtn.disabled = !this.editingTitle.trim();
    saveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this._saveChanges();
    });
    actions.appendChild(saveBtn);

    // Cancel button
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "card-edit-cancel";
    cancelBtn.textContent = "Cancel";
    cancelBtn.setAttribute("aria-label", "Cancel editing");
    cancelBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this._cancelEdit();
    });
    actions.appendChild(cancelBtn);

    card.appendChild(actions);

    // Auto-focus and select title input
    setTimeout(() => {
      titleInput.focus();
      titleInput.select();
    }, 0);
  }

  /**
   * Enter edit mode
   * @private
   */
  _enterEditMode() {
    this.isEditing = true;
    this.editingTitle = this.data.title;
    this.editingDescription = this.data.description || "";

    // Re-render the card element in place
    if (this.cardElement) {
      this.cardElement.innerHTML = "";
      this.cardElement.draggable = false;
      this._renderEditMode(this.cardElement);
    }
  }

  /**
   * Save changes and exit edit mode
   * @private
   */
  _saveChanges() {
    const trimmedTitle = this.editingTitle.trim();
    if (!trimmedTitle) return;

    // Dispatch update action - this will trigger a full board re-render
    this.dispatch(
      updateTask(this.data.id, {
        title: trimmedTitle,
        description: this.editingDescription.trim(),
      }),
    );

    this.isEditing = false;
  }

  /**
   * Cancel editing and exit edit mode
   * @private
   */
  _cancelEdit() {
    this.isEditing = false;
    this.editingTitle = "";
    this.editingDescription = "";

    // Re-render the card element in place
    if (this.cardElement) {
      this.cardElement.innerHTML = "";
      this.cardElement.draggable = true;
      this._renderDisplayMode(this.cardElement);
    }
  }

  /**
   * Update save button disabled state based on title validity
   * @param {HTMLElement} card - Card container element
   * @private
   */
  _updateSaveButton(card) {
    const saveBtn = /** @type {HTMLButtonElement|null} */ (card.querySelector(".card-edit-save"));
    if (saveBtn) {
      saveBtn.disabled = !this.editingTitle.trim();
    }
  }
}
