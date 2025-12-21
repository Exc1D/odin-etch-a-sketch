const createNewGrid = document.getElementById("newGridBtn");
const clearBtn = document.getElementById("clearBtn");
const displayGridSize = document.getElementById("displayGridSize");
const sizeInput = document.getElementById("sizeInput");
const gridContainer = document.getElementById("grid");
const statusSpan = document.getElementById("drawingStatus");
const currentColorDisplay = document.getElementById("currentColor");
const colorPicker = document.getElementById("colorPicker");
const colorCode = document.getElementById("colorCode");
const colorSwatch = document.getElementById("colorSwatch");

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

// Mouse event listeners to enable dragging
let isMouseDown = false;

document.addEventListener("mousedown", () => {
  isMouseDown = true;
});
document.addEventListener("mouseup", () => {
  isMouseDown = false;
});

// Set initial color swatch
const DEFAULT_COLOR = "#000000";
let currentColor = DEFAULT_COLOR;
colorSwatch.style.backgroundColor = currentColor;
newGridBtn.style.backgroundColor = currentColor;

// Color picker to change cell background
colorPicker.addEventListener("input", () => {
  currentColor = colorPicker.value;
  colorCode.textContent = currentColor;
  colorSwatch.style.backgroundColor = currentColor;
  newGridBtn.style.backgroundColor = currentColor;

  console.log("Color changed to:", currentColor);
});
console.log("Color picker ready!");

// Create Grid based on User Input
function createGrid(size) {
  console.log(`Creating ${size}x${size} grid`);
  // const container = document.getElementById("grid");

  gridContainer.innerHTML = "";
  console.log("Old grid cleared");

  gridContainer.style.gridTemplateColumns = `repeat(${size}, 50px)`;
  console.log(`Grid colums set to: repeat(${size}, 50px)`);

  const totalCells = size * size;
  console.log(`Total cells to create: ${totalCells}`);
  displayGridSize.textContent = `Number of cells: ${totalCells}`;

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    // Color cells on drag
    cell.addEventListener("mouseenter", () => {
      if (isMouseDown) {
        cell.style.backgroundColor = currentColor;
      }
    });
    // Color cells on click
    cell.addEventListener("mousedown", () => {
      cell.style.backgroundColor = currentColor;
    });
    gridContainer.appendChild(cell);
  }
  console.log("Grid creation complete!");
}

function clearGrid() {
  console.log("CLearing grid...");

  const cells = document.querySelectorAll(".cell");

  // Add fade-out to all cells
  cells.forEach(function (cell, index) {
    // Stagger the animation slightly for wave effect
    setTimeout(function () {
      cell.style.transition = "background-color 0.3s";
      cell.style.backgroundColor = "white";
    }, index * 2); // 2ms delay per cell creates wave
  });

  console.log(`Cleared ${cells.length} cells!`);
}

clearBtn.addEventListener("click", clearGrid);

// Track drawing status for aditional visual feedback
const setDrawingStatus = (drawing, statusSpan, gridContainer) => {
  statusSpan.textContent = drawing ? "Drawing!" : "Not Drawing";
  statusSpan.classList.toggle("active", drawing);
  gridContainer.classList.toggle("drawing", drawing);
};

gridContainer.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  e.preventDefault();
  setDrawingStatus(true, statusSpan, gridContainer);
});

gridContainer.addEventListener("mouseup", (e) => {
  isMouseDown = false;
  e.preventDefault();
  setDrawingStatus(false, statusSpan, gridContainer);
});
