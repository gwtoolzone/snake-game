export function clamp(num, min, max) {
  if (num < min) return min;
  if (num > max) return max;
  return num;
}

export function randInt(min, max) {
  // inclusive min, exclusive max
  return Math.floor(Math.random() * (max - min)) + min;
}

export function choice(array, rng = Math.random) {
  if (!array || array.length === 0) return undefined;
  const i = Math.floor(rng() * array.length);
  return array[i];
}

export function equalsPoint(a, b) {
  if (!a || !b) return false;
  return a.x === b.x && a.y === b.y;
}

export function range(n) {
  return Array.from({ length: n }, (_, i) => i);
}
