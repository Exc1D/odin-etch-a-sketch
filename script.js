const createNewGrid = document.getElementById("newGridBtn");
const displayGridSize = document.getElementById("displayGridSize");
const sizeInput = document.getElementById("sizeInput");

let isMouseDown = false;
console.log("Initial drawing state:", isMouseDown);

document.addEventListener("mousedown", () => {
  isMouseDown = true;
});

document.addEventListener("mouseup", () => {
  isMouseDown = false;
});
function createGrid(size) {
  console.log(`Creating ${size}x${size} grid`);
  const container = document.getElementById("grid");

  container.innerHTML = "";
  console.log("Old grid cleared");

  container.style.gridTemplateColumns = `repeat(${size}, 50px)`;
  console.log(`Grid colums set to: repeat(${size}, 50px)`);

  const totalCells = size * size;
  console.log(`Total cells to create: ${totalCells}`);
  displayGridSize.textContent = `Number of cells: ${totalCells}`;

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    cell.addEventListener("mouseenter", () => {
      if (isMouseDown) {
        cell.style.backgroundColor = "#4caf50";
      }
    });
    cell.addEventListener("mousedown", () => {
      cell.style.backgroundColor = "#4caf50";
    });
    container.appendChild(cell);
  }
  console.log("Grid creation complete!");
}

function setupNewGrid() {
  const userInput = sizeInput.value;

  if (userInput === null || userInput === "") {
    console.log("User cancelled, proceed to default grid");
    alert("I'll create a grid anyway.");
    createGrid(16);
  } else {
    console.log("User entered:", userInput);
    console.log("Type of input:", typeof userInput);

    const gridSize = parseInt(userInput);
    console.log("Converted to a number:", gridSize);
    console.log("Type after conversion:", typeof gridSize);

    if (isNaN(gridSize)) {
      console.log("🔴 Not a number!");
      alert("Hey! That's not a number! Please enter a valid number.");
    } else if (gridSize < 1 || gridSize > 100) {
      console.log("🔴 Out of range!");
      alert("That's out of range! Just pick a number 1-100.");
    } else {
      console.log("🟢Valid input, creating grid...");
      createGrid(gridSize);
    }
  }
}

createNewGrid.addEventListener("click", setupNewGrid);
