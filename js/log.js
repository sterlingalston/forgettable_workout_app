// Workout history log view

const Log = (() => {
  function render() {
    const el = document.getElementById('log-list');
    if (!el) return;
    const logs = Storage.getLogs().filter(l => l.finishedAt);

    if (!logs.length) {
      el.innerHTML = `<div class="empty-state"><div class="empty-icon">📊</div><p>No workouts logged yet.</p></div>`;
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
  }

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
      const setsHtml = doneSets.length
        ? doneSets.map((s, i) => `<div class="log-set-row">Set ${i+1}: ${s.weight ?? 0}kg × ${s.reps ?? 0} reps</div>`).join('')
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
