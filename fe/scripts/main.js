const container = document.getElementById("container");
if (!container) {
  throw new Error("Container element not found");
}

const targets = [0, 1].map((i) => {
  const el = document.createElement("div");
  el.classList.add("dropzone");
  el.id = `dropzone_${i}`;
  el.innerText = `Dropzone ${i}`;

  el.addEventListener("dragenter", (ev) => {
    console.log(`drag entered dropzone ${i}`);
    el.classList.add("dragging");
  });

  el.addEventListener("dragleave", (ev) => {
    console.log(`drag leaving dropzone ${i}`);
    el.classList.remove("dragging");
  });

  container.appendChild(el);
  return el;
});

const boxes = [0, 1, 2].map((i) => {
  const el = document.createElement("div");
  el.classList.add("draggable");
  el.id = `draggable_${i}`;
  el.draggable = true;
  el.innerText = `Draggable ${i}`;

  // el.addEventListener("mouseup", (evt) => {
  //   console.log(`mouse up on draggable ${i}`);
  // });

  el.addEventListener("dragstart", (evt) => {
    console.log(`draggable ${i} started being dragged`);
    // evt.preventDefault();
  });
  el.addEventListener("dragend", (evt) => {
    console.log(`draggable ${i} finished being dragged`);
  });

  container.appendChild(el);
  return el;
});
