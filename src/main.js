// Entry bootstrap for scaffold (M1)
const canvas = document.getElementById('game');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const restartBtn = document.getElementById('restartBtn');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlayText');
const overlayRestart = document.getElementById('overlayRestart');

function setupCanvasSize(cols = 30, rows = 20, cellSize = 24){
  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  const cssW = cols * cellSize;
  const cssH = rows * cellSize;
  canvas.style.width = cssW + 'px';
  canvas.style.height = cssH + 'px';
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  return ctx;
}

function drawPlaceholder(ctx){
  ctx.save();
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#0b0e1a';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#22c55e';
  ctx.font = '16px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const cssW = parseFloat(getComputedStyle(canvas).width);
  const cssH = parseFloat(getComputedStyle(canvas).height);
  ctx.fillText('Snake Scaffold Ready', cssW/2, cssH/2);
  ctx.restore();
}

function init(){
  const ctx = setupCanvasSize();
  requestAnimationFrame(()=>canvas.focus());
  scoreEl.textContent = '0';
  try{ highScoreEl.textContent = localStorage.getItem('snake_highScore') || '0'; }catch{ highScoreEl.textContent = '0'; }
  overlay.classList.add('hidden');
  overlayText.textContent = '暂停';
  const draw = ()=> drawPlaceholder(ctx);
  draw();
  window.addEventListener('resize', ()=>{ const c = setupCanvasSize(); drawPlaceholder(c); });
  const doRestart = ()=>{ drawPlaceholder(ctx); };
  restartBtn.addEventListener('click', doRestart);
  overlayRestart.addEventListener('click', doRestart);
}

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }

