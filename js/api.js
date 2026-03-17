// Exercise data — free-exercise-db (primary, no CORS issues, no API key)
// https://github.com/yuhonas/free-exercise-db — Unlicense / public domain
// wrkout.xyz removed: their API does not allow browser (cross-origin) requests.

const API = (() => {
  const RAW = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main';

  let _cache = null; // full dataset, in-memory after first load

  // ── Load full dataset once ─────────────────────────────────────────────────

  async function loadAll() {
    if (_cache) return _cache;

    // Try localStorage cache first
    const stored = Storage.getCached('freedb_all');
    if (stored) { _cache = stored; return _cache; }

    const res = await fetch(`${RAW}/dist/exercises.json`);
    if (!res.ok) throw new Error(`Failed to load exercise database (${res.status})`);
    const raw = await res.json();

    // Normalise to a consistent schema
    _cache = raw.map(ex => ({
      id:             ex.id,
      displayName:    ex.name,
      category:       (ex.category || '').toUpperCase(),
      level:          (ex.level    || '').toUpperCase(),
      mechanic:       (ex.mechanic || '').toUpperCase(),
      force:          (ex.force    || '').toUpperCase(),
      equipment:      normaliseEquipment(ex.equipment),
      primaryMuscle:  (ex.primaryMuscles  || []).map(m => m.toUpperCase().replace(/ /g, '_')),
      secondaryMuscle:(ex.secondaryMuscles|| []).map(m => m.toUpperCase().replace(/ /g, '_')),
      instructions:   ex.instructions || [],
      imageUrl:       imgUrl(ex),
      _imageUrl:      imgUrl(ex),
    }));

    Storage.setCached('freedb_all', _cache);
    return _cache;
  }

  function imgUrl(ex) {
    if (!ex.images?.length) return '';
    const img = ex.images[0];
    return img.includes('/')
      ? `${RAW}/exercises/${img}`
      : `${RAW}/exercises/${ex.id}/${img}`;
  }

  function normaliseEquipment(eq) {
    if (!eq) return 'OTHER';
    return eq.toUpperCase()
      .replace(/ /g, '_')
      .replace('BODY_WEIGHT', 'BODY_ONLY')
      .replace('BODY ONLY',   'BODY_ONLY')
      .replace('E-Z_CURL_BAR','E_Z_CURL_BAR')
      .replace('MEDICINE_BALL','MEDICINE_BALL');
  }

  // ── Filtered + paginated (all client-side) ────────────────────────────────

  async function queryExercises(filters = {}, cursor = null) {
    const all = await loadAll();
    let data = applyFilters(all, filters);
    const PAGE = 24;
    const offset = cursor ? parseInt(cursor, 10) : 0;
    const slice  = data.slice(offset, offset + PAGE);
    const next   = offset + PAGE < data.length ? String(offset + PAGE) : null;
    return {
      exercises: slice.map(ex => ({ ...ex, cursor: String(offset + slice.indexOf(ex) + 1) })),
      pagination: { total: data.length },
      _nextCursor: next,
    };
  }

  function applyFilters(data, filters) {
    return data.filter(ex => {
      if (filters.category     && ex.category    !== filters.category)    return false;
      if (filters.level        && ex.level        !== filters.level)        return false;
      if (filters.mechanic     && ex.mechanic     !== filters.mechanic)     return false;
      if (filters.force        && ex.force        !== filters.force)        return false;
      if (filters.equipment    && ex.equipment    !== filters.equipment)    return false;
      if (filters.primaryMuscle && !ex.primaryMuscle.includes(filters.primaryMuscle)) return false;
      return true;
    });
  }

  async function searchExercises(query, cursor = null) {
    const all  = await loadAll();
    const q    = query.toLowerCase();
    const data = all.filter(ex =>
      ex.displayName.toLowerCase().includes(q) ||
      ex.primaryMuscle.some(m => m.toLowerCase().includes(q)) ||
      ex.equipment.toLowerCase().includes(q) ||
      ex.category.toLowerCase().includes(q)
    );
    const PAGE   = 24;
    const offset = cursor ? parseInt(cursor, 10) : 0;
    const slice  = data.slice(offset, offset + PAGE);
    const next   = offset + PAGE < data.length ? String(offset + PAGE) : null;
    return {
      exercises:    slice.map(ex => ({ ...ex, cursor: String(offset + slice.indexOf(ex) + 1) })),
      _nextCursor:  next,
      pagination:   { total: data.length },
    };
  }

  async function getExercise(id) {
    const all = await loadAll();
    return all.find(ex => ex.id === id) || null;
  }

  // Kept for backward compat — images are already on each exercise object
  async function getImageUrl(displayName) {
    const all = await loadAll();
    const ex  = all.find(e => e.displayName.toLowerCase() === displayName.toLowerCase());
    return ex?.imageUrl || '';
  }

  // ── YouTube video search ──────────────────────────────────────────────────
  // Uses YouTube Data API v3. Enable it at:
  // console.cloud.google.com → APIs → YouTube Data API v3 → Enable
  // Then create a browser API key (restrict to your GitHub Pages domain).

  async function getYouTubeVideoId(exerciseName) {
    const ytKey = Storage.getSettings().youtubeApiKey;
    if (!ytKey) return null;

    const cacheKey = 'yt_' + exerciseName.toLowerCase().replace(/\s+/g, '_');
    const cached = Storage.getCached(cacheKey);
    if (cached !== null) return cached; // may be '' if no result found

    try {
      const q = encodeURIComponent(`${exerciseName} exercise demonstration proper form`);
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&type=video&videoDuration=short&maxResults=1&key=${ytKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const videoId = data.items?.[0]?.id?.videoId || '';
      Storage.setCached(cacheKey, videoId); // cache even empty results
      return videoId;
    } catch (e) {
      console.warn('YouTube search failed:', e.message);
      return null;
    }
  }

  // ── Static filter lists ───────────────────────────────────────────────────

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

  function fmt(s) {
    return (s || '').replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  return {
    queryExercises,
    searchExercises,
    getExercise,
    getImageUrl,
    getYouTubeVideoId,
    MUSCLES, EQUIPMENT, CATEGORIES, LEVELS,
    fmt,
  };
})();
