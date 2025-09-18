/* Neon Defense - MVP Canvas + basic wiring */

// Production Configuration - safe for client-side (ANON_KEY is public)
window.CONFIG = {
  SUPABASE_URL: "https://aehddhwtksimtcdhxzxp.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlaGRkaHd0a3NpbXRjZGh4enhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNzA3ODgsImV4cCI6MjA3Mjc0Njc4OH0.ETDLwSLXklp6m5Vpdk1zBS7ToyVl2U6YAr4_02g24Ds",
  N8N_NEW_RUN_URL: "https://marcowille.app.n8n.cloud/webhook/neon/new_run",
  N8N_SPAWN_WAVE_URL: "https://marcowille.app.n8n.cloud/webhook/neon/spawn_wave"
};

// Legacy compatibility for existing code
window.CONFIG.N8N_NEW_RUN_PROD = window.CONFIG.N8N_NEW_RUN_URL;
window.CONFIG.N8N_NEW_RUN_TEST = window.CONFIG.N8N_NEW_RUN_URL;
window.CONFIG.N8N_SPAWN_WAVE_PROD = window.CONFIG.N8N_SPAWN_WAVE_URL;
window.CONFIG.N8N_SPAWN_WAVE_TEST = window.CONFIG.N8N_SPAWN_WAVE_URL;

// BALANCING: Fallback values if config.js loading fails
window.BALANCE = window.BALANCE || {
  enemies: {
    virus:    { hp: 3, speed: 0.6 },
    spam:     { hp: 6, speed: 0.4 },
    trojan:   { hp: 4, speed: 0.5 }
  },
  towers: {
    antivirus: { damage: 1, fireRate: 400, multiplier: { virus: 2, spam: 1, trojan: 1 } },
    firewall:  { damage: 1, fireRate: 400, multiplier: { virus: 1, spam: 2, trojan: 1 } },
    patch:     { damage: 1, fireRate: 400, multiplier: { virus: 1, spam: 1, trojan: 2 } }
  }
};

// Startscreen elements
const startscreen = document.getElementById('startscreen');
const gameUI = document.getElementById('game-ui');
const btnStartGame = document.getElementById('btn-start-game');
const logoElement = document.getElementById('startscreen-logo');
const startAudio = new Audio('assets/sounds/startscreen.mp3');

// Glitch effect variables
let glitchTimer = null;
let isGlitching = false;

// Game elements
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

/** Basic state **/
const state = {
  hp: 20,
  energy: 20,
  wave: 0,
  run_id: null,
  session_token: null,
  enemies: [],
};

/** Tower slots - strategic positions along the path **/
const towerSlots = [
  { x: 180, y: 120, occupied: false, tower: null }, // Upper segment, left side
  { x: 360, y: 120, occupied: false, tower: null }, // Upper segment, right side
  { x: 80, y: 180, occupied: false, tower: null },  // First curve area
  { x: 270, y: 240, occupied: false, tower: null }, // Middle segment
  { x: 450, y: 240, occupied: false, tower: null }, // Second curve area
  { x: 180, y: 480, occupied: false, tower: null }, // Lower segment, left side
  { x: 360, y: 480, occupied: false, tower: null }  // Lower segment, right side
];

/** Tower and projectile system **/
const towers = [];
const projectiles = [];
let currentEnemies = [];

/** Wave management system **/
let currentWave = {
  number: 0,
  enemies: [],
  isActive: false,
  isComplete: false,
  startTime: null,
  enemiesSpawned: 0,
  enemiesDestroyed: 0,
  enemiesReachedBase: 0
};

/** Tower types and effectiveness system **/
const towerTypes = {
  antivirus: {
    name: 'antivirus',
    color: '#00e5ff',      // Cyan
    strongAgainst: 'virus',
    damage: 1,
    description: 'Antivirus → stark gegen Virus'
  },
  firewall: {
    name: 'firewall',
    color: '#ff00ff',      // Magenta
    strongAgainst: 'spam',
    damage: 1,
    description: 'Firewall → stark gegen Spam'
  },
  patch: {
    name: 'patch',
    color: '#ffff00',      // Yellow
    strongAgainst: 'trojan',
    damage: 1,
    description: 'Patch/Router → stark gegen Trojan'
  }
};

let towerPlacementCount = 0; // For cycling through tower types

const elHP = document.getElementById('hp');
const elEnergy = document.getElementById('energy');
const elNextWave = document.getElementById('next-wave');
const btnNewRun = document.getElementById('btn-new-run');
const btnStartWave = document.getElementById('btn-start-wave');

