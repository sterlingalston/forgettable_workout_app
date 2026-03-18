// GitHub Gist sync — username + GitHub Personal Access Token (gist scope)
// Data stored in a private gist as workout-data.json.
// Same token on any device restores all routines and workout history.

const GithubSync = (() => {
  const GIST_FILE = 'workout-data.json';
  const GH = 'https://api.github.com';

  let _token    = null;
  let _username = null;
  let _gistId   = null;

  function isSignedIn() { return !!_token; }
  function getUser()    { return _username; }

  function _headers() {
    return {
      Authorization: `Bearer ${_token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    };
  }

  // ── Sign in ───────────────────────────────────────────────────────────────

  async function signIn(username, token) {
    const res = await fetch(`${GH}/user`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) throw new Error('Invalid credentials');
    _token    = token;
    _username = username;
    await _findOrCreateGist();
    // Save credentials only after gist is confirmed to exist
    Storage.saveSettings({ githubToken: token, githubUsername: username, githubGistId: _gistId });
    await pullAll();
    Routine.renderList();
    Log.render();
    renderAuthUI(true);
    App.toast(`Signed in as ${username}`);
  }

  // ── Sign out ──────────────────────────────────────────────────────────────

  async function signOut() {
    if (!confirm('Sign out? Your local data will be cleared.')) return;
    Storage.saveSettings({ githubToken: '', githubUsername: '', githubGistId: '' });
    Storage.clearLocalUserData();
    _token = _username = _gistId = null;
    renderAuthUI(false);
    Routine.renderList();
    Log.render();
    App.toast('Signed out');
  }

  // ── Gist helpers ──────────────────────────────────────────────────────────

  async function _findOrCreateGist() {
    // Walk pages of gists to find one with our filename
    for (let page = 1; page <= 5; page++) {
      const res = await fetch(`${GH}/gists?per_page=100&page=${page}`, { headers: _headers() });
      if (!res.ok) break;
      const list = await res.json();
      const found = list.find(g => g.files[GIST_FILE]);
      if (found) { _gistId = found.id; return; }
      if (list.length < 100) break;
    }
    // Not found — create a new private gist
    const payload = _buildPayload();
    const res = await fetch(`${GH}/gists`, {
      method: 'POST',
      headers: _headers(),
      body: JSON.stringify({
        description: 'Workout data',
        public: false,
        files: { [GIST_FILE]: { content: JSON.stringify(payload, null, 2) } },
      }),
    });
    if (!res.ok) throw new Error('Failed to create gist');
    const gist = await res.json();
    if (!gist.id) throw new Error('Gist creation returned no ID');
    _gistId = gist.id;
  }

  function _buildPayload() {
    // Strip device-local auth credentials — never store them in the gist
    const { githubToken, githubUsername, githubGistId, ...settings } = Storage.getSettings();
    return {
      routines:   Storage.getRoutines(),
      logs:       Storage.getLogs().filter(l => l.finishedAt),
      settings,
      videoCache: Storage.getVideoCache(),
      updatedAt:  Date.now(),
    };
  }

  function _mergeById(local, remote) {
    const map = new Map(local.map(x => [x.id, x]));
    remote.forEach(x => map.set(x.id, x));
    return [...map.values()];
  }

  // ── Push / Pull ───────────────────────────────────────────────────────────

  const PENDING_KEY = 'gh_sync_pending';

  async function pushAll() {
    if (!_token || !_gistId) return;
    if (!navigator.onLine) {
      // Queue for when we're back online
      localStorage.setItem(PENDING_KEY, '1');
      console.log('Offline — sync queued');
      return;
    }
    try {
      await fetch(`${GH}/gists/${_gistId}`, {
        method: 'PATCH',
        headers: _headers(),
        body: JSON.stringify({ files: { [GIST_FILE]: { content: JSON.stringify(_buildPayload(), null, 2) } } }),
      });
      localStorage.removeItem(PENDING_KEY);
    } catch (e) {
      localStorage.setItem(PENDING_KEY, '1');
      console.warn('Gist push failed:', e.message);
    }
  }

  async function pullAll() {
    if (!_token || !_gistId) return;
    try {
      const res = await fetch(`${GH}/gists/${_gistId}`, { headers: _headers() });
      if (!res.ok) return;
      const gist  = await res.json();
      const raw   = gist.files[GIST_FILE]?.content;
      if (!raw) return;
      const data  = JSON.parse(raw);
      if (data.routines?.length) Storage.saveRoutines(_mergeById(Storage.getRoutines(), data.routines));
      if (data.logs?.length)     Storage.saveLogs(_mergeById(Storage.getLogs(), data.logs));
      if (data.settings) {
        const { githubToken, githubUsername, githubGistId, ...remote } = data.settings;
        Storage.saveSettings(remote);
      }
      if (data.videoCache) Storage.mergeVideoCache(data.videoCache);
    } catch (e) { console.warn('Gist pull failed:', e.message); }
  }

  // Individual helpers called by workout/routine/log — all delegate to pushAll
  async function pushLog(log)      { await pushAll(); }
  async function removeLog(id)     { await pushAll(); }
  async function pushRoutine(r)    { await pushAll(); }
  async function removeRoutine(id) { await pushAll(); }

  // ── Auth UI ───────────────────────────────────────────────────────────────

  function renderAuthUI(signedIn) {
    const container = document.getElementById('auth-section');
    if (!container) return;

    if (signedIn) {
      container.innerHTML = `
        <div class="auth-user">
          <div class="auth-name">${_username}</div>
        </div>
        <div class="auth-actions">
          <button class="btn btn-ghost btn-sm" id="btn-sync">↻ Sync</button>
          <button class="btn btn-ghost btn-sm" id="btn-signout">Sign Out</button>
        </div>`;
      document.getElementById('btn-signout')?.addEventListener('click', signOut);
      document.getElementById('btn-sync')?.addEventListener('click', async () => {
        await pushAll();
        await pullAll();
        Routine.renderList();
        Log.render();
        App.toast('Synced');
      });
    } else {
      container.innerHTML = `
        <p class="settings-hint">Sign in to back up and sync your workouts across devices.</p>
        <div class="auth-form">
          <input id="auth-username" class="input" type="text" placeholder="Username" autocomplete="username">
          <input id="auth-password" class="input" type="password" placeholder="Password" autocomplete="current-password">
          <button class="btn btn-primary full-w" id="btn-signin">Sign In</button>
        </div>
        <p class="settings-hint" style="margin-top:8px">
          Password = a GitHub Personal Access Token with <strong>gist</strong> scope.<br>
          <a href="https://github.com/settings/tokens/new?scopes=gist&description=Workout+App" target="_blank" rel="noopener">Generate one here</a> — free, no billing required.
        </p>`;
      document.getElementById('btn-signin')?.addEventListener('click', async () => {
        const u   = document.getElementById('auth-username').value.trim();
        const p   = document.getElementById('auth-password').value.trim();
        if (!u || !p) return App.toast('Enter username and password');
        const btn = document.getElementById('btn-signin');
        btn.disabled    = true;
        btn.textContent = 'Signing in…';
        try {
          await signIn(u, p);
        } catch (e) {
          App.toast('Sign in failed: ' + e.message);
          btn.disabled    = false;
          btn.textContent = 'Sign In';
        }
      });
    }
  }

  // ── Init (auto-restore saved session) ────────────────────────────────────

  async function init() {
    // When coming back online, flush any queued sync
    window.addEventListener('online', async () => {
      if (localStorage.getItem(PENDING_KEY) && _token && _gistId) {
        console.log('Back online — flushing queued sync');
        await pushAll();
      }
    });

    const s = Storage.getSettings();
    if (s.githubToken && s.githubUsername) {
      _token    = s.githubToken;
      _username = s.githubUsername;
      _gistId   = s.githubGistId || null;
      try {
        if (!_gistId) await _findOrCreateGist();
        Storage.saveSettings({ githubGistId: _gistId });
        await pullAll();
        Routine.renderList();
        Log.render();
        renderAuthUI(true);
      } catch (e) {
        console.warn('Auto sign-in failed:', e.message);
        renderAuthUI(false);
      }
    } else {
      renderAuthUI(false);
    }
  }

  return {
    init, signIn, signOut,
    getUser, isSignedIn,
    pushAll, pullAll,
    pushLog, removeLog,
    pushRoutine, removeRoutine,
  };
})();
