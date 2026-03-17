// App shell — navigation, views, settings, toast

const App = (() => {
  const views = ['routines', 'routine-detail', 'exercises', 'workout', 'log', 'settings'];

  function showView(name) {
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

    // New routine button in header (custom)
    document.getElementById('btn-new-routine')?.addEventListener('click', () => {
      Routine.promptCreate();
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
  }

  return { init, showView, toast, addExToActiveWorkout };
})();

document.addEventListener('DOMContentLoaded', App.init);
