// ===== EDITE AQUI se algo mudar =====
const CONFIG = {
  whatsappNumber: '5554996023257', // número do Ju, com DDI+DDD
  dateRangeDays: 14,               // até quantos dias no futuro ela pode escolher
  timeSlots: ['19:00', '20:00', '21:00', '22:00'],
  eventDurationHours: 2,
  musicFile: 'music.mp3',          // arquivo de música (coloque na mesma pasta do index.html)
  musicVolume: 0.5,
};
// =====================================

let currentScreen = 'ask';
function switchScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${name}`).classList.add('active');
  currentScreen = name;
}

// ---------- Fundo de corações ----------
(function spawnHearts() {
  const container = document.getElementById('hearts-bg');
  const symbols = ['❤️', '💗', '💕'];
  for (let i = 0; i < 22; i++) {
    const el = document.createElement('div');
    el.className = 'heart';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = 14 + Math.random() * 20 + 'px';
    el.style.animationDuration = 8 + Math.random() * 10 + 's';
    el.style.animationDelay = Math.random() * 12 + 's';
    container.appendChild(el);
  }
})();

// ---------- Aura counter ----------
let aura = 0;
const auraCounterEl = document.getElementById('aura-counter');
const auraValueEl = document.getElementById('aura-value');

function gainAura(x, y) {
  const amount = Math.floor(Math.random() * 400) + 100;
  aura += amount;
  auraCounterEl.hidden = false;
  auraValueEl.textContent = aura.toLocaleString('pt-BR');

  const float = document.createElement('div');
  float.className = 'floating-gain';
  float.textContent = `+${amount} aura`;
  float.style.left = x + 'px';
  float.style.top = y + 'px';
  document.body.appendChild(float);
  setTimeout(() => float.remove(), 1000);
}

// ---------- Botão "Não" fujão ----------
const noBtn = document.getElementById('btn-no');
const yesBtn = document.getElementById('btn-yes');

const taunts = [
  'É nada',
  'Sipasso',
  'Ba mas ai viajo negão',
  'Continua tentando gostosa',
  'kk tchola',
  'Tá farmando aura é porra',
  'Ai foi 67 omegalul total',
  'Sigma',
  'Cachorro dançando ao som de gaita.mp4',
  '67',
];

let dodgeCount = 0;
let yesScale = 1;
let lastDodge = 0;
let lastTauntIndex = -1;

function dodgeNo(x, y) {
  const now = Date.now();
  if (now - lastDodge < 200) return;
  lastDodge = now;

  dodgeCount++;
  gainAura(x ?? window.innerWidth / 2, y ?? window.innerHeight / 2);

  if (!noBtn.classList.contains('fixed')) {
    noBtn.classList.add('fixed');
  }

  const rect = noBtn.getBoundingClientRect();
  const margin = 24;
  const maxX = Math.max(margin, window.innerWidth - rect.width - margin);
  const maxY = Math.max(margin, window.innerHeight - rect.height - margin);
  noBtn.style.left = (margin + Math.random() * (maxX - margin)) + 'px';
  noBtn.style.top = (margin + Math.random() * (maxY - margin)) + 'px';

  let tauntIndex = Math.floor(Math.random() * taunts.length);
  if (taunts.length > 1 && tauntIndex === lastTauntIndex) {
    tauntIndex = (tauntIndex + 1) % taunts.length;
  }
  lastTauntIndex = tauntIndex;
  noBtn.textContent = taunts[tauntIndex];

  yesScale = Math.min(yesScale + 0.06, 1.8);
  yesBtn.style.transform = `scale(${yesScale})`;
}

document.addEventListener('mousemove', (e) => {
  if (currentScreen !== 'ask') return;
  const rect = noBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
  if (dist < 90) dodgeNo(e.clientX, e.clientY);
});

noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const t = e.touches[0];
  dodgeNo(t.clientX, t.clientY);
}, { passive: false });

noBtn.addEventListener('click', (e) => {
  dodgeNo(e.clientX, e.clientY);
});

window.addEventListener('resize', () => {
  if (!noBtn.classList.contains('fixed')) return;
  const rect = noBtn.getBoundingClientRect();
  const maxX = Math.max(24, window.innerWidth - rect.width - 24);
  const maxY = Math.max(24, window.innerHeight - rect.height - 24);
  noBtn.style.left = Math.min(rect.left, maxX) + 'px';
  noBtn.style.top = Math.min(rect.top, maxY) + 'px';
});

// ---------- Botão "Sim" ----------
yesBtn.addEventListener('click', () => {
  startMusic();
  launchConfetti();
  setTimeout(() => {
    switchScreen('pick');
    setupPicker();
  }, 600);
});

// ---------- Seleção de dia/horário ----------
function pad(n) { return String(n).padStart(2, '0'); }
function toInputDate(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

let selectedSlot = null;
const dateInput = document.getElementById('date-input');
const slotList = document.getElementById('slot-list');
const confirmBtn = document.getElementById('btn-confirm');

function setupPicker() {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + CONFIG.dateRangeDays);

  dateInput.min = toInputDate(today);
  dateInput.max = toInputDate(maxDate);
  dateInput.value = toInputDate(today);

  renderSlots();
}

function renderSlots() {
  slotList.innerHTML = '';
  selectedSlot = null;
  confirmBtn.disabled = true;

  const isToday = dateInput.value === toInputDate(new Date());
  const now = new Date();

  CONFIG.timeSlots.forEach(slot => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'slot-btn';
    btn.textContent = slot;

    if (isToday) {
      const [h, m] = slot.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(h, m, 0, 0);
      if (slotTime <= now) btn.disabled = true;
    }

    btn.addEventListener('click', () => {
      document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSlot = slot;
      confirmBtn.disabled = false;
    });

    slotList.appendChild(btn);
  });
}

dateInput.addEventListener('change', renderSlots);

confirmBtn.addEventListener('click', () => {
  if (!dateInput.value || !selectedSlot) return;

  const [y, m, d] = dateInput.value.split('-').map(Number);
  const [hh, mm] = selectedSlot.split(':').map(Number);
  const start = new Date(y, m - 1, d, hh, mm);
  const end = new Date(start.getTime() + CONFIG.eventDurationHours * 60 * 60 * 1000);

  finishBooking(start, end);
});

// ---------- Tela final: WhatsApp, Google Calendar ----------
function finishBooking(start, end) {
  const prettyDate = start.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const prettyTime = start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  document.getElementById('summary-line').textContent = `${prettyDate} às ${prettyTime}`;

  const waText = encodeURIComponent(
    `Oi Meu amor lindo gostoso.. Vamo farmar aura ${prettyDate} às ${prettyTime}. - Jenni`
  );
  document.getElementById('btn-whatsapp').href = `https://wa.me/${CONFIG.whatsappNumber}?text=${waText}`;

  function toUTCBasic(d) {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }
  const gcalText = encodeURIComponent('Encontro Ju & Jenni 💕');
  const gcalDetails = encodeURIComponent('Encontro combinado no site surpresa. Aura garantida. 😎');
  document.getElementById('btn-gcal').href =
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcalText}&dates=${toUTCBasic(start)}/${toUTCBasic(end)}&details=${gcalDetails}`;

  switchScreen('done');
}

// ---------- Confete ----------
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#ff4d6d', '#ffd166', '#ff8fa3', '#ffffff'];
  const particles = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.3,
    r: 4 + Math.random() * 5,
    vx: -2 + Math.random() * 4,
    vy: 2 + Math.random() * 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * 360,
    vrot: -8 + Math.random() * 16,
  }));

  let frame = 0;
  const maxFrames = 180;

  function tick() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      ctx.restore();
    });
    if (frame < maxFrames) {
      requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  tick();
}

// ---------- Música ----------
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
bgMusic.src = CONFIG.musicFile;
bgMusic.volume = CONFIG.musicVolume;

let musicUnlocked = false;

function startMusic() {
  if (musicUnlocked) return;
  bgMusic.play().then(() => {
    musicUnlocked = true;
    musicToggle.textContent = '🔇';
  }).catch(() => {
    // ainda bloqueado (ou arquivo não encontrado); ela pode tentar pelo botão
  });
}

musicToggle.addEventListener('click', () => {
  musicUnlocked = true;
  if (bgMusic.paused) {
    bgMusic.play();
    musicToggle.textContent = '🔇';
  } else {
    bgMusic.pause();
    musicToggle.textContent = '🎵';
  }
});
