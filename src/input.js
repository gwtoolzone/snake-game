import { Direction } from './game/types.js';
import { willReverse } from './game/snake.js';

let targetRef = null;
let handlers = null;
let optsRef = {};

const KEY_TO_DIR = new Map([
  ['ArrowUp', Direction.Up],
  ['ArrowDown', Direction.Down],
  ['ArrowLeft', Direction.Left],
  ['ArrowRight', Direction.Right],
  ['KeyW', Direction.Up],
  ['KeyS', Direction.Down],
  ['KeyA', Direction.Left],
  ['KeyD', Direction.Right],
]);

function isDirKey(code) {
  return KEY_TO_DIR.has(code);
}

function preventForNavKeys(e) {
  if (isDirKey(e.code) || e.code === 'Space') {
    e.preventDefault();
  }
}

/**
 * Attach keyboard input to the given target (canvas or window)
 * @param {object} state Game state object (M3)
 * @param {Window|HTMLElement} canvasOrWindow target to listen on (default: window)
 * @param {object} opts optional callbacks: { onRestart?:()=>void, onTogglePause?:(paused:boolean)=>void }
 */
export function attachInput(state, canvasOrWindow = window, opts = {}) {
  detachInput();
  targetRef = canvasOrWindow || window;
  optsRef = opts || {};

  const onKeyDown = (e) => {
    const code = e.code || e.key || '';

    // Direction changes
    if (isDirKey(code)) {
      preventForNavKeys(e);
      const nextDir = KEY_TO_DIR.get(code);
      if (nextDir == null) return;
      if (willReverse(state.dir, nextDir)) return;
      if (state.pendingTurnAppliedThisTick) return;
      if (state.pendingDir != null) return;
      state.pendingDir = nextDir;
      return;
    }

    // Pause toggle: Space or P
    if (code === 'Space' || code === 'KeyP') {
      preventForNavKeys(e);
      state.isPaused = !state.isPaused;
      if (typeof optsRef.onTogglePause === 'function') {
        optsRef.onTogglePause(state.isPaused);
      }
      return;
    }

    // Restart: R or Enter when game over
    if (code === 'KeyR' || code === 'Enter') {
      if (state.isGameOver) {
        if (typeof optsRef.onRestart === 'function') {
          optsRef.onRestart();
        } else {
          try {
            const ev = new CustomEvent('snake:restart');
            (targetRef || window).dispatchEvent(ev);
          } catch {
            // ignore
          }
        }
      }
      return;
    }
  };

  handlers = { onKeyDown };
  targetRef.addEventListener('keydown', onKeyDown, { passive: false });
}

export function detachInput() {
  if (targetRef && handlers && handlers.onKeyDown) {
    targetRef.removeEventListener('keydown', handlers.onKeyDown);
  }
  targetRef = null;
  handlers = null;
  optsRef = {};
}
