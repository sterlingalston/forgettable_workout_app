// Routine management — list view + detail view

const Routine = (() => {
  const escHtml = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  // ── Routines list ─────────────────────────────────────────────────────────

  function renderList() {
    const el = document.getElementById('routines-list');
    if (!el) return;
    const routines = Storage.getRoutines();

    if (!routines.length) {
      el.innerHTML = `
        <div class="empty-state lift-hero">
          <div class="lift-hero-mark">🏋</div>
          <p class="lift-hero-sub">No routines yet. Build your first one.</p>
          <button class="btn btn-primary" id="btn-new-routine-empty">Create Routine</button>
        </div>`;
      document.getElementById('btn-new-routine-empty')
        ?.addEventListener('click', promptCreate);
      return;
    }

    el.innerHTML = routines.map(r => `
      <div class="routine-card" data-id="${r.id}">
        <div class="routine-card-body">
          <div class="routine-card-name">${escHtml(r.name)}</div>
          <div class="routine-card-meta">${r.exercises.length} exercise${r.exercises.length !== 1 ? 's' : ''}</div>
        </div>
        <button class="icon-btn routine-menu-btn" data-id="${r.id}" aria-label="Menu">⋯</button>
      </div>`).join('');

    el.querySelectorAll('.routine-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.routine-menu-btn')) return;
        openRoutine(card.dataset.id);
      });
    });

    el.querySelectorAll('.routine-menu-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        showRoutineMenu(btn.dataset.id);
      });
    });
  }

  function promptCreate() {
    const name = prompt('Routine name:');
    if (!name?.trim()) return;
    Storage.createRoutine(name.trim());
    renderList();
    App.toast('Routine created');
  }

  function showRoutineMenu(id) {
    const r = Storage.getRoutine(id);
    if (!r) return;
    const choice = confirm(`Delete "${r.name}"?\n\nOK = Delete  |  Cancel = Keep`);
    if (choice) {
      Storage.deleteRoutine(id);
      renderList();
      App.toast('Routine deleted');
    }
  }

  // ── Routine detail ────────────────────────────────────────────────────────

  let currentRoutineId = null;
  let expandedExIndex  = null;

  function openRoutine(id) {
    currentRoutineId = id;
    expandedExIndex  = null;
    const r = Storage.getRoutine(id);
    if (!r) return;

    App.showView('routine-detail');

    document.getElementById('rd-title').textContent = r.name;
    renderExerciseList(r);

    const startBtn = document.getElementById('btn-start-workout');
    if (startBtn) startBtn.onclick = () => Workout.start(currentRoutineId);

    const addBtn = document.getElementById('btn-add-ex-to-routine');
    if (addBtn) addBtn.onclick = () => {
      Exercises.openPicker(currentRoutineId, ex => {
        Storage.addExerciseToRoutine(currentRoutineId, {
          id: ex.id,
          displayName: ex.displayName,
          equipment: ex.equipment || '',
          primaryMuscle: ex.primaryMuscle || [],
          sets: Storage.getSettings().defaultSets,
          reps: Storage.getSettings().defaultReps,
          restSeconds: Storage.getSettings().restSeconds,
        });
        renderExerciseList(Storage.getRoutine(currentRoutineId));
        App.toast(`${ex.displayName} added`);
      });
    };
  }

  function renderExerciseList(r) {
    const el = document.getElementById('rd-exercises');
    if (!el) return;

    if (!r.exercises.length) {
      el.innerHTML = `<p class="empty-msg">No exercises. Tap "+ Add Exercise" to get started.</p>`;
      return;
    }

    el.innerHTML = r.exercises.map((ex, i) => {
      const isOpen = i === expandedExIndex;
      return `
        <div class="rd-ex-row ${isOpen ? 'rd-ex-expanded' : ''}" data-index="${i}">
          <div class="rd-ex-header" data-index="${i}">
            <div class="rd-ex-num">${i + 1}</div>
            <div class="rd-ex-info">
              <div class="rd-ex-name">${escHtml(ex.name)}</div>
              <div class="rd-ex-target">
                ${ex.timed
                  ? `<span class="ex-target-edit" data-field="sets" data-index="${i}">${ex.sets}</span> sets × timed`
                  : `<span class="ex-target-edit" data-field="sets" data-index="${i}">${ex.sets}</span> × <span class="ex-target-edit" data-field="reps" data-index="${i}">${ex.reps}</span> reps`}
                · <span class="ex-target-edit" data-field="restSeconds" data-index="${i}">${ex.restSeconds}s</span> rest
              </div>
            </div>
            <span class="rd-ex-chevron">${isOpen ? '▲' : '▼'}</span>
            <button class="icon-btn rd-ex-menu" data-index="${i}" aria-label="Options">⋯</button>
          </div>
          ${isOpen ? `
            <div class="rd-ex-video-wrap" id="rd-video-wrap-${i}">
              <div class="wk-video-loading"><div class="spinner"></div></div>
            </div>` : ''}
        </div>`;
    }).join('');

    // Toggle expand on row tap
    el.querySelectorAll('.rd-ex-header').forEach(header => {
      header.addEventListener('click', e => {
        if (e.target.closest('.rd-ex-menu') || e.target.closest('.ex-target-edit')) return;
        const idx = +header.dataset.index;
        expandedExIndex = expandedExIndex === idx ? null : idx;
        renderExerciseList(Storage.getRoutine(currentRoutineId));
      });
    });

    el.querySelectorAll('.ex-target-edit').forEach(span => {
      span.addEventListener('click', e => {
        e.stopPropagation();
        const { field, index } = span.dataset;
        const labels = { sets: 'Sets', reps: 'Reps', restSeconds: 'Rest (seconds)' };
        const val = prompt(`${labels[field]}:`, span.textContent.replace('s',''));
        if (val === null || isNaN(+val)) return;
        Storage.updateExInRoutine(currentRoutineId, +index, { [field]: +val });
        renderExerciseList(Storage.getRoutine(currentRoutineId));
      });
    });

    el.querySelectorAll('.rd-ex-menu').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        showExMenu(+btn.dataset.index);
      });
    });

    // Restore video if a row was already open
    if (expandedExIndex !== null && r.exercises[expandedExIndex]) {
      loadRoutineVideo(r.exercises[expandedExIndex].name, expandedExIndex);
    }

    markStaleExercises(r);
  }

  async function markStaleExercises(r) {
    for (let i = 0; i < r.exercises.length; i++) {
      if (r.id !== currentRoutineId) return; // user navigated away
      const ex = r.exercises[i];
      const exId = ex.exId || ex.id || '';
      if (!exId || String(exId).startsWith('custom_')) continue;
      const found = await API.getExercise(exId);
      if (!found) {
        // Try to auto-repair: find DB exercise by display name
        const byName = ex.name ? await API.findByName(ex.name) : null;
        if (byName) {
          // Silently repair the stored exId — no badge needed
          Storage.updateExInRoutine(r.id, i, {
            exId: byName.id,
            equipment: byName.equipment || ex.equipment || '',
            primaryMuscle: byName.primaryMuscle?.[0] || ex.primaryMuscle || '',
          });
        } else {
          // Truly not found — show stale badge
          const row = document.querySelector(`#rd-exercises .rd-ex-row[data-index="${i}"]`);
          if (row) {
            row.classList.add('rd-ex-stale');
            const nameEl = row.querySelector('.rd-ex-name');
            if (nameEl && !nameEl.querySelector('.rd-stale-badge')) {
              nameEl.insertAdjacentHTML('beforeend', ' <span class="rd-stale-badge">⚠ Not Found</span>');
            }
          }
        }
      }
    }
  }

  function _ytWrap(videoId, exerciseName) {
    const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    return `
      <div class="video-with-thumb">
        <img class="video-thumb-bg" src="${thumb}" alt="${escHtml(exerciseName)}" loading="lazy">
        <iframe
          class="wk-video-frame"
          src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0&modestbranding=1"
          allow="autoplay; encrypted-media"
          allowfullscreen
          title="${escHtml(exerciseName)}">
        </iframe>
      </div>`;
  }

  async function loadRoutineVideo(exerciseName, index) {
    const wrap = document.getElementById(`rd-video-wrap-${index}`);
    if (!wrap) return;
    // Custom media takes priority (same as exercise detail modal)
    const custom = Storage.getCustomMediaFor(exerciseName);
    if (custom?.videoId) { if (!wrap.isConnected) return; wrap.innerHTML = _ytWrap(custom.videoId, exerciseName); return; }
    if (custom?.thumb)   { if (!wrap.isConnected) return; wrap.innerHTML = `<img class="wk-video-frame" src="${custom.thumb}" alt="${escHtml(exerciseName)}" loading="lazy">`; return; }

    // Community data (curated, cached after first fetch)
    const community = await API.getCommunityMeta(exerciseName);
    if (!wrap.isConnected) return;
    if (community?.videoId)      { wrap.innerHTML = _ytWrap(community.videoId, exerciseName); return; }
    if (community?.thumbnailUrl) { wrap.innerHTML = `<img class="wk-video-frame" src="${community.thumbnailUrl}" alt="${escHtml(exerciseName)}" loading="lazy">`; return; }

    const videoId = await API.getYouTubeVideoId(exerciseName);
    if (!wrap.isConnected) return;
    if (!videoId) { wrap.innerHTML = ''; return; }
    wrap.innerHTML = _ytWrap(videoId, exerciseName);
  }

  function showExMenu(index) {
    const r = Storage.getRoutine(currentRoutineId);
    const ex = r?.exercises[index];
    if (!ex) return;

    const isStale = document.querySelector(`#rd-exercises .rd-ex-row[data-index="${index}"]`)?.classList.contains('rd-ex-stale');

    const html = `
      <div class="modal-overlay" id="ex-menu-overlay">
        <div class="action-sheet">
          <div class="action-sheet-title">${escHtml(ex.name)}</div>
          ${isStale ? `<div class="action-sheet-notice">⚠ This exercise is no longer in the database</div>` : ''}
          ${isStale
            ? `<button class="action-sheet-btn action-sheet-btn-accent" id="exm-replace">Replace with Equivalent</button>`
            : `<button class="action-sheet-btn" id="exm-view">View / Edit Exercise</button>
               <button class="action-sheet-btn" id="exm-replace">Replace Exercise</button>`
          }
          <button class="action-sheet-btn" id="exm-timed">
            Toggle Timed — currently <strong>${ex.timed ? 'ON' : 'OFF'}</strong>
          </button>
          <button class="action-sheet-btn action-sheet-danger" id="exm-remove">Remove from Routine</button>
          <button class="action-sheet-btn action-sheet-cancel" id="exm-cancel">Cancel</button>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const overlay = document.getElementById('ex-menu-overlay');
    const close = () => overlay.remove();

    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    overlay.querySelector('#exm-cancel').addEventListener('click', close);

    overlay.querySelector('#exm-remove').addEventListener('click', () => {
      close();
      if (!confirm(`Remove "${ex.name}" from this routine?`)) return;
      Storage.removeExFromRoutine(currentRoutineId, index);
      renderExerciseList(Storage.getRoutine(currentRoutineId));
    });

    overlay.querySelector('#exm-timed').addEventListener('click', () => {
      close();
      Storage.updateExInRoutine(currentRoutineId, index, { timed: !ex.timed });
      renderExerciseList(Storage.getRoutine(currentRoutineId));
      App.toast(`${ex.name} timed: ${!ex.timed ? 'ON' : 'OFF'}`);
    });

    overlay.querySelector('#exm-view')?.addEventListener('click', () => {
      close();
      Exercises.openDetail(ex.exId || ex.id, ex.name);
    });

    overlay.querySelector('#exm-replace').addEventListener('click', () => {
      close();
      Exercises.openPicker(currentRoutineId, newEx => {
        Exercises.closePicker();
        Storage.updateExInRoutine(currentRoutineId, index, {
          exId: newEx.id,
          name: newEx.displayName,
          equipment: newEx.equipment || '',
          primaryMuscle: newEx.primaryMuscle?.[0] || '',
        });
        renderExerciseList(Storage.getRoutine(currentRoutineId));
        App.toast(`Replaced with ${newEx.displayName}`);
      });
    });
  }

  return { renderList, openRoutine, promptCreate };
})();
