// Workout history log view

const Log = (() => {
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
            <div class="log-card-name">${l.routineName}</div>
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
        ? doneSets.map((s, i) => `<div class="log-set-row">Set ${i+1}: ${s.weight ?? 0} ${unit} × ${s.reps ?? 0} reps</div>`).join('')
        : '<div class="log-set-row muted">No sets logged</div>';
      return `
        <div class="log-ex-block">
          <div class="log-ex-name">${ex.name}</div>
          ${setsHtml}
        </div>`;
    }).join('');

    const html = `
      <div class="modal-overlay" id="log-detail-modal">
        <div class="modal modal-sheet">
          <button class="modal-close">✕</button>
          <div class="modal-body">
            <h2 class="modal-title">${l.routineName}</h2>
            <p class="log-detail-meta">${date} · ${duration}</p>
            ${l.notes ? `<p class="log-detail-notes">${l.notes}</p>` : ''}
            ${exerciseRows}
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('log-detail-modal');
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  }

  return { render };
})();