function redrawHUD() {
  elHP.textContent = state.hp;
  elEnergy.textContent = state.energy;

  // Update wave display based on current state
  if (currentWave.isActive) {
    elNextWave.textContent = `${currentWave.number} (Aktiv)`;
  } else {
    elNextWave.textContent = state.wave + 1;
  }

  // Update button states based on game state
  if (state.hp <= 0) {
    btnStartWave.disabled = true;
    btnNewRun.disabled = false;
  } else if (currentWave.isActive) {
    btnStartWave.disabled = true;
  }
}

function drawTowerSlot(slot) {
  ctx.save();

  if (slot.occupied) {
    // Draw tower
    drawTower(slot.tower);
  } else {
    // Draw empty slot
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeStyle = '#ff00ff';
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.lineWidth = 2;

    // Draw slot circle
    ctx.beginPath();
    ctx.arc(slot.x, slot.y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner glow effect
    ctx.shadowBlur = 8;
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(slot.x, slot.y, 12, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawTower(tower) {
  ctx.save();
  const towerTypeData = towerTypes[tower.type];
  ctx.fillStyle = towerTypeData.color;
  ctx.strokeStyle = '#ffffff';
  ctx.shadowColor = towerTypeData.color;
  ctx.shadowBlur = 12;
  ctx.lineWidth = 2;

  // Draw tower base
  ctx.beginPath();
  ctx.arc(tower.x, tower.y, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Draw range indicator (faint) with tower color
  const rangeColor = towerTypeData.color;
  ctx.strokeStyle = rangeColor.replace('#', 'rgba(').replace(/(..)(..)(..)/, '$1,$2,$3,0.2)');
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawProjectile(projectile) {
  ctx.save();
  ctx.fillStyle = '#ffff00';
  ctx.shadowColor = '#ffff00';
  ctx.shadowBlur = 8;

  ctx.beginPath();
  ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
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

  // Tower slots
  towerSlots.forEach(slot => {
    drawTowerSlot(slot);
  });

  // Draw projectiles
  projectiles.forEach(projectile => {
    drawProjectile(projectile);
  });
}

async function startNewRun() {
  try {
    btnNewRun.disabled = true;

    // Reset wave state
    currentWave = {
      number: 0,
      enemies: [],
      isActive: false,
      isComplete: false,
      startTime: null,
      enemiesSpawned: 0,
      enemiesDestroyed: 0,
      enemiesReachedBase: 0
    };

    // Clear game objects
    towers.length = 0;
    projectiles.length = 0;
    currentEnemies.length = 0;
    towerPlacementCount = 0;

    // Reset tower slots
    towerSlots.forEach(slot => {
      slot.occupied = false;
      slot.tower = null;
    });

    // Initialize new run via backend or locally
    if (window.CONFIG && (window.CONFIG.N8N_NEW_RUN_URL || window.CONFIG.N8N_NEW_RUN_PROD || window.CONFIG.N8N_NEW_RUN_TEST)) {
      try {
        const webhookUrl = window.CONFIG.N8N_NEW_RUN_URL || window.CONFIG.N8N_NEW_RUN_PROD || window.CONFIG.N8N_NEW_RUN_TEST;
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ player_name: 'Anonymous' }),
        });
        const data = await res.json();
        state.run_id = data.run_id || `local-run-${Date.now()}`;
        state.session_token = data.session_token || null;
        state.hp = data.base_hp ?? 20;
        state.energy = data.energy ?? 15;
        state.wave = 0;
        console.log('New run initialized via backend:', state.run_id);
      } catch (error) {
        console.log('Backend not available, starting local run:', error.message);
        initializeLocalRun();
      }
    } else {
      initializeLocalRun();
    }

    btnStartWave.disabled = false;
    redrawHUD();
    drawBoard();
  } catch (e) {
    console.error('Failed to start new run:', e);
    btnNewRun.disabled = false;
  }
}

function initializeLocalRun() {
  state.run_id = `local-run-${Date.now()}`;
  state.session_token = 'local-session';
  state.hp = 20;
  state.energy = 15;
  state.wave = 0;
  console.log('Local run initialized:', state.run_id);
}

async function startWave() {
  try {
    btnStartWave.disabled = true;

    // Increment wave counter
    state.wave++;

    // Load enemies from backend (waits until complete)
    await loadWaveEnemies();

    // Initialize new wave with loaded enemies
    currentWave.number = state.wave;
    currentWave.isActive = true;
    currentWave.isComplete = false;
    currentWave.startTime = Date.now();
    currentWave.enemiesSpawned = 0;
    currentWave.enemiesDestroyed = 0;
    currentWave.enemiesReachedBase = 0;
    currentWave.enemies = state.enemies;

    // Start wave animation
    await animateWave(state.enemies);

    // Wave completed - handle end
    endWave();

  } catch (e) {
    console.error('Wave failed:', e);
    btnStartWave.disabled = false;
    currentWave.isActive = false;
  }
}

async function loadWaveEnemies() {
  try {
    const res = await fetch(window.CONFIG.N8N_SPAWN_WAVE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        run_id: state.run_id,
        wave: state.wave + 1
      })
    });

    const data = await res.json();
    if (!data.enemies) throw new Error("No enemies in response");

    state.enemies = data.enemies;
    console.log("✅ Loaded", state.enemies.length, "enemies from backend for wave", state.wave + 1);
  } catch (err) {
    console.warn("⚠️ Backend not available, using dummy data:", err);
    state.enemies = generateDummyWave(state.wave + 1);
  }
}

