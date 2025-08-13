export const GRID_COLS = 30;
export const GRID_ROWS = 20;
export const CELL_SIZE = 24;

export function inBounds(x, y, cols = GRID_COLS, rows = GRID_ROWS) {
  return x >= 0 && x < cols && y >= 0 && y < rows;
}

export function wrapCoord(v, max) {
  if (max <= 0) return 0;
  return ((v % max) + max) % max;
}

export function index(x, y, cols = GRID_COLS) {
  return y * cols + x;
}

export function createBoard(cols = GRID_COLS, rows = GRID_ROWS, cellSize = CELL_SIZE) {
  return { cols, rows, cellSize };
}
