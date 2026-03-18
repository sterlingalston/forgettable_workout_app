// All user-data persistence (routines, workout logs, settings)

const Storage = (() => {
  const KEYS = {
    routines:    'wk_routines',
    logs:        'wk_logs',
    settings:    'wk_settings',
    exCache:     'wk_ex_cache',
    exCacheIdx:  'wk_ex_cache_idx',
    freeDbMap:   'wk_freedb_map',
    videoCache:  'wk_video_cache',
    customMedia: 'wk_custom_media',
  };
  // Auth lives in its own key — saveSettings() NEVER touches this key.
  // The only way to clear it is clearAuth() (explicit sign-out).
  const AUTH_KEY = 'wk_auth';
  const AUTH_FIELDS = ['githubToken', 'githubUsername', 'githubGistId'];

  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }

  // ── One-time migration: move auth out of wk_settings → wk_auth ───────────
  (function _migrateAuth() {
    if (localStorage.getItem(AUTH_KEY) !== null) return; // already migrated
    const old = read(KEYS.settings, {});
    const auth = {};
    for (const k of AUTH_FIELDS) { if (old[k]) auth[k] = old[k]; }
    write(AUTH_KEY, auth);
    // Strip auth fields from the settings blob
    const { githubToken, githubUsername, githubGistId, ...rest } = old;
    write(KEYS.settings, rest);
  })();

  // ── Settings ──────────────────────────────────────────────────────────────
  const defaultSettings = {
    youtubeApiKey:   '',
    language:        'en',
    defaultSets:     3,
    defaultReps:     10,
    restSeconds:     90,
    weightUnit:      'lbs',
  };

  // Returns merged view: non-auth settings + auth credentials
  function getSettings() {
    return {
      ...defaultSettings,
      ...read(KEYS.settings, {}),
      ...read(AUTH_KEY, {}),         // auth always wins
    };
  }

  // saveSettings() NEVER writes auth fields — they go through saveAuth() only.
  function saveSettings(s) {
    const authPatch = {};
    const settingsPatch = {};
    for (const [k, v] of Object.entries(s)) {
      if (AUTH_FIELDS.includes(k)) {
        if (v) authPatch[k] = v;      // non-blank auth → dedicated key
      } else {
        settingsPatch[k] = v;
      }
    }
    // Non-auth settings: merge into wk_settings
    write(KEYS.settings, { ...read(KEYS.settings, {}), ...settingsPatch });
    // Auth: merge into wk_auth (only when caller provides real values)
    if (Object.keys(authPatch).length) {
      write(AUTH_KEY, { ...read(AUTH_KEY, {}), ...authPatch });
    }
  }

  function clearAuth() {
    write(AUTH_KEY, { githubToken: '', githubUsername: '', githubGistId: '' });
  }

  // ── Exercise cache ────────────────────────────────────────────────────────
  // Index: { [cacheKey]: true }  — lets us know what's cached without loading all data
  function getCacheIndex() { return read(KEYS.exCacheIdx, {}); }
  function setCached(cacheKey, data) {
    const idx = getCacheIndex();
    idx[cacheKey] = true;
    write(KEYS.exCacheIdx, idx);
    write(`${KEYS.exCache}_${cacheKey}`, data);
  }
  function getCached(cacheKey) {
    if (!getCacheIndex()[cacheKey]) return null;
    return read(`${KEYS.exCache}_${cacheKey}`, null);
  }
  function clearExCache() {
    const idx = getCacheIndex();
    Object.keys(idx).forEach(k => localStorage.removeItem(`${KEYS.exCache}_${k}`));
    localStorage.removeItem(KEYS.exCacheIdx);
    localStorage.removeItem(KEYS.freeDbMap);
  }

  // ── Video cache (exercise name → YouTube videoId) ─────────────────────────
  // Persisted in the gist so discoveries sync across devices
  function getVideoCache()          { return read(KEYS.videoCache, {}); }
  function setVideoCache(map)       { write(KEYS.videoCache, map); }
  function saveVideoId(name, id)    { const m = getVideoCache(); m[name.toLowerCase()] = id; setVideoCache(m); }
  function getVideoId(name)         { return getVideoCache()[name.toLowerCase()] ?? null; }
  // Remote wins so discoveries from any device propagate everywhere
  function mergeVideoCache(remote)  { setVideoCache({ ...getVideoCache(), ...remote }); }

  // ── Custom media overrides (user-set video/thumbnail per exercise) ─────────
  // { "exercise name": { videoId: "...", thumb: "..." } }
  function getCustomMedia()            { return read(KEYS.customMedia, {}); }
  function saveCustomMedia(name, data) { const m = getCustomMedia(); m[name.toLowerCase()] = data; write(KEYS.customMedia, m); }
  function getCustomMediaFor(name)     { return getCustomMedia()[name.toLowerCase()] || null; }
  function mergeCustomMedia(remote)    { write(KEYS.customMedia, { ...getCustomMedia(), ...remote }); } // remote wins

  // ── free-exercise-db name→images map ─────────────────────────────────────
  function getFreeDbMap() { return read(KEYS.freeDbMap, null); }
  function setFreeDbMap(map) { write(KEYS.freeDbMap, map); }

  // ── Routines ──────────────────────────────────────────────────────────────
  function getRoutines() { return read(KEYS.routines, []); }
  function saveRoutines(list) { write(KEYS.routines, list); }

  function getRoutine(id) { return getRoutines().find(r => r.id === id) || null; }

  function createRoutine(name) {
    const r = { id: uid(), name, notes: '', exercises: [], createdAt: Date.now() };
    const list = getRoutines();
    list.push(r);
    saveRoutines(list);
    return r;
  }

  function updateRoutine(id, patch) {
    const list = getRoutines().map(r => r.id === id ? { ...r, ...patch } : r);
    saveRoutines(list);
  }

  function deleteRoutine(id) {
    saveRoutines(getRoutines().filter(r => r.id !== id));
  }

  // exercises inside routine: { exId, name, sets, reps, restSeconds, timed }
  function addExerciseToRoutine(routineId, exObj) {
    const r = getRoutine(routineId);
    if (!r) return;
    r.exercises.push({
      exId: exObj.id,
      name: exObj.displayName || exObj.name,
      sets: exObj.sets || getSettings().defaultSets,
      reps: exObj.reps || getSettings().defaultReps,
      restSeconds: exObj.restSeconds || getSettings().restSeconds,
      timed: exObj.timed || false,
    });
    updateRoutine(routineId, { exercises: r.exercises });
  }

  function removeExFromRoutine(routineId, index) {
    const r = getRoutine(routineId);
    if (!r) return;
    r.exercises.splice(index, 1);
    updateRoutine(routineId, { exercises: r.exercises });
  }

  function updateExInRoutine(routineId, index, patch) {
    const r = getRoutine(routineId);
    if (!r) return;
    r.exercises[index] = { ...r.exercises[index], ...patch };
    updateRoutine(routineId, { exercises: r.exercises });
  }

  // ── Workout logs ──────────────────────────────────────────────────────────
  function getLogs() { return read(KEYS.logs, []); }
  function saveLogs(list) { write(KEYS.logs, list); }

  function saveLog(log) {
    const logs = getLogs();
    const idx = logs.findIndex(l => l.id === log.id);
    if (idx >= 0) logs[idx] = log;
    else logs.unshift(log);
    saveLogs(logs);
    return log;
  }

  function getLog(id) { return getLogs().find(l => l.id === id) || null; }
  function deleteLog(id) {
    saveLogs(getLogs().filter(l => l.id !== id));
  }

  function createWorkoutLog(routineId, routineName) {
    return {
      id: uid(),
      routineId,
      routineName,
      startedAt: Date.now(),
      finishedAt: null,
      exercises: [], // [{exId, name, sets:[{weight,reps,done,seconds}]}]
    };
  }

  // ── Utils ─────────────────────────────────────────────────────────────────
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // Clears only user data (routines, logs) — keeps exercise cache + settings
  function clearLocalUserData() {
    localStorage.removeItem(KEYS.routines);
    localStorage.removeItem(KEYS.logs);
  }

  function clearAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    Object.keys(localStorage)
      .filter(k => k.startsWith('wk_'))
      .forEach(k => localStorage.removeItem(k));
  }

  return {
    getSettings, saveSettings,
    getCached, setCached, clearExCache,
    getVideoCache, setVideoCache, saveVideoId, getVideoId, mergeVideoCache,
    clearAuth,
    getCustomMedia, saveCustomMedia, getCustomMediaFor, mergeCustomMedia,
    getFreeDbMap, setFreeDbMap,
    getRoutines, saveRoutines, getRoutine, createRoutine, updateRoutine, deleteRoutine,
    addExerciseToRoutine, removeExFromRoutine, updateExInRoutine,
    getLogs, saveLogs, saveLog, getLog, deleteLog, createWorkoutLog,
    clearLocalUserData, clearAll, uid,
  };
})();
