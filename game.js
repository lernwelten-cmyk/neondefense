/* Neon Defense - MVP Canvas + basic wiring */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

/** Basic state **/
const state = {
  hp: 20,
  energy: 20,
  wave: 0,
  run_id: null,
  session_token: null,
};

const elHP = document.getElementById('hp');
const elEnergy = document.getElementById('energy');
const elNextWave = document.getElementById('next-wave');
const btnNewRun = document.getElementById('btn-new-run');
const btnStartWave = document.getElementById('btn-start-wave');

function redrawHUD() {
  elHP.textContent = state.hp;
  elEnergy.textContent = state.energy;
  elNextWave.textContent = state.wave + 1;
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Background grid
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 36) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();

  // Fixed path (simple S shape)
  ctx.save();
  ctx.strokeStyle = '#00e5ff';
  ctx.shadowColor = '#00e5ff';
  ctx.shadowBlur = 10;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(40, 60);
  ctx.lineTo(500, 60);
  ctx.lineTo(40, 300);
  ctx.lineTo(500, 300);
  ctx.lineTo(40, 540);
  ctx.lineTo(500, 540);
  ctx.stroke();
  ctx.restore();

  // Base core
  ctx.save();
  ctx.fillStyle = '#ff00ff';
  ctx.shadowColor = '#ff00ff';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(500, 540, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

async function startNewRun() {
  try {
    btnNewRun.disabled = true;
    // If an n8n webhook is configured, call it. Otherwise, simulate a run.
    if (window.CONFIG && CONFIG.N8N_BASE_URL && CONFIG.ENDPOINTS.NEW_RUN) {
      const res = await fetch(`${CONFIG.N8N_BASE_URL}${CONFIG.ENDPOINTS.NEW_RUN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_name: 'Anonymous' }),
      });
      const data = await res.json();
      state.run_id = data.run_id || null;
      state.session_token = data.session_token || null;
      state.hp = data.base_hp ?? 20;
      state.energy = data.energy ?? 20;
      state.wave = 0;
    } else {
      // Fallback local init
      state.run_id = 'local-run';
      state.session_token = 'local-session';
      state.hp = 20;
      state.energy = 20;
      state.wave = 0;
    }
    btnStartWave.disabled = false;
    redrawHUD();
    drawBoard();
  } catch (e) {
    console.error(e);
    btnNewRun.disabled = false;
  }
}

async function startWave() {
  try {
    btnStartWave.disabled = true;
    // Ask backend to spawn a wave
    let enemies = [];
    if (window.CONFIG && CONFIG.N8N_BASE_URL && CONFIG.ENDPOINTS.SPAWN_WAVE) {
      const res = await fetch(`${CONFIG.N8N_BASE_URL}${CONFIG.ENDPOINTS.SPAWN_WAVE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ run_id: state.run_id, wave: state.wave + 1 }),
      });
      const data = await res.json();
      enemies = data.enemies || [];
    } else {
      // Local dummy enemies
      enemies = [
        { type: 'triangle', hp: 3, speed: 1.2 },
        { type: 'square', hp: 6, speed: 0.8 },
        { type: 'circle', hp: 4, speed: 1.0 },
      ];
    }

    // Simple animation demo: move a few enemies along the first segment of the path
    await animateWave(enemies);

    state.wave += 1;
    state.energy += 5;
    redrawHUD();
    btnStartWave.disabled = false;
  } catch (e) {
    console.error(e);
    btnStartWave.disabled = false;
  }
}

function enemyColor(type) {
  switch (type) {
    case 'triangle': return '#00e5ff';   // Pulse weak, swarm style
    case 'square':   return '#ff2d55';   // Laser target (panzer)
    case 'circle':   return '#a7ff4b';   // Missile target (flieger)
    default: return '#ffffff';
  }
}

function drawEnemy(e, x, y) {
  ctx.save();
  ctx.fillStyle = enemyColor(e.type);
  ctx.shadowColor = ctx.fillStyle;
  ctx.shadowBlur = 14;
  if (e.type === 'triangle') {
    ctx.beginPath();
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x - 8, y + 8);
    ctx.lineTo(x + 8, y + 8);
    ctx.closePath();
    ctx.fill();
  } else if (e.type === 'square') {
    ctx.fillRect(x - 9, y - 9, 18, 18);
  } else {
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function lerp(a, b, t) { return a + (b - a) * t; }

function pathAt(t) {
  // Very simple segmented path mapping t in [0,1]
  const segments = [
    { ax: 40, ay: 60, bx: 500, by: 60 },
    { ax: 500, ay: 60, bx: 40, by: 300 },
    { ax: 40, ay: 300, bx: 500, by: 300 },
    { ax: 500, ay: 300, bx: 40, by: 540 },
    { ax: 40, ay: 540, bx: 500, by: 540 },
  ];
  const idx = Math.min(segments.length - 1, Math.floor(t * segments.length));
  const localT = (t * segments.length) - idx;
  const s = segments[idx];
  return { x: lerp(s.ax, s.bx, localT), y: lerp(s.ay, s.by, localT) };
}

async function animateWave(enemies) {
  const start = performance.now();
  const duration = 6000; // ~6s demo
  return new Promise(resolve => {
    function frame(now) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      drawBoard();
      enemies.forEach((e, i) => {
        const et = Math.min(1, t * (1 + i * 0.1));
        const { x, y } = pathAt(et);
        drawEnemy(e, x, y);
      });
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
}

btnNewRun.addEventListener('click', startNewRun);
btnStartWave.addEventListener('click', startWave);

// Initial render
redrawHUD();
drawBoard();
