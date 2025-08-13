/**
 * @typedef {{x:number, y:number}} Point
 */

export const Direction = Object.freeze({
  Up: 'Up',
  Down: 'Down',
  Left: 'Left',
  Right: 'Right',
});

export const DIR_VECTORS = Object.freeze({
  [Direction.Up]: { x: 0, y: -1 },
  [Direction.Down]: { x: 0, y: 1 },
  [Direction.Left]: { x: -1, y: 0 },
  [Direction.Right]: { x: 1, y: 0 },
});

export function isPoint(v) {
  return v && typeof v.x === 'number' && typeof v.y === 'number';
}
