let rafId = null;
let running = false;
let lastTime = 0;
let accumulator = 0;

let ctx = null;
const current = {
  state: null,
  update: null,
  render: null,
  canvas: null,
};

function frame(now) {
  if (!running) return;
  if (lastTime === 0) lastTime = now;
  const delta = now - lastTime;
  lastTime = now;

  const state = current.state;
  const update = current.update;
  const render = current.render;

  if (!state || !update || !render || !ctx) {
    rafId = window.requestAnimationFrame(frame);
    return;
  }

  if (state.isPaused || state.isGameOver) {
    // do not advance simulation while paused/ended
    accumulator = 0;
  } else {
    accumulator += delta;
    let guard = 0;
    while (accumulator >= state.speedMs) {
      update(state);
      accumulator -= state.speedMs;
      if (++guard > 100) { // safety guard
        accumulator = 0;
        break;
      }
    }
  }

  try {
    render(ctx, state);
  } finally {
    rafId = window.requestAnimationFrame(frame);
  }
}

export function startLoop({ state, update, render, canvas }) {
  stopLoop();
  current.state = state;
  current.update = update;
  current.render = render;
  current.canvas = canvas;
  ctx = canvas.getContext('2d');
  accumulator = 0;
  lastTime = 0;
  running = true;
  rafId = window.requestAnimationFrame(frame);
  return { stop: stopLoop, pause, resume, isRunning: () => running };
}

export function stopLoop() {
  if (rafId != null) {
    window.cancelAnimationFrame(rafId);
    rafId = null;
  }
  running = false;
  lastTime = 0;
  accumulator = 0;
}

export function pause() {
  if (current.state) current.state.isPaused = true;
}

export function resume() {
  if (current.state) current.state.isPaused = false;
}
