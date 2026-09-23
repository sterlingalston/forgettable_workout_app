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

    // Merge local exercise additions
    try {
      const localRes = await fetch('data/exercises.json');
      if (localRes.ok) {
        const localRaw = await localRes.json();
        const localIds = new Set(_cache.map(e => e.id));
        const localExercises = localRaw
          .filter(ex => !localIds.has(ex.id))
          .map(ex => ({
            id:              ex.id,
            displayName:     ex.name,
            category:        (ex.category || '').toUpperCase(),
            level:           (ex.level    || '').toUpperCase(),
            mechanic:        (ex.mechanic || '').toUpperCase(),
            force:           (ex.force    || '').toUpperCase(),
            equipment:       normaliseEquipment(ex.equipment),
            primaryMuscle:   (ex.primaryMuscles   || []).map(m => m.toUpperCase().replace(/ /g, '_')),
            secondaryMuscle: (ex.secondaryMuscles  || []).map(m => m.toUpperCase().replace(/ /g, '_')),
            instructions:    ex.instructions || [],
            imageUrl:        '',
            _imageUrl:       '',
          }));
        _cache = [..._cache, ...localExercises];
      }
    } catch {}

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
      exercises: slice.map((ex, i) => ({ ...ex, cursor: String(offset + i + 1) })),
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
      exercises:    slice.map((ex, i) => ({ ...ex, cursor: String(offset + i + 1) })),
      _nextCursor:  next,
      pagination:   { total: data.length },
    };
  }

  async function getExercise(id) {
    const all = await loadAll();
    return all.find(ex => ex.id === id) || null;
  }

  async function findByName(name) {
    const all = await loadAll();
    const lower = name.toLowerCase();
    return all.find(ex => ex.displayName.toLowerCase() === lower) || null;
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
      // Try localStorage cache first (available offline after first load)
      const lsCached = Storage.getCached('fp_gifmap');
      if (lsCached) {
        _gifMap = lsCached;
      } else {
        try {
          const res = await fetch('data/fitnessprogramer-gifs.json');
          _gifMap = res.ok ? await res.json() : {};
          if (Object.keys(_gifMap).length) Storage.setCached('fp_gifmap', _gifMap);
        } catch { _gifMap = {}; }
      }
    }
    const key = exerciseName.toLowerCase();
    const norm = s => s.replace(/[\s\-_]/g, '');
    const normKey = norm(key);

    // Exact match
    if (_gifMap[key]) return _gifMap[key];
    // Normalized exact match (handles "air bike" → "airbike")
    for (const [k, v] of Object.entries(_gifMap)) {
      if (norm(k) === normKey) return v;
    }
    // Normalized partial match
    for (const [k, v] of Object.entries(_gifMap)) {
      const normK = norm(k);
      if (normK.includes(normKey) || normKey.includes(normK)) return v;
    }
    return null;
  }

  // ── YouTube video search ──────────────────────────────────────────────────
  // Requires YouTube Data API v3 key in Settings.

  const YT_CHANNELS = [
    { handle: 'NasmOrgPersonalTrainer', id: 'UCjWgUFeyDbeQ3Q_eVCup_7Q' },
    { handle: 'OnnitAcademy' },
    { handle: 'MyPTHub' },
    { handle: 'BSNTraining' },
  ];

  // Hardcoded video overrides — preferred videos for specific exercises.
  // A `null` value means "no YouTube search for this one": the channel search
  // returns wrong videos for these names, so the fitnessprogramer GIF is kept.
  const HARDCODED_VIDEOS = {
    'bodyweight walking lunge': 'tQNktxPkSeE',

    // band_knee_kick program (title/embed-verified, Sep 2026)
    'banded glute bridge':                              'NrTHNJBWl5c', // My PT Hub — Banded Glute Bridges
    'resistance band lateral walk':                     'M5uxEQH5BUM', // NASM — Lateral Band Walking
    'band side lying clam':                             'V_AnVxKPFlY', // NASM — Clamshells
    'bodyweight box squat':                             '-GaRp6_b2vk', // NASM — Box Squat
    'seated leg extension with resistance band':        'INNeoMEoX8Y', // MedBridge — Seated Knee Extension with Anchored Resistance
    'standing leg curl with resistance band':           'XpG51BuqNAE', // ODEN Fitness — Band Standing Hamstring Curl
    'wall sit':                                         'LCjvngoH-mY', // Onnit — Wall Sit
    'bodyweight standing calf raise':                   'aZh9tCFh46o', // Center For Total Back Care — PT Shows Standing Calf Raises
    'hip circles':                                      'D_kQzMB_HkY', // Sporting Health Club — standing hip circles
    'standing leg raise with resistance band':          'EXRuvztckGA', // Elite Sport & Spine — Banded Hip Flexion
    'banded standing glute kickback':                   'kK5RKh_abCE', // Funsized — Mini Band Standing Glute Kickbacks
    'banded fire hydrant':                              'k6WI1adIiHM', // Rehab My Patient — Banded Fire Hydrant
    'band seated hip external rotation':                'sT0gXVnj1xg', // Rehab My Patient — Hip External Rotation Band Sitting
    'band seated hip internal rotation':                'o0aV-kdmPsY', // Rehab My Patient — Hip Internal Rotation Band Sitting
    'banded walk':                                      '9aLcb5a7390', // NASM — Forward and Back Band Walking
    'muay thai roundhouse kick':                        'XbS2y-4mMVI', // Sean Fagan — How to throw a perfect Muay Thai kick
    'banded step-up':                                   'hvxGZBZlOxg', // Jared Hamilton — Banded step ups
    'banded split squat':                               'OSIEmB3QEZs', // StrongHER Fitness — Mini Band Split Squat
    'lateral step-up':                                  'sXW9aOo03P8', // MedBridge — Lateral Step-up
    'banded single leg glute bridge':                   'lHXShY-FivU', // NASM — Single-Leg Floor Bridge
    'standing straight leg raise with resistance band': '4qr26RNU3EQ', // Live Lean TV — Standing Banded Hip Abduction
    'reverse lunge knee lift':                          'pa3fq5cLeAA', // E3 Rehab — Reverse Lunge to Knee Drive
    'single leg calf raise':                            'qPd73snQfUs', // HSS — Single-Leg Calf Raise
    'kneeling hip flexor stretch':                      'mzPvzMivukw', // HSS — Half-Kneeling Hip Flexor Stretch

    // db_runners program (title/embed-verified, Sep 2026)
    'dumbbell goblet squat':                            'Xjo_fY9Hl9w', // Live Lean TV — Dumbbell Goblet Squat
    'dumbbell bulgarian split squat':                   'Fmjj7wFJWRE', // The Active Life — Bulgarian Split Squat with Dumbbells
    'dumbbell step-up':                                 '9ZknEYboBOQ', // Bobby Maximus — Dumbbell Step-up
    'dumbbell single leg deadlift':                     'lI8-igvsnVQ', // The Active Life — Dumbbell Single Leg RDL
    'standing calf raise with dumbbell':                'ADIDoYt_ko4', // OPEX — Dumbbell Standing Calf Raise
    'dead bug':                                         'xtTIb6dC-vI', // MedBridge — Dead Bug
    'side plank':                                       'H7H2_a4p68Y', // Pursuit PT — Side Plank
    'dumbbell romanian deadlift':                       'xAL7lHwj30E', // Onnit — Dumbbell Romanian Deadlift
    'dumbbell reverse lunge':                           'UoQcIFYTN_o', // Live Lean TV — Alternating Dumbbell Reverse Lunge
    'dumbbell lateral step up':                         'CCdqnBLIUfU', // Facet Seven — Dumbbell Lateral Step Up
    'dumbbell glute bridge':                            'cruqsnAyU6A', // PureGym — Glute Bridge With A Dumbbell
    'dumbbell row':                                     'DMo3HJoawrU', // Renaissance Periodization — Single Arm Supported Dumbbell Row
    'bird dog':                                         'ZdAHe9_HeEw', // NASM — Bird Dog
    'plank':                                            'GQE8ASRA7t0', // Release PT — Front Plank
    'dumbbell walking lunge':                           'I34ysEkPK7w', // Bobby Maximus — Dumbbell Walking Lunge
    'dumbbell push press':                              'vuaYVK8xyqo', // NASM — Dumbbell Push Press
    'dumbbell goblet curtsey lunge':                    'h-JJzoLXg7w', // Functional Bodybuilding — Dumbbell Goblet Curtsy Lunge
    'single-leg dumbbell hip thrust':                   'J3qfu-rQgus', // The Barbell Physio — Single Leg Dumbbell Hip Thrust
    'dumbbell renegade row':                            'Oh2o-WACBJk', // TWD Fitness — Renegade Rows (Beginner)
    'superman':                                         'PKQlXa3qdJo', // AskDoctorJo — Prone Superman

    // kot_knee_ability program (title/embed-verified, all <= 45 s, Sep 2026)
    'backward walking':                                 'BwaRNvSn_P0', // Synaptyx — Reverse Deadmill Walks
    'tibialis raise':                                   'VzIcGAgBiaM', // The Barefoot Sprinter — Tibialis Wall Raises
    'knees over toes calf raise':                       '6e0f2DxRNxw', // College Station PT — Knee Over Toes Calf Raise
    'atg split squat':                                  'oVGns3iOxVw', // Core Blend Training — ATG Split Squat
    'couch stretch':                                    'QB42mpL30gM', // CrossFit — Couch Stretch movement demo
    'seated calf raise':                                'uJ7QH7pExh0', // The Physio Fix — Seated Soleus Calf Raises
    'patrick step':                                     '16AjEFQADvI', // Helix Gym — Patrick Step-up (ATG)
    'seated good morning':                              'tdRGFa0SibM', // Greg Pignataro — ATG Level 1 Seated Goodmorning standard
    'elephant walk':                                    'fnih_6w_JjA', // PureGym — Elephant Walks
    'nordic hamstring curl':                            'Y4c4Rljx3Co', // Lifestyle Fitness Studio — Nordic Hamstring Curl (assisted)
    'standing hamstring stretch':                       '29jVlG6w4IU', // NHS inform — Standing hamstring stretch
    'bodyweight kneeling sissy squat':                  'gzcXksjqufI', // Boulder Athletics — Kneeling Sissy Squat
  };

  async function resolveChannelId(ch, ytKey) {
    if (ch.id) return ch.id;
    const cacheKey = 'ch_' + ch.handle;
    const cached = Storage.getCached(cacheKey);
    if (cached) return cached;
    if (!ytKey) return null;
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${ch.handle}&key=${ytKey}`);
      if (!res.ok) return null;
      const data = await res.json();
      const id = data.items?.[0]?.id || '';
      if (id) Storage.setCached(cacheKey, id);
      return id || null;
    } catch { return null; }
  }

  async function searchChannel(channelId, query, key) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&channelId=${channelId}&maxResults=5&videoDuration=short&key=${key}`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`YT API ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const ids  = (data.items || []).map(i => i.id.videoId).filter(Boolean);
    if (!ids.length) return null;
    const durations = await getVideosDuration(ids, key);
    for (const id of ids) {
      if ((durations[id] || Infinity) <= 90) return id;
    }
    return null;
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

  async function getYouTubeVideoId(exerciseName) {
    // Hardcoded overrides always win
    const key = exerciseName.toLowerCase();
    if (key in HARDCODED_VIDEOS) return HARDCODED_VIDEOS[key];

    const ytKey = Storage.getSettings().youtubeApiKey || _dyk();
    if (!ytKey) return null;

    // Check gist-backed video cache first (synced across devices)
    const gistCached = Storage.getVideoId(exerciseName);
    if (gistCached !== null) return gistCached || null;

    const cacheKey = 'yt5_' + exerciseName.toLowerCase().replace(/\s+/g, '_');
    const cached = Storage.getCached(cacheKey);
    if (cached !== null) return cached || null; // '' = confirmed no result

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
          Storage.saveVideoId(exerciseName, videoId);
          GithubSync.pushAll();
          return videoId;
        }
      }
      Storage.setCached(cacheKey, '');
      return null;
    } catch (e) {
      console.warn('YouTube search failed:', e.message);
      return null; // don't cache — transient errors should retry
    }
  }

  // ── Community exercise metadata ───────────────────────────────────────────
  // data/community/<slug>.json — contributor-provided video, thumb, instructions, timed flag

  const COMMUNITY_BASE = 'data/community';
  let _communityIndex = null; // Set of slugs that have a community file

  function _slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async function _loadCommunityIndex() {
    if (_communityIndex !== null) return _communityIndex;
    try {
      const res = await fetch(`${COMMUNITY_BASE}/index.json`);
      if (!res.ok) { _communityIndex = new Set(); return _communityIndex; }
      const data = await res.json();
      const slugs = data.slugs || [];
      const version = data.version || 1;
      // When version changes, clear all cached community exercise data
      const cachedVersion = Storage.getCached('community_version');
      if (cachedVersion !== version) {
        const cachedSlugs = Storage.getCached('community_index') || [];
        [...new Set([...cachedSlugs, ...slugs])].forEach(s =>
          Storage.clearCacheEntry('community_ex_' + s)
        );
        Storage.setCached('community_version', version);
      }
      Storage.setCached('community_index', slugs);
      _communityIndex = new Set(slugs);
    } catch {
      // Offline fallback — use localStorage cache if available
      const cached = Storage.getCached('community_index');
      _communityIndex = new Set(cached || []);
    }
    return _communityIndex;
  }

  async function getCommunityMeta(exerciseName) {
    const slug = _slugify(exerciseName);
    const index = await _loadCommunityIndex();
    if (!index.has(slug)) return null;
    const cacheKey = 'community_ex_' + slug;
    const cached = Storage.getCached(cacheKey);
    if (cached) return cached;
    try {
      const res = await fetch(`${COMMUNITY_BASE}/${slug}.json`);
      if (!res.ok) return null;
      const data = await res.json();
      Storage.setCached(cacheKey, data);
      return data;
    } catch { return null; }
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
    findByName,
    loadAll,
    getImageUrl,
    getYouTubeVideoId,
    getFitnessProgramerGif,
    getCommunityMeta,
    slugify: _slugify,
    MUSCLES, EQUIPMENT, CATEGORIES, LEVELS,
    fmt,
  };
})();
