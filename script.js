// --- ESTADO GLOBAL DEL JUEGO ---
let previousScreen = 'screen-cover';
let currentScreen = 'screen-cover';
let currentCodeInput = "";
const CORRECT_COMBINATION = "1358"; // Código de las 4 pistas ordenadas de menor a mayor

// Claves obtenidas por resolver cada sala:
// Sala 1 (Grado del polinomio): 5
// Sala 2 (Expresión verbal): 1
// Sala 3 (Operación monomios): 8
// Sala 4 (Ecuación lineal): 3
const roomKeys = {
  1: { number: 5, solved: false },
  2: { number: 1, solved: false },
  3: { number: 8, solved: false },
  4: { number: 3, solved: false }
};

// --- FUNCIÓN DE CAMBIO DE PANTALLA ---
function navigateTo(screenId) {
  const current = document.getElementById(currentScreen);
  const next = document.getElementById(screenId);

  if (current) current.classList.add('hidden');
  if (next) {
    next.classList.remove('hidden');
    next.classList.add('active');
    previousScreen = currentScreen;
    currentScreen = screenId;
  }
}

// --- CONFIGURACIÓN DE MODALES Y PORTADA ---
document.getElementById('btn-enter').addEventListener('click', () => {
  navigateTo('screen-torch');
});

document.getElementById('btn-open-intro').addEventListener('click', () => {
  document.getElementById('modal-intro').classList.remove('hidden');
});

document.getElementById('btn-open-mission').addEventListener('click', () => {
  document.getElementById('modal-mission').classList.remove('hidden');
});

document.querySelectorAll('.close-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const target = e.target.getAttribute('data-target');
    document.getElementById(target).classList.add('hidden');
  });
});

// --- LINTERNA INTERACTIVA ---
const stage = document.getElementById('game-stage');
const flashlight = document.getElementById('flashlight');

stage.addEventListener('mousemove', (e) => {
  const rect = stage.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  flashlight.style.left = `${x}px`;
  flashlight.style.top = `${y}px`;
});

document.getElementById('secret-rune').addEventListener('click', () => {
  navigateTo('screen-enigma1');
});

// --- ENIGMA INICIAL & SISTEMA DE JUMPSCARE/ERROR ---
function triggerJumpscare() {
  navigateTo('screen-jumpscare');
}

document.getElementById('btn-retry').addEventListener('click', () => {
  navigateTo('screen-enigma1');
});

function checkAnswer(step, answer) {
  if (step === 1) {
    if (answer === 3) {
      // Correcto: abre el camino hacia el hub central
      navigateTo('screen-hub');
    } else {
      triggerJumpscare();
    }
  }
}

// --- HUB CENTRAL Y ACCESO A SALAS ---
document.querySelectorAll('.node-portal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const roomNumber = e.target.getAttribute('data-room');
    navigateTo(`room-${roomNumber}`);
  });
});

document.getElementById('btn-to-lock').addEventListener('click', () => {
  navigateTo('screen-keypad');
});

document.getElementById('btn-back-hub-from-key').addEventListener('click', () => {
  navigateTo('screen-hub');
});

// --- VALIDACIÓN DE RESPUESTAS EN LAS SALAS ---
function checkRoom(roomNum, isCorrect) {
  if (isCorrect) {
    roomKeys[roomNum].solved = true;
    const numObtenido = roomKeys[roomNum].number;
    
    document.getElementById('feedback-title').innerText = `¡Sendero ${roomNum} Despejado!`;
    document.getElementById('feedback-text').innerHTML = `El espíritu te entrega el número rúnico: <strong style="font-size:2rem; color:#fde047;">${numObtenido}</strong>.<br>Apúntalo en tu pergamino.`;
    
    navigateTo('screen-feedback');
  } else {
    triggerJumpscare();
  }
}

document.getElementById('btn-return-hub').addEventListener('click', () => {
  navigateTo('screen-hub');
});

// --- TECLADO DE LA CERRADURA FINAL ---
function updateDisplay() {
  const display = document.getElementById('code-display');
  let padded = currentCodeInput.padEnd(4, '_');
  display.innerText = padded;
}

function pressDigit(d) {
  if (currentCodeInput.length < 4) {
    currentCodeInput += d;
    updateDisplay();
  }
}

function clearCode() {
  currentCodeInput = "";
  updateDisplay();
}

function validateCode() {
  if (currentCodeInput === CORRECT_COMBINATION) {
    navigateTo('screen-victory');
  } else {
    const display = document.getElementById('code-display');
    display.style.color = '#ef4444';
    display.innerText = "ERR";
    setTimeout(() => {
      display.style.color = '#4ade80';
      clearCode();
    }, 1000);
  }
}