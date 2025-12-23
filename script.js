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
const shadingBtn = document.getElementById("shadingBtn");
const gridLinesBtn = document.getElementById("gridLinesBtn");

// STATE VARIABLES
let isMouseDown = false;
const DEFAULT_COLOR = "#000000";
let currentColor = DEFAULT_COLOR;
let currentTool = "pen";
let showGridLines = true;

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

  if (showGridLines) {
    gridContainer.style.backgroundColor = "#2d3436";
    gridContainer.style.gap = "1px";
    gridContainer.style.justifyContent = "normal";
    gridContainer.style.alignContent = "normal";
  } else {
    gridContainer.style.backgroundColor = "white";
    gridContainer.style.gap = "0";
    gridContainer.style.justifyContent = "center";
    gridContainer.style.alignContent = "center";
  }

  const containerWidth = gridContainer.clientWidth || 380;

  // Account for gaps in between cells
  const gapSize = 1;
  const totalGapWidth = (size - 1) * gapSize;
  const availableWidth = containerWidth - totalGapWidth;
  const cellSize = Math.floor(availableWidth / size);
  gridContainer.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
  gridContainer.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;

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

    // Toggle grid lines
    if (!showGridLines) {
      cell.style.border = "none";
      cell.classList.add("no-border");
    } else {
      cell.style.border = "1px solid rgba(0, 0, 0, 0.05)";
      cell.classList.remove("no-border");
    }

    fragment.appendChild(cell);
  }

  gridContainer.appendChild(fragment);
  console.log("✅ Grid creation complete!");
}

// ============================================
// TOGGLE GRID LINES
// ============================================

function toggleGridLines() {
  showGridLines = !showGridLines;

  if (showGridLines) {
    // 1. Grid Lines ON: Dark background, 1px gap
    gridContainer.style.backgroundColor = "#2d3436";
    gridContainer.style.gap = "1px";

    // Reset alignment to default so it fills the container normally
    gridContainer.style.justifyContent = "normal";
    gridContainer.style.alignContent = "normal";
  } else {
    // 2. Grid Lines OFF: White background, 0 gap
    gridContainer.style.backgroundColor = "white";
    gridContainer.style.gap = "0";

    // Center the grid content!
    // (Because removing the gap makes the grid slightly smaller than the container)
    gridContainer.style.justifyContent = "center";
    gridContainer.style.alignContent = "center";
  }

  // 3. Toggle borders on the individual cells
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    if (showGridLines) {
      cell.style.border = "1px solid rgba(0, 0, 0, 0.05)";
      cell.classList.remove("no-border");
    } else {
      cell.style.border = "none";
      cell.classList.add("no-border");
    }
  });

  gridLinesBtn.classList.toggle("active", showGridLines);
}

// ============================================
// 3. PAINTING LOGIC
// ============================================

function paintCell(target) {
  if (currentTool === "eraser") {
    target.style.backgroundColor = "white";
  } else if (currentTool === "rainbow") {
    target.style.backgroundColor = getRandomColor();
  } else if (currentTool === "shading") {
    applyShading(target);
  } else {
    target.style.backgroundColor = currentColor;
  }
}

function applyShading(cell) {
  let darkness = parseInt(cell.dataset.darkness) || 0;

  darkness = Math.min(darkness + 10, 100);

  cell.dataset.darkness = darkness;
  const alpha = darkness / 100;
  cell.style.backgroundColor = `rgba(0, 0, 0, ${alpha})`;
}

// ============================================
// 4. TOOL SWITCHING
// ============================================

function switchTool(tool) {
  currentTool = tool;

  penBtn.classList.toggle("active", tool === "pen");
  eraserBtn.classList.toggle("active", tool === "eraser");
  rainbowBtn.classList.toggle("active", tool === "rainbow");
  shadingBtn.classList.toggle("active", tool === "shading");

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
      cell.dataset.darkness = "0";
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

// Button listeners
gridLinesBtn.addEventListener("click", toggleGridLines);

// Tool buttons
penBtn.addEventListener("click", () => switchTool("pen"));
eraserBtn.addEventListener("click", () => switchTool("eraser"));
rainbowBtn.addEventListener("click", () => switchTool("rainbow"));
shadingBtn.addEventListener("click", () => switchTool("shading"));

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
  if (e.key.toLowerCase() === "s") switchTool("shading");
  if (e.key.toLowerCase() === "e") switchTool("eraser");
  if (e.key.toLowerCase() === "g") toggleGridLines();
  if (e.key.toLowerCase() === "c") clearBtn.click();
});

// ============================================
// 8. INITIALIZATION
// ============================================

console.log("🎨 Starting Etch-a-Sketch...");
switchTool("pen");
gridLinesBtn.classList.add("active");
createGrid(16);
console.log("✅ Ready to draw!");
console.log(
  "⌨️ Shortcuts: P (Pen) | R (Rainbow) | S (Shading) | E (Eraser) | G (Grid line) | C (Clear)"
);