function generateDummyWave(waveNumber) {
  // BALANCING: Use values from config.js for easier balancing
  const baseEnemies = [
    {
      type: 'virus',
      hp: window.BALANCE.enemies.virus.hp + waveNumber,
      speed: window.BALANCE.enemies.virus.speed + (waveNumber * 0.05)
    },
    {
      type: 'spam',
      hp: window.BALANCE.enemies.spam.hp + waveNumber,
      speed: window.BALANCE.enemies.spam.speed + (waveNumber * 0.05)
    },
    {
      type: 'trojan',
      hp: window.BALANCE.enemies.trojan.hp + waveNumber,
      speed: window.BALANCE.enemies.trojan.speed + (waveNumber * 0.05)
    },
  ];

  // Add more enemies for higher waves
  let enemies = [...baseEnemies];
  for (let i = 1; i < waveNumber && i < 5; i++) {
    enemies.push(...baseEnemies);
  }

  // TODO: Add boss enemies for certain waves (every 5th wave)
  // TODO: Add hybrid enemy types for advanced waves

  return enemies;
}

function enemyColor(type) {
  switch (type) {
    case 'virus': return '#00e5ff';   // Cyan → Antivirus kontert
    case 'spam': return '#ff00ff';    // Magenta → Firewall kontert
    case 'trojan': return '#ffff00';  // Gelb → Patch/Router kontert
    default: return '#ffffff';
  }
}

function drawEnemy(e, x, y) {
  ctx.save();
  ctx.fillStyle = enemyColor(e.type);
  ctx.shadowColor = ctx.fillStyle;
  ctx.shadowBlur = 14;
  if (e.type === 'virus') {
    ctx.beginPath();
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x - 8, y + 8);
    ctx.lineTo(x + 8, y + 8);
    ctx.closePath();
    ctx.fill();
  } else if (e.type === 'spam') {
    ctx.fillRect(x - 9, y - 9, 18, 18);
  } else {
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
  }

  // DEBUG: HP display above enemy
  ctx.fillStyle = "#ffffff";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.shadowBlur = 0; // Remove shadow for text
  ctx.fillText(e.hp, x, y - 15);

  ctx.restore();
}

function lerp(a, b, t) { return a + (b - a) * t; }

function pathAt(t) {
  const segments = [
    { ax: 40, ay: 60, bx: 500, by: 60 },
    { ax: 500, ay: 60, bx: 40, by: 300 },
    { ax: 40, ay: 300, bx: 500, by: 300 },
    { ax: 500, ay: 300, bx: 40, by: 540 },
    { ax: 40, ay: 540, bx: 500, by: 540 },
  ];
  // Clamp t auf 0–1
  const clampedT = Math.max(0, Math.min(1, t));
  const idx = Math.min(segments.length - 1, Math.floor(clampedT * segments.length));
  const localT = (clampedT * segments.length) - idx;
  const s = segments[idx];
  if (!s) return { x: 0, y: 0 }; // Fallback, falls undefined
  return { x: lerp(s.ax, s.bx, localT), y: lerp(s.ay, s.by, localT) };
}

