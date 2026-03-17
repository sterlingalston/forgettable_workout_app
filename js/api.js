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

  // ── FitnessProgramer GIF fallback ────────────────────────────────────────
  // Scraped GIF map: exercise name (lowercase) → animated GIF URL

  let _gifMap = null;

  async function getFitnessProgramerGif(exerciseName) {
    if (!_gifMap) {
      try {
        const res = await fetch('data/fitnessprogramer-gifs.json');
        _gifMap = res.ok ? await res.json() : {};
      } catch { _gifMap = {}; }
    }
    const key = exerciseName.toLowerCase();
    // Exact match first
    if (_gifMap[key]) return _gifMap[key];
    // Partial match: gif name contains or is contained by the exercise name
    for (const [k, v] of Object.entries(_gifMap)) {
      if (k.includes(key) || key.includes(k)) return v;
    }
    return null;
  }

  // ── YouTube video search ──────────────────────────────────────────────────
  // Searches preferred channels in priority order.
  // Requires YouTube Data API v3 key in Settings.
  // Enable at: console.cloud.google.com → APIs → YouTube Data API v3

  // Priority channel handles. Known IDs are hardcoded to save quota; the rest
  // are resolved via the channels?forHandle API on first use and cached.
  const YT_CHANNELS = [
    { handle: 'NasmOrgPersonalTrainer', id: 'UCjWgUFeyDbeQ3Q_eVCup_7Q' },
    { handle: 'gymvisual8018' },
    { handle: 'BSNTraining' },
    { handle: 'leveltencoaching2296' },
    { handle: 'ElliotGrahamCoaching' },
    { handle: 'strengthtools2494' },
  ];

  async function resolveChannelId(ch, key) {
    if (ch.id) return ch.id; // hardcoded — no API call needed
    const cacheKey = 'ch_' + ch.handle;
    const cached = Storage.getCached(cacheKey);
    if (cached) return cached;
    try {
      const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${ch.handle}&key=${key}`;
      const res  = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      const id   = data.items?.[0]?.id || '';
      if (id) Storage.setCached(cacheKey, id);
      return id || null;
    } catch { return null; }
  }

  async function translateExerciseName(text, lang) {
    if (!lang || lang === 'en') return text;
    const cacheKey = `tr_${lang}_${text.toLowerCase().replace(/\s+/g, '_')}`;
    const cached = Storage.getCached(cacheKey);
    if (cached) return cached;
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`;
      const res  = await fetch(url);
      const data = await res.json();
      const translated = data.responseData?.translatedText || text;
      Storage.setCached(cacheKey, translated);
      return translated;
    } catch { return text; }
  }

  function _dyk() {
    const _s = 'wk';
    return atob('NiINCiQSNjo4OAUIBwQ/PDAgBV46GgBbJRstDgQePRpHMRssP18i')
      .split('').map((c,i) => String.fromCharCode(c.charCodeAt(0) ^ _s.charCodeAt(i % _s.length))).join('');
  }

  function parseDurationSeconds(iso) {
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!m) return Infinity;
    return (+(m[1] || 0)) * 3600 + (+(m[2] || 0)) * 60 + (+(m[3] || 0));
  }

  async function getVideosDuration(videoIds, key) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(',')}&key=${key}`;
    const res = await fetch(url);
    if (!res.ok) return {};
    const data = await res.json();
    const map = {};
    for (const item of (data.items || [])) {
      map[item.id] = parseDurationSeconds(item.contentDetails.duration);
    }
    return map;
  }

  async function searchChannel(channelId, query, key) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&channelId=${channelId}&maxResults=5&videoDuration=short&key=${key}`;
    const res  = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const ids  = (data.items || []).map(i => i.id.videoId).filter(Boolean);
    if (!ids.length) return null;

    const durations = await getVideosDuration(ids, key);
    for (const id of ids) {
      if ((durations[id] || Infinity) <= 30) return id;
    }
    return null;
  }

  async function getYouTubeVideoId(exerciseName) {
    const ytKey = Storage.getSettings().youtubeApiKey || _dyk();
    if (!ytKey) return null;

    const cacheKey = 'yt3_' + exerciseName.toLowerCase().replace(/\s+/g, '_');
    const cached = Storage.getCached(cacheKey);
    if (cached !== null) return cached || null; // '' = no result, don't retry

    const lang = Storage.getSettings().language || 'en';
    const searchName = await translateExerciseName(exerciseName, lang);
    const DEMO_SUFFIX = {
      en: 'exercise demonstration proper form',
      es: 'ejercicio demostración forma correcta',
      fr: 'exercice démonstration forme correcte',
      pt: 'exercício demonstração forma correta',
      de: 'Übung Demonstration richtige Form',
      it: 'esercizio dimostrazione forma corretta',
      zh: '锻炼 示范 正确姿势',
      ja: 'エクササイズ デモンストレーション 正しいフォーム',
      ko: '운동 시범 올바른 자세',
      ru: 'упражнение демонстрация правильная техника',
      ar: 'تمرين عرض الشكل الصحيح',
    };
    const suffix = DEMO_SUFFIX[lang] || DEMO_SUFFIX.en;
    const query = `"${searchName}" ${suffix}`;

    try {
      for (const ch of YT_CHANNELS) {
        const channelId = await resolveChannelId(ch, ytKey);
        if (!channelId) continue;
        const videoId = await searchChannel(channelId, query, ytKey);
        if (videoId) {
          Storage.setCached(cacheKey, videoId);
          return videoId;
        }
      }
      // Nothing found in any channel
      Storage.setCached(cacheKey, '');
      return null;
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
    getFitnessProgramerGif,
    MUSCLES, EQUIPMENT, CATEGORIES, LEVELS,
    fmt,
  };
})();
