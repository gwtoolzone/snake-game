import { inBounds, wrapCoord } from './board.js';

export function hitsWall(nextHead, board, wrapWalls) {
  const { cols, rows } = board;
  if (wrapWalls) {
    const wrapped = { x: wrapCoord(nextHead.x, cols), y: wrapCoord(nextHead.y, rows) };
    return { hit: false, point: wrapped };
  }
  const hit = !inBounds(nextHead.x, nextHead.y, cols, rows);
  return { hit, point: nextHead };
}

export function hitsSelf(nextHead, snake, grow) {
  const upto = grow ? snake.length : Math.max(0, snake.length - 1);
  for (let i = 0; i < upto; i++) {
    const s = snake[i];
    if (s.x === nextHead.x && s.y === nextHead.y) return true;
  }
  return false;
}