async function animateWave(enemies) {
  const start = performance.now();
  const duration = 8000; // Increased duration for better gameplay

  // Prepare enemies with position tracking
  enemies.forEach((e, i) => {
    e.id = Date.now() + i;
    e.progress = 0;
    e.maxHP = e.hp;
    e.isDestroyed = false;
    e.reachedBase = false;
  });
  currentEnemies = [...enemies];
  currentWave.enemiesSpawned = enemies.length;

  return new Promise(resolve => {
    function frame(now) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);

      drawBoard();

      // Update and draw enemies
      const previousEnemyCount = currentEnemies.length;
      currentEnemies = currentEnemies.filter(e => {
        if (e.hp <= 0 && !e.isDestroyed) {
          e.isDestroyed = true;
          currentWave.enemiesDestroyed++;
          return false;
        }
        return e.hp > 0;
      });

      currentEnemies.forEach((e, i) => {
        const et = Math.min(1, t * (1 + i * 0.1));
        e.progress = et;
        const { x, y } = pathAt(et);
        e.x = x;
        e.y = y;

        // Check if enemy reached base
        if (et >= 1 && !e.reachedBase) {
          e.reachedBase = true;
          currentWave.enemiesReachedBase++;
          state.hp -= 1; // Damage player base
          redrawHUD();
        }

        drawEnemy(e, x, y);
      });

      // Remove enemies that reached the base
      currentEnemies = currentEnemies.filter(e => e.progress < 1);

      // Update towers and projectiles
      updateTowers();
      updateProjectiles();

      // Check if wave is complete
      if (isWaveCleared() || t >= 1) {
        currentEnemies = [];
        resolve();
      } else {
        requestAnimationFrame(frame);
      }
    }
    requestAnimationFrame(frame);
  });
}

// Wave lifecycle functions
function isWaveCleared() {
  const totalProcessed = currentWave.enemiesDestroyed + currentWave.enemiesReachedBase;
  return totalProcessed >= currentWave.enemiesSpawned && currentEnemies.length === 0;
}

function endWave() {
  currentWave.isActive = false;
  currentWave.isComplete = true;

  // Update game state
  state.wave = currentWave.number;

  // Calculate rewards
  const enemiesKilled = currentWave.enemiesDestroyed;
  const baseEnergyReward = 5;
  const bonusEnergy = Math.floor(enemiesKilled * 0.5); // Bonus for kills
  const totalReward = baseEnergyReward + bonusEnergy;

  state.energy += totalReward;

  // Log wave results
  console.log(`Wave ${currentWave.number} complete!`);
  console.log(`- Enemies destroyed: ${currentWave.enemiesDestroyed}/${currentWave.enemiesSpawned}`);
  console.log(`- Enemies reached base: ${currentWave.enemiesReachedBase}`);
  console.log(`- Energy reward: ${totalReward} (${baseEnergyReward} base + ${bonusEnergy} bonus)`);

  // Check game over condition
  if (state.hp <= 0) {
    handleGameOver();
    return;
  }

  // Update HUD and re-enable wave button
  redrawHUD();
  btnStartWave.disabled = false;

  // TODO: Show wave completion popup with stats
  // TODO: Unlock new tower types or upgrades
}

function handleGameOver() {
  console.log('Game Over! Base destroyed.');
  btnStartWave.disabled = true;
  btnNewRun.disabled = false;

  // TODO: Show game over screen
  // TODO: Save high score to backend
  // TODO: Reset game state option
}

// Damage calculation system
function calculateDamage(towerType, enemyType) {
  // BALANCING: Use values from config.js for easier balancing
  const towerData = window.BALANCE.towers[towerType];
  if (!towerData) return 1; // Fallback

  const baseDamage = towerData.damage;
  const multiplier = towerData.multiplier[enemyType] || 1;

  return baseDamage * multiplier;
}

// Tower placement and combat system
function createTower(x, y) {
  // Cycle through tower types for demo purposes
  const typeNames = Object.keys(towerTypes);
  const selectedType = typeNames[towerPlacementCount % typeNames.length];
  towerPlacementCount++;

  return {
    x: x,
    y: y,
    range: 80,
    damage: towerTypes[selectedType].damage,
    fireRate: 500, // BALANCING: Increased fire rate (was 1000ms, now 500ms)
    lastShot: 0,
    target: null,
    type: selectedType
  };
}

function placeTower(slotIndex) {
  const slot = towerSlots[slotIndex];
  if (!slot.occupied) {
    const tower = createTower(slot.x, slot.y);
    slot.tower = tower;
    slot.occupied = true;
    towers.push(tower);
    // TODO: Deduct energy cost
    // TODO: Check if player has enough energy
  }
}

