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
      routines: 'Routines',
      exercises: 'Exercises',
      workout: 'Workout',
      log: 'History',
      settings: 'Settings',
    };
    const titleEl = document.getElementById('header-title');
    if (titleEl && titles[name]) titleEl.textContent = titles[name];
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

    document.getElementById('set-api-key').value  = s.apiKey;
    document.getElementById('set-yt-key').value    = s.youtubeApiKey;
    document.getElementById('set-formspree').value = s.formspreeId;
    document.getElementById('set-def-sets').value  = s.defaultSets;
    document.getElementById('set-def-reps').value  = s.defaultReps;
    document.getElementById('set-rest').value      = s.restSeconds;
    document.getElementById('req-count').textContent = Storage.getReqCount();
  }

  function setupSettings() {
    document.getElementById('settings-form')?.addEventListener('submit', e => {
      e.preventDefault();
      Storage.saveSettings({
        apiKey:        document.getElementById('set-api-key').value.trim(),
        youtubeApiKey: document.getElementById('set-yt-key').value.trim(),
        formspreeId:   document.getElementById('set-formspree').value.trim(),
        defaultSets: +document.getElementById('set-def-sets').value,
        defaultReps: +document.getElementById('set-def-reps').value,
        restSeconds: +document.getElementById('set-rest').value,
      });
      toast('Settings saved');
    });

    document.getElementById('btn-clear-ex-cache')?.addEventListener('click', () => {
      Storage.clearExCache();
      Storage.resetReqCount();
      document.getElementById('req-count').textContent = 0;
      toast('Exercise cache cleared');
    });

    document.getElementById('btn-clear-local')?.addEventListener('click', async () => {
      if (!confirm('Clear local data and reload from Firebase?\nYou must be signed in.')) return;
      Storage.clearLocalUserData();
      if (Firebase.isSignedIn()) {
        await Firebase.pullAll();
        Routine.renderList();
        Log.render();
        toast('Reloaded from Firebase');
      } else {
        toast('Cleared — sign in to reload from Firebase');
      }
    });

    document.getElementById('btn-clear-all')?.addEventListener('click', () => {
      if (!confirm('Delete ALL data (local + Firebase)? This cannot be undone.')) return;
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

  // ── API key prompt (first run) ────────────────────────────────────────────

  function promptApiKeyIfMissing() {
    if (Storage.getSettings().apiKey) return;
    const html = `
      <div class="modal-overlay" id="apikey-modal">
        <div class="modal modal-sheet">
          <div class="modal-body">
            <h2 class="modal-title">Enter wrkout.xyz API Key</h2>
            <p class="settings-hint" style="margin-bottom:16px">
              Required to browse exercises. Your key is stored only in this browser — never in code or git.
            </p>
            <input id="apikey-input" class="input" type="text"
                   placeholder="Paste your API key here" autocomplete="off" spellcheck="false">
            <button class="btn btn-primary full-w" id="apikey-save" style="margin-top:12px">Save</button>
            <button class="btn btn-ghost full-w" id="apikey-skip" style="margin-top:8px">Skip for now</button>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', html);

    const save = () => {
      const key = document.getElementById('apikey-input').value.trim();
      if (!key) return;
      Storage.saveSettings({ apiKey: key });
      document.getElementById('apikey-modal').remove();
    };
    document.getElementById('apikey-save').addEventListener('click', save);
    document.getElementById('apikey-input').addEventListener('keydown', e => { if (e.key === 'Enter') save(); });
    document.getElementById('apikey-skip').addEventListener('click', () => {
      document.getElementById('apikey-modal').remove();
    });
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
    Routine.renderList();
    promptApiKeyIfMissing();

    // Init Firebase in background — pulls data when auth state resolves
    Firebase.init();
  }

  return { init, showView, toast, addExToActiveWorkout };
})();

document.addEventListener('DOMContentLoaded', App.init);
