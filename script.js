function createGrid(size) {
  console.log(`Creating ${size}x${size} grid...`);
  const container = document.getElementById("grid");

  container.innerHTML = "";

  container.style.gridTemplateColumns = `repeat(${size}, 50px)`;
  console.log(`Grid columns set to: repeat(${size}, 50 px)`);

  const totalCells = size * size;

  for (let i = 0; i < totalCells; i++);
  const cell = document.createElement("div");
  cell.classList.add("cell");
  container.appendChild(cell);
}