function updateTowers() {
  towers.forEach(tower => {
    // Find nearest enemy in range
    tower.target = null;
    let nearestDistance = tower.range;

    currentEnemies.forEach(enemy => {
      const distance = Math.sqrt(
        Math.pow(enemy.x - tower.x, 2) + Math.pow(enemy.y - tower.y, 2)
      );
      if (distance < nearestDistance) {
        tower.target = enemy;
        nearestDistance = distance;
      }
    });

    // Fire at target
    if (tower.target && Date.now() - tower.lastShot > tower.fireRate) {
      fireProjectile(tower, tower.target);
      tower.lastShot = Date.now();
    }
  });
}

function fireProjectile(tower, target) {
  const projectile = {
    x: tower.x,
    y: tower.y,
    targetX: target.x,
    targetY: target.y,
    speed: 200, // pixels per second
    damage: tower.damage,
    towerType: tower.type, // Store tower type for damage calculation
    target: target,
    startTime: Date.now()
  };
  projectiles.push(projectile);
}

function updateProjectiles() {
  const now = Date.now();

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i];
    const elapsed = (now - projectile.startTime) / 1000; // seconds

    // Calculate current position
    const dx = projectile.targetX - projectile.x;
    const dy = projectile.targetY - projectile.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const progress = Math.min(1, (elapsed * projectile.speed) / distance);

    projectile.x += dx * progress;
    projectile.y += dy * progress;

    // Check if projectile reached target
    if (progress >= 1) {
      // Hit the target with type effectiveness
      if (projectile.target && projectile.target.hp > 0) {
        const hpBefore = projectile.target.hp;
        const effectiveDamage = calculateDamage(projectile.towerType, projectile.target.type);
        projectile.target.hp -= effectiveDamage;

        // DEBUG: Detailed damage logging
        console.log(`${projectile.towerType} trifft ${projectile.target.type} für ${effectiveDamage} Schaden (HP vorher: ${hpBefore}, nachher: ${projectile.target.hp})`);

        // BALANCING: Enhanced damage visibility for combat observation
        console.log(`${projectile.towerType} → ${projectile.target.type}, Schaden: ${effectiveDamage}, Rest-HP: ${projectile.target.hp}`);

        // BALANCING: Visual feedback for effective hits using config.js multipliers
        const multiplier = window.BALANCE.towers[projectile.towerType]?.multiplier[projectile.target.type] || 1;
        if (multiplier > 1) {
          // TODO: Add visual effect for critical hits (particle effects, screen shake)
          console.log(`CRITICAL HIT! ${projectile.towerType} vs ${projectile.target.type}: ${effectiveDamage} damage (${multiplier}x)`);
        }
      }
      projectiles.splice(i, 1);
    }
  }
}

function getClickedSlot(mouseX, mouseY) {
  for (let i = 0; i < towerSlots.length; i++) {
    const slot = towerSlots[i];
    const distance = Math.sqrt(
      Math.pow(mouseX - slot.x, 2) + Math.pow(mouseY - slot.y, 2)
    );
    if (distance <= 18) { // Slot radius
      return i;
    }
  }
  return -1;
}

// DEBUG: Test scenario helper function
function spawnTestWave(towerType, enemyType) {
  console.log(`DEBUG: Starting test scenario - ${towerType} vs ${enemyType}`);

  // Reset current game state
  currentEnemies.length = 0;
  projectiles.length = 0;

  // Clear all tower slots first
  towerSlots.forEach(slot => {
    slot.occupied = false;
    slot.tower = null;
  });
  towers.length = 0;

  // Place test tower on first slot
  const firstSlot = towerSlots[0];
  const testTower = {
    x: firstSlot.x,
    y: firstSlot.y,
    range: 80,
    damage: towerTypes[towerType].damage,
    fireRate: 300, // BALANCING: Even faster firing for testing scenarios
    lastShot: 0,
    target: null,
    type: towerType
  };

  firstSlot.tower = testTower;
  firstSlot.occupied = true;
  towers.push(testTower);

  // Create test enemy
  const testEnemy = {
    type: enemyType,
    hp: 5, // Fixed HP for consistent testing
    speed: 0.5, // Slower for better observation
    id: Date.now(),
    progress: 0,
    maxHP: 5,
    isDestroyed: false,
    reachedBase: false
  };

  // Start manual animation for test enemy
  const start = performance.now();
  const duration = 10000; // 10 seconds for detailed observation

  currentEnemies = [testEnemy];

  function testFrame(now) {
    const elapsed = now - start;
    const t = Math.min(1, elapsed / duration);

    drawBoard();

    // Update test enemy position
    if (currentEnemies.length > 0) {
      const enemy = currentEnemies[0];
      enemy.progress = t;
      const { x, y } = pathAt(t);
      enemy.x = x;
      enemy.y = y;

      if (enemy.hp > 0) {
        drawEnemy(enemy, x, y);
      } else {
        currentEnemies.length = 0;
        console.log(`DEBUG: Test enemy destroyed!`);
      }
    }

    // Update towers and projectiles
    updateTowers();
    updateProjectiles();

    if (t < 1 && currentEnemies.length > 0) {
      requestAnimationFrame(testFrame);
    } else {
      console.log(`DEBUG: Test scenario completed`);
    }
  }

  requestAnimationFrame(testFrame);
}

