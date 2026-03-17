// Firebase: Auth (Google Sign-In) + Firestore sync
// Data stored under users/{uid}/ — synced on sign-in.

const Firebase = (() => {
  const CONFIG = {
    apiKey:            "AIzaSyDH9LlHxCEUy-DLqWhrumm4OjQP7OkH37k",
    authDomain:        "forgettable-workout.firebaseapp.com",
    projectId:         "forgettable-workout",
    storageBucket:     "forgettable-workout.firebasestorage.app",
    messagingSenderId: "867581925872",
    appId:             "1:867581925872:web:a4a854974dfaa4cc722535",
  };

  let db   = null;
  let auth = null;
  let currentUser = null;

  // ── Init ──────────────────────────────────────────────────────────────────

  async function init() {
    if (!window.firebase) { console.warn('Firebase SDK not loaded'); return; }
    try {
      firebase.initializeApp(CONFIG);
    } catch {}  // already initialized
    db   = firebase.firestore();
    auth = firebase.auth();

    // Listen for auth state changes
    auth.onAuthStateChanged(async user => {
      currentUser = user;
      renderAuthUI(user);
      if (user) {
        // Push any local data first, then pull to merge
        await pushAll();
        await pullAll();
        Routine.renderList();
        Log.render();
        App.toast(`Signed in as ${user.displayName}`);
      }
    });
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  async function signInWithGoogle() {
    if (!auth) return;
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.signInWithPopup(provider);
    } catch (e) {
      App.toast('Sign-in failed: ' + e.message);
    }
  }

  async function signOut() {
    if (!auth) return;
    if (!confirm('Sign out? Your local data will be cleared.')) return;
    await auth.signOut();
    Storage.clearLocalUserData();
    currentUser = null;
    renderAuthUI(null);
    Routine.renderList();
    Log.render();
    App.toast('Signed out');
  }

  function getUser() { return currentUser; }
  function isSignedIn() { return !!currentUser; }

  // ── Firestore helpers ─────────────────────────────────────────────────────

  function col(name) {
    if (!db || !currentUser) return null;
    return db.collection('users').doc(currentUser.uid).collection(name);
  }

  // ── Push all local data → Firestore (used on first sign-in) ─────────────

  async function pushAll() {
    const c_r = col('routines');
    const c_l = col('logs');
    if (!c_r || !c_l) return;
    try {
      const routines = Storage.getRoutines();
      const logs = Storage.getLogs().filter(l => l.finishedAt);
      await Promise.all([
        ...routines.map(r => c_r.doc(r.id).set(r)),
        ...logs.map(l => c_l.doc(l.id).set(l)),
      ]);
    } catch (e) {
      console.warn('pushAll failed:', e.message);
    }
  }

  // ── Pull Firestore → localStorage ─────────────────────────────────────────

  async function pullAll() {
    if (!col('routines')) return;
    try {
      const [rSnap, lSnap] = await Promise.all([
        col('routines').get(),
        col('logs').orderBy('startedAt', 'desc').limit(200).get(),
      ]);

      if (!rSnap.empty) {
        const remote = [];
        rSnap.forEach(d => remote.push({ id: d.id, ...d.data() }));
        Storage.saveRoutines(mergeById(Storage.getRoutines(), remote));
      }

      if (!lSnap.empty) {
        const remote = [];
        lSnap.forEach(d => remote.push({ id: d.id, ...d.data() }));
        Storage.saveLogs(mergeById(Storage.getLogs(), remote));
      }
    } catch (e) {
      console.warn('Firestore pull failed:', e.message);
    }
  }

  // ── Push individual docs ──────────────────────────────────────────────────

  async function pushRoutine(routine) {
    const c = col('routines');
    if (!c) return;
    try { await c.doc(routine.id).set(routine); } catch (e) { console.warn(e); }
  }

  async function removeRoutine(id) {
    const c = col('routines');
    if (!c) return;
    try { await c.doc(id).delete(); } catch (e) { console.warn(e); }
  }

  async function pushLog(log) {
    const c = col('logs');
    if (!c) return;
    try { await c.doc(log.id).set(log); } catch (e) { console.warn(e); }
  }

  async function removeLog(id) {
    const c = col('logs');
    if (!c) return;
    try { await c.doc(id).delete(); } catch (e) { console.warn(e); }
  }

  // ── Auth UI ───────────────────────────────────────────────────────────────

  function renderAuthUI(user) {
    const container = document.getElementById('auth-section');
    if (!container) return;

    if (user) {
      container.innerHTML = `
        <div class="auth-user">
          ${user.photoURL ? `<img class="auth-avatar" src="${user.photoURL}" alt="">` : ''}
          <div class="auth-user-info">
            <div class="auth-name">${user.displayName}</div>
            <div class="auth-email">${user.email}</div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" id="btn-sync">↻ Sync Now</button>
        <button class="btn btn-ghost btn-sm" id="btn-signout">Sign Out</button>`;

      document.getElementById('btn-signout')?.addEventListener('click', signOut);
      document.getElementById('btn-sync')?.addEventListener('click', async () => {
        await pullAll();
        Routine.renderList();
        Log.render();
        App.toast('Synced from Firebase');
      });
    } else {
      container.innerHTML = `
        <p class="settings-hint">Sign in to back up and sync your workouts across devices.</p>
        <button class="btn btn-google full-w" id="btn-google-signin">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>`;

      document.getElementById('btn-google-signin')?.addEventListener('click', signInWithGoogle);
    }
  }

  // ── Merge helper ──────────────────────────────────────────────────────────

  function mergeById(local, remote) {
    const map = new Map(local.map(x => [x.id, x]));
    remote.forEach(x => map.set(x.id, x));
    return [...map.values()];
  }

  return {
    init,
    signInWithGoogle,
    signOut,
    getUser,
    isSignedIn,
    pushAll,
    pullAll,
    pushRoutine,
    removeRoutine,
    pushLog,
    removeLog,
  };
})();
