// App shell — navigation, views, settings, toast

const App = (() => {
  const views = ['routines', 'routine-detail', 'exercises', 'workout', 'log', 'settings'];
  let _currentView = 'routines';

  function showView(name) {
    _currentView = name;
    views.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      if (el) el.hidden = (v !== name);
    });

    // Bottom nav highlight
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.view === name);
    });

    // Back button — show on sub-views
    const backBtn = document.getElementById('btn-back');
    if (backBtn) {
      backBtn.hidden = !['routine-detail', 'workout'].includes(name);
    }

    // Header + button — hide on sub-views and settings
    const newBtn = document.getElementById('btn-new-routine');
    if (newBtn) {
      newBtn.hidden = ['routine-detail', 'workout', 'settings'].includes(name);
      const labels = { routines: 'New routine', exercises: 'New exercise', log: 'Log workout' };
      newBtn.setAttribute('aria-label', labels[name] || 'New');
    }

    // Header title
    const titles = {
      routines: 'LIFT',
      exercises: 'Exercises',
      workout: 'Workout',
      log: 'History',
      settings: 'Settings',
    };
    const titleEl = document.getElementById('header-title');
    if (titleEl && titles[name]) {
      titleEl.textContent = titles[name];
      titleEl.classList.toggle('header-title-brand', name === 'routines');
    }
  }

  function addExToActiveWorkout(ex) {
    if (!Workout.isActive()) {
      toast('No active workout — start one from a routine first');
      return;
    }
    Workout.addExercise(ex);
    toast(`${ex.displayName} added to workout`);
  }

  // ── Settings view ─────────────────────────────────────────────────────────

  function renderSettings() {
    const s = Storage.getSettings();
    const el = document.getElementById('settings-form');
    if (!el) return;

    document.getElementById('set-yt-key').value      = s.youtubeApiKey;
    document.getElementById('set-language').value    = s.language || 'en';
    document.getElementById('set-def-sets').value  = s.defaultSets;
    document.getElementById('set-def-reps').value  = s.defaultReps;
    document.getElementById('set-rest').value      = s.restSeconds;
    const autoRestEl = document.getElementById('set-auto-rest');
    if (autoRestEl) autoRestEl.checked = !!s.autoRest; // default OFF

    // Unit toggle
    const unit = s.weightUnit || 'lbs';
    document.getElementById('unit-lbs')?.classList.toggle('active', unit === 'lbs');
    document.getElementById('unit-kg')?.classList.toggle('active', unit === 'kg');
  }

  function setupSettings() {
    // Unit toggle
    document.querySelectorAll('.unit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Storage.saveSettings({ weightUnit: btn.dataset.unit });
      });
    });

    document.getElementById('settings-form')?.addEventListener('submit', e => {
      e.preventDefault();
      Storage.saveSettings({
        youtubeApiKey: document.getElementById('set-yt-key').value.trim(),
        language:      document.getElementById('set-language').value,
        defaultSets: +document.getElementById('set-def-sets').value,
        defaultReps: +document.getElementById('set-def-reps').value,
        restSeconds: +document.getElementById('set-rest').value,
        autoRest:    document.getElementById('set-auto-rest')?.checked || false,
      });
      GithubSync.pushAll();
      toast('Settings saved');
    });

    document.getElementById('btn-clear-ex-cache')?.addEventListener('click', () => {
      Storage.clearExCache();
      toast('Exercise cache cleared');
    });

    document.getElementById('btn-clear-local')?.addEventListener('click', async () => {
      if (!confirm('Clear local data and reload from sync?\nYou must be signed in.')) return;
      Storage.clearLocalUserData();
      if (GithubSync.isSignedIn()) {
        await GithubSync.pullAll();
        Routine.renderList();
        Log.render();
        toast('Reloaded from sync');
      } else {
        toast('Cleared — sign in to reload');
      }
    });

    document.getElementById('btn-clear-all')?.addEventListener('click', () => {
      if (!confirm('Delete ALL local data? This cannot be undone.')) return;
      Storage.clearAll();
      location.reload();
    });

    document.getElementById('btn-export-csv')?.addEventListener('click', exportHistoryCSV);
    document.getElementById('btn-export-json')?.addEventListener('click', exportHistoryJSON);
    document.getElementById('btn-community-bulk')?.addEventListener('click', showCommunityBulkExport);
  }

  // ── Toast ─────────────────────────────────────────────────────────────────

  let _toastTimer;
  function toast(msg) {
    let el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('toast-show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => el.classList.remove('toast-show'), 2800);
  }

  // ── Routine exercise repair ───────────────────────────────────────────────
  // Background migration: ensures every routine exercise has a valid exId
  // that exists in the free-exercise-db. Runs once per session after sync.

  async function repairRoutineExercises() {
    let all;
    try { all = await API.loadAll(); } catch { return; }
    if (!all.length) return;

    const byId        = new Map(all.map(e => [e.id, e]));
    const byNameLower = new Map(all.map(e => [e.displayName.toLowerCase(), e]));

    const norm = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

    function findMatch(ex) {
      // 1. Valid exId already present
      if (ex.exId && byId.has(ex.exId)) return null; // already good

      // 2. Exact name match
      const nameLow = (ex.name || '').toLowerCase();
      if (byNameLower.has(nameLow)) return byNameLower.get(nameLow);

      // 3. Normalized name match
      const normName = norm(ex.name || '');
      for (const [k, v] of byNameLower) {
        if (norm(k) === normName) return v;
      }

      // 4. Partial normalized match (name is a substring of db entry or vice versa)
      for (const [k, v] of byNameLower) {
        const normK = norm(k);
        if (normK.length > 4 && (normK.includes(normName) || normName.includes(normK))) return v;
      }

      // 5. Score by word overlap (name keywords vs db exercise name keywords)
      //    Boost for shared equipment/muscle hints
      const nameWords = normName.match(/[a-z]{3,}/g) || [];
      if (!nameWords.length) return null;

      let bestScore = 0, bestEx = null;
      for (const dbEx of all) {
        const dbWords = norm(dbEx.displayName).match(/[a-z]{3,}/g) || [];
        const shared  = nameWords.filter(w => dbWords.includes(w)).length;
        if (shared === 0) continue;

        // Bonus: equipment and muscle matches inferred from stored name
        const equipBonus = nameWords.some(w => dbEx.equipment.toLowerCase().includes(w)) ? 1 : 0;
        const muscBonus  = dbEx.primaryMuscle.some(m =>
          nameWords.some(w => m.toLowerCase().includes(w))
        ) ? 1 : 0;

        const score = shared * 2 + equipBonus + muscBonus;
        if (score > bestScore) { bestScore = score; bestEx = dbEx; }
      }

      // Require at least 2 shared significant words to avoid wild mismatches
      return bestScore >= 4 ? bestEx : null;
    }

    const routines = Storage.getRoutines();
    let repaired = 0;

    for (const routine of routines) {
      let changed = false;
      const updatedExercises = routine.exercises.map(ex => {
        // Skip custom exercises (they are not in free-exercise-db)
        if ((ex.exId || ex.id || '').startsWith('custom_')) return ex;

        const match = findMatch(ex);
        if (!match) return ex;

        console.info(`[repair] "${ex.name}" → "${match.displayName}" (${match.id})`);
        changed = true;
        repaired++;
        return { ...ex, exId: match.id, name: match.displayName };
      });

      if (changed) {
        Storage.updateRoutine(routine.id, { exercises: updatedExercises });
      }
    }

    if (repaired > 0) {
      console.info(`[repair] Fixed ${repaired} exercise reference(s) in routines`);
      // Re-render if currently on a visible view that shows routines/exercises
      Routine.renderList();
      GithubSync.pushAll();
      toast(`Synced ${repaired} exercise${repaired > 1 ? 's' : ''} in your routines`);
    }
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  function init() {
    // Bottom nav
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const view = tab.dataset.view;
        showView(view);
        if (view === 'routines')  Routine.renderList();
        if (view === 'exercises') Exercises.initView();
        if (view === 'log')       Log.render();
        if (view === 'settings')  renderSettings();
      });
    });

    // Back button
    document.getElementById('btn-back')?.addEventListener('click', () => {
      showView('routines');
      Routine.renderList();
    });

    // Header + button — context-aware per active view
    document.getElementById('btn-new-routine')?.addEventListener('click', () => {
      if (_currentView === 'exercises') Exercises.promptCreateCustom();
      else if (_currentView === 'log')  Log.promptAddManual();
      else                              Routine.promptCreate();
    });

    // Browse pre-built programs
    document.getElementById('btn-browse-programs')?.addEventListener('click', () => {
      Programs.openBrowser();
    });

    // Rest overlay skip
    document.getElementById('rest-skip-btn')?.addEventListener('click', Timer.skipRest);
    document.getElementById('rest-add-btn')?.addEventListener('click', () => Timer.addRestTime(30));

    setupSettings();
    showView('routines');
    document.getElementById('header-title')?.classList.add('header-title-brand');
    Routine.renderList();

    // Init GitHub sync in background — auto-restores saved session
    GithubSync.init();

    // Background migration: repair stale exIds in routines (non-blocking)
    repairRoutineExercises();
  }

  // ── Export functions ──────────────────────────────────────────────────────

  function exportHistoryCSV() {
    const logs = Storage.getLogs().filter(l => l.finishedAt);
    if (!logs.length) { toast('No workout history to export'); return; }

    const rows = ['"Date","Title","Exercise","Set #","Reps","Weight","Time"'];
    for (const log of logs) {
      const date = new Date(log.startedAt).toISOString().slice(0, 10);
      for (const ex of log.exercises) {
        (ex.sets || []).forEach((set, i) => {
          if (!set.done) return;
          const mins = set.seconds ? Math.floor(set.seconds / 60) : 0;
          const secs = set.seconds ? String(set.seconds % 60).padStart(2, '0') : '00';
          const time = set.seconds ? `${mins}:${secs}` : '';
          const q = s => `"${String(s || '').replace(/"/g, '""')}"`;
          rows.push([q(date), q(log.routineName), q(ex.name), q(i + 1), q(set.reps || ''), q(set.weight || ''), q(time)].join(','));
        });
      }
    }

    _downloadText(rows.join('\n'), `lift-history-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
    toast(`Exported ${logs.length} workouts`);
  }

  function exportHistoryJSON() {
    const logs = Storage.getLogs().filter(l => l.finishedAt);
    if (!logs.length) { toast('No workout history to export'); return; }
    _downloadText(JSON.stringify(logs, null, 2), `lift-history-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
    toast(`Exported ${logs.length} workouts`);
  }

  async function showCommunityBulkExport() {
    const customMedia = Storage.getCustomMedia();
    const entries = Object.entries(customMedia).filter(([, m]) => m && (m.videoId || m.thumb));
    if (!entries.length) {
      toast('No custom media yet — add a video via ✏️ on any exercise');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const escHtml = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

    const items = await Promise.all(entries.map(async ([nameLower, media]) => {
      const dbEx = await API.findByName(nameLower).catch(() => null);
      const displayName = dbEx?.displayName || nameLower.replace(/(?:^|\s)\S/g, c => c.toUpperCase());
      const slug = API.slugify(displayName);
      const json = JSON.stringify({
        exerciseName: displayName, slug,
        videoId: media.videoId || null,
        thumbnailUrl: media.thumb || null,
        timed: false, instructions: [],
        meta: { contributor: 'your-github-username', source: media.videoId ? `https://youtu.be/${media.videoId}` : null, addedAt: today },
      }, null, 2);
      const filename = `data/community/${slug}.json`;
      const ghBase = 'https://github.com/sterlingalston/forgettable_workout_app/new/main';
      const ghParams = `?filename=${encodeURIComponent(filename)}&value=${encodeURIComponent(json)}`;
      const ghUrl = (ghBase + ghParams).length < 8000 ? ghBase + ghParams : ghBase;
      return { displayName, slug, filename, json, ghUrl };
    }));

    const slugList = items.map(it => `"${it.slug}"`).join(', ');
    const itemsHtml = items.map((item, i) => `
      <div class="community-bulk-item">
        <div class="community-bulk-name">${escHtml(item.displayName)}</div>
        <code class="community-bulk-file">${escHtml(item.filename)}</code>
        <div class="community-bulk-actions">
          <button class="btn btn-ghost btn-sm" data-bulk-copy="${i}">Copy JSON</button>
          <a href="${item.ghUrl}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">GitHub →</a>
        </div>
      </div>`).join('');

    const html = `
      <div class="modal-overlay" id="community-bulk-modal">
        <div class="modal modal-full">
          <div class="modal-header">
            <button class="modal-close" aria-label="Close">✕</button>
            <h3>Community Contributions (${items.length})</h3>
          </div>
          <div style="padding:16px;overflow-y:auto;flex:1">
            <p class="settings-hint">Click <strong>GitHub →</strong> on each exercise to open a pre-filled PR, or copy the JSON and create the file manually in your fork.</p>
            <p class="settings-hint" style="margin-bottom:16px">Add these slugs to <code>data/community/index.json</code>: <code style="word-break:break-all">${escHtml(slugList)}</code></p>
            ${itemsHtml}
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('community-bulk-modal');
    const close = () => modal.remove();
    modal.querySelector('.modal-close').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    modal.querySelectorAll('[data-bulk-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        const json = items[+btn.dataset.bulkCopy].json;
        navigator.clipboard?.writeText(json).then(() => toast('Copied!')).catch(() => {
          const el = document.createElement('textarea');
          el.value = json; document.body.appendChild(el); el.select();
          try { document.execCommand('copy'); toast('Copied!'); } catch {}
          el.remove();
        });
      });
    });
  }

  function _downloadText(text, filename, type) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  return { init, showView, toast, addExToActiveWorkout, exportHistoryCSV, exportHistoryJSON, showCommunityBulkExport };
})();

document.addEventListener('DOMContentLoaded', App.init);
