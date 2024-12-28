const canvas = document.getElementById('glass');
const ctx = canvas.getContext('2d');

const defaults = {
  rowCount: 20,
  columnCount: 10,
  blockSize: 0,
  jointColor: '#333',
  fallDelay: 1000,
}

const config = {
  ...defaults,
}

const ominos = [
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 2, 0],
    [0, 2, 0],
    [0, 2, 2],
  ],
  [
    [0, 3, 0],
    [0, 3, 0],
    [3, 3, 0],
  ],
  [
    [4, 4, 0],
    [0, 4, 4],
    [0, 0, 0],
  ],
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  [
    [6, 6],
    [6, 6],
  ],
  [
    [0, 7, 0, 0],
    [0, 7, 0, 0],
    [0, 7, 0, 0],
    [0, 7, 0, 0],
  ],
]

const colors = [
  '',
  'magenta',
  'orange',
  'blue',
  'red',
  'lime',
  'yellow',
  'cyan',
]

const omino = [
  [0, 1, 0],
  [1, 1, 1],
  [0, 0, 0],
]

const state = {
  currentOmino: omino,
  currentPosition: {
    row: 0,
    column: 4,
  },
  inertBlocks: makeMatrix(
    config.rowCount,
    config.columnCount
  ),
}

let stopSimulation = () => { };

window.onresize = setUpGlassCanvas;
window.onkeydown = handleKeys;

setUpGlassCanvas();

drawOmino(
  state.currentOmino,
  state.currentPosition.row,
  state.currentPosition.column,
  'magenta',
);

startSimulation();

function makeMatrix(rowCount, columnCount) {
  return Array(rowCount).fill(0).map(
    () => Array(columnCount).fill(0)
  );
}

function handleKeys(e) {
  if (e.key === 'ArrowLeft') {
    state.currentPosition.column--;
  } else if (e.key === 'ArrowRight') {
    state.currentPosition.column++;
  } else if (e.key === 'ArrowDown') {
    if (canMoveDown()) {
      state.currentPosition.row++;
    }
  } else {
    return;
  }

  stopSimulation();
  startSimulation();
  clearCanvas();
  drawOmino(
    state.currentOmino,
    state.currentPosition.row,
    state.currentPosition.column,
  );
  drawInertBlocks();
}

function setUpGlassCanvas() {
  canvas.height = window.innerHeight * 0.9;
  config.blockSize = canvas.height / config.rowCount;
  canvas.width = config.blockSize * config.columnCount;
}

function drawOmino(omino, startRow, startColumn) {
  const rowCount = omino.length;
  const columnCount = omino[0].length;
  const { blockSize, jointColor } = config;

  ctx.strokeStyle = jointColor;

  for (let row = 0; row < rowCount; row++) {
    for (let column = 0; column < columnCount; column++) {
      if (omino[row][column]) {
        const color = colors[omino[row][column]];
        
        drawBlock(
          row + startRow, 
          column + startColumn, 
          color
        );
      }
    }
  }
}

function startSimulation() {
  const intervalId = setInterval(() => {
    if (canMoveDown()) {
      state.currentPosition.row++;
    } else {
      freezeOmino();
    }

    clearCanvas();
    drawOmino(
      state.currentOmino,
      state.currentPosition.row,
      state.currentPosition.column,
      'magenta',
    );
    drawInertBlocks();
  }, config.fallDelay);

  stopSimulation = () => clearInterval(intervalId);
}

function canMoveDown() {
  const { rowCount, columnCount } = config;
  const { currentOmino, currentPosition } = state;
  const { row, column } = currentPosition;
  const ominoRowCount = currentOmino.length;
  const ominoColumnCount = currentOmino[0].length;

  for (let r = 0; r < ominoRowCount; r++) {
    for (let c = 0; c < ominoColumnCount; c++) {
      if (currentOmino[r][c]) {
        const nextRow = row + r + 1;

        if (nextRow === rowCount) return false;
      }
    }
  }

  return true;
}

function freezeOmino() {
  const {
    currentOmino, currentPosition, inertBlocks: inert
  } = state;
  const { row, column } = currentPosition;
  const ominoRowCount = currentOmino.length;
  const ominoColumnCount = currentOmino[0].length;

  for (let r = 0; r < ominoRowCount; r++) {
    for (let c = 0; c < ominoColumnCount; c++) {
      if (currentOmino[r][c]) {
        inert[row + r][column + c] = currentOmino[r][c];
      }
    }
  }

  state.currentOmino = omino;
  state.currentPosition = {
    row: 0,
    column: 4,
  };
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawInertBlocks() {
  const { rowCount, columnCount } = config;
  const { inertBlocks } = state;

  for (let row = 0; row < rowCount; row++) {
    for (let column = 0; column < columnCount; column++) {
      if (inertBlocks[row][column]) {
        const color = colors[inertBlocks[row][column]];
        
        drawBlock(row, column, color,);
      }
    }
  }
}

function drawBlock(row, column, color) {
  const { blockSize, jointColor } = config;
  ctx.fillStyle = color;
  ctx.strokeStyle = jointColor;

  ctx.fillRect(
    column * blockSize,
    row * blockSize,
    blockSize, blockSize
  );
  ctx.strokeRect(
    column * blockSize,
    row * blockSize,
    blockSize, blockSize
  );
}
