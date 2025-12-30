import App from "./app.js";
import Store from "./store.js";
import EventBus from "./eventBus.js";

const container = /** @type {HTMLDivElement} */ (document.getElementById("container"));
if (!container) {
  throw new Error("Container element not found");
}

// Helper to build typed tasks (ensures status is Status union)
/**
 * @param {string} id
 * @param {string} title
 * @param {string | undefined} description
 * @param {import("../types.js").Status} status
 * @param {number} createdAt
 * @returns {import("../types.js").Task}
 */
function makeTask(id, title, description, status, createdAt) {
  return { id, title, status, createdAt, ...(description ? { description } : {}) };
}

// Mock data: single board with tasks in three lanes
/** @type {import("../types.js").AppState} */
const mockState = {
  boards: [
    {
      id: "mock-board",
      name: "Demo Board",
      tasks: [
        makeTask("t1", "Sketch layout", "Rough out lanes and cards", "todo", Date.now() - 500000),
        makeTask("t2", "Write mock data", "Add a few tasks", "todo", Date.now() - 450000),
        makeTask("t3", "Style lanes", "Minimal whites/grays", "in-progress", Date.now() - 400000),
        makeTask("t4", "Card component", undefined, "in-progress", Date.now() - 350000),
        makeTask("t5", "Responsive layout", "Stack lanes on mobile", "done", Date.now() - 300000),
        makeTask("t6", "No interactions", "Display-only for now", "done", Date.now() - 250000),
      ],
    },
  ],
  selectedBoardId: "mock-board",
};

const store = new Store(mockState);
const bus = new EventBus();

const app = new App({ container, store, api: null, bus });

// Start app: renders the board
app.start();
