// Stopwatch + rest timer

const Timer = (() => {
  // ── Stopwatch ─────────────────────────────────────────────────────────────
  let swInterval = null;
  let swStart = 0;
  let swElapsed = 0;
  let swRunning = false;

  function swTick() {
    swElapsed = Date.now() - swStart;
    renderStopwatch();
  }

  function swStart_() {
    if (swRunning) return;
    swRunning = true;
    swStart = Date.now() - swElapsed;
    swInterval = setInterval(swTick, 100);
    document.querySelector('.sw-btn-start')?.classList.add('hidden');
    document.querySelector('.sw-btn-pause')?.classList.remove('hidden');
  }

  function swPause() {
    if (!swRunning) return;
    swRunning = false;
    clearInterval(swInterval);
    document.querySelector('.sw-btn-start')?.classList.remove('hidden');
    document.querySelector('.sw-btn-pause')?.classList.add('hidden');
  }

  function swReset() {
    swPause();
    swElapsed = 0;
    renderStopwatch();
    document.querySelector('.sw-btn-start')?.classList.remove('hidden');
    document.querySelector('.sw-btn-pause')?.classList.add('hidden');
  }

  function renderStopwatch() {
    const el = document.getElementById('sw-display');
    if (el) el.textContent = formatMs(swElapsed);
  }

  // ── Rest timer ────────────────────────────────────────────────────────────
  let rtInterval = null;
  let rtEnd = 0;
  let rtOnDone = null;

  function startRest(seconds, onDone) {
    clearInterval(rtInterval);
    rtEnd = Date.now() + seconds * 1000;
    rtOnDone = onDone;

    const overlay = document.getElementById('rest-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
      overlay.querySelector('.rest-total').textContent = formatSeconds(seconds);
    }

    rtInterval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((rtEnd - Date.now()) / 1000));
      const el = document.getElementById('rest-countdown');
      if (el) el.textContent = formatSeconds(remaining);

      // Update ring progress
      const ring = document.getElementById('rest-ring-fill');
      if (ring) {
        const total = seconds;
        const pct = remaining / total;
        const circ = 2 * Math.PI * 52; // r=52
        ring.style.strokeDashoffset = circ * pct;
      }

      if (remaining <= 0) {
        clearInterval(rtInterval);
        const overlay = document.getElementById('rest-overlay');
        if (overlay) overlay.classList.add('hidden');
        if (rtOnDone) rtOnDone();
        // vibrate if supported
        navigator.vibrate?.([200, 100, 200]);
      }
    }, 250);
  }

  function skipRest() {
    clearInterval(rtInterval);
    document.getElementById('rest-overlay')?.classList.add('hidden');
    if (rtOnDone) rtOnDone();
  }

  function addRestTime(secs) {
    rtEnd += secs * 1000;
  }

  // ── Formatting ────────────────────────────────────────────────────────────
  function formatMs(ms) {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const sec = (totalSec % 60).toString().padStart(2, '0');
    const tenth = Math.floor((ms % 1000) / 100);
    return `${min}:${sec}.${tenth}`;
  }

  function formatSeconds(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  return {
    swStart: swStart_,
    swPause,
    swReset,
    getSwElapsed: () => swElapsed,
    startRest,
    skipRest,
    addRestTime,
    formatMs,
    formatSeconds,
  };
})();
