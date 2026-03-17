// Active workout session — logging sets, rest timer, stopwatch, submit

const Workout = (() => {
  let log = null; // current workout log object
  let expanded = null; // index of expanded exercise

  // ── Start ─────────────────────────────────────────────────────────────────

  function start(routineId) {
    const r = Storage.getRoutine(routineId);
    if (!r) return;

    log = Storage.createWorkoutLog(routineId, r.name);
    log.exercises = r.exercises.map(ex => ({
      exId: ex.exId,
      name: ex.name,
      targetSets: ex.sets,
      targetReps: ex.reps,
      restSeconds: ex.restSeconds,
      timed: ex.timed,
      sets: [],
    }));
    Storage.saveLog(log);

    App.showView('workout');
    document.getElementById('wk-title').textContent = r.name;
    document.getElementById('wk-date').textContent = new Date().toLocaleDateString(undefined, {
      weekday: 'short', month: 'short', day: 'numeric'
    });

    expanded = 0;
    render();
    setupActions();
  }

  // ── Resume (reload from log) ──────────────────────────────────────────────

  function resume(logId) {
    const saved = Storage.getLog(logId);
    if (!saved || saved.finishedAt) return;
    log = saved;
    App.showView('workout');
    document.getElementById('wk-title').textContent = log.routineName;
    document.getElementById('wk-date').textContent = new Date(log.startedAt).toLocaleDateString(undefined, {
      weekday: 'short', month: 'short', day: 'numeric'
    });
    expanded = 0;
    render();
    setupActions();
  }

  // ── Render ────────────────────────────────────────────────────────────────

  function render() {
    const container = document.getElementById('wk-exercises');
    if (!container || !log) return;

    container.innerHTML = log.exercises.map((ex, i) => {
      const done = ex.sets.filter(s => s.done).length;
      const isExpanded = i === expanded;

      return `
        <div class="wk-ex ${isExpanded ? 'expanded' : ''}" data-index="${i}">
          <div class="wk-ex-header" data-index="${i}">
            <div class="wk-ex-progress-ring">
              ${progressRing(done, ex.targetSets)}
            </div>
            <div class="wk-ex-meta">
              <div class="wk-ex-name">${ex.name}</div>
              <div class="wk-ex-sub">${done}/${ex.targetSets} sets${ex.timed ? ' · timed' : ` · ${ex.targetReps} reps`}</div>
            </div>
            <button class="icon-btn wk-ex-info" data-index="${i}" title="Exercise info">ℹ</button>
            <span class="wk-ex-chevron">${isExpanded ? '▲' : '▼'}</span>
          </div>
          ${isExpanded ? expandedHtml(ex, i) : ''}
        </div>`;
    }).join('');

    // Delegation
    container.querySelectorAll('.wk-ex-header').forEach(h => {
      h.addEventListener('click', e => {
        if (e.target.closest('.wk-ex-info')) return;
        const idx = +h.dataset.index;
        expanded = expanded === idx ? null : idx;
        render();
      });
    });

    container.querySelectorAll('.wk-ex-info').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const ex = log.exercises[+btn.dataset.index];
        Exercises.openDetail(ex.exId);
      });
    });

    container.querySelectorAll('.set-done-btn').forEach(btn => {
      btn.addEventListener('click', () => logSet(+btn.dataset.exIndex, +btn.dataset.setIndex));
    });

    container.querySelectorAll('.set-undo-btn').forEach(btn => {
      btn.addEventListener('click', () => undoSet(+btn.dataset.exIndex, +btn.dataset.setIndex));
    });

    container.querySelectorAll('.sw-btn-start').forEach(btn => {
      btn.addEventListener('click', Timer.swStart);
    });
    container.querySelectorAll('.sw-btn-pause').forEach(btn => {
      btn.addEventListener('click', Timer.swPause);
    });
    container.querySelectorAll('.sw-btn-reset').forEach(btn => {
      btn.addEventListener('click', Timer.swReset);
    });

    // Sync weight/reps inputs live
    container.querySelectorAll('.set-input').forEach(input => {
      input.addEventListener('change', e => {
        const { exIndex, setIndex, field } = e.target.dataset;
        if (!log.exercises[exIndex].sets[setIndex]) {
          log.exercises[exIndex].sets[setIndex] = {};
        }
        log.exercises[exIndex].sets[setIndex][field] = e.target.value;
        Storage.saveLog(log);
      });
    });
  }

  function expandedHtml(ex, exIdx) {
    const rows = [];
    for (let s = 0; s < ex.targetSets; s++) {
      const set = ex.sets[s] || {};
      const done = !!set.done;
      const prevLog = getPrevSet(ex.exId, s);

      if (ex.timed) {
        rows.push(`
          <div class="set-row ${done ? 'set-done' : ''}" data-set="${s}">
            <span class="set-label">Set ${s+1}</span>
            <div id="sw-display" class="sw-display">00:00.0</div>
            <div class="sw-controls">
              <button class="sw-btn-start btn-sm">▶</button>
              <button class="sw-btn-pause btn-sm hidden">⏸</button>
              <button class="sw-btn-reset btn-sm">↺</button>
            </div>
            <button class="set-done-btn btn-sm ${done ? 'btn-done' : 'btn-outline'}"
                    data-ex-index="${exIdx}" data-set-index="${s}">
              ${done ? '✓' : 'Done'}
            </button>
            ${done ? `<button class="set-undo-btn btn-text" data-ex-index="${exIdx}" data-set-index="${s}">undo</button>` : ''}
          </div>`);
      } else {
        rows.push(`
          <div class="set-row ${done ? 'set-done' : ''}" data-set="${s}">
            <span class="set-label">Set ${s+1}</span>
            <div class="set-inputs">
              <div class="set-input-group">
                <label>kg</label>
                <input class="set-input input-sm" type="number" min="0" step="0.5"
                       placeholder="${prevLog?.weight ?? '0'}"
                       value="${set.weight ?? ''}"
                       data-ex-index="${exIdx}" data-set-index="${s}" data-field="weight">
              </div>
              <div class="set-input-group">
                <label>reps</label>
                <input class="set-input input-sm" type="number" min="1" max="999"
                       placeholder="${prevLog?.reps ?? ex.targetReps}"
                       value="${set.reps ?? ''}"
                       data-ex-index="${exIdx}" data-set-index="${s}" data-field="reps">
              </div>
            </div>
            <button class="set-done-btn btn-sm ${done ? 'btn-done' : 'btn-outline'}"
                    data-ex-index="${exIdx}" data-set-index="${s}">
              ${done ? '✓' : 'Done'}
            </button>
            ${done ? `<button class="set-undo-btn btn-text" data-ex-index="${exIdx}" data-set-index="${s}">undo</button>` : ''}
          </div>`);
      }
    }

    return `
      <div class="wk-ex-body">
        ${rows.join('')}
        <button class="btn btn-ghost btn-sm add-set-btn" data-ex-index="${exIdx}">+ Add Set</button>
      </div>`;
  }

  function progressRing(done, total) {
    const r = 18;
    const circ = 2 * Math.PI * r;
    const fill = total > 0 ? (done / total) * circ : 0;
    const color = done >= total ? 'var(--green)' : 'var(--accent)';
    return `
      <svg width="42" height="42" viewBox="0 0 42 42">
        <circle cx="21" cy="21" r="${r}" fill="none" stroke="var(--border)" stroke-width="3"/>
        <circle cx="21" cy="21" r="${r}" fill="none" stroke="${color}" stroke-width="3"
                stroke-dasharray="${fill} ${circ}" stroke-dashoffset="${circ / 4}"
                transform="rotate(-90 21 21)" style="transition:stroke-dasharray .3s"/>
        <text x="21" y="26" text-anchor="middle" fill="var(--text)" font-size="11" font-weight="700">
          ${done}/${total}
        </text>
      </svg>`;
  }

  // ── Set logging ───────────────────────────────────────────────────────────

  function logSet(exIdx, setIdx) {
    const ex = log.exercises[exIdx];
    if (!ex) return;
    if (!ex.sets[setIdx]) ex.sets[setIdx] = {};

    // Pull values from inputs
    const weightInput = document.querySelector(
      `.set-input[data-ex-index="${exIdx}"][data-set-index="${setIdx}"][data-field="weight"]`);
    const repsInput = document.querySelector(
      `.set-input[data-ex-index="${exIdx}"][data-set-index="${setIdx}"][data-field="reps"]`);

    if (weightInput) ex.sets[setIdx].weight = +weightInput.value || +weightInput.placeholder || 0;
    if (repsInput)   ex.sets[setIdx].reps   = +repsInput.value   || +repsInput.placeholder   || ex.targetReps;

    ex.sets[setIdx].done = true;
    ex.sets[setIdx].timestamp = Date.now();
    Storage.saveLog(log);

    render();

    // Start rest timer
    const restSecs = ex.restSeconds || Storage.getSettings().restSeconds;
    Timer.startRest(restSecs, () => {
      // vibrate done
    });
  }

  function undoSet(exIdx, setIdx) {
    const ex = log.exercises[exIdx];
    if (ex?.sets[setIdx]) {
      ex.sets[setIdx].done = false;
      Storage.saveLog(log);
      render();
    }
  }

  // ── Previous log lookup ───────────────────────────────────────────────────

  function getPrevSet(exId, setIdx) {
    const logs = Storage.getLogs().filter(l => l.id !== log.id && l.finishedAt);
    const prev = logs[0]; // most recent finished
    if (!prev) return null;
    const exLog = prev.exercises?.find(e => e.exId === exId);
    return exLog?.sets?.[setIdx] || null;
  }

  // ── Finish + submit ───────────────────────────────────────────────────────

  function setupActions() {
    document.getElementById('btn-finish-workout')?.addEventListener('click', finishWorkout);
  }

  async function finishWorkout() {
    if (!log) return;
    if (!confirm('Finish workout?')) return;

    log.finishedAt = Date.now();
    Storage.saveLog(log);

    const settings = Storage.getSettings();
    if (settings.formspreeId) {
      await submitToFormspree(settings.formspreeId);
    }

    App.toast('Workout saved!');
    App.showView('log');
    Log.render();
    log = null;
  }

  async function submitToFormspree(formId) {
    const payload = {
      routine: log.routineName,
      date: new Date(log.startedAt).toISOString(),
      duration_min: Math.round((log.finishedAt - log.startedAt) / 60000),
      exercises: log.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets.filter(s => s.done).map(s => `${s.weight ?? 0}kg × ${s.reps ?? 0}`).join(', '),
      })),
    };

    try {
      await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      App.toast('Workout submitted ✓');
    } catch {
      App.toast('Submit failed — saved locally');
    }
  }

  // ── Add exercise mid-workout ──────────────────────────────────────────────

  function addExercise(ex) {
    if (!log) return;
    const settings = Storage.getSettings();
    log.exercises.push({
      exId: ex.id,
      name: ex.displayName,
      targetSets: settings.defaultSets,
      targetReps: settings.defaultReps,
      restSeconds: settings.restSeconds,
      timed: false,
      sets: [],
    });
    Storage.saveLog(log);
    expanded = log.exercises.length - 1;
    render();
  }

  return { start, resume, addExercise };
})();
