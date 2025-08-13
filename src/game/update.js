import { DIR_VECTORS } from './types.js';
import { advanceSnake } from './snake.js';
import { hitsWall, hitsSelf } from './collisions.js';
import { equalsPoint } from '../utils.js';
import { spawnFood } from './food.js';
import { maybeIncreaseSpeed, updateHighScore } from './state.js';

export function update(state, board) {
  if (state.isPaused || state.isGameOver) return;

  // Apply pending direction once per tick
  if (state.pendingDir != null) {
    state.dir = state.pendingDir;
    state.pendingDir = null;
    state.pendingTurnAppliedThisTick = true;
  }

  // Candidate next head from current direction
  const head = state.snake[0];
  const v = DIR_VECTORS[state.dir];
  const candidate = { x: head.x + v.x, y: head.y + v.y };

  // Wall handling (with optional wrapping)
  const wall = hitsWall(candidate, board, state.wrapWalls);
  if (wall.hit) {
    state.isGameOver = true;
    state.pendingTurnAppliedThisTick = false;
    updateHighScore(state);
    return;
  }
  const nextHead = wall.point; // wrapped (if enabled) or same as candidate

  // Eat food?
  const ate = state.food != null && equalsPoint(nextHead, state.food);

  // Self collision (tail will be removed unless growing)
  if (hitsSelf(nextHead, state.snake, ate)) {
    state.isGameOver = true;
    state.pendingTurnAppliedThisTick = false;
    updateHighScore(state);
    return;
  }

  // Move snake
  advanceSnake(state.snake, state.dir, ate);
  // Correct head to wrapped coordinates (if any)
  state.snake[0].x = nextHead.x;
  state.snake[0].y = nextHead.y;

  if (ate) {
    state.score += 1;
    maybeIncreaseSpeed(state);
    state.food = spawnFood(board, state.snake);
    if (state.food == null) {
      state.isGameOver = true; // victory / no free cell
    }
  }

  // End-of-tick housekeeping
  state.pendingTurnAppliedThisTick = false;
  updateHighScore(state);
}
