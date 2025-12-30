import App from "./app.js";
import Store from "./store.js";
import EventBus from "./eventBus.js";
import InputHandler from "./input.js";
import KanbanBoard from "./ui/kanbanBoard.js";

const container = /** @type {HTMLDivElement} */ (document.getElementById("container"));
if (!container) {
  throw new Error("Container element not found");
}

const store = new Store();
store.load();
const bus = new EventBus();

const app = new App({ container, store, api: null, bus });
const input = new InputHandler({ container, store, bus });
const board = new KanbanBoard({ container, store, bus });

// Start hooks (implementations pending)
app.start();
input.attach();
board.render();
