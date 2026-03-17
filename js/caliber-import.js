// Caliber CSV importer
// Format: "Date","Title","Exercise","Set #","Reps","Weight","Time"

const CaliberImport = (() => {

  function parseCSV(text) {
    const lines = text.trim().split('\n');
    const header = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    return lines.slice(1).map(line => {
      // Handle commas inside quoted fields
      const cols = [];
      let cur = ''; let inQ = false;
      for (const ch of line) {
        if (ch === '"') { inQ = !inQ; }
        else if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = ''; }
        else cur += ch;
      }
      cols.push(cur.trim());
      const row = {};
      header.forEach((h, i) => row[h] = cols[i] || '');
      return row;
    }).filter(r => r.Date && r.Title && r.Exercise);
  }

  function importData(csvText) {
    const rows = parseCSV(csvText);
    if (!rows.length) { App.toast('No data found in CSV'); return { routines: 0, logs: 0 }; }

    // Group by date + title = one workout session
    const sessions = new Map();
    rows.forEach(row => {
      const key = `${row.Date}|${row.Title}`;
      if (!sessions.has(key)) sessions.set(key, []);
      sessions.get(key).push(row);
    });

    // Build existing routine name map to avoid duplicates
    const existingRoutineNames = new Set(Storage.getRoutines().map(r => r.name));
    let newRoutines = 0;
    let newLogs = 0;

    sessions.forEach((rows, key) => {
      const [dateStr, title] = key.split('|');

      // Create routine if new
      if (!existingRoutineNames.has(title)) {
        Storage.createRoutine(title);
        existingRoutineNames.add(title);
        newRoutines++;
      }

      const routine = Storage.getRoutines().find(r => r.name === title);

      // Build exercise groups: exercise name → sets[]
      const exMap = new Map();
      rows.forEach(row => {
        if (!exMap.has(row.Exercise)) exMap.set(row.Exercise, []);
        exMap.get(row.Exercise).push(row);
      });

      // Build workout log
      const dateParts = dateStr.split('-');
      const startedAt = new Date(dateStr).getTime() || Date.now();

      const log = {
        id: Storage.uid(),
        routineId: routine?.id || '',
        routineName: title,
        startedAt,
        finishedAt: startedAt + 60 * 60 * 1000, // assume 1hr
        importedFromCaliber: true,
        exercises: [],
      };

      exMap.forEach((setRows, exName) => {
        const sets = setRows.map(r => ({
          weight: parseFloat(r.Weight) || 0,
          reps:   parseInt(r.Reps) || 0,
          done:   true,
          seconds: r.Time ? parseTime(r.Time) : undefined,
        }));

        log.exercises.push({
          exId:       slugify(exName),
          name:       exName,
          targetSets: sets.length,
          targetReps: sets[0]?.reps || 10,
          restSeconds: 90,
          timed:      sets.some(s => s.seconds),
          sets,
        });
      });

      // Skip if already imported (same date + title)
      const exists = Storage.getLogs().some(
        l => l.routineName === title && l.startedAt === startedAt
      );
      if (!exists) {
        Storage.saveLog(log);
        newLogs++;
      }
    });

    return { routines: newRoutines, logs: newLogs };
  }

  function parseTime(t) {
    // "MM:SS" or "H:MM:SS"
    if (!t) return undefined;
    const parts = t.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return undefined;
  }

  function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  // ── UI trigger (called from settings) ────────────────────────────────────

  function openImportDialog() {
    const html = `
      <div class="modal-overlay" id="import-modal">
        <div class="modal modal-sheet">
          <button class="modal-close">✕</button>
          <div class="modal-body">
            <h2 class="modal-title">Import Caliber Data</h2>
            <p class="settings-hint" style="margin-bottom:16px">
              Export from Caliber app → Me → Settings → Export Data.<br>
              Select the <strong>strength_workouts.csv</strong> file.
            </p>
            <input type="file" id="caliber-file-input" accept=".csv" class="file-input">
            <label for="caliber-file-input" class="btn btn-ghost full-w" style="margin-top:8px;cursor:pointer">
              📂 Choose CSV file
            </label>
            <div id="import-preview" style="margin-top:12px"></div>
            <button class="btn btn-primary full-w hidden" id="import-confirm-btn" style="margin-top:8px">
              Import
            </button>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('import-modal');
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

    let csvText = null;

    document.getElementById('caliber-file-input').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        csvText = ev.target.result;
        const rows = parseCSV(csvText);
        const sessions = new Set(rows.map(r => `${r.Date}|${r.Title}`));
        const exercises = new Set(rows.map(r => r.Exercise));

        document.getElementById('import-preview').innerHTML = `
          <div class="import-summary">
            <div class="import-stat"><span class="import-num">${sessions.size}</span><span>workouts</span></div>
            <div class="import-stat"><span class="import-num">${exercises.size}</span><span>exercises</span></div>
            <div class="import-stat"><span class="import-num">${rows.length}</span><span>sets</span></div>
          </div>`;

        document.getElementById('import-confirm-btn').classList.remove('hidden');
      };
      reader.readAsText(file);
    });

    document.getElementById('import-confirm-btn').addEventListener('click', () => {
      if (!csvText) return;
      const { routines, logs } = importData(csvText);
      modal.remove();
      Routine.renderList();
      Log.render();
      App.toast(`Imported ${logs} workouts, ${routines} new routines`);
    });
  }

  return { openImportDialog, importData, parseCSV };
})();
