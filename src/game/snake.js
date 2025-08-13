import { DIR_VECTORS, Direction } from './types.js';

export function getHead(snake) {
  return snake[0];
}

export function contains(snake, x, y) {
  return snake.some((p) => p.x === x && p.y === y);
}

export function advanceSnake(snake, dir, grow = false) {
  const v = DIR_VECTORS[dir];
  const head = getHead(snake);
  const newHead = { x: head.x + v.x, y: head.y + v.y };
  snake.unshift(newHead);
  if (!grow) snake.pop();
  return newHead;
}

export function willReverse(currDir, nextDir) {
  if (currDir === nextDir) return false;
  const opposites = {
    [Direction.Up]: Direction.Down,
    [Direction.Down]: Direction.Up,
    [Direction.Left]: Direction.Right,
    [Direction.Right]: Direction.Left,
  };
  return opposites[currDir] === nextDir;
}
