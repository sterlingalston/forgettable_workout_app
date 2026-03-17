// All user-data persistence (routines, workout logs, settings)

const Storage = (() => {
  const KEYS = {
    routines:   'wk_routines',
    logs:       'wk_logs',
    settings:   'wk_settings',
    exCache:    'wk_ex_cache',
    exCacheIdx: 'wk_ex_cache_idx',
    freeDbMap:  'wk_freedb_map',
  };

  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }

  // ── Settings ──────────────────────────────────────────────────────────────
  const defaultSettings = {
    youtubeApiKey:   '',
    githubToken:     '',
    githubUsername:  '',
    githubGistId:    '',
    defaultSets:     3,
    defaultReps:     10,
    restSeconds:     90,
    weightUnit:      'lbs',
  };
  function getSettings() { return { ...defaultSettings, ...read(KEYS.settings, {}) }; }
  function saveSettings(s) { write(KEYS.settings, { ...getSettings(), ...s }); }

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
    window.Firebase?.pushRoutine(r);
    return r;
  }

  function updateRoutine(id, patch) {
    const list = getRoutines().map(r => r.id === id ? { ...r, ...patch } : r);
    saveRoutines(list);
    const updated = list.find(r => r.id === id);
    if (updated) window.Firebase?.pushRoutine(updated);
  }

  function deleteRoutine(id) {
    saveRoutines(getRoutines().filter(r => r.id !== id));
    window.Firebase?.removeRoutine(id);
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
    // Only push to Firestore when finished
    if (log.finishedAt) window.Firebase?.pushLog(log);
    return log;
  }

  function getLog(id) { return getLogs().find(l => l.id === id) || null; }
  function deleteLog(id) {
    saveLogs(getLogs().filter(l => l.id !== id));
    window.Firebase?.removeLog(id);
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
    getFreeDbMap, setFreeDbMap,
    getRoutines, saveRoutines, getRoutine, createRoutine, updateRoutine, deleteRoutine,
    addExerciseToRoutine, removeExFromRoutine, updateExInRoutine,
    getLogs, saveLogs, saveLog, getLog, deleteLog, createWorkoutLog,
    clearLocalUserData, clearAll, uid,
  };
})();
