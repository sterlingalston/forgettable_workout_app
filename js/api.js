// wrkout.xyz API client — 100 req/month budget, cache everything in localStorage
// free-exercise-db for images (no quota)

const API = (() => {
  const BASE = 'https://api.wrkout.xyz';
  const FREE_DB = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main';

  // Obfuscated fallback — XOR + base64. User-supplied key in Settings takes priority.
  function _dk() {
    const _s = 'wk';
    return atob('T1wVDkMOQg5aCUBYR0ZDCEAIWlJGXkJGRlhBUhEIRVsRX05e')
      .split('').map((c,i) => String.fromCharCode(c.charCodeAt(0) ^ _s.charCodeAt(i % _s.length))).join('');
  }

  function key() { return Storage.getSettings().apiKey || _dk(); }

  function headers() {
    return { 'X-API-Key': key(), 'Content-Type': 'application/json' };
  }

  async function apiFetch(path, params = {}) {
    const url = new URL(BASE + path);
    Object.entries(params).forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach(item => url.searchParams.append(k, item));
      else url.searchParams.set(k, v);
    });
    Storage.incReqCount();
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) throw new Error(`wrkout ${res.status}: ${res.statusText}`);
    return res.json();
  }

  // ── Exercise query with cache ─────────────────────────────────────────────
  async function queryExercises(filters = {}, cursor = null) {
    const params = { limit: 25, ...filters };
    if (cursor) params.after = cursor;

    const cacheKey = btoa(JSON.stringify({ filters, cursor })).replace(/[^a-z0-9]/gi, '');
    const cached = Storage.getCached(cacheKey);
    if (cached) return cached;

    const data = await apiFetch('/exercise/query', params);
    Storage.setCached(cacheKey, data);
    return data;
  }

  async function getExercise(id) {
    const cacheKey = `ex_${id}`;
    const cached = Storage.getCached(cacheKey);
    if (cached) return cached;
    const data = await apiFetch(`/exercise/${id}`);
    Storage.setCached(cacheKey, data);
    return data;
  }

  async function searchExercises(name, cursor = null) {
    return queryExercises({ name }, cursor);
  }

  // ── free-exercise-db image lookup ─────────────────────────────────────────
  let freeDbMap = null; // name (normalized) → imageUrl

  function normalize(str) {
    return (str || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  async function loadFreeDb() {
    if (freeDbMap) return freeDbMap;

    const stored = Storage.getFreeDbMap();
    if (stored) { freeDbMap = stored; return freeDbMap; }

    try {
      const res = await fetch(`${FREE_DB}/dist/exercises.json`);
      const exercises = await res.json();
      freeDbMap = {};
      exercises.forEach(ex => {
        const key = normalize(ex.name);
        if (ex.images?.length) {
          const img = ex.images[0];
          const url = img.includes('/')
            ? `${FREE_DB}/exercises/${img}`
            : `${FREE_DB}/exercises/${ex.id}/${img}`;
          freeDbMap[key] = url;
        }
      });
      Storage.setFreeDbMap(freeDbMap);
    } catch {
      freeDbMap = {};
    }
    return freeDbMap;
  }

  async function getImageUrl(displayName) {
    const map = await loadFreeDb();
    return map[normalize(displayName)] || '';
  }

  // ── Filter option lists (cached) ──────────────────────────────────────────
  const MUSCLES = [
    'ABDOMINALS','ABDUCTORS','ADDUCTORS','BICEPS','CALVES','CHEST',
    'FOREARMS','GLUTES','HAMSTRINGS','LATS','LOWER_BACK','MIDDLE_BACK',
    'NECK','QUADRICEPS','SHOULDERS','TRAPS','TRICEPS',
  ];
  const EQUIPMENT = [
    'BODY_ONLY','BARBELL','DUMBBELL','CABLE','MACHINE','KETTLEBELLS',
    'BANDS','MEDICINE_BALL','EXERCISE_BALL','E_Z_CURL_BAR','FOAM_ROLL','OTHER',
  ];
  const CATEGORIES = [
    'STRENGTH','CARDIO','STRETCHING','PLYOMETRICS',
    'POWERLIFTING','STRONGMAN','OLYMPIC_WEIGHTLIFTING',
  ];
  const LEVELS = ['BEGINNER','INTERMEDIATE','EXPERT'];

  function fmt(s) { return s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); }

  return {
    queryExercises,
    getExercise,
    searchExercises,
    getImageUrl,
    loadFreeDb,
    MUSCLES, EQUIPMENT, CATEGORIES, LEVELS,
    fmt,
  };
})();
