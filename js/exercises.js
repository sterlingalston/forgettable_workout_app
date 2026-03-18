// Exercise browser — used both as a standalone view and as a picker modal

const Exercises = (() => {
  let cursor = null;
  let hasMore = true;
  let isLoading = false;
  let activeFilters = {};
  let searchQuery = '';
  let onPick = null; // callback when in picker mode
  let pickerRoutineId = null;
  let _sentinelObs = null;

  // ── Render ────────────────────────────────────────────────────────────────

  function chipHtml(label, cls) {
    return label ? `<span class="chip ${cls}">${API.fmt(label)}</span>` : '';
  }

  function cardHtml(ex, compact = false) {
    if (compact) {
      return `
        <div class="ex-row" data-id="${ex.id}" tabindex="0" role="button">
          <div class="ex-row-info">
            <div class="ex-row-name">${ex.displayName}</div>
            <div class="ex-row-chips">
              ${chipHtml(ex.primaryMuscle?.[0], 'chip-muscle')}
              ${chipHtml(ex.equipment, 'chip-equip')}
            </div>
          </div>
          ${onPick ? `<button class="btn-add-ex" data-id="${ex.id}" title="Add">+</button>` : '<span class="ex-row-arrow">›</span>'}
        </div>`;
    }

    return `
      <div class="ex-card" data-id="${ex.id}" tabindex="0" role="button">
        <div class="ex-card-body">
          <div class="ex-card-name">${ex.displayName}</div>
          <div class="ex-card-chips">
            ${chipHtml(ex.category, 'chip-cat')}
            ${chipHtml(ex.level, 'chip-level chip-level-' + (ex.level || '').toLowerCase())}
          </div>
          <div class="ex-card-chips">
            ${chipHtml(ex.primaryMuscle?.[0], 'chip-muscle')}
            ${chipHtml(ex.equipment, 'chip-equip')}
          </div>
        </div>
      </div>`;
  }

  // ── Data loading ──────────────────────────────────────────────────────────

  async function loadMore() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    const grid = document.getElementById('ex-grid');
    const sentinel = document.getElementById('ex-sentinel');
    if (sentinel) sentinel.innerHTML = '<div class="spinner"></div>';

    try {
      let result;
      if (searchQuery) {
        result = await API.searchExercises(searchQuery, cursor);
      } else {
        result = await API.queryExercises(activeFilters, cursor);
      }

      const exercises = result.exercises || result;
      if (!exercises?.length) {
        hasMore = false;
        if (sentinel) sentinel.innerHTML = cursor === null
          ? '<p class="empty-msg">No exercises found.</p>'
          : '';
        isLoading = false;
        return;
      }

      const compact = !!onPick;
      exercises.forEach(ex => {
        grid?.insertAdjacentHTML('beforeend', cardHtml(ex, compact));
      });

      cursor = result._nextCursor || null;
      hasMore = !!cursor;
      if (sentinel) sentinel.innerHTML = '';
    } catch (e) {
      console.error(e);
      if (sentinel) sentinel.innerHTML = `<p class="error-msg">${e.message}</p>`;
    } finally {
      isLoading = false;
    }
  }

  function reset() {
    cursor = null;
    hasMore = true;
    const grid = document.getElementById('ex-grid');
    if (grid) grid.innerHTML = '';
    loadMore();
  }

  // ── Filter bar ────────────────────────────────────────────────────────────

  function buildFilterBar(containerId) {
    const bar = document.getElementById(containerId);
    if (!bar) return;

    bar.innerHTML = `
      <div class="filter-scroller">
        <button class="filter-pill active" data-type="" data-val="">All</button>
        ${API.CATEGORIES.map(c =>
          `<button class="filter-pill" data-type="category" data-val="${c}">${API.fmt(c)}</button>`
        ).join('')}
        ${API.MUSCLES.map(m =>
          `<button class="filter-pill" data-type="primaryMuscle" data-val="${m}">${API.fmt(m)}</button>`
        ).join('')}
        ${API.EQUIPMENT.map(e =>
          `<button class="filter-pill" data-type="equipment" data-val="${e}">${API.fmt(e)}</button>`
        ).join('')}
        ${API.LEVELS.map(l =>
          `<button class="filter-pill" data-type="level" data-val="${l}">${API.fmt(l)}</button>`
        ).join('')}
      </div>`;

    bar.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        bar.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const { type, val } = pill.dataset;
        activeFilters = type ? { [type]: val } : {};
        searchQuery = '';
        document.getElementById('ex-search').value = '';
        reset();
      });
    });
  }

  // ── Exercise detail modal ─────────────────────────────────────────────────

  async function openDetail(id) {
    let ex;
    try { ex = await API.getExercise(id); }
    catch (e) { App.toast(e.message); return; }

    const instructions = (ex.instructions || [])
      .map((s, i) => `<li><span class="step-n">${i+1}</span>${s}</li>`)
      .join('');

    const muscles = [
      ...(ex.primaryMuscle || []).map(m => `<span class="chip chip-muscle">${API.fmt(m)}</span>`),
      ...(ex.secondaryMuscle || []).map(m => `<span class="chip chip-muscle2">${API.fmt(m)}</span>`),
    ].join('');

    const addBtn = onPick
      ? `<button class="btn btn-primary full-w" id="modal-add-ex">+ Add to Routine</button>`
      : `<button class="btn btn-primary full-w" id="modal-add-ex">+ Add to Workout</button>`;

    // Media section — YouTube video (loading spinner while fetching)
    const mediaHtml = `
      <div class="modal-media-wrap-outer">
        <div class="modal-media" id="modal-media-wrap">
          <div class="modal-video-loading"><div class="spinner"></div></div>
        </div>
        <button class="btn-media-edit" id="modal-media-edit" title="Change video">✏️</button>
      </div>`;

    const html = `
      <div class="modal-overlay" id="ex-detail-modal">
        <div class="modal modal-sheet">
          <button class="modal-close" aria-label="Close">✕</button>
          ${mediaHtml}
          <div class="modal-body">
            <h2 class="modal-title">${ex.displayName}</h2>
            <div class="chip-row">
              ${chipHtml(ex.category, 'chip-cat')}
              ${chipHtml(ex.equipment, 'chip-equip')}
              ${chipHtml(ex.level, 'chip-level chip-level-' + (ex.level||'').toLowerCase())}
              ${chipHtml(ex.mechanic, 'chip-mech')}
              ${chipHtml(ex.force, 'chip-force')}
            </div>
            ${muscles ? `<div class="chip-row muscles-row">${muscles}</div>` : ''}
            ${instructions
              ? `<h4 class="section-label">Instructions</h4><ol class="steps">${instructions}</ol>`
              : ''}
            ${addBtn}
            <button class="btn btn-ghost full-w" id="modal-back-btn" style="margin-top:8px">← Back</button>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('ex-detail-modal');
    modal.querySelector('.modal-close').addEventListener('click', closeDetail);
    modal.addEventListener('click', e => { if (e.target === modal) closeDetail(); });
    document.addEventListener('keydown', _escDetail);

    // Try to load YouTube video — replaces animation if found
    loadVideo(ex.displayName);

    modal.querySelector('#modal-media-edit')?.addEventListener('click', e => {
      e.stopPropagation();
      openMediaEditor(modal, ex.displayName);
    });

    modal.querySelector('#modal-back-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      closeDetail();
      // Underlying view is still visible — no navigation needed
    });

    modal.querySelector('#modal-add-ex')?.addEventListener('click', e => {
      e.stopPropagation();
      if (onPick) {
        onPick(ex);
        closeDetail();
      } else {
        App.addExToActiveWorkout(ex);
        closeDetail();
      }
    });
  }

  function renderMedia(wrap, videoId, thumbUrl, exerciseName) {
    if (videoId) {
      wrap.innerHTML = `
        <iframe
          class="ex-video-frame"
          src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0&modestbranding=1"
          allow="autoplay; encrypted-media"
          allowfullscreen
          loading="lazy"
          title="${exerciseName}">
        </iframe>`;
    } else if (thumbUrl) {
      wrap.innerHTML = `<img class="modal-media-gif" src="${thumbUrl}" alt="${exerciseName}" loading="lazy">`;
    } else {
      wrap.innerHTML = `<div class="modal-media-ph">🎬<br><small>No video found</small></div>`;
    }
  }

  async function loadVideo(exerciseName) {
    const wrap = document.getElementById('modal-media-wrap');
    if (!wrap) return;

    // User-set custom media takes priority
    const custom = Storage.getCustomMediaFor(exerciseName);
    if (custom) { renderMedia(wrap, custom.videoId, custom.thumb, exerciseName); return; }

    const [videoId, gifUrl] = await Promise.all([
      API.getYouTubeVideoId(exerciseName),
      API.getFitnessProgramerGif(exerciseName),
    ]);
    if (!wrap.isConnected) return;
    if (wrap.querySelector('.media-edit-form')) return; // editor opened while loading — don't overwrite
    // Re-check: user may have saved custom media while the API call was in flight
    const customNow = Storage.getCustomMediaFor(exerciseName);
    if (customNow) return;
    renderMedia(wrap, videoId, gifUrl, exerciseName);
  }

  function parseYouTubeId(url) {
    try {
      const u = new URL(url.trim());
      if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0];
      if (u.pathname.includes('/shorts/')) return u.pathname.split('/shorts/')[1].split('?')[0];
      if (u.pathname.includes('/embed/'))  return u.pathname.split('/embed/')[1].split('?')[0];
      return u.searchParams.get('v') || null;
    } catch { return null; }
  }

  function openMediaEditor(modal, exerciseName) {
    const existing = Storage.getCustomMediaFor(exerciseName) || {};
    const wrap = modal.querySelector('#modal-media-wrap');

    // Replace media with edit form
    wrap.innerHTML = `
      <div class="media-edit-form">
        <label class="media-edit-label">YouTube URL</label>
        <input class="input" id="media-edit-video" type="url" placeholder="https://youtube.com/watch?v=…" value="${existing.videoId ? 'https://youtu.be/' + existing.videoId : ''}">
        <label class="media-edit-label" style="margin-top:10px">Backup thumbnail URL <span style="font-weight:400;color:var(--text-muted)">(optional)</span></label>
        <input class="input" id="media-edit-thumb" type="url" placeholder="https://…" value="${existing.thumb || ''}">
        <div class="media-edit-actions">
          <button class="btn btn-ghost btn-sm" id="media-edit-cancel">Cancel</button>
          <button class="btn btn-primary btn-sm" id="media-edit-save">Save</button>
        </div>
      </div>`;

    wrap.querySelector('#media-edit-cancel').addEventListener('click', e => {
      e.stopPropagation();
      loadVideo(exerciseName);
    });

    wrap.querySelector('#media-edit-save').addEventListener('click', async e => {
      e.stopPropagation();
      const rawVideo = document.getElementById('media-edit-video').value.trim();
      const thumb    = document.getElementById('media-edit-thumb').value.trim();
      const videoId  = rawVideo ? parseYouTubeId(rawVideo) : null;

      if (rawVideo && !videoId) { App.toast('Invalid YouTube URL'); return; }

      const data = { videoId: videoId || null, thumb: thumb || null };
      Storage.saveCustomMedia(exerciseName, data);
      renderMedia(wrap, data.videoId, data.thumb, exerciseName);
      try {
        await GithubSync.pushAll();
        App.toast('Video saved & synced');
      } catch (err) {
        App.toast('Video saved locally (sync failed)');
      }
    });
  }

  function closeDetail() {
    document.getElementById('ex-detail-modal')?.remove();
    document.removeEventListener('keydown', _escDetail);
  }
  function _escDetail(e) { if (e.key === 'Escape') closeDetail(); }

  // ── Picker mode (modal over routine detail) ───────────────────────────────

  function openPicker(routineId, callback) {
    pickerRoutineId = routineId;
    onPick = callback;

    const html = `
      <div class="modal-overlay" id="ex-picker-modal">
        <div class="modal modal-full">
          <div class="modal-header">
            <button class="modal-close" aria-label="Close">✕</button>
            <h3>Add Exercise</h3>
          </div>
          <div class="picker-search-wrap">
            <input id="ex-search" class="input" type="search" placeholder="Search exercises…" autocomplete="off">
          </div>
          <div id="ex-filter-bar"></div>
          <div id="ex-grid" class="ex-list"></div>
          <div id="ex-sentinel"></div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('ex-picker-modal');
    modal.querySelector('.modal-close').addEventListener('click', closePicker);

    document.getElementById('ex-search')?.addEventListener('input', e => onSearch(e.target.value));

    buildFilterBar('ex-filter-bar');
    setupGridDelegation('ex-grid');
    setupSentinel('ex-sentinel');
    reset();
  }

  function closePicker() {
    document.getElementById('ex-picker-modal')?.remove();
    if (_sentinelObs) { _sentinelObs.disconnect(); _sentinelObs = null; }
    onPick = null;
    pickerRoutineId = null;
    cursor = null;
    hasMore = true;
  }

  // ── Standalone view init ──────────────────────────────────────────────────

  function initView() {
    onPick = null;
    cursor = null;
    hasMore = true;
    activeFilters = {};
    searchQuery = '';

    document.getElementById('ex-search')?.addEventListener('input', e => onSearch(e.target.value));
    buildFilterBar('ex-filter-bar');
    setupGridDelegation('ex-grid');
    setupSentinel('ex-sentinel');
    reset();
  }

  // ── Shared helpers ────────────────────────────────────────────────────────

  let _searchTimer;
  function onSearch(q) {
    clearTimeout(_searchTimer);
    _searchTimer = setTimeout(() => {
      searchQuery = q.trim();
      activeFilters = {};
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      document.querySelector('.filter-pill[data-val=""]')?.classList.add('active');
      reset();
    }, 350);
  }

  function setupGridDelegation(gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.addEventListener('click', e => {
      const addBtn = e.target.closest('.btn-add-ex');
      if (addBtn) { e.stopPropagation(); handlePick(addBtn.dataset.id); return; }
      const card = e.target.closest('[data-id]');
      if (card) openDetail(card.dataset.id);
    });
    grid.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const card = e.target.closest('[data-id]');
        if (card) openDetail(card.dataset.id);
      }
    });
  }

  async function handlePick(exId) {
    if (!onPick) return;
    try {
      const ex = await API.getExercise(exId);
      onPick(ex);
      App.toast(`${ex.displayName} added`);
    } catch (e) { App.toast(e.message); }
  }

  function setupSentinel(sentinelId) {
    if (_sentinelObs) { _sentinelObs.disconnect(); _sentinelObs = null; }
    const sentinel = document.getElementById(sentinelId);
    if (!sentinel) return;
    _sentinelObs = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '300px' }
    );
    _sentinelObs.observe(sentinel);
  }

  return { initView, openPicker, closePicker, openDetail };
})();
