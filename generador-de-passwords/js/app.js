/**
 * ============================================
 *   🔐 PASSWORD GENERATOR
 *   DEV.F - Módulo I: DOM (basado en Frontend Mentor)
 * ============================================
 *
 * Genera contraseñas seguras (más de 8 caracteres) usando
 * mayúsculas, minúsculas, números y símbolos, y calcula su
 * fuerza mostrando un candado animado (roto / abierto / cerrado)
 * con degradado de color rojo -> verde.
 *
 * Conceptos del DOM practicados:
 *   - Selección de elementos y manejo de eventos (click, input)
 *   - Modificación dinámica de contenido y clases
 *   - API del portapapeles (navigator.clipboard)
 */

// ─────────────────────────────────────────────
// 📌 SELECCIÓN DE ELEMENTOS DEL DOM
// ─────────────────────────────────────────────
const passwordOutput = document.getElementById("passwordOutput");
const btnCopy = document.getElementById("btnCopy");
const copiedMsg = document.getElementById("copiedMsg");
const lockIndicator = document.getElementById("lockIndicator");
const lockEmoji = document.getElementById("lockEmoji");

const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");

const optUpper = document.getElementById("optUpper");
const optLower = document.getElementById("optLower");
const optNumbers = document.getElementById("optNumbers");
const optSymbols = document.getElementById("optSymbols");

const strengthText = document.getElementById("strengthText");
const strengthBars = document.getElementById("strengthBars");
const btnGenerate = document.getElementById("btnGenerate");
const optionsError = document.getElementById("optionsError");

// ─────────────────────────────────────────────
// 🔤 CONJUNTOS DE CARACTERES
// ─────────────────────────────────────────────
const CHARSET = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?/~",
};

// ─────────────────────────────────────────────
// 🎚️ SLIDER: relleno visual + valor
// ─────────────────────────────────────────────
function actualizarSlider() {
  const min = Number(lengthSlider.min);
  const max = Number(lengthSlider.max);
  const val = Number(lengthSlider.value);
  const porcentaje = ((val - min) / (max - min)) * 100;
  lengthSlider.style.setProperty("--fill", porcentaje + "%");
  lengthValue.textContent = val;
}

// ─────────────────────────────────────────────
// 🎲 GENERACIÓN DE CONTRASEÑA
// ─────────────────────────────────────────────
/** Entero aleatorio seguro en [0, max). */
function aleatorio(max) {
  if (window.crypto && window.crypto.getRandomValues) {
    const buffer = new Uint32Array(1);
    window.crypto.getRandomValues(buffer);
    return buffer[0] % max;
  }
  return Math.floor(Math.random() * max);
}

