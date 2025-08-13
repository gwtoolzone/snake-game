import { range } from '../utils.js';

export function spawnFood(board, snake, rng = Math.random) {
  const { cols, rows } = board;
  const total = cols * rows;
  if (snake.length >= total) return null;

  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  const freeCells = [];
  for (let y of range(rows)) {
    for (let x of range(cols)) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) freeCells.push({ x, y });
    }
  }
  if (freeCells.length === 0) return null;
  const idx = Math.floor(rng() * freeCells.length);
  return freeCells[idx];
}
