// Pre-built workout programs — static, no API needed.
// Each program has an `equipment` array listing what's required.
// The UI filters by what the user says they have available.

const Programs = (() => {

  // ── Equipment catalog ────────────────────────────────────────────────────

  const EQUIPMENT_OPTIONS = [
    { id: 'bodyweight',    label: 'Bodyweight only', icon: '🙆' },
    { id: 'dumbbell',      label: 'Dumbbells',        icon: '🏋️' },
    { id: 'barbell',       label: 'Barbell',          icon: '🏋️' },
    { id: 'bench',         label: 'Bench',            icon: '🪑' },
    { id: 'pullup-bar',    label: 'Pull-up bar',      icon: '🔝' },
    { id: 'cable',         label: 'Cable machine',    icon: '⚙️' },
    { id: 'machine',       label: 'Gym machines',     icon: '🏭' },
    { id: 'resistance-band', label: 'Resistance bands', icon: '〰️' },
    { id: 'kettlebell',    label: 'Kettlebell',       icon: '⚫' },
  ];

  // ── Program library ──────────────────────────────────────────────────────
  // equipment: minimum required gear (empty = truly bodyweight only)

  const PROGRAMS = [
    // ── BODYWEIGHT ──────────────────────────────────────────────────────────
    {
      id: 'bw_fullbody',
      name: 'Bodyweight Full Body',
      description: '3-day full body routine using no equipment. Great for travel or home.',
      level: 'Beginner',
      frequency: '3×/week',
      equipment: [],
      days: [
        {
          name: 'Day A',
          exercises: [
            { name: 'Push-Up',                         sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Bodyweight Squat',                sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Plank',                           sets: 3, reps: 30, restSeconds: 60, timed: true },
            { name: 'Bodyweight Walking Lunge',        sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Triceps Dip',                     sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Air Bicycle',                     sets: 3, reps: 20, restSeconds: 45 },
          ],
        },
        {
          name: 'Day B',
          exercises: [
            { name: 'Close Grip Push-Up',              sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Bodyweight Bulgarian Split Squat', sets: 3, reps: 8,  restSeconds: 90 },
            { name: 'Alternating Superman',            sets: 3, reps: 12, restSeconds: 45 },
            { name: 'Bodyweight Reverse Alternating Lunge', sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Alternating Toe Touch',           sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Bodyweight Step-Up',              sets: 3, reps: 10, restSeconds: 60 },
          ],
        },
        {
          name: 'Day C',
          exercises: [
            { name: 'Push-Up',                         sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Bodyweight Squat',                sets: 4, reps: 20, restSeconds: 60 },
            { name: 'Alternating Toe Touch',           sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Bodyweight Step-Up',              sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Air Bicycle',                     sets: 3, reps: 25, restSeconds: 45 },
            { name: 'Plank',                           sets: 3, reps: 45, restSeconds: 60, timed: true },
          ],
        },
      ],
    },

    {
      id: 'bw_ppl',
      name: 'Bodyweight Push/Pull/Legs',
      description: 'Intermediate calisthenics split. 3 days on, 1 rest, repeat.',
      level: 'Intermediate',
      frequency: '3–6×/week',
      equipment: [],
      days: [
        {
          name: 'Push',
          exercises: [
            { name: 'Push-Up',              sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Close Grip Push-Up',   sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Triceps Dip',          sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Pike Push-Up',         sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Plank',                sets: 3, reps: 45, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Pull',
          exercises: [
            { name: 'Alternating Superman', sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Inverted Row',         sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Bodyweight Curl',      sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Air Bicycle',          sets: 3, reps: 20, restSeconds: 45 },
          ],
        },
        {
          name: 'Legs',
          exercises: [
            { name: 'Bodyweight Squat',                 sets: 4, reps: 20, restSeconds: 60 },
            { name: 'Bodyweight Bulgarian Split Squat', sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Bodyweight Walking Lunge',         sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Bodyweight Step-Up',               sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Alternating Toe Touch',            sets: 3, reps: 20, restSeconds: 45 },
          ],
        },
      ],
    },

    // ── DUMBBELL ────────────────────────────────────────────────────────────
    {
      id: 'db_fullbody',
      name: 'Dumbbell Full Body',
      description: '3-day total body program using dumbbells only. Good for home gyms.',
      level: 'Beginner–Intermediate',
      frequency: '3×/week',
      equipment: ['dumbbell'],
      days: [
        {
          name: 'Day A',
          exercises: [
            { name: 'Dumbbell Goblet Squat',         sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Bench Press',          sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Bent-Over Row',        sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Shoulder Press',       sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Romanian Deadlift',    sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Curl',                 sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Dumbbell Lying Tricep Extension (2 Arm)', sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Day B',
          exercises: [
            { name: 'Dumbbell Lunge',                sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Fly',                  sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Dumbbell Lying Incline Row',    sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Lateral Raise',        sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Dumbbell Hip Thrust',           sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Dumbbell Hammer Curl',          sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Air Bicycle',                   sets: 3, reps: 20, restSeconds: 45 },
          ],
        },
        {
          name: 'Day C',
          exercises: [
            { name: 'Dumbbell Front Squat',          sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Incline Bench Press',  sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Back Fly',             sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Dumbbell Arnold Press',         sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Bulgarian Split Squat', sets: 3, reps: 8, restSeconds: 90 },
            { name: 'Dumbbell Bicep 21s',            sets: 3, reps: 21, restSeconds: 90 },
            { name: 'Plank',                         sets: 3, reps: 45, restSeconds: 45, timed: true },
          ],
        },
      ],
    },

    {
      id: 'db_upper_lower',
      name: 'Dumbbell Upper / Lower',
      description: '4-day upper/lower split with dumbbells. Efficient strength and hypertrophy.',
      level: 'Intermediate',
      frequency: '4×/week',
      equipment: ['dumbbell', 'bench'],
      days: [
        {
          name: 'Upper A',
          exercises: [
            { name: 'Dumbbell Bench Press',          sets: 4, reps: 8,  restSeconds: 120 },
            { name: 'Dumbbell Bent-Over Row',        sets: 4, reps: 8,  restSeconds: 120 },
            { name: 'Dumbbell Shoulder Press',       sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Curl',                 sets: 3, reps: 12, restSeconds: 60  },
            { name: 'Dumbbell Lying Tricep Extension (2 Arm)', sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Lower A',
          exercises: [
            { name: 'Dumbbell Goblet Squat',         sets: 4, reps: 10, restSeconds: 120 },
            { name: 'Dumbbell Romanian Deadlift',    sets: 4, reps: 10, restSeconds: 120 },
            { name: 'Dumbbell Lunge',                sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Hip Thrust',           sets: 3, reps: 12, restSeconds: 90  },
            { name: 'Air Bicycle',                   sets: 3, reps: 20, restSeconds: 45  },
          ],
        },
        {
          name: 'Upper B',
          exercises: [
            { name: 'Dumbbell Incline Bench Press',  sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Lying Incline Row',    sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Lateral Raise',        sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Dumbbell Hammer Curl',          sets: 3, reps: 12, restSeconds: 60  },
            { name: 'Dumbbell Back Fly',             sets: 3, reps: 15, restSeconds: 60  },
          ],
        },
        {
          name: 'Lower B',
          exercises: [
            { name: 'Dumbbell Bulgarian Split Squat', sets: 4, reps: 8, restSeconds: 120 },
            { name: 'Dumbbell Front Squat',           sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Step-Up',               sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Romanian Deadlift',     sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Plank',                          sets: 3, reps: 45, restSeconds: 45, timed: true },
          ],
        },
      ],
    },

    // ── BARBELL ─────────────────────────────────────────────────────────────
    {
      id: 'starting_strength',
      name: 'Starting Strength',
      description: 'Mark Rippetoe\'s classic barbell program. Two alternating workouts, 3×/week. Best beginner strength program.',
      level: 'Beginner',
      frequency: '3×/week',
      equipment: ['barbell', 'bench'],
      days: [
        {
          name: 'Workout A',
          exercises: [
            { name: 'Barbell Squat',         sets: 3, reps: 5, restSeconds: 180 },
            { name: 'Barbell Bench Press',   sets: 3, reps: 5, restSeconds: 180 },
            { name: 'Barbell Bent-Over Row', sets: 3, reps: 5, restSeconds: 180 },
          ],
        },
        {
          name: 'Workout B',
          exercises: [
            { name: 'Barbell Squat',           sets: 3, reps: 5, restSeconds: 180 },
            { name: 'Barbell Shoulder Press',  sets: 3, reps: 5, restSeconds: 180 },
            { name: 'Barbell Bent-Over Row',   sets: 1, reps: 5, restSeconds: 180 },
          ],
        },
      ],
    },

    {
      id: 'stronglifts_5x5',
      name: 'StrongLifts 5×5',
      description: 'Simple, effective barbell strength. Two alternating workouts 3×/week. Add weight every session.',
      level: 'Beginner–Intermediate',
      frequency: '3×/week',
      equipment: ['barbell', 'bench'],
      days: [
        {
          name: 'Workout A',
          exercises: [
            { name: 'Barbell Squat',        sets: 5, reps: 5, restSeconds: 180 },
            { name: 'Barbell Bench Press',  sets: 5, reps: 5, restSeconds: 180 },
            { name: 'Barbell Bent-Over Row',sets: 5, reps: 5, restSeconds: 180 },
          ],
        },
        {
          name: 'Workout B',
          exercises: [
            { name: 'Barbell Squat',          sets: 5, reps: 5, restSeconds: 180 },
            { name: 'Barbell Shoulder Press', sets: 5, reps: 5, restSeconds: 180 },
            { name: 'Deadlift',               sets: 1, reps: 5, restSeconds: 180 },
          ],
        },
      ],
    },

    // ── FULL GYM ─────────────────────────────────────────────────────────────
    {
      id: 'upper_lower_gym',
      name: 'Upper / Lower (Gym)',
      description: '4-day upper/lower split with barbell, cables and machines. Balanced strength + hypertrophy.',
      level: 'Intermediate',
      frequency: '4×/week',
      equipment: ['barbell', 'dumbbell', 'cable', 'bench'],
      days: [
        {
          name: 'Upper A (Strength)',
          exercises: [
            { name: 'Barbell Bench Press',   sets: 4, reps: 5,  restSeconds: 180 },
            { name: 'Barbell Bent-Over Row', sets: 4, reps: 5,  restSeconds: 180 },
            { name: 'Barbell Shoulder Press',sets: 3, reps: 8,  restSeconds: 120 },
            { name: 'Dumbbell Curl',         sets: 3, reps: 10, restSeconds: 60  },
            { name: 'Cable Tricep Pushdown', sets: 3, reps: 12, restSeconds: 60  },
          ],
        },
        {
          name: 'Lower A (Strength)',
          exercises: [
            { name: 'Barbell Squat',         sets: 4, reps: 5,  restSeconds: 180 },
            { name: 'Deadlift',              sets: 3, reps: 5,  restSeconds: 180 },
            { name: 'Dumbbell Lunge',        sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Cable Kneeling Crunch', sets: 3, reps: 15, restSeconds: 60  },
          ],
        },
        {
          name: 'Upper B (Hypertrophy)',
          exercises: [
            { name: 'Dumbbell Incline Bench Press', sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Cable Lat Pulldown',            sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Lateral Raise',        sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Dumbbell Hammer Curl',          sets: 3, reps: 12, restSeconds: 60  },
            { name: 'Dumbbell Lying Tricep Extension (2 Arm)', sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Lower B (Hypertrophy)',
          exercises: [
            { name: 'Barbell Squat',                 sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Romanian Deadlift',    sets: 4, reps: 12, restSeconds: 90  },
            { name: 'Dumbbell Bulgarian Split Squat',sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Hip Thrust',           sets: 3, reps: 12, restSeconds: 90  },
            { name: 'Air Bicycle',                   sets: 3, reps: 20, restSeconds: 45  },
          ],
        },
      ],
    },

    {
      id: 'ppl_gym',
      name: 'Push / Pull / Legs (Gym)',
      description: 'Classic 6-day PPL split. Each muscle group hit twice per week. Best intermediate hypertrophy program.',
      level: 'Intermediate–Advanced',
      frequency: '6×/week',
      equipment: ['barbell', 'dumbbell', 'cable', 'machine', 'bench'],
      days: [
        {
          name: 'Push A',
          exercises: [
            { name: 'Barbell Bench Press',    sets: 4, reps: 8,  restSeconds: 120 },
            { name: 'Dumbbell Shoulder Press',sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Incline Bench Press', sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Dumbbell Lateral Raise', sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Cable Tricep Pushdown',  sets: 3, reps: 12, restSeconds: 60  },
            { name: 'Dumbbell Lying Tricep Extension (2 Arm)', sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Pull A',
          exercises: [
            { name: 'Barbell Bent-Over Row',  sets: 4, reps: 8,  restSeconds: 120 },
            { name: 'Cable Lat Pulldown',     sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Lying Incline Row', sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Dumbbell Curl',          sets: 3, reps: 12, restSeconds: 60  },
            { name: 'Dumbbell Hammer Curl',   sets: 3, reps: 12, restSeconds: 60  },
          ],
        },
        {
          name: 'Legs A',
          exercises: [
            { name: 'Barbell Squat',          sets: 4, reps: 8,  restSeconds: 180 },
            { name: 'Deadlift',               sets: 3, reps: 6,  restSeconds: 180 },
            { name: 'Dumbbell Lunge',         sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Hip Thrust',    sets: 3, reps: 12, restSeconds: 90  },
            { name: 'Cable Kneeling Crunch',  sets: 3, reps: 15, restSeconds: 60  },
          ],
        },
        {
          name: 'Push B',
          exercises: [
            { name: 'Dumbbell Incline Bench Press', sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Barbell Shoulder Press', sets: 3, reps: 8,  restSeconds: 120 },
            { name: 'Dumbbell Fly',           sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Dumbbell Arnold Press',  sets: 3, reps: 12, restSeconds: 60  },
            { name: 'Cable Tricep Pushdown',  sets: 4, reps: 15, restSeconds: 60  },
          ],
        },
        {
          name: 'Pull B',
          exercises: [
            { name: 'Dumbbell Bent-Over Row', sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Cable Lat Pulldown',     sets: 4, reps: 12, restSeconds: 90  },
            { name: 'Dumbbell Back Fly',      sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Dumbbell Bicep 21s',     sets: 3, reps: 21, restSeconds: 90  },
            { name: 'Dumbbell Lateral to Front Shoulder Raise', sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Legs B',
          exercises: [
            { name: 'Barbell Squat',                  sets: 4, reps: 10, restSeconds: 120 },
            { name: 'Dumbbell Romanian Deadlift',     sets: 4, reps: 12, restSeconds: 90  },
            { name: 'Dumbbell Bulgarian Split Squat', sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Marine Lateral Lunge',  sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Air Bicycle',                    sets: 4, reps: 20, restSeconds: 45  },
          ],
        },
      ],
    },
  ];

  // ── Filter logic ─────────────────────────────────────────────────────────

  function getMatching(availableEquipment) {
    // availableEquipment: Set of equipment IDs the user has
    return PROGRAMS.filter(p =>
      p.equipment.every(req => availableEquipment.has(req))
    );
  }

  // ── UI ────────────────────────────────────────────────────────────────────

  function openBrowser() {
    const savedEquipment = JSON.parse(localStorage.getItem('wk_equipment') || '[]');
    const selected = new Set(savedEquipment);

    const html = `
      <div class="modal-overlay" id="programs-modal">
        <div class="modal modal-full">
          <div class="modal-header">
            <button class="modal-close" aria-label="Close">✕</button>
            <h3>Browse Programs</h3>
          </div>

          <div class="programs-equipment-section">
            <p class="programs-eq-label">What equipment do you have?</p>
            <div class="programs-eq-grid">
              ${EQUIPMENT_OPTIONS.map(eq => `
                <button class="eq-pill ${selected.has(eq.id) ? 'active' : ''}"
                        data-id="${eq.id}">
                  ${eq.icon} ${eq.label}
                </button>`).join('')}
            </div>
          </div>

          <div id="programs-list" class="programs-list"></div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('programs-modal');
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());

    // Equipment toggle
    modal.querySelectorAll('.eq-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const id = pill.dataset.id;
        if (id === 'bodyweight') {
          // "Bodyweight only" = deselect everything else
          const wasActive = pill.classList.contains('active');
          modal.querySelectorAll('.eq-pill').forEach(p => p.classList.remove('active'));
          if (!wasActive) pill.classList.add('active');
        } else {
          // Deselect "bodyweight only" if selecting real equipment
          modal.querySelector('.eq-pill[data-id="bodyweight"]')?.classList.remove('active');
          pill.classList.toggle('active');
        }
        saveEquipment(modal);
        renderPrograms(modal, getSelected(modal));
      });
    });

    renderPrograms(modal, selected);
  }

  function getSelected(modal) {
    const s = new Set();
    modal.querySelectorAll('.eq-pill.active').forEach(p => s.add(p.dataset.id));
    return s;
  }

  function saveEquipment(modal) {
    localStorage.setItem('wk_equipment', JSON.stringify([...getSelected(modal)]));
  }

  function renderPrograms(modal, selected) {
    const list = modal.querySelector('#programs-list');
    if (!list) return;

    // If "bodyweight" is selected or nothing selected → show bodyweight programs
    const useBodyweight = selected.has('bodyweight') || selected.size === 0;
    const effectiveSet = useBodyweight ? new Set() : selected;
    const matches = getMatching(effectiveSet);

    if (!matches.length) {
      list.innerHTML = `<p class="empty-msg">No programs match your equipment.<br>Try adding more equipment above.</p>`;
      return;
    }

    list.innerHTML = matches.map(p => `
      <div class="program-card">
        <div class="program-card-top">
          <div class="program-card-name">${p.name}</div>
          <div class="program-card-badges">
            <span class="chip chip-level-${p.level.toLowerCase().split('–')[0]}">${p.level}</span>
            <span class="chip chip-mech">${p.frequency}</span>
          </div>
        </div>
        <p class="program-card-desc">${p.description}</p>
        <div class="program-card-days">
          ${p.days.map(d => `<span class="program-day-pill">${d.name}</span>`).join('')}
        </div>
        <button class="btn btn-primary full-w program-add-btn" data-id="${p.id}">
          Add to My Routines
        </button>
      </div>`).join('');

    list.querySelectorAll('.program-add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const prog = PROGRAMS.find(p => p.id === btn.dataset.id);
        if (!prog) return;
        addProgramAsRoutine(prog);
        document.getElementById('programs-modal')?.remove();
      });
    });
  }

  // ── Add program to user's routines ────────────────────────────────────────

  function addProgramAsRoutine(program) {
    // Create one routine per day in the program
    program.days.forEach(day => {
      const routineName = `${program.name} — ${day.name}`;
      // Skip if already exists
      if (Storage.getRoutines().some(r => r.name === routineName)) return;

      const r = Storage.createRoutine(routineName);
      day.exercises.forEach(ex => {
        Storage.addExerciseToRoutine(r.id, {
          id:          ex.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          displayName: ex.name,
          sets:        ex.sets,
          reps:        ex.reps,
          restSeconds: ex.restSeconds,
          timed:       ex.timed || false,
        });
      });
    });

    Routine.renderList();
    App.toast(`${program.name} added (${program.days.length} routines)`);
  }

  return { openBrowser, PROGRAMS, EQUIPMENT_OPTIONS };
})();