/** Mezcla un array (Fisher-Yates). */
function mezclar(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = aleatorio(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Genera la contraseña garantizando al menos un carácter de
 * cada tipo seleccionado y respetando la longitud del slider.
 */
function generarPassword() {
  const activos = [];
  if (optUpper.checked) activos.push(CHARSET.upper);
  if (optLower.checked) activos.push(CHARSET.lower);
  if (optNumbers.checked) activos.push(CHARSET.numbers);
  if (optSymbols.checked) activos.push(CHARSET.symbols);

  // Validación: al menos una opción seleccionada
  if (activos.length === 0) {
    optionsError.textContent = "⚠️ Selecciona al menos un tipo de carácter.";
    passwordOutput.value = "";
    actualizarFuerza(0);
    return;
  }
  optionsError.textContent = "";

  const longitud = Number(lengthSlider.value);
  const todos = activos.join("");
  const chars = [];

  // Garantiza al menos un carácter de cada tipo activo
  activos.forEach((set) => {
    chars.push(set[aleatorio(set.length)]);
  });

  // Rellena el resto
  while (chars.length < longitud) {
    chars.push(todos[aleatorio(todos.length)]);
  }

  // Mezcla para que los obligatorios no queden al inicio
  const password = mezclar(chars).slice(0, longitud).join("");

  passwordOutput.value = password;

  // Condición de SUPER STRONG: TODAS las opciones activas + longitud > 20
  const todasLasOpciones =
    optUpper.checked && optLower.checked && optNumbers.checked && optSymbols.checked;
  const esSuper = todasLasOpciones && longitud > 20;

  actualizarFuerza(calcularFuerza(password), esSuper);
  resetCopiado();
}

// ─────────────────────────────────────────────
// 💪 CÁLCULO DE FUERZA
// ─────────────────────────────────────────────
/**
 * Retorna un nivel de fuerza 0-4 (base) según longitud y variedad.
 * El nivel 5 (SUPER STRONG) se decide aparte por condición explícita.
 *
 * Escala base:
 *   0 = vacío
 *   1 = FRAGILE (1 barra roja)
 *   2 = WEAK    (2 barras rojas)
 *   3 = MEDIUM  (3 barras naranjas)
 *   4 = STRONG  (4 barras verdes)
 */
function calcularFuerza(password) {
  if (!password) return 0;

  // Variedad de tipos de caracteres presentes (0-4)
  let variedad = 0;
  if (/[A-Z]/.test(password)) variedad++;
  if (/[a-z]/.test(password)) variedad++;
  if (/[0-9]/.test(password)) variedad++;
  if (/[^A-Za-z0-9]/.test(password)) variedad++;

  const len = password.length;

  // Puntaje bruto por longitud (0-3)
  let puntosLongitud = 0;
  if (len >= 6) puntosLongitud = 1;
  if (len >= 10) puntosLongitud = 2;
  if (len >= 14) puntosLongitud = 3;

  // Combinamos longitud (0-3) + variedad (0-4) -> total 0-7
  const total = puntosLongitud + variedad;

  // Mapeo a la escala 1-4
  let nivel;
  if (total <= 2) nivel = 1;      // FRAGILE
  else if (total <= 3) nivel = 2; // WEAK
  else if (total <= 5) nivel = 3; // MEDIUM
  else nivel = 4;                 // STRONG

  // Regla dura: contraseñas muy cortas nunca pasan de FRAGILE/WEAK
  if (len < 6) nivel = 1;
  else if (len < 10 && nivel > 2) nivel = 2;

  return nivel;
}

// ─────────────────────────────────────────────
// 🔒 INDICADOR DE FUERZA + CANDADO ANIMADO
// ─────────────────────────────────────────────
/**
 * Mapea el nivel al texto, barras y candado. Escala exacta:
 *   1 -> FRAGILE      -> 1 barra roja      -> 💔 candado roto
 *   2 -> WEAK         -> 2 barras rojas    -> 🔓 candado abierto
 *   3 -> MEDIUM       -> 3 barras naranjas -> 🔓 candado abierto
 *   4 -> STRONG       -> 4 barras verdes   -> 🔒 candado cerrado
 *   5 -> SUPER STRONG -> 5 barras azules   -> 🔒 candado metálico shiny
 *        Solo si TODAS las opciones están activas y la longitud > 20.
 *
 * @param {number} score  Nivel base 0-4 de calcularFuerza()
 * @param {boolean} esSuper  true si cumple la condición de SUPER STRONG
 */
function actualizarFuerza(score, esSuper) {
  const niveles = {
    0: { texto: "", barra: "", lock: "lock-none", emoji: "🔓" },
    1: { texto: "FRAGILE", barra: "fragile", lock: "lock-fragile", emoji: "💔" },
    2: { texto: "WEAK", barra: "weak", lock: "lock-weak", emoji: "🔓" },
    3: { texto: "MEDIUM", barra: "medium", lock: "lock-medium", emoji: "🔓" },
    4: { texto: "STRONG", barra: "strong", lock: "lock-strong", emoji: "🔒" },
    5: { texto: "SUPER STRONG", barra: "super-strong", lock: "lock-super", emoji: "🔒" },
  };

  // Ascenso al nivel 5 (SUPER STRONG) si cumple la condición explícita
  // (todas las opciones activas + longitud > 20). No depende del score base.
  if (esSuper) {
    score = 5;
  }

  const nivel = niveles[score] || niveles[0];

  // Texto
  strengthText.textContent = nivel.texto;
  strengthText.className = "strength-text " + (nivel.barra || "");

  // Barras
  strengthBars.className = "strength-bars " + (nivel.barra || "");

  // Candado (con degradado de color y transición vía CSS)
  lockIndicator.className = "lock-indicator " + nivel.lock;
  lockEmoji.textContent = nivel.emoji;

  // Tooltip descriptivo
  const titulos = {
    "lock-none": "Genera una contraseña",
    "lock-fragile": "Frágil: candado roto 💔",
    "lock-weak": "Débil: candado abierto 🔓",
    "lock-medium": "Media: candado abierto 🔓",
    "lock-strong": "Fuerte: candado cerrado 🔒",
    "lock-super": "SÚPER fuerte: candado metálico 🔒 (todas las opciones + más de 20 caracteres)",
  };
  lockIndicator.title = titulos[nivel.lock] || "";
}

// ─────────────────────────────────────────────
// 📋 COPIAR AL PORTAPAPELES
// ─────────────────────────────────────────────
async function copiarPassword() {
  const valor = passwordOutput.value;
  if (!valor) return;

  try {
    await navigator.clipboard.writeText(valor);
  } catch (e) {
    // Fallback para navegadores sin clipboard API
    passwordOutput.removeAttribute("readonly");
    passwordOutput.select();
    document.execCommand("copy");
    passwordOutput.setAttribute("readonly", "");
    window.getSelection().removeAllRanges();
  }

  copiedMsg.textContent = "Copied!";
  copiedMsg.classList.add("show");
  clearTimeout(copiarPassword._t);
  copiarPassword._t = setTimeout(() => copiedMsg.classList.remove("show"), 1800);
}

function resetCopiado() {
  copiedMsg.classList.remove("show");
  copiedMsg.textContent = "";
}

// ─────────────────────────────────────────────
// 🎯 EVENTOS
// ─────────────────────────────────────────────
lengthSlider.addEventListener("input", () => {
  actualizarSlider();
});

btnGenerate.addEventListener("click", generarPassword);
btnCopy.addEventListener("click", copiarPassword);

// Regenerar al cambiar opciones (feedback inmediato)
[optUpper, optLower, optNumbers, optSymbols].forEach((opt) => {
  opt.addEventListener("change", generarPassword);
});

// ─────────────────────────────────────────────
// 🚀 INICIALIZACIÓN
// ─────────────────────────────────────────────
actualizarSlider();
generarPassword();
