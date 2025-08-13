import { Direction } from './types.js';
import { spawnFood } from './food.js';

export const BASE_SPEED_MS = 150;
export const MIN_SPEED_MS = 80;

function loadHighScore() {
  try {
    const raw = localStorage.getItem('snake_highScore');
    const n = raw == null ? 0 : Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

function saveHighScore(value) {
  try {
    localStorage.setItem('snake_highScore', String(value));
  } catch {
    // ignore storage errors
  }
}

function createInitialSnake(board) {
  const { cols, rows } = board;
  const desiredLen = 3;
  const len = Math.max(1, Math.min(desiredLen, cols));
  const y = Math.floor(rows / 2);
  const startX = Math.min(cols - 1, Math.max(0, Math.floor(cols / 2)));
  const snake = [];
  for (let i = 0; i < len; i++) {
    const x = startX - i;
    if (x < 0) break;
    snake.push({ x, y });
  }
  return snake;
}

export function createInitialState(board) {
  const state = {
    snake: createInitialSnake(board),
    dir: Direction.Right,
    pendingDir: null,
    pendingTurnAppliedThisTick: false,
    food: null,
    score: 0,
    highScore: loadHighScore(),
    speedMs: BASE_SPEED_MS,
    isPaused: false,
    isGameOver: false,
    wrapWalls: false,
  };
  state.food = spawnFood(board, state.snake);
  if (state.food == null) {
    state.isGameOver = true; // edge case: no free cell
  }
  return state;
}

export function resetState(state, board) {
  const keepHigh = state.highScore;
  const keepWrap = state.wrapWalls;
  state.snake = createInitialSnake(board);
  state.dir = Direction.Right;
  state.pendingDir = null;
  state.pendingTurnAppliedThisTick = false;
  state.food = spawnFood(board, state.snake);
  state.score = 0;
  state.highScore = keepHigh;
  state.speedMs = BASE_SPEED_MS;
  state.isPaused = false;
  state.isGameOver = state.food == null;
  state.wrapWalls = keepWrap ?? false;
}

export function updateHighScore(state) {
  if (state.score > state.highScore) {
    state.highScore = state.score;
    saveHighScore(state.highScore);
  }
}

export function maybeIncreaseSpeed(state) {
  if (state.score > 0 && state.score % 5 === 0) {
    state.speedMs = Math.max(MIN_SPEED_MS, state.speedMs - 5);
  }
}
