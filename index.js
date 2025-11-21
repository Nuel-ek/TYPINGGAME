// ==========================
// DOM ELEMENTS
// ==========================
const quoteDisplay = document.getElementById("quotedisplay");
const quoteInput = document.getElementById("quoteinput");
const timerElement = document.getElementById("timer");
const wpmEl = document.getElementById("wpm");
const wpsEl = document.getElementById("wps");
const restartBtn = document.getElementById("restartBtn");

// ==========================
// QUOTES (local for now)
// ==========================
const quotes = [
  "Practice makes progress, not perfection.",
  "Simplicity is the soul of efficiency.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Small steps every day lead to big results."
];

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// ==========================
// GAME LOGIC
// ==========================
let startTime = null;
let timerInterval = null;
let started = false;

function renderNewQuote() {
  const quote = getRandomQuote();
  quoteDisplay.innerHTML = "";

  quote.split("").forEach(ch => {
    const span = document.createElement("span");
    span.innerText = ch;
    quoteDisplay.appendChild(span);
  });

  quoteInput.value = "";
  stopTimer();
  resetStats();
  started = false; // wait until user starts typing
}

quoteInput.addEventListener("input", () => {
  const quoteChars = quoteDisplay.querySelectorAll("span");
  const typed = quoteInput.value.split("");

  // Start timer on first key
  if (!started && typed.length > 0) {
    startTimer();
    started = true;
  }

  let allCorrect = true;
  let correctChars = 0;

  quoteChars.forEach((span, i) => {
    const ch = typed[i];
    if (ch == null) {
      span.classList.remove("correct", "incorrect");
      allCorrect = false;
    } else if (ch === span.innerText) {
      span.classList.add("correct");
      span.classList.remove("incorrect");
      correctChars++;
    } else {
      span.classList.remove("correct");
      span.classList.add("incorrect");
      allCorrect = false;
    }
  });

  updateSpeed(correctChars);

  // 👉 No auto refresh here anymore
  if (allCorrect && typed.length === quoteChars.length) {
    stopTimer(); // stop counting when done
  }
});

// ==========================
// TIMER + STATS
// ==========================
function startTimer() {
  stopTimer();
  startTime = new Date();
  timerInterval = setInterval(() => {
    timerElement.innerText = getTime() + "s";
  }, 500);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function getTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

function resetStats() {
  timerElement.innerText = "0s";
  wpmEl.innerText = "WPM: 0";
  wpsEl.innerText = "WPS: 0";
}

function updateSpeed(correctChars) {
  if (!started) return;
  const seconds = (new Date() - startTime) / 1000 || 1;
  const words = correctChars / 5;
  const wpm = words / (seconds / 60);
  const wps = words / seconds;
  wpmEl.innerText = "WPM: " + Math.round(wpm);
  wpsEl.innerText = "WPS: " + wps.toFixed(2);
}

// ==========================
// RESTART BUTTON
// ==========================
restartBtn.addEventListener("click", () => {
  renderNewQuote();
});

// ==========================
// START GAME
// ==========================
renderNewQuote();