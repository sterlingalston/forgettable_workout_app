// Workout history log view

const Log = (() => {
  let _escManualLog = null;
  const escHtml = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  function render() {
    const el = document.getElementById('log-list');
    if (!el) return;
    const logs = Storage.getLogs().filter(l => l.finishedAt);

    if (!logs.length) {
      el.innerHTML = `<div class="empty-state"><div class="empty-icon">📊</div><p>No workouts logged yet.</p></div>`;
      renderCalendar([]);
      return;
    }

    el.innerHTML = logs.map(l => {
      const date = new Date(l.startedAt).toLocaleDateString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric'
      });
      const duration = l.finishedAt
        ? `${Math.round((l.finishedAt - l.startedAt) / 60000)} min`
        : '';
      const totalSets = l.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.done).length, 0);

      return `
        <div class="log-card" data-id="${l.id}">
          <div class="log-card-main">
            <div class="log-card-name">${escHtml(l.routineName)}</div>
            <div class="log-card-meta">${date} · ${duration} · ${totalSets} sets</div>
          </div>
          <button class="icon-btn log-del-btn" data-id="${l.id}" aria-label="Delete">🗑</button>
        </div>`;
    }).join('');

    el.querySelectorAll('.log-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.log-del-btn')) return;
        showDetail(card.dataset.id);
      });
    });

    el.querySelectorAll('.log-del-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if (confirm('Delete this workout log?')) {
          Storage.deleteLog(btn.dataset.id);
          GithubSync.pushAll();
          render();
        }
      });
    });

    renderCalendar(logs);
  }

  // ── Calendar ───────────────────────────────────────────────────────────────

  function renderCalendar(logs) {
    const wrap = document.getElementById('log-calendar');
    if (!wrap) return;

    // Build a map: "YYYY-MM-DD" → [{ routineName, notes }]
    const dayMap = {};
    logs.forEach(l => {
      const d = new Date(l.startedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (!dayMap[key]) dayMap[key] = [];
      dayMap[key].push({ name: l.routineName, notes: l.notes || '' });
    });

    const escAttr = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\n/g, '&#10;');

    const now = new Date();
    const year = now.getFullYear();
    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const DOW    = ['S','M','T','W','T','F','S'];
    const COLORS = [
      '#5b5ef4','#e05fa0','#34c77b','#d4a017',
      '#3fb3d4','#e07a5b','#e05252','#2e9e63',
      '#9b6cdf','#e8802a','#6b7280','#3b7dd8',
    ];

    let html = `<div class="cal-year-label">${year}</div><div class="cal-grid">`;

    for (let m = 0; m < 12; m++) {
      const firstDay = new Date(year, m, 1).getDay();
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      const color = COLORS[m];

      html += `<div class="cal-month">
        <div class="cal-month-name" style="background:${color}">${MONTHS[m]}</div>
        <div class="cal-dow-row">${DOW.map(d => `<span>${d}</span>`).join('')}</div>
        <div class="cal-days">`;

      for (let i = 0; i < firstDay; i++) html += `<span class="cal-day cal-empty"></span>`;

      for (let d = 1; d <= daysInMonth; d++) {
        const key = `${year}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const entries = dayMap[key];
        const isToday = (d === now.getDate() && m === now.getMonth());
        const hasLog  = !!entries;
        const tooltip = hasLog
          ? entries.map(e => e.name + (e.notes ? `: ${e.notes}` : '')).join('\n')
          : '';

        const cls = ['cal-day', hasLog && 'cal-has-log', isToday && 'cal-today'].filter(Boolean).join(' ');
        const style = [
          hasLog   ? `background:${color}` : '',
          isToday  ? `outline:2px solid ${color};outline-offset:-2px` : '',
        ].filter(Boolean).join(';');
        html += `<span class="${cls}"
          ${style ? `style="${style}"` : ''}
          ${hasLog ? `title="${escAttr(tooltip)}"` : ''}
          data-key="${key}">${d}</span>`;
      }

      html += `</div></div>`;
    }

    html += `</div>`;
    wrap.innerHTML = html;

    wrap.querySelectorAll('.cal-day.cal-has-log').forEach(span => {
      span.addEventListener('click', () => {
        const entries = dayMap[span.dataset.key];
        if (!entries) return;
        const text = entries.map(e => e.name + (e.notes ? `\n${e.notes}` : '')).join('\n\n');
        alert(text);
      });
    });
  }

  // ── Detail modal ───────────────────────────────────────────────────────────

  function showDetail(id) {
    const l = Storage.getLog(id);
    if (!l) return;

    const date = new Date(l.startedAt).toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const duration = l.finishedAt
      ? `${Math.round((l.finishedAt - l.startedAt) / 60000)} min`
      : 'In progress';

    const exerciseRows = l.exercises.map(ex => {
      const doneSets = ex.sets.filter(s => s.done);
      const unit = Storage.getSettings().weightUnit || 'lbs';
      const setsHtml = doneSets.length
        ? doneSets.map((s, i) => {
            if (s.seconds != null && s.reps == null) {
              const m = Math.floor(s.seconds / 60), sec = s.seconds % 60;
              const t = m > 0 ? `${m}m ${sec}s` : `${sec}s`;
              return `<div class="log-set-row">Set ${i+1}: ${t}</div>`;
            }
            return `<div class="log-set-row">Set ${i+1}: ${s.weight ?? 0} ${unit} × ${s.reps ?? 0} reps</div>`;
          }).join('')
        : '<div class="log-set-row muted">No sets logged</div>';
      return `
        <div class="log-ex-block">
          <div class="log-ex-name">${escHtml(ex.name)}</div>
          ${setsHtml}
        </div>`;
    }).join('');

    const html = `
      <div class="modal-overlay" id="log-detail-modal">
        <div class="modal modal-sheet">
          <button class="modal-close">✕</button>
          <div class="modal-body">
            <h2 class="modal-title">${escHtml(l.routineName)}</h2>
            <p class="log-detail-meta">${date} · ${duration}</p>
            ${l.notes ? `<p class="log-detail-notes">${escHtml(l.notes)}</p>` : ''}
            ${exerciseRows}
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('log-detail-modal');
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  }

  // ── Manual log entry ──────────────────────────────────────────────────────

  function _addManualExRow(container) {
    const unit = Storage.getSettings().weightUnit || 'lbs';
    const div = document.createElement('div');
    div.className = 'mlog-ex-block';
    div.innerHTML = `
      <div class="mlog-ex-header">
        <input class="input mlog-ex-name" type="text" placeholder="Exercise name" style="flex:1;min-width:0">
        <button class="icon-btn mlog-ex-del" title="Remove" style="flex-shrink:0">✕</button>
      </div>
      <div class="mlog-sets"></div>
      <button class="btn btn-ghost btn-sm mlog-add-set" style="margin-top:4px">+ Set</button>`;

    const addSet = () => {
      const row = document.createElement('div');
      row.className = 'mlog-set-row';
      row.style.cssText = 'display:flex;align-items:center;gap:6px;margin-top:6px';
      row.innerHTML = `
        <input class="input input-sm mlog-weight" type="number" min="0" step="0.5"
          placeholder="0 ${unit}" style="width:90px">
        <span style="color:var(--text-muted)">×</span>
        <input class="input input-sm mlog-reps" type="number" min="0"
          placeholder="reps" style="width:70px">`;
      div.querySelector('.mlog-sets').appendChild(row);
    };

    div.querySelector('.mlog-ex-del').addEventListener('click', () => div.remove());
    div.querySelector('.mlog-add-set').addEventListener('click', addSet);
    addSet(); // start with one set
    container.appendChild(div);
  }

  function promptAddManual() {
    const today = new Date().toISOString().split('T')[0];

    const html = `
      <div class="modal-overlay" id="manual-log-modal">
        <div class="modal modal-sheet">
          <button class="modal-close" aria-label="Close">✕</button>
          <div class="modal-body">
            <h2 class="modal-title">Log Workout</h2>

            <label class="media-edit-label">Date *</label>
            <input class="input" id="mlog-date" type="date" value="${today}">

            <label class="media-edit-label" style="margin-top:10px">Workout Name *</label>
            <input class="input" id="mlog-name" type="text" placeholder="e.g. Morning Workout">

            <label class="media-edit-label" style="margin-top:10px">Duration (minutes)</label>
            <input class="input input-sm" id="mlog-duration" type="number" min="1" placeholder="60" style="width:90px">

            <h4 class="section-label" style="margin-top:16px">Exercises</h4>
            <div id="mlog-exercises"></div>
            <button class="btn btn-ghost btn-sm" id="mlog-add-ex" style="margin-top:8px">+ Add Exercise</button>

            <label class="media-edit-label" style="margin-top:12px">Notes</label>
            <textarea class="input" id="mlog-notes" rows="2"
              placeholder="How did it feel?" style="resize:vertical"></textarea>

            <div class="media-edit-actions" style="margin-top:16px">
              <button class="btn btn-ghost btn-sm" id="mlog-cancel">Cancel</button>
              <button class="btn btn-primary btn-sm" id="mlog-save">Save Log</button>
            </div>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('manual-log-modal');
    const close = () => {
      modal.remove();
      document.removeEventListener('keydown', _escManualLog);
      _escManualLog = null;
    };

    modal.querySelector('.modal-close').addEventListener('click', close);
    modal.querySelector('#mlog-cancel').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    _escManualLog = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', _escManualLog);

    modal.querySelector('#mlog-add-ex').addEventListener('click', () => {
      _addManualExRow(modal.querySelector('#mlog-exercises'));
    });

    // Start with one exercise row
    _addManualExRow(modal.querySelector('#mlog-exercises'));

    modal.querySelector('#mlog-save').addEventListener('click', async () => {
      const name    = document.getElementById('mlog-name').value.trim();
      const dateStr = document.getElementById('mlog-date').value;
      if (!name)    { App.toast('Workout name is required'); return; }
      if (!dateStr) { App.toast('Date is required'); return; }

      // noon local time so no timezone shift
      const dateMs     = new Date(dateStr + 'T12:00:00').getTime();
      const durationMs = (parseInt(document.getElementById('mlog-duration').value) || 60) * 60000;
      const notes      = document.getElementById('mlog-notes').value.trim();

      const exercises = [];
      modal.querySelectorAll('.mlog-ex-block').forEach(block => {
        const exName = block.querySelector('.mlog-ex-name').value.trim();
        if (!exName) return;
        const sets = [];
        block.querySelectorAll('.mlog-set-row').forEach(row => {
          const weight = parseFloat(row.querySelector('.mlog-weight').value) || 0;
          const reps   = parseInt(row.querySelector('.mlog-reps').value)   || 0;
          sets.push({ weight, reps, done: true, seconds: 0 });
        });
        if (sets.length) exercises.push({ exId: null, name: exName, sets });
      });

      const log = {
        id:          Storage.uid(),
        routineId:   null,
        routineName: name,
        startedAt:   dateMs,
        finishedAt:  dateMs + durationMs,
        exercises,
        notes,
        manual:      true,
      };

      Storage.saveLog(log);
      close();
      render();

      try {
        await GithubSync.pushAll();
        App.toast('Log saved & synced');
      } catch {
        App.toast('Log saved locally');
      }
    });
  }

  return { render, promptAddManual };
})();
