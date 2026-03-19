// Exercise browser — used both as a standalone view and as a picker modal

const Exercises = (() => {
  let cursor = null;
  let hasMore = true;
  let isLoading = false;
  let activeFilters = {};
  let activeEquipment = '';
  let searchQuery = '';
  let onPick = null; // callback when in picker mode
  let pickerRoutineId = null;
  let _sentinelObs = null;
  let _escCustomEx = null;
  let _viewInited = false;

  // IDs of the currently active grid/sentinel/search — switch between
  // static exercises view and picker modal to avoid getElementById collisions
  let _gridId     = 'ex-grid';
  let _sentinelId = 'ex-sentinel';
  let _searchId   = 'ex-search';

  // ── Render ────────────────────────────────────────────────────────────────

  function chipHtml(label, cls) {
    return label ? `<span class="chip ${cls}">${API.fmt(label)}</span>` : '';
  }

  const escHtml = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  function cardHtml(ex, compact = false) {
    const customBadge = ex.custom ? `<span class="chip chip-custom">Custom</span>` : '';
    if (compact) {
      return `
        <div class="ex-row" data-id="${ex.id}" tabindex="0" role="button">
          <div class="ex-row-info">
            <div class="ex-row-name">${escHtml(ex.displayName)} ${customBadge}</div>
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
          <div class="ex-card-name">${escHtml(ex.displayName)} ${customBadge}</div>
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

  function _getFilteredCustomExercises() {
    let exs = Storage.getCustomExercises();
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      exs = exs.filter(ex =>
        ex.displayName.toLowerCase().includes(q) ||
        (ex.primaryMuscle || []).some(m => m.toLowerCase().includes(q)) ||
        (ex.equipment || '').toLowerCase().includes(q) ||
        (ex.category || '').toLowerCase().includes(q)
      );
    } else {
      if (activeFilters.category)      exs = exs.filter(ex => ex.category === activeFilters.category);
      if (activeFilters.primaryMuscle) exs = exs.filter(ex => (ex.primaryMuscle || []).includes(activeFilters.primaryMuscle));
      if (activeFilters.level)         exs = exs.filter(ex => ex.level === activeFilters.level);
    }
    if (activeEquipment) exs = exs.filter(ex => ex.equipment === activeEquipment);
    return exs;
  }

  async function loadMore() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    const grid = document.getElementById(_gridId);
    const sentinel = document.getElementById(_sentinelId);
    if (sentinel) sentinel.innerHTML = '<div class="spinner"></div>';

    try {
      // On first page, prepend custom exercises at the top
      if (cursor === null) {
        const customExs = _getFilteredCustomExercises();
        const compact = !!onPick;
        customExs.forEach(ex => grid?.insertAdjacentHTML('beforeend', cardHtml(ex, compact)));
      }

      let result;
      const combinedFilters = activeEquipment
        ? { ...activeFilters, equipment: activeEquipment }
        : activeFilters;
      if (searchQuery) {
        result = await API.searchExercises(searchQuery, cursor);
        // Apply equipment filter client-side on search results
        if (activeEquipment && result.exercises) {
          result.exercises = result.exercises.filter(ex => ex.equipment === activeEquipment);
        }
      } else {
        result = await API.queryExercises(combinedFilters, cursor);
      }

      const exercises = result.exercises || result;
      if (!exercises?.length) {
        hasMore = false;
        if (sentinel) {
          const hasCustom = cursor === null && _getFilteredCustomExercises().length > 0;
          sentinel.innerHTML = (cursor === null && !hasCustom)
            ? '<p class="empty-msg">No exercises found.</p>'
            : '';
        }
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
    const grid = document.getElementById(_gridId);
    if (grid) grid.innerHTML = '';
    loadMore();
  }

  // ── Equipment filter bar ──────────────────────────────────────────────────

  function buildEquipmentBar(containerId) {
    const bar = document.getElementById(containerId);
    if (!bar) return;
    bar.innerHTML = `
      <div class="ex-equip-wrap">
        <select class="input ex-equip-select">
          <option value="">All Equipment</option>
          ${API.EQUIPMENT.map(e =>
            `<option value="${e}" ${activeEquipment === e ? 'selected' : ''}>${API.fmt(e)}</option>`
          ).join('')}
        </select>
      </div>`;
    bar.querySelector('select').addEventListener('change', e => {
      activeEquipment = e.target.value;
      reset();
    });
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
        const searchEl = document.getElementById(_searchId);
        if (searchEl) searchEl.value = '';
        reset();
      });
    });
  }

  // ── Exercise detail modal ─────────────────────────────────────────────────

  async function openDetail(id, fallbackName = null) {
    let ex;
    const isCustom = String(id).startsWith('custom_');

    if (isCustom) {
      const found = Storage.getCustomExercises().find(e => e.id === id);
      if (!found) { App.toast('Exercise not found'); return; }
      ex = { primaryMuscle: [], secondaryMuscle: [], instructions: [], ...found };
    } else {
      try { ex = await API.getExercise(id); }
      catch (e) { App.toast(e.message); return; }
      // Fallback: look up by display name (handles stale slugified IDs from program import)
      if (!ex && fallbackName) {
        try { ex = await API.findByName(fallbackName); } catch {}
      }
      if (!ex) { App.toast('Exercise not found'); return; }
    }

    // Community metadata only for non-custom exercises
    const community = isCustom ? null : await API.getCommunityMeta(ex.displayName);
    const activeInstructions = community?.instructions?.length
      ? community.instructions
      : (ex.instructions || []);
    const isCommunityInstructions = !!(community?.instructions?.length);

    const instructions = activeInstructions
      .map((s, i) => `<li><span class="step-n">${i+1}</span>${s}</li>`)
      .join('');

    const muscles = [
      ...(ex.primaryMuscle || []).map(m => `<span class="chip chip-muscle">${API.fmt(m)}</span>`),
      ...(ex.secondaryMuscle || []).map(m => `<span class="chip chip-muscle2">${API.fmt(m)}</span>`),
    ].join('');

    // Custom media equipment override
    const customMedia = isCustom ? null : Storage.getCustomMediaFor(ex.displayName);
    const contributeBtn = (!isCustom && (customMedia?.videoId || customMedia?.thumb))
      ? `<button class="btn btn-ghost full-w" id="modal-contribute-btn" style="margin-top:8px">↑ Contribute this video to the community</button>`
      : '';
    const displayEquipment = customMedia?.equipment || ex.equipment;

    const addBtn = onPick
      ? `<button class="btn btn-primary full-w" id="modal-add-ex">+ Add to Routine</button>`
      : `<button class="btn btn-primary full-w" id="modal-add-ex">+ Add to Workout</button>`;

    const customActions = isCustom ? `
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="btn btn-ghost full-w" id="modal-edit-custom">✏️ Edit</button>
        <button class="btn btn-danger full-w" id="modal-del-custom">🗑 Delete</button>
      </div>` : '';

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
            <h2 class="modal-title">${escHtml(ex.displayName)}</h2>
            <div class="chip-row">
              ${chipHtml(ex.category, 'chip-cat')}
              ${chipHtml(displayEquipment, 'chip-equip')}
              ${chipHtml(ex.level, 'chip-level chip-level-' + (ex.level||'').toLowerCase())}
              ${chipHtml(ex.mechanic, 'chip-mech')}
              ${chipHtml(ex.force, 'chip-force')}
            </div>
            ${muscles ? `<div class="chip-row muscles-row">${muscles}</div>` : ''}
            ${instructions
              ? `<h4 class="section-label">Instructions${isCommunityInstructions ? ' <span class="badge-community">Community</span>' : ''}</h4><ol class="steps">${instructions}</ol>`
              : ''}
            ${addBtn}
            ${customActions}
            ${contributeBtn}
            <button class="btn btn-ghost full-w" id="modal-back-btn" style="margin-top:8px">← Back</button>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('ex-detail-modal');
    modal.querySelector('.modal-close').addEventListener('click', closeDetail);
    modal.addEventListener('click', e => { if (e.target === modal) closeDetail(); });
    document.addEventListener('keydown', _escDetail);

    // Try to load video — for custom exercises use embedded videoId/thumb as fallback
    loadVideo(ex.displayName, isCustom ? { videoId: ex.videoId, thumb: ex.thumb } : null);

    modal.querySelector('#modal-media-edit')?.addEventListener('click', e => {
      e.stopPropagation();
      openMediaEditor(modal, ex.displayName);
    });

    modal.querySelector('#modal-back-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      closeDetail();
      // Underlying view is still visible — no navigation needed
    });

    modal.querySelector('#modal-contribute-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      openCommunityExport(ex.displayName, customMedia);
    });

    modal.querySelector('#modal-add-ex')?.addEventListener('click', e => {
      e.stopPropagation();
      const exWithMeta = community?.timed ? { ...ex, timed: true } : ex;
      if (onPick) {
        onPick(exWithMeta);
        closeDetail();
      } else {
        App.addExToActiveWorkout(exWithMeta);
        closeDetail();
      }
    });

    modal.querySelector('#modal-edit-custom')?.addEventListener('click', e => {
      e.stopPropagation();
      closeDetail();
      promptCreateCustom(ex);
    });

    modal.querySelector('#modal-del-custom')?.addEventListener('click', e => {
      e.stopPropagation();
      if (!confirm(`Delete "${ex.displayName}"?`)) return;
      Storage.deleteCustomExercise(ex.id);
      closeDetail();
      cursor = null; hasMore = true;
      const grid = document.getElementById(_gridId);
      if (grid) { grid.innerHTML = ''; loadMore(); }
      App.toast('Exercise deleted');
      GithubSync.pushAll().catch(() => {});
    });
  }

  function renderMedia(wrap, videoId, thumbUrl, exerciseName) {
    if (videoId) {
      const ytThumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      wrap.innerHTML = `
        <div class="video-with-thumb">
          <img class="video-thumb-bg" src="${ytThumb}" alt="${escHtml(exerciseName)}" loading="lazy">
          <iframe
            class="ex-video-frame"
            src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0&modestbranding=1"
            allow="autoplay; encrypted-media"
            allowfullscreen
            loading="lazy"
            title="${escHtml(exerciseName)}">
          </iframe>
        </div>`;
    } else if (thumbUrl) {
      wrap.innerHTML = `<img class="modal-media-gif" src="${thumbUrl}" alt="${escHtml(exerciseName)}" loading="lazy">`;
    } else {
      wrap.innerHTML = `<div class="modal-media-ph">🎬<br><small>No video found</small></div>`;
    }
  }

  async function loadVideo(exerciseName, fallback = null) {
    const wrap = document.getElementById('modal-media-wrap');
    if (!wrap) return;

    // User-set custom media takes priority
    const custom = Storage.getCustomMediaFor(exerciseName);
    if (custom) { renderMedia(wrap, custom.videoId, custom.thumb, exerciseName); return; }

    // Embedded media on custom exercise object
    if (fallback?.videoId || fallback?.thumb) {
      renderMedia(wrap, fallback.videoId || null, fallback.thumb || null, exerciseName);
      return;
    }

    // Step 1: community data (curated, cached after first fetch)
    const community = await API.getCommunityMeta(exerciseName);
    if (!wrap.isConnected) return;
    if (community?.videoId || community?.thumbnailUrl) {
      if (!wrap.querySelector('.media-edit-form') && !Storage.getCustomMediaFor(exerciseName)) {
        renderMedia(wrap, community.videoId || null, community.thumbnailUrl || null, exerciseName);
      }
      return;
    }

    // Step 2: GIF lookup is fast (local JSON, usually cached) — clears spinner right away
    const gifUrl = await API.getFitnessProgramerGif(exerciseName);
    if (!wrap.isConnected) return;
    if (!wrap.querySelector('.media-edit-form') && !Storage.getCustomMediaFor(exerciseName)) {
      renderMedia(wrap, null, gifUrl, exerciseName); // show GIF or "No video" placeholder immediately
    }

    // Step 2: race YouTube search vs 5 s timeout — never blocks the UI indefinitely
    const _timedOut = Symbol();
    const videoId = await Promise.race([
      API.getYouTubeVideoId(exerciseName),
      new Promise(res => setTimeout(() => res(_timedOut), 5000)),
    ]);

    if (!videoId || videoId === _timedOut) return; // no upgrade needed — keep GIF/placeholder
    if (!wrap.isConnected) return;
    if (wrap.querySelector('.media-edit-form')) return;
    if (Storage.getCustomMediaFor(exerciseName)) return;
    renderMedia(wrap, videoId, gifUrl, exerciseName); // upgrade to video
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

    const equipOptions = API.EQUIPMENT.map(e =>
      `<option value="${e}" ${existing.equipment === e ? 'selected' : ''}>${API.fmt(e)}</option>`
    ).join('');

    // Replace media with edit form
    wrap.innerHTML = `
      <div class="media-edit-form">
        <label class="media-edit-label">YouTube URL</label>
        <input class="input" id="media-edit-video" type="url" placeholder="https://youtube.com/watch?v=…" value="${existing.videoId ? 'https://youtu.be/' + existing.videoId : ''}">
        <label class="media-edit-label" style="margin-top:10px">Backup thumbnail URL <span style="font-weight:400;color:var(--text-muted)">(optional)</span></label>
        <input class="input" id="media-edit-thumb" type="url" placeholder="https://…" value="${existing.thumb || ''}">
        <label class="media-edit-label" style="margin-top:10px">Equipment</label>
        <select class="input" id="media-edit-equip">
          <option value="">— unchanged —</option>
          ${equipOptions}
        </select>
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
      const rawVideo  = document.getElementById('media-edit-video').value.trim();
      const thumb     = document.getElementById('media-edit-thumb').value.trim();
      const equipment = document.getElementById('media-edit-equip').value;
      const videoId   = rawVideo ? parseYouTubeId(rawVideo) : null;

      if (rawVideo && !videoId) { App.toast('Invalid YouTube URL'); return; }

      const data = {
        videoId:   videoId   || null,
        thumb:     thumb     || null,
        equipment: equipment || null,
      };
      Storage.saveCustomMedia(exerciseName, data);
      renderMedia(wrap, data.videoId, data.thumb, exerciseName);

      // Update equipment chip in detail modal if it changed
      if (equipment) {
        const chipEl = modal.querySelector('.chip-equip');
        if (chipEl) chipEl.textContent = API.fmt(equipment);
      }

      try {
        await GithubSync.pushAll();
        App.toast('Saved & synced');
      } catch (err) {
        App.toast('Saved locally (sync failed)');
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
            <input id="picker-search" class="input" type="search" placeholder="Search exercises…" autocomplete="off">
          </div>
          <div id="picker-equip-bar"></div>
          <div id="picker-filter-bar"></div>
          <div id="picker-grid" class="ex-list"></div>
          <div id="picker-sentinel"></div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('ex-picker-modal');
    modal.querySelector('.modal-close').addEventListener('click', closePicker);

    _searchId = 'picker-search';
    modal.querySelector('#picker-search').addEventListener('input', e => onSearch(e.target.value));

    buildEquipmentBar('picker-equip-bar');
    buildFilterBar('picker-filter-bar');
    setupGridDelegation('picker-grid');
    setupSentinel('picker-sentinel');
    reset();
  }

  function closePicker() {
    document.getElementById('ex-picker-modal')?.remove();
    if (_sentinelObs) { _sentinelObs.disconnect(); _sentinelObs = null; }
    onPick = null;
    pickerRoutineId = null;
    cursor = null;
    hasMore = true;
    activeEquipment = '';
    activeFilters = {};
    searchQuery = '';
    // Restore static view IDs
    _gridId = 'ex-grid'; _sentinelId = 'ex-sentinel'; _searchId = 'ex-search';
  }

  // ── Standalone view init ──────────────────────────────────────────────────

  function initView() {
    onPick = null;
    cursor = null;
    hasMore = true;
    activeFilters = {};
    activeEquipment = '';
    searchQuery = '';
    _gridId = 'ex-grid'; _sentinelId = 'ex-sentinel'; _searchId = 'ex-search';

    // Wire up static DOM elements only once — avoid accumulating listeners
    if (!_viewInited) {
      document.getElementById('ex-search')?.addEventListener('input', e => onSearch(e.target.value));
      setupGridDelegation('ex-grid');
      setupSentinel('ex-sentinel');
      _viewInited = true;
    }

    buildEquipmentBar('ex-equip-bar');
    buildFilterBar('ex-filter-bar');
    reset();
  }

  // ── Shared helpers ────────────────────────────────────────────────────────

  let _searchTimer;
  function onSearch(q) {
    clearTimeout(_searchTimer);
    _searchTimer = setTimeout(() => {
      searchQuery = q.trim();
      activeFilters = {};
      // Only clear pills within the active container (bar sibling of active grid)
      const grid = document.getElementById(_gridId);
      const bar  = grid?.parentElement?.querySelector('[id$="-filter-bar"], #ex-filter-bar');
      if (bar) {
        bar.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        bar.querySelector('.filter-pill[data-val=""]')?.classList.add('active');
      }
      reset();
    }, 350);
  }

  function setupGridDelegation(gridId) {
    _gridId = gridId;
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
      let ex;
      if (String(exId).startsWith('custom_')) {
        ex = Storage.getCustomExercises().find(e => e.id === exId);
        if (!ex) throw new Error('Exercise not found');
        ex = { primaryMuscle: [], secondaryMuscle: [], instructions: [], ...ex };
      } else {
        ex = await API.getExercise(exId);
      }
      onPick(ex);
      // Only show "added" toast if picker wasn't closed inside the callback
      // (e.g. Replace flow calls closePicker() which nulls onPick)
      if (onPick) App.toast(`${ex.displayName} added`);
    } catch (e) { App.toast(e.message); }
  }

  function setupSentinel(sentinelId) {
    _sentinelId = sentinelId;
    if (_sentinelObs) { _sentinelObs.disconnect(); _sentinelObs = null; }
    const sentinel = document.getElementById(sentinelId);
    if (!sentinel) return;
    _sentinelObs = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '300px' }
    );
    _sentinelObs.observe(sentinel);
  }

  // ── Create / edit custom exercise ────────────────────────────────────────

  function promptCreateCustom(existing = null) {
    const isEdit = !!existing;
    const catOptions = API.CATEGORIES.map(c =>
      `<option value="${c}" ${existing?.category === c ? 'selected' : ''}>${API.fmt(c)}</option>`
    ).join('');
    const muscleOptions = API.MUSCLES.map(m =>
      `<option value="${m}" ${existing?.primaryMuscle?.[0] === m ? 'selected' : ''}>${API.fmt(m)}</option>`
    ).join('');
    const equipOptions = API.EQUIPMENT.map(e =>
      `<option value="${e}" ${existing?.equipment === e ? 'selected' : ''}>${API.fmt(e)}</option>`
    ).join('');

    const existingVideoUrl = existing?.videoId ? `https://youtu.be/${existing.videoId}` : '';
    const existingThumb    = existing?.thumb || '';
    const existingInstr    = (existing?.instructions || []).join('\n');

    const html = `
      <div class="modal-overlay" id="custom-ex-modal">
        <div class="modal modal-sheet">
          <button class="modal-close" aria-label="Close">✕</button>
          <div class="modal-body">
            <h2 class="modal-title">${isEdit ? 'Edit Exercise' : 'New Exercise'}</h2>
            <label class="media-edit-label">Name *</label>
            <input class="input" id="cex-name" type="text" placeholder="e.g. Banded Squat"
              value="${escHtml(existing?.displayName || '')}">

            <label class="media-edit-label" style="margin-top:10px">Category</label>
            <select class="input" id="cex-category">
              <option value="">— none —</option>${catOptions}
            </select>

            <label class="media-edit-label" style="margin-top:10px">Primary Muscle</label>
            <select class="input" id="cex-muscle">
              <option value="">— none —</option>${muscleOptions}
            </select>

            <label class="media-edit-label" style="margin-top:10px">Equipment</label>
            <select class="input" id="cex-equipment">
              <option value="">— none —</option>${equipOptions}
            </select>

            <label class="media-edit-label" style="margin-top:10px">YouTube URL
              <span style="font-weight:400;color:var(--text-muted)">(optional)</span>
            </label>
            <input class="input" id="cex-video" type="url"
              placeholder="https://youtube.com/watch?v=…" value="${escHtml(existingVideoUrl)}">

            <label class="media-edit-label" style="margin-top:10px">Thumbnail URL
              <span style="font-weight:400;color:var(--text-muted)">(optional)</span>
            </label>
            <input class="input" id="cex-thumb" type="url"
              placeholder="https://…" value="${escHtml(existingThumb)}">

            <label class="media-edit-label" style="margin-top:10px">Instructions
              <span style="font-weight:400;color:var(--text-muted)">(one step per line)</span>
            </label>
            <textarea class="input" id="cex-instructions" rows="4"
              placeholder="Stand with feet shoulder-width apart&#10;…"
              style="resize:vertical">${escHtml(existingInstr)}</textarea>

            <label class="media-edit-label" style="margin-top:10px;display:flex;align-items:center;gap:8px">
              <input type="checkbox" id="cex-timed" ${existing?.timed ? 'checked' : ''}>
              Timed exercise (no rep count)
            </label>

            <div class="media-edit-actions" style="margin-top:16px">
              <button class="btn btn-ghost btn-sm" id="cex-cancel">Cancel</button>
              <button class="btn btn-primary btn-sm" id="cex-save">
                ${isEdit ? 'Save Changes' : 'Save Exercise'}
              </button>
            </div>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('custom-ex-modal');
    const close = () => {
      modal.remove();
      document.removeEventListener('keydown', _escCustomEx);
      _escCustomEx = null;
    };

    modal.querySelector('.modal-close').addEventListener('click', close);
    modal.querySelector('#cex-cancel').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    _escCustomEx = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', _escCustomEx);

    modal.querySelector('#cex-save').addEventListener('click', async () => {
      const name = document.getElementById('cex-name').value.trim();
      if (!name) { App.toast('Name is required'); return; }

      const rawVideo = document.getElementById('cex-video').value.trim();
      const videoId  = rawVideo ? parseYouTubeId(rawVideo) : null;
      if (rawVideo && !videoId) { App.toast('Invalid YouTube URL'); return; }

      const instructions = document.getElementById('cex-instructions').value
        .split('\n').map(s => s.trim()).filter(Boolean);

      const ex = {
        id:             isEdit ? existing.id : ('custom_' + Storage.uid()),
        displayName:    name,
        category:       document.getElementById('cex-category').value || '',
        primaryMuscle:  document.getElementById('cex-muscle').value
                          ? [document.getElementById('cex-muscle').value] : [],
        secondaryMuscle: [],
        equipment:      document.getElementById('cex-equipment').value || '',
        level: '', mechanic: '', force: '',
        videoId:        videoId || null,
        thumb:          document.getElementById('cex-thumb').value.trim() || null,
        instructions,
        timed:          document.getElementById('cex-timed').checked,
        custom:         true,
        createdAt:      isEdit ? (existing.createdAt || Date.now()) : Date.now(),
      };

      Storage.saveCustomExercise(ex);
      close();

      // Refresh exercise grid
      cursor = null; hasMore = true;
      const grid = document.getElementById(_gridId);
      if (grid) { grid.innerHTML = ''; loadMore(); }

      try {
        await GithubSync.pushAll();
        App.toast(isEdit ? 'Exercise updated & synced' : 'Exercise saved & synced');
      } catch {
        App.toast(isEdit ? 'Exercise updated locally' : 'Exercise saved locally');
      }
    });
  }

  function openCommunityExport(exerciseName, customMedia) {
    const slug = API.slugify(exerciseName);
    const today = new Date().toISOString().slice(0, 10);
    const json = JSON.stringify({
      exerciseName,
      slug,
      videoId: customMedia.videoId || null,
      thumbnailUrl: customMedia.thumb || null,
      timed: false,
      instructions: [],
      meta: {
        contributor: 'your-github-username',
        source: customMedia.videoId ? `https://youtu.be/${customMedia.videoId}` : null,
        addedAt: today,
      },
    }, null, 2);

    const filename = `data/community/${slug}.json`;
    const ghBase = 'https://github.com/sterlingalston/forgettable_workout_app/new/main';
    const ghParams = `?filename=${encodeURIComponent(filename)}&value=${encodeURIComponent(json)}`;
    // GitHub has a URL length limit — only provide the direct link if it's reasonable
    const ghUrl = (ghBase + ghParams).length < 8000 ? ghBase + ghParams : ghBase;

    const html = `
      <div class="modal-overlay" id="community-export-modal">
        <div class="modal modal-sheet">
          <button class="modal-close" aria-label="Close">✕</button>
          <div class="modal-body">
            <h2 class="modal-title">Contribute to Community</h2>
            <p class="settings-hint">Share your custom video for <strong>${escHtml(exerciseName)}</strong> with everyone.</p>
            <div class="community-json-wrap">
              <pre class="community-json-preview" id="community-json-text">${escHtml(json)}</pre>
              <button class="btn btn-ghost btn-sm community-copy-btn" id="community-json-copy">Copy</button>
            </div>
            <p class="settings-hint" style="margin-top:8px">File: <code>${escHtml(filename)}</code></p>
            <a href="${ghUrl}" target="_blank" rel="noopener" class="btn btn-primary full-w" style="margin-top:8px;display:block;text-align:center;text-decoration:none;line-height:44px">Open GitHub to submit PR →</a>
            <p class="settings-hint" style="margin-top:8px">After creating the file, add <code>"${escHtml(slug)}"</code> to <code>data/community/index.json</code>.</p>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('community-export-modal');
    const close = () => modal.remove();
    modal.querySelector('.modal-close').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    document.getElementById('community-json-copy')?.addEventListener('click', () => {
      navigator.clipboard?.writeText(json).then(() => App.toast('Copied!')).catch(() => {
        const el = document.createElement('textarea');
        el.value = json; document.body.appendChild(el); el.select();
        try { document.execCommand('copy'); App.toast('Copied!'); } catch {}
        el.remove();
      });
    });
  }

  return { initView, openPicker, closePicker, openDetail, promptCreateCustom, openCommunityExport };
})();
