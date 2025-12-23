// DOM ELEMENTS
const clearBtn = document.getElementById("clearBtn");
const displayGridSize = document.getElementById("displayGridSize");
const gridContainer = document.getElementById("grid");
const statusSpan = document.getElementById("drawingStatus");
const colorPicker = document.getElementById("colorPicker");
const colorCode = document.getElementById("colorCode");
const colorSwatch = document.getElementById("colorSwatch");
const penBtn = document.getElementById("penBtn");
const eraserBtn = document.getElementById("eraserBtn");
const rainbowBtn = document.getElementById("rainbowBtn");
const sizeSlider = document.getElementById("sizeSlider");
const totalSquares = document.getElementById("totalSquares");

// STATE VARIABLES
let isMouseDown = false;
const DEFAULT_COLOR = "#000000";
let currentColor = DEFAULT_COLOR;
let currentTool = "pen";

// Set initial color swatch
colorSwatch.style.backgroundColor = currentColor;

console.log("🎨 Etch-a-Sketch initializing...");
console.log("Initial mousedown:", isMouseDown);
console.log("Initial tool:", currentTool);

// ============================================
// 1. UTILITY FUNCTIONS
// ============================================

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================
// 2. GRID CREATION
// ============================================

function createGrid(size) {
  console.log(`📐 Creating ${size}×${size} grid...`);

  gridContainer.innerHTML = "";

  // Dynamic cell sizing
  let cellSize;
  if (size <= 16) {
    cellSize = 50;
  } else if (size <= 32) {
    cellSize = 25;
  } else {
    cellSize = 600 / size;
  }

  // 🔧 FIX: Added missing space and 'px'
  gridContainer.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
  console.log(`Grid columns set to: repeat(${size}, ${cellSize}px)`);

  const totalCells = size * size;
  console.log(`Total cells to create: ${totalCells}`);
  displayGridSize.textContent = `Grid: ${size}×${size} (${totalCells} squares)`;

  // Document fragment for performance
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    // Initialize darkness to 0
    cell.dataset.darkness = "0";

    // Set dynamic cell size
    cell.style.width = `${cellSize}px`;
    cell.style.height = `${cellSize}px`;

    fragment.appendChild(cell);
  }

  gridContainer.appendChild(fragment);
  console.log("✅ Grid creation complete!");
}

// ============================================
// 3. PAINTING LOGIC
// ============================================

function paintCell(target) {
  if (currentTool === "eraser") {
    target.style.backgroundColor = "white";
  } else if (currentTool === "rainbow") {
    target.style.backgroundColor = getRandomColor();
  } else {
    target.style.backgroundColor = currentColor;
  }
}

function applyShading(cell) {
  let darkness = parseInt(cell.dataset.darkness) || 0;

  darkness = Math.min(darkness + 10, 100);

  cell.dataset.darkness = darkness;
  const alpha = darkness / 100;
  cell.style.backgroundColor = `rgb(0, 0, 0, ${alpha})`;
}

// ============================================
// 4. TOOL SWITCHING
// ============================================

function switchTool(tool) {
  currentTool = tool;

  penBtn.classList.toggle("active", tool === "pen");
  eraserBtn.classList.toggle("active", tool === "eraser");
  rainbowBtn.classList.toggle("active", tool === "rainbow");

  console.log(`🔧 ${tool.toUpperCase()} mode activated!`);
}

// ============================================
// 5. GRID SIZE UPDATE
// ============================================

function updateGridSize() {
  const size = parseInt(sizeSlider.value);
  console.log(`📏 Updating grid to ${size}×${size}`);
  createGrid(size);
}

// Create debounced version
const debouncedUpdate = debounce(updateGridSize, 100);

// ============================================
// 6. STATUS UPDATES
// ============================================

function updateStatus(isDrawing) {
  statusSpan.textContent = isDrawing ? " Drawing! ✏️" : " Ready";
  statusSpan.classList.toggle("active", isDrawing);
  gridContainer.classList.toggle("drawing", isDrawing);
}

// ============================================
// 7. EVENT LISTENERS
// ============================================

// Global mouse tracking
document.addEventListener("mousedown", () => {
  isMouseDown = true;
});

document.addEventListener("mouseup", () => {
  isMouseDown = false;
  updateStatus(false);
});

// Clear button
clearBtn.addEventListener("click", () => {
  console.log("🧹 Clearing grid...");
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell, index) => {
    setTimeout(() => {
      cell.style.transition = "background-color 0.3s";
      cell.style.backgroundColor = "white";
    }, index * 2);
  });

  console.log("✅ Grid cleared!");
});

// Grid size slider
sizeSlider.addEventListener("input", () => {
  const size = parseInt(sizeSlider.value);

  // Update display immediately
  totalSquares.textContent = `(${size * size} squares)`;

  // Debounced grid regeneration
  debouncedUpdate();
});

// Tool buttons
penBtn.addEventListener("click", () => switchTool("pen"));
eraserBtn.addEventListener("click", () => switchTool("eraser"));
rainbowBtn.addEventListener("click", () => switchTool("rainbow"));

// Color picker
colorPicker.addEventListener("input", (e) => {
  currentColor = e.target.value;
  colorCode.textContent = currentColor;
  colorSwatch.style.backgroundColor = currentColor;
  console.log("🎨 Color changed to:", currentColor);

  // Auto-switch to pen when changing color
  if (currentTool !== "pen") switchTool("pen");
});

// Grid painting (event delegation)
gridContainer.addEventListener("mousedown", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("cell")) {
    paintCell(e.target);
    updateStatus(true);
  }
});

gridContainer.addEventListener("mouseover", (e) => {
  if (isMouseDown && e.target.classList.contains("cell")) {
    paintCell(e.target);
  }
});

// Keyboard shortcuts (BONUS!)
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "p") switchTool("pen");
  if (e.key.toLowerCase() === "r") switchTool("rainbow");
  if (e.key.toLowerCase() === "e") switchTool("eraser");
  if (e.key.toLowerCase() === "c") clearBtn.click();
});

// ============================================
// 8. INITIALIZATION
// ============================================

console.log("🎨 Starting Etch-a-Sketch...");
switchTool("pen");
createGrid(16);
console.log("✅ Ready to draw!");
console.log("⌨️ Shortcuts: P (Pen) | R (Rainbow) | E (Eraser) | C (Clear)");