// DEBUG: Make test function available globally for console use
window.spawnTestWave = spawnTestWave;

// Logo glitch effect
function triggerLogoGlitch() {
  if (isGlitching) return;

  isGlitching = true;
  logoElement.classList.add('glitch');

  setTimeout(() => {
    logoElement.classList.remove('glitch');
    isGlitching = false;
  }, 500);
}

// Schedule random glitch effects
function scheduleGlitch() {
  // Random interval between 8-12 seconds
  const interval = Math.random() * 4000 + 8000;

  glitchTimer = setTimeout(() => {
    triggerLogoGlitch();
    scheduleGlitch(); // Schedule next glitch
  }, interval);
}

// Startscreen functionality
function initStartscreen() {
  // Setup audio
  startAudio.loop = true;
  startAudio.volume = 0.3;

  // Try immediate autoplay (will likely fail due to browser policy)
  startAudio.play().catch(() => {
    // Autoplay blocked - enable button and wait for user interaction
    btnStartGame.disabled = false;
  });

  // Enable button when audio is ready
  startAudio.addEventListener('canplaythrough', () => {
    btnStartGame.disabled = false;
  });

  // Enable button if audio fails to load
  startAudio.addEventListener('error', () => {
    btnStartGame.disabled = false;
  });

  // Enable audio on any user interaction
  const enableAudioOnInteraction = () => {
    startAudio.play().catch(e => console.log('Audio play failed:', e));
    document.removeEventListener('click', enableAudioOnInteraction);
    document.removeEventListener('keydown', enableAudioOnInteraction);
    document.removeEventListener('touchstart', enableAudioOnInteraction);
  };

  document.addEventListener('click', enableAudioOnInteraction);
  document.addEventListener('keydown', enableAudioOnInteraction);
  document.addEventListener('touchstart', enableAudioOnInteraction);

  // Load the audio
  startAudio.load();

  // Start glitch effects
  scheduleGlitch();
}

function startGame() {
  // Keep startscreen audio playing (remove the stop/pause code)

  // Clear glitch timer
  if (glitchTimer) {
    clearTimeout(glitchTimer);
    glitchTimer = null;
  }

  // Hide startscreen and show game UI
  startscreen.style.display = 'none';
  gameUI.style.display = 'block';

  // Initialize game
  redrawHUD();
  drawBoard();
}

// Canvas click handler for tower placement
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const slotIndex = getClickedSlot(mouseX, mouseY);
  if (slotIndex !== -1) {
    placeTower(slotIndex);
    drawBoard(); // Refresh display
  }
});

// Event listeners
btnStartGame.addEventListener('click', startGame);
btnNewRun.addEventListener('click', startNewRun);
btnStartWave.addEventListener('click', startWave);

// Initialize startscreen on load
window.addEventListener('load', initStartscreen);

// TODO:
// - Spielerische Turmtyp-Auswahl (UI für Antivirus/Firewall/Patch)
// - Energie-Kosten für verschiedene Turmtypen implementieren
// - Turm-Upgrades und Verbesserungen (Damage, Range, Fire Rate)
// - Schwache Effektivität hinzufügen (0.5x Schaden) für Balancing
// - Turm-Verkauf und Repositionierung
// - Visuelle Verbesserungen (Critical Hit Effects, Muzzle Flash)
// - Balancing der Turmstärken und Gegner-HP

// Wave Management TODO:
// - Boss-Wellen implementieren (jede 5. Welle)
// - Hybrid-Gegnertypen für fortgeschrittene Wellen
// - Wave-Completion-Popup mit Statistiken
// - Dynamisches Balancing basierend auf Spielerleistung
// - Special Events (Double Energy, Bonus Waves)
// - Leaderboard-Integration über Backend
