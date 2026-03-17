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

    {
      id: 'bw_fullbody_intermediate',
      name: 'Bodyweight Full Body (Intermediate)',
      description: '4-day bodyweight program with progressions like archer push-ups, pistol squats, and L-sits.',
      level: 'Intermediate',
      frequency: '4×/week',
      equipment: [],
      days: [
        {
          name: 'Day A — Strength',
          exercises: [
            { name: 'Push-Up',                         sets: 5, reps: 20, restSeconds: 60 },
            { name: 'Close Grip Push-Up',              sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Bodyweight Bulgarian Split Squat', sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Alternating Superman',            sets: 4, reps: 15, restSeconds: 45 },
            { name: 'Plank',                           sets: 3, reps: 60, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Day B — Power',
          exercises: [
            { name: 'Pike Push-Up',                    sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Bodyweight Squat',                sets: 5, reps: 25, restSeconds: 60 },
            { name: 'Triceps Dip',                     sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Bodyweight Walking Lunge',        sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Air Bicycle',                     sets: 4, reps: 30, restSeconds: 30 },
          ],
        },
        {
          name: 'Day C — Strength',
          exercises: [
            { name: 'Close Grip Push-Up',              sets: 5, reps: 20, restSeconds: 60 },
            { name: 'Bodyweight Reverse Alternating Lunge', sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Pike Push-Up',                    sets: 4, reps: 15, restSeconds: 90 },
            { name: 'Bodyweight Step-Up',              sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Plank',                           sets: 4, reps: 60, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Day D — Volume',
          exercises: [
            { name: 'Push-Up',                         sets: 6, reps: 20, restSeconds: 45 },
            { name: 'Bodyweight Bulgarian Split Squat', sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Triceps Dip',                     sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Alternating Toe Touch',           sets: 4, reps: 20, restSeconds: 30 },
            { name: 'Air Bicycle',                     sets: 4, reps: 30, restSeconds: 30 },
          ],
        },
      ],
    },

    {
      id: 'bw_ppl_advanced',
      name: 'Bodyweight PPL (Advanced)',
      description: 'Hard calisthenics 6-day PPL. Targets handstand push-up progressions, muscle-up prep, and pistol squat work.',
      level: 'Advanced',
      frequency: '6×/week',
      equipment: ['pullup-bar'],
      days: [
        {
          name: 'Push',
          exercises: [
            { name: 'Pike Push-Up',                    sets: 5, reps: 15, restSeconds: 90 },
            { name: 'Close Grip Push-Up',              sets: 4, reps: 20, restSeconds: 60 },
            { name: 'Triceps Dip',                     sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Push-Up',                         sets: 4, reps: 25, restSeconds: 45 },
            { name: 'Plank',                           sets: 3, reps: 90, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Pull',
          exercises: [
            { name: 'Wide-Grip Pull-Up',               sets: 5, reps: 10, restSeconds: 120 },
            { name: 'Close-Grip Pull-Up',              sets: 4, reps: 10, restSeconds: 120 },
            { name: 'Hanging Knee Raise',              sets: 4, reps: 20, restSeconds: 60  },
            { name: 'Inverted Row',                    sets: 4, reps: 15, restSeconds: 90  },
            { name: 'Alternating Superman',            sets: 3, reps: 20, restSeconds: 45  },
          ],
        },
        {
          name: 'Legs',
          exercises: [
            { name: 'Bodyweight Bulgarian Split Squat', sets: 5, reps: 12, restSeconds: 90 },
            { name: 'Bodyweight Squat',                sets: 5, reps: 30, restSeconds: 60 },
            { name: 'Bodyweight Walking Lunge',        sets: 4, reps: 16, restSeconds: 60 },
            { name: 'Bodyweight Reverse Alternating Lunge', sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Air Bicycle',                     sets: 4, reps: 30, restSeconds: 30 },
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

    {
      id: 'db_ppl',
      name: 'Dumbbell PPL',
      description: '6-day push/pull/legs with dumbbells only. Full hypertrophy program for home gym.',
      level: 'Intermediate',
      frequency: '6×/week',
      equipment: ['dumbbell'],
      days: [
        {
          name: 'Push',
          exercises: [
            { name: 'Dumbbell Bench Press',            sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Shoulder Press',         sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Incline Bench Press',    sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Dumbbell Lateral Raise',          sets: 4, reps: 15, restSeconds: 45 },
            { name: 'Dumbbell Lying Tricep Extension (2 Arm)', sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Dumbbell Fly',                    sets: 3, reps: 15, restSeconds: 60 },
          ],
        },
        {
          name: 'Pull',
          exercises: [
            { name: 'Dumbbell Bent-Over Row',          sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Lying Incline Row',      sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Dumbbell Back Fly',               sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Dumbbell Curl',                   sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Dumbbell Hammer Curl',            sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Alternating Superman',            sets: 3, reps: 15, restSeconds: 45 },
          ],
        },
        {
          name: 'Legs',
          exercises: [
            { name: 'Dumbbell Goblet Squat',           sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Dumbbell Romanian Deadlift',      sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Dumbbell Lunge',                  sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Bulgarian Split Squat',  sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Hip Thrust',             sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Air Bicycle',                     sets: 3, reps: 20, restSeconds: 45 },
          ],
        },
      ],
    },

    {
      id: 'db_bro_split',
      name: 'Dumbbell Bro Split',
      description: '5-day classic bro split with dumbbells. Chest/tri, back/bi, legs, shoulders, arms.',
      level: 'Intermediate',
      frequency: '5×/week',
      equipment: ['dumbbell'],
      days: [
        {
          name: 'Chest & Triceps',
          exercises: [
            { name: 'Dumbbell Bench Press',            sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Incline Bench Press',    sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Dumbbell Fly',                    sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Dumbbell Lying Tricep Extension (2 Arm)', sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Close Grip Push-Up',              sets: 3, reps: 15, restSeconds: 60 },
          ],
        },
        {
          name: 'Back & Biceps',
          exercises: [
            { name: 'Dumbbell Bent-Over Row',          sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Lying Incline Row',      sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Dumbbell Back Fly',               sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Dumbbell Curl',                   sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Dumbbell Hammer Curl',            sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Legs',
          exercises: [
            { name: 'Dumbbell Goblet Squat',           sets: 5, reps: 12, restSeconds: 90 },
            { name: 'Dumbbell Romanian Deadlift',      sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Dumbbell Lunge',                  sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Hip Thrust',             sets: 3, reps: 15, restSeconds: 90 },
            { name: 'Dumbbell Step-Up',                sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Shoulders',
          exercises: [
            { name: 'Dumbbell Shoulder Press',         sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Lateral Raise',          sets: 5, reps: 15, restSeconds: 45 },
            { name: 'Dumbbell Arnold Press',           sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Dumbbell Back Fly',               sets: 4, reps: 15, restSeconds: 45 },
            { name: 'Dumbbell Lateral to Front Shoulder Raise', sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Arms',
          exercises: [
            { name: 'Dumbbell Curl',                   sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Dumbbell Hammer Curl',            sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Dumbbell Bicep 21s',              sets: 3, reps: 21, restSeconds: 90 },
            { name: 'Dumbbell Lying Tricep Extension (2 Arm)', sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Close Grip Push-Up',              sets: 3, reps: 20, restSeconds: 60 },
          ],
        },
      ],
    },

    {
      id: 'db_fullbody_5day',
      name: 'Dumbbell 5-Day Full Body',
      description: 'High-frequency full body training 5 days per week with dumbbells. Each session hits everything.',
      level: 'Intermediate–Advanced',
      frequency: '5×/week',
      equipment: ['dumbbell'],
      days: [
        {
          name: 'Day A',
          exercises: [
            { name: 'Dumbbell Goblet Squat',           sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Bench Press',            sets: 4, reps: 8,  restSeconds: 90 },
            { name: 'Dumbbell Bent-Over Row',          sets: 4, reps: 8,  restSeconds: 90 },
            { name: 'Dumbbell Shoulder Press',         sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Air Bicycle',                     sets: 3, reps: 20, restSeconds: 45 },
          ],
        },
        {
          name: 'Day B',
          exercises: [
            { name: 'Dumbbell Romanian Deadlift',      sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Incline Bench Press',    sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Lying Incline Row',      sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Lateral Raise',          sets: 4, reps: 15, restSeconds: 45 },
            { name: 'Plank',                           sets: 3, reps: 45, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Day C',
          exercises: [
            { name: 'Dumbbell Bulgarian Split Squat',  sets: 4, reps: 8,  restSeconds: 90 },
            { name: 'Dumbbell Fly',                    sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Dumbbell Back Fly',               sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Dumbbell Arnold Press',           sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Curl',                   sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Day D',
          exercises: [
            { name: 'Dumbbell Front Squat',            sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Bench Press',            sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Bent-Over Row',          sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Hip Thrust',             sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Dumbbell Lying Tricep Extension (2 Arm)', sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Day E',
          exercises: [
            { name: 'Dumbbell Lunge',                  sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Incline Bench Press',    sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Dumbbell Lying Incline Row',      sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Dumbbell Lateral Raise',          sets: 4, reps: 15, restSeconds: 45 },
            { name: 'Air Bicycle',                     sets: 4, reps: 25, restSeconds: 30 },
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

    // ── PULL-UP BAR ──────────────────────────────────────────────────────────
    {
      id: 'pullup_fundamentals',
      name: 'Pull-Up Bar Fundamentals',
      description: 'Build upper-body pulling strength from zero to full pull-ups. Pull-up bar only.',
      level: 'Beginner',
      frequency: '3×/week',
      equipment: ['pullup-bar'],
      days: [
        {
          name: 'Day A',
          exercises: [
            { name: 'Dead Hang',                sets: 3, reps: 30, restSeconds: 60, timed: true },
            { name: 'Scapular Pull-Up',         sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Negative Pull-Up',         sets: 3, reps: 5,  restSeconds: 90 },
            { name: 'Push-Up',                  sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Inverted Row',             sets: 3, reps: 8,  restSeconds: 90 },
            { name: 'Plank',                    sets: 3, reps: 30, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Day B',
          exercises: [
            { name: 'Pull-Up',                  sets: 3, reps: 5,  restSeconds: 120 },
            { name: 'Close-Grip Pull-Up',       sets: 3, reps: 5,  restSeconds: 120 },
            { name: 'Push-Up',                  sets: 4, reps: 15, restSeconds: 60  },
            { name: 'Hanging Knee Raise',        sets: 3, reps: 12, restSeconds: 60  },
            { name: 'Plank',                    sets: 3, reps: 45, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Day C',
          exercises: [
            { name: 'Wide-Grip Pull-Up',        sets: 4, reps: 5,  restSeconds: 120 },
            { name: 'Negative Pull-Up',         sets: 3, reps: 5,  restSeconds: 90  },
            { name: 'Triceps Dip',              sets: 3, reps: 10, restSeconds: 60  },
            { name: 'Hanging Knee Raise',        sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Bodyweight Squat',         sets: 3, reps: 15, restSeconds: 45  },
          ],
        },
      ],
    },

    {
      id: 'calisthenics_strength',
      name: 'Calisthenics Strength',
      description: 'Intermediate full-body program with pull-up bar and bodyweight movements. Build real strength.',
      level: 'Intermediate',
      frequency: '4×/week',
      equipment: ['pullup-bar'],
      days: [
        {
          name: 'Upper A',
          exercises: [
            { name: 'Wide-Grip Pull-Up',        sets: 5, reps: 6,  restSeconds: 120 },
            { name: 'Push-Up',                  sets: 4, reps: 20, restSeconds: 60  },
            { name: 'Close-Grip Pull-Up',       sets: 3, reps: 8,  restSeconds: 120 },
            { name: 'Pike Push-Up',             sets: 3, reps: 12, restSeconds: 90  },
            { name: 'Triceps Dip',              sets: 3, reps: 12, restSeconds: 60  },
          ],
        },
        {
          name: 'Lower A',
          exercises: [
            { name: 'Bodyweight Squat',                 sets: 4, reps: 20, restSeconds: 60 },
            { name: 'Bodyweight Bulgarian Split Squat', sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Bodyweight Walking Lunge',         sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Alternating Superman',             sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Hanging Knee Raise',               sets: 3, reps: 15, restSeconds: 60 },
          ],
        },
        {
          name: 'Upper B',
          exercises: [
            { name: 'Pull-Up',                  sets: 5, reps: 8,  restSeconds: 120 },
            { name: 'Close Grip Push-Up',       sets: 4, reps: 15, restSeconds: 60  },
            { name: 'Inverted Row',             sets: 3, reps: 12, restSeconds: 90  },
            { name: 'Plank',                    sets: 3, reps: 60, restSeconds: 45, timed: true },
            { name: 'Air Bicycle',              sets: 3, reps: 20, restSeconds: 45  },
          ],
        },
        {
          name: 'Lower B',
          exercises: [
            { name: 'Bodyweight Step-Up',               sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Bodyweight Reverse Alternating Lunge', sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Alternating Toe Touch',            sets: 3, reps: 20, restSeconds: 45 },
            { name: 'Hanging Knee Raise',               sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Plank',                            sets: 3, reps: 60, restSeconds: 45, timed: true },
          ],
        },
      ],
    },

    // ── RESISTANCE BANDS ─────────────────────────────────────────────────────
    {
      id: 'band_fullbody',
      name: 'Resistance Band Full Body',
      description: '3-day full body program with resistance bands only. Great for travel, home, or rehab.',
      level: 'Beginner–Intermediate',
      frequency: '3×/week',
      equipment: ['resistance-band'],
      days: [
        {
          name: 'Day A',
          exercises: [
            { name: 'Band Pull Apart',          sets: 3, reps: 20, restSeconds: 45  },
            { name: 'Resistance Band Squat',    sets: 4, reps: 15, restSeconds: 60  },
            { name: 'Band Chest Press',         sets: 3, reps: 12, restSeconds: 60  },
            { name: 'Band Bent-Over Row',       sets: 3, reps: 12, restSeconds: 60  },
            { name: 'Band Shoulder Press',      sets: 3, reps: 12, restSeconds: 60  },
            { name: 'Air Bicycle',              sets: 3, reps: 20, restSeconds: 45  },
          ],
        },
        {
          name: 'Day B',
          exercises: [
            { name: 'Band Pull Apart',          sets: 3, reps: 20, restSeconds: 45  },
            { name: 'Resistance Band Deadlift', sets: 4, reps: 12, restSeconds: 90  },
            { name: 'Band Curl',                sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Band Tricep Overhead Extension', sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Band Lateral Raise',       sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Plank',                    sets: 3, reps: 45, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Day C',
          exercises: [
            { name: 'Resistance Band Squat',    sets: 4, reps: 20, restSeconds: 60  },
            { name: 'Band Chest Fly',           sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Band Face Pull',           sets: 3, reps: 20, restSeconds: 45  },
            { name: 'Band Lateral Walk',        sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Band Curl',                sets: 3, reps: 12, restSeconds: 60  },
            { name: 'Air Bicycle',              sets: 3, reps: 25, restSeconds: 45  },
          ],
        },
      ],
    },

    {
      id: 'band_upper',
      name: 'Resistance Band Upper Body',
      description: '3-day upper-body focus with resistance bands. Build shoulders, back, and arms at home.',
      level: 'Beginner',
      frequency: '3×/week',
      equipment: ['resistance-band'],
      days: [
        {
          name: 'Push Day',
          exercises: [
            { name: 'Band Chest Press',              sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Band Shoulder Press',           sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Band Chest Fly',                sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Band Lateral Raise',            sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Band Tricep Overhead Extension',sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Push-Up',                       sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Pull Day',
          exercises: [
            { name: 'Band Bent-Over Row',      sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Band Face Pull',          sets: 4, reps: 20, restSeconds: 45 },
            { name: 'Band Pull Apart',         sets: 3, reps: 20, restSeconds: 45 },
            { name: 'Band Curl',               sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Alternating Superman',    sets: 3, reps: 12, restSeconds: 45 },
          ],
        },
        {
          name: 'Full Body',
          exercises: [
            { name: 'Resistance Band Squat',   sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Band Chest Press',        sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Band Bent-Over Row',      sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Band Lateral Walk',       sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Plank',                   sets: 3, reps: 45, restSeconds: 45, timed: true },
          ],
        },
      ],
    },

    // ── KETTLEBELL ───────────────────────────────────────────────────────────
    {
      id: 'kb_fullbody',
      name: 'Kettlebell Full Body',
      description: '3-day kettlebell program. Builds strength, power, and conditioning with a single bell.',
      level: 'Beginner–Intermediate',
      frequency: '3×/week',
      equipment: ['kettlebell'],
      days: [
        {
          name: 'Day A',
          exercises: [
            { name: 'Kettlebell Swing',         sets: 5, reps: 15, restSeconds: 60  },
            { name: 'Kettlebell Goblet Squat',  sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Kettlebell Single Leg Deadlift', sets: 3, reps: 8, restSeconds: 90 },
            { name: 'Kettlebell Military Press',sets: 3, reps: 8,  restSeconds: 90  },
            { name: 'Kettlebell Row',           sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Plank',                    sets: 3, reps: 45, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Day B',
          exercises: [
            { name: 'Kettlebell Swing',         sets: 5, reps: 20, restSeconds: 60  },
            { name: 'Kettlebell Clean and Press',sets: 4, reps: 5,  restSeconds: 120 },
            { name: 'Kettlebell Sumo Deadlift', sets: 4, reps: 8,  restSeconds: 90  },
            { name: 'Kettlebell Windmill',      sets: 3, reps: 5,  restSeconds: 90  },
            { name: 'Kettlebell Halo',          sets: 3, reps: 10, restSeconds: 60  },
            { name: 'Air Bicycle',              sets: 3, reps: 20, restSeconds: 45  },
          ],
        },
        {
          name: 'Day C',
          exercises: [
            { name: 'Kettlebell Turkish Get-Up',sets: 3, reps: 3,  restSeconds: 120 },
            { name: 'Kettlebell Goblet Squat',  sets: 5, reps: 12, restSeconds: 90  },
            { name: 'Kettlebell Military Press',sets: 4, reps: 8,  restSeconds: 90  },
            { name: 'Kettlebell Row',           sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Kettlebell Swing',         sets: 4, reps: 15, restSeconds: 60  },
            { name: 'Plank',                    sets: 3, reps: 60, restSeconds: 45, timed: true },
          ],
        },
      ],
    },

    {
      id: 'kb_conditioning',
      name: 'Kettlebell Conditioning',
      description: 'High-intensity kettlebell circuits for strength and fat loss. Classic Russian-style training.',
      level: 'Intermediate',
      frequency: '3–4×/week',
      equipment: ['kettlebell'],
      days: [
        {
          name: 'Strength Circuit',
          exercises: [
            { name: 'Kettlebell Clean and Press',sets: 5, reps: 5,  restSeconds: 90  },
            { name: 'Kettlebell Goblet Squat',   sets: 5, reps: 10, restSeconds: 60  },
            { name: 'Kettlebell Row',            sets: 5, reps: 8,  restSeconds: 60  },
            { name: 'Kettlebell Single Leg Deadlift', sets: 4, reps: 6, restSeconds: 90 },
            { name: 'Kettlebell Windmill',       sets: 3, reps: 5,  restSeconds: 90  },
          ],
        },
        {
          name: 'Power Circuit',
          exercises: [
            { name: 'Kettlebell Swing',          sets: 10, reps: 10, restSeconds: 30 },
            { name: 'Kettlebell Clean and Press', sets: 5, reps: 5,  restSeconds: 60 },
            { name: 'Kettlebell Sumo Deadlift',   sets: 5, reps: 8,  restSeconds: 60 },
            { name: 'Kettlebell Halo',            sets: 3, reps: 10, restSeconds: 45 },
            { name: 'Air Bicycle',                sets: 3, reps: 20, restSeconds: 45 },
          ],
        },
        {
          name: 'Core & Mobility',
          exercises: [
            { name: 'Kettlebell Turkish Get-Up', sets: 5, reps: 3,  restSeconds: 120 },
            { name: 'Kettlebell Windmill',        sets: 4, reps: 5,  restSeconds: 90  },
            { name: 'Kettlebell Halo',            sets: 4, reps: 10, restSeconds: 60  },
            { name: 'Kettlebell Swing',           sets: 5, reps: 15, restSeconds: 45  },
            { name: 'Plank',                      sets: 3, reps: 60, restSeconds: 45, timed: true },
          ],
        },
      ],
    },

    {
      id: 'kb_ppl',
      name: 'Kettlebell PPL',
      description: '6-day push/pull/legs with a single kettlebell. Brutal conditioning and strength.',
      level: 'Intermediate',
      frequency: '6×/week',
      equipment: ['kettlebell'],
      days: [
        {
          name: 'Push',
          exercises: [
            { name: 'Kettlebell Military Press',       sets: 5, reps: 8,  restSeconds: 90 },
            { name: 'Kettlebell Clean and Press',      sets: 4, reps: 5,  restSeconds: 120 },
            { name: 'Push-Up',                         sets: 4, reps: 20, restSeconds: 60  },
            { name: 'Kettlebell Halo',                 sets: 3, reps: 10, restSeconds: 60  },
            { name: 'Plank',                           sets: 3, reps: 60, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Pull',
          exercises: [
            { name: 'Kettlebell Row',                  sets: 5, reps: 10, restSeconds: 90  },
            { name: 'Kettlebell Single Leg Deadlift',  sets: 4, reps: 8,  restSeconds: 90  },
            { name: 'Alternating Superman',            sets: 4, reps: 15, restSeconds: 45  },
            { name: 'Kettlebell Windmill',             sets: 3, reps: 6,  restSeconds: 90  },
            { name: 'Air Bicycle',                     sets: 3, reps: 20, restSeconds: 45  },
          ],
        },
        {
          name: 'Legs',
          exercises: [
            { name: 'Kettlebell Goblet Squat',         sets: 5, reps: 15, restSeconds: 90 },
            { name: 'Kettlebell Sumo Deadlift',        sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Kettlebell Swing',                sets: 5, reps: 20, restSeconds: 60 },
            { name: 'Bodyweight Bulgarian Split Squat', sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Bodyweight Walking Lunge',        sets: 3, reps: 15, restSeconds: 60 },
          ],
        },
      ],
    },

    {
      id: 'kb_upper_lower',
      name: 'Kettlebell Upper / Lower',
      description: '4-day upper/lower kettlebell split. Builds strength and muscle with minimal equipment.',
      level: 'Beginner–Intermediate',
      frequency: '4×/week',
      equipment: ['kettlebell'],
      days: [
        {
          name: 'Upper A',
          exercises: [
            { name: 'Kettlebell Military Press',       sets: 4, reps: 8,  restSeconds: 90 },
            { name: 'Kettlebell Row',                  sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Kettlebell Halo',                 sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Push-Up',                         sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Alternating Superman',            sets: 3, reps: 15, restSeconds: 45 },
          ],
        },
        {
          name: 'Lower A',
          exercises: [
            { name: 'Kettlebell Goblet Squat',         sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Kettlebell Swing',                sets: 5, reps: 20, restSeconds: 60 },
            { name: 'Kettlebell Single Leg Deadlift',  sets: 3, reps: 8,  restSeconds: 90 },
            { name: 'Bodyweight Walking Lunge',        sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Air Bicycle',                     sets: 3, reps: 20, restSeconds: 45 },
          ],
        },
        {
          name: 'Upper B',
          exercises: [
            { name: 'Kettlebell Clean and Press',      sets: 4, reps: 5,  restSeconds: 120 },
            { name: 'Kettlebell Row',                  sets: 4, reps: 12, restSeconds: 90  },
            { name: 'Kettlebell Windmill',             sets: 3, reps: 5,  restSeconds: 90  },
            { name: 'Push-Up',                         sets: 4, reps: 20, restSeconds: 60  },
            { name: 'Plank',                           sets: 3, reps: 60, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Lower B',
          exercises: [
            { name: 'Kettlebell Sumo Deadlift',        sets: 5, reps: 8,  restSeconds: 90 },
            { name: 'Kettlebell Goblet Squat',         sets: 4, reps: 15, restSeconds: 90 },
            { name: 'Kettlebell Swing',                sets: 5, reps: 15, restSeconds: 60 },
            { name: 'Bodyweight Bulgarian Split Squat', sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Plank',                           sets: 3, reps: 60, restSeconds: 45, timed: true },
          ],
        },
      ],
    },

    {
      id: 'kb_simple_sinister',
      name: 'Kettlebell Simple & Sinister',
      description: 'Pavel Tsatsouline\'s minimalist KB program. 100 swings + 10 Turkish get-ups daily. Deceptively hard.',
      level: 'Intermediate–Advanced',
      frequency: '5×/week',
      equipment: ['kettlebell'],
      days: [
        {
          name: 'Simple Session',
          exercises: [
            { name: 'Kettlebell Swing',                sets: 10, reps: 10, restSeconds: 30 },
            { name: 'Kettlebell Turkish Get-Up',       sets: 10, reps: 1,  restSeconds: 60 },
          ],
        },
        {
          name: 'Sinister Session',
          exercises: [
            { name: 'Kettlebell Swing',                sets: 10, reps: 10, restSeconds: 30 },
            { name: 'Kettlebell Turkish Get-Up',       sets: 10, reps: 1,  restSeconds: 60 },
            { name: 'Kettlebell Clean and Press',      sets: 5,  reps: 5,  restSeconds: 90 },
            { name: 'Kettlebell Goblet Squat',         sets: 5,  reps: 10, restSeconds: 60 },
          ],
        },
      ],
    },

    {
      id: 'kb_fullbody_4day',
      name: 'Kettlebell Full Body (4-Day)',
      description: '4-day kettlebell program hitting every muscle group twice per week. Progressive overload via reps.',
      level: 'Intermediate',
      frequency: '4×/week',
      equipment: ['kettlebell'],
      days: [
        {
          name: 'Day A — Strength',
          exercises: [
            { name: 'Kettlebell Clean and Press',      sets: 5, reps: 5,  restSeconds: 120 },
            { name: 'Kettlebell Goblet Squat',         sets: 5, reps: 8,  restSeconds: 90  },
            { name: 'Kettlebell Row',                  sets: 5, reps: 8,  restSeconds: 90  },
            { name: 'Kettlebell Single Leg Deadlift',  sets: 4, reps: 6,  restSeconds: 90  },
            { name: 'Plank',                           sets: 3, reps: 60, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Day B — Power',
          exercises: [
            { name: 'Kettlebell Swing',                sets: 6, reps: 20, restSeconds: 60  },
            { name: 'Kettlebell Military Press',       sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Kettlebell Sumo Deadlift',        sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Kettlebell Halo',                 sets: 3, reps: 10, restSeconds: 60  },
            { name: 'Air Bicycle',                     sets: 4, reps: 25, restSeconds: 30  },
          ],
        },
        {
          name: 'Day C — Strength',
          exercises: [
            { name: 'Kettlebell Clean and Press',      sets: 5, reps: 6,  restSeconds: 120 },
            { name: 'Kettlebell Goblet Squat',         sets: 5, reps: 10, restSeconds: 90  },
            { name: 'Kettlebell Row',                  sets: 5, reps: 10, restSeconds: 90  },
            { name: 'Kettlebell Windmill',             sets: 3, reps: 5,  restSeconds: 90  },
            { name: 'Plank',                           sets: 3, reps: 60, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Day D — Conditioning',
          exercises: [
            { name: 'Kettlebell Swing',                sets: 8, reps: 20, restSeconds: 30  },
            { name: 'Kettlebell Turkish Get-Up',       sets: 4, reps: 3,  restSeconds: 120 },
            { name: 'Kettlebell Sumo Deadlift',        sets: 4, reps: 12, restSeconds: 60  },
            { name: 'Kettlebell Military Press',       sets: 4, reps: 10, restSeconds: 60  },
            { name: 'Air Bicycle',                     sets: 4, reps: 30, restSeconds: 30  },
          ],
        },
      ],
    },

    // ── CABLE MACHINE ────────────────────────────────────────────────────────
    {
      id: 'cable_hypertrophy',
      name: 'Cable Machine Hypertrophy',
      description: '4-day push/pull split focused on cables and dumbbells. Maximum time under tension for muscle growth.',
      level: 'Intermediate',
      frequency: '4×/week',
      equipment: ['cable', 'dumbbell', 'bench'],
      days: [
        {
          name: 'Chest & Triceps',
          exercises: [
            { name: 'Dumbbell Bench Press',           sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Cable Crossover',                sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Dumbbell Incline Bench Press',   sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Cable Chest Press',              sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Cable Tricep Pushdown',          sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Cable Overhead Tricep Extension',sets: 3, reps: 15, restSeconds: 60 },
          ],
        },
        {
          name: 'Back & Biceps',
          exercises: [
            { name: 'Cable Lat Pulldown',             sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Cable Seated Row',               sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Bent-Over Row',         sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Cable Straight Arm Pulldown',    sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Curl',                     sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Dumbbell Hammer Curl',           sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Shoulders & Arms',
          exercises: [
            { name: 'Dumbbell Shoulder Press',        sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Cable Lateral Raise',            sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Cable Face Pull',                sets: 4, reps: 20, restSeconds: 60 },
            { name: 'Dumbbell Lateral Raise',         sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Curl',                     sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Tricep Pushdown',          sets: 3, reps: 15, restSeconds: 60 },
          ],
        },
        {
          name: 'Legs & Core',
          exercises: [
            { name: 'Cable Pull Through',             sets: 4, reps: 15, restSeconds: 90 },
            { name: 'Dumbbell Goblet Squat',          sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Dumbbell Romanian Deadlift',     sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Cable Kneeling Crunch',          sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Dumbbell Lunge',                 sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Air Bicycle',                    sets: 3, reps: 20, restSeconds: 45 },
          ],
        },
      ],
    },

    // ── GYM MACHINES ─────────────────────────────────────────────────────────
    {
      id: 'machine_builder',
      name: 'Machine Muscle Builder',
      description: '3-day machine-focused program. Ideal for beginners learning movements safely with controlled resistance.',
      level: 'Beginner',
      frequency: '3×/week',
      equipment: ['machine'],
      days: [
        {
          name: 'Upper Body A',
          exercises: [
            { name: 'Machine Chest Press',       sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Cable Lat Pulldown',         sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Machine Shoulder Press',     sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Cable Seated Row',           sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Cable Curl',                 sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Tricep Pushdown',      sets: 3, reps: 15, restSeconds: 60 },
          ],
        },
        {
          name: 'Lower Body',
          exercises: [
            { name: 'Leg Press',                  sets: 4, reps: 12, restSeconds: 120 },
            { name: 'Machine Leg Extension',      sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Machine Lying Leg Curl',     sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Machine Hip Abduction',      sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Machine Calf Raise',         sets: 4, reps: 20, restSeconds: 45  },
            { name: 'Cable Kneeling Crunch',      sets: 3, reps: 15, restSeconds: 60  },
          ],
        },
        {
          name: 'Upper Body B',
          exercises: [
            { name: 'Machine Chest Fly',          sets: 4, reps: 15, restSeconds: 90  },
            { name: 'Cable Lat Pulldown',         sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Cable Face Pull',            sets: 3, reps: 20, restSeconds: 60  },
            { name: 'Cable Lateral Raise',        sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Cable Curl',                 sets: 4, reps: 12, restSeconds: 60  },
            { name: 'Cable Tricep Pushdown',      sets: 4, reps: 12, restSeconds: 60  },
          ],
        },
      ],
    },

    {
      id: 'machine_ppl',
      name: 'Machine Push / Pull / Legs',
      description: '6-day PPL using machines and cables. Great for beginners who want structure without free-weight complexity.',
      level: 'Beginner–Intermediate',
      frequency: '6×/week',
      equipment: ['machine'],
      days: [
        {
          name: 'Push',
          exercises: [
            { name: 'Machine Chest Press',        sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Machine Shoulder Press',     sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Machine Chest Fly',          sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Lateral Raise',        sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Tricep Pushdown',      sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Overhead Tricep Extension', sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Pull',
          exercises: [
            { name: 'Cable Lat Pulldown',         sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Cable Seated Row',           sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Cable Face Pull',            sets: 3, reps: 20, restSeconds: 60 },
            { name: 'Cable Straight Arm Pulldown',sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Curl',                 sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Legs',
          exercises: [
            { name: 'Leg Press',                  sets: 4, reps: 12, restSeconds: 120 },
            { name: 'Machine Leg Extension',      sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Machine Lying Leg Curl',     sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Machine Hip Abduction',      sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Machine Calf Raise',         sets: 4, reps: 20, restSeconds: 45  },
            { name: 'Cable Kneeling Crunch',      sets: 3, reps: 15, restSeconds: 60  },
          ],
        },
      ],
    },

    // ── BENCH (BENCH-ONLY BODYWEIGHT) ────────────────────────────────────────
    {
      id: 'bench_bw',
      name: 'Bench Bodyweight',
      description: 'Bodyweight program that uses a flat bench for dips, step-ups, and elevated push-ups. No weights needed.',
      level: 'Beginner',
      frequency: '3×/week',
      equipment: ['bench'],
      days: [
        {
          name: 'Day A',
          exercises: [
            { name: 'Triceps Dip',                    sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Incline Push-Up',                sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Bodyweight Step-Up',             sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Decline Push-Up',                sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Plank',                          sets: 3, reps: 45, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Day B',
          exercises: [
            { name: 'Triceps Dip',                    sets: 5, reps: 10, restSeconds: 60 },
            { name: 'Bodyweight Hip Thrust',          sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Bodyweight Step-Up',             sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Decline Push-Up',                sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Air Bicycle',                    sets: 3, reps: 25, restSeconds: 45 },
          ],
        },
        {
          name: 'Day C',
          exercises: [
            { name: 'Triceps Dip',                    sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Incline Push-Up',                sets: 4, reps: 20, restSeconds: 60 },
            { name: 'Bodyweight Hip Thrust',          sets: 5, reps: 20, restSeconds: 60 },
            { name: 'Bodyweight Step-Up',             sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Plank',                          sets: 3, reps: 60, restSeconds: 45, timed: true },
          ],
        },
      ],
    },

    {
      id: 'machine_upper_lower',
      name: 'Machine Upper / Lower',
      description: '4-day upper/lower split using only machines and cables. Ideal for injury prevention and beginners.',
      level: 'Beginner–Intermediate',
      frequency: '4×/week',
      equipment: ['machine'],
      days: [
        {
          name: 'Upper A (Strength)',
          exercises: [
            { name: 'Machine Chest Press',       sets: 4, reps: 8,  restSeconds: 120 },
            { name: 'Cable Lat Pulldown',         sets: 4, reps: 8,  restSeconds: 120 },
            { name: 'Machine Shoulder Press',     sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Cable Seated Row',           sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Cable Curl',                 sets: 3, reps: 12, restSeconds: 60  },
            { name: 'Cable Tricep Pushdown',      sets: 3, reps: 12, restSeconds: 60  },
          ],
        },
        {
          name: 'Lower A',
          exercises: [
            { name: 'Leg Press',                  sets: 4, reps: 10, restSeconds: 120 },
            { name: 'Machine Lying Leg Curl',     sets: 3, reps: 12, restSeconds: 90  },
            { name: 'Machine Leg Extension',      sets: 3, reps: 12, restSeconds: 90  },
            { name: 'Machine Hip Abduction',      sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Machine Calf Raise',         sets: 4, reps: 20, restSeconds: 45  },
            { name: 'Cable Kneeling Crunch',      sets: 3, reps: 15, restSeconds: 60  },
          ],
        },
        {
          name: 'Upper B (Hypertrophy)',
          exercises: [
            { name: 'Machine Chest Fly',          sets: 4, reps: 15, restSeconds: 90  },
            { name: 'Cable Lat Pulldown',         sets: 4, reps: 12, restSeconds: 90  },
            { name: 'Cable Face Pull',            sets: 3, reps: 20, restSeconds: 60  },
            { name: 'Cable Lateral Raise',        sets: 4, reps: 15, restSeconds: 60  },
            { name: 'Cable Curl',                 sets: 4, reps: 15, restSeconds: 60  },
            { name: 'Cable Overhead Tricep Extension', sets: 3, reps: 15, restSeconds: 60 },
          ],
        },
        {
          name: 'Lower B',
          exercises: [
            { name: 'Leg Press',                  sets: 5, reps: 15, restSeconds: 90  },
            { name: 'Machine Leg Extension',      sets: 4, reps: 15, restSeconds: 60  },
            { name: 'Machine Lying Leg Curl',     sets: 4, reps: 15, restSeconds: 60  },
            { name: 'Machine Hip Adduction',      sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Machine Calf Raise',         sets: 5, reps: 25, restSeconds: 45  },
            { name: 'Air Bicycle',                sets: 3, reps: 20, restSeconds: 45  },
          ],
        },
      ],
    },

    {
      id: 'machine_fullbody',
      name: 'Machine Full Body',
      description: '3-day total body program using only gym machines. Perfect for true beginners building a foundation.',
      level: 'Beginner',
      frequency: '3×/week',
      equipment: ['machine'],
      days: [
        {
          name: 'Day A',
          exercises: [
            { name: 'Leg Press',                  sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Machine Chest Press',        sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Cable Lat Pulldown',         sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Machine Shoulder Press',     sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Machine Calf Raise',         sets: 3, reps: 20, restSeconds: 45 },
            { name: 'Cable Kneeling Crunch',      sets: 3, reps: 15, restSeconds: 60 },
          ],
        },
        {
          name: 'Day B',
          exercises: [
            { name: 'Leg Press',                  sets: 3, reps: 15, restSeconds: 90 },
            { name: 'Machine Chest Fly',          sets: 3, reps: 15, restSeconds: 90 },
            { name: 'Cable Seated Row',           sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Cable Lateral Raise',        sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Curl',                 sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Cable Tricep Pushdown',      sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Day C',
          exercises: [
            { name: 'Machine Leg Extension',      sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Machine Lying Leg Curl',     sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Machine Chest Press',        sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Cable Lat Pulldown',         sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Cable Face Pull',            sets: 3, reps: 20, restSeconds: 60 },
            { name: 'Machine Calf Raise',         sets: 4, reps: 20, restSeconds: 45 },
          ],
        },
      ],
    },

    {
      id: 'machine_hypertrophy_5day',
      name: 'Machine 5-Day Split',
      description: 'Dedicated machine-based bro split targeting each muscle group once per week. Classic hypertrophy focus.',
      level: 'Intermediate',
      frequency: '5×/week',
      equipment: ['machine'],
      days: [
        {
          name: 'Chest',
          exercises: [
            { name: 'Machine Chest Press',        sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Machine Chest Fly',          sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Cable Crossover',            sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Cable Chest Press',          sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Tricep Pushdown',      sets: 3, reps: 15, restSeconds: 60 },
          ],
        },
        {
          name: 'Back',
          exercises: [
            { name: 'Cable Lat Pulldown',         sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Cable Seated Row',           sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Cable Straight Arm Pulldown',sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Face Pull',            sets: 4, reps: 20, restSeconds: 60 },
            { name: 'Cable Curl',                 sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Legs',
          exercises: [
            { name: 'Leg Press',                  sets: 5, reps: 12, restSeconds: 120 },
            { name: 'Machine Leg Extension',      sets: 4, reps: 15, restSeconds: 60  },
            { name: 'Machine Lying Leg Curl',     sets: 4, reps: 15, restSeconds: 60  },
            { name: 'Machine Hip Abduction',      sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Machine Hip Adduction',      sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Machine Calf Raise',         sets: 5, reps: 20, restSeconds: 45  },
          ],
        },
        {
          name: 'Shoulders',
          exercises: [
            { name: 'Machine Shoulder Press',     sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Cable Lateral Raise',        sets: 5, reps: 15, restSeconds: 60 },
            { name: 'Cable Face Pull',            sets: 4, reps: 20, restSeconds: 60 },
            { name: 'Cable Overhead Tricep Extension', sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Tricep Pushdown',      sets: 3, reps: 15, restSeconds: 60 },
          ],
        },
        {
          name: 'Arms',
          exercises: [
            { name: 'Cable Curl',                 sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Cable Hammer Curl',          sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Tricep Pushdown',      sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Cable Overhead Tricep Extension', sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Kneeling Crunch',      sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Air Bicycle',                sets: 3, reps: 20, restSeconds: 45 },
          ],
        },
      ],
    },

    {
      id: 'machine_bro_split',
      name: 'Machine Bro Split',
      description: '4-day classic bro split — chest/tri, back/bi, legs, shoulders/abs. All machines and cables.',
      level: 'Intermediate',
      frequency: '4×/week',
      equipment: ['machine'],
      days: [
        {
          name: 'Chest & Triceps',
          exercises: [
            { name: 'Machine Chest Press',             sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Machine Chest Fly',               sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Cable Crossover',                 sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Chest Press',               sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Cable Tricep Pushdown',           sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Cable Overhead Tricep Extension', sets: 3, reps: 15, restSeconds: 60 },
          ],
        },
        {
          name: 'Back & Biceps',
          exercises: [
            { name: 'Cable Lat Pulldown',              sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Cable Seated Row',                sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Cable Straight Arm Pulldown',     sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Face Pull',                 sets: 3, reps: 20, restSeconds: 60 },
            { name: 'Cable Curl',                      sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Cable Hammer Curl',               sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Legs',
          exercises: [
            { name: 'Leg Press',                       sets: 5, reps: 12, restSeconds: 120 },
            { name: 'Machine Leg Extension',           sets: 4, reps: 15, restSeconds: 60  },
            { name: 'Machine Lying Leg Curl',          sets: 4, reps: 15, restSeconds: 60  },
            { name: 'Machine Hip Abduction',           sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Machine Hip Adduction',           sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Machine Calf Raise',              sets: 5, reps: 20, restSeconds: 45  },
          ],
        },
        {
          name: 'Shoulders & Abs',
          exercises: [
            { name: 'Machine Shoulder Press',          sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Cable Lateral Raise',             sets: 5, reps: 15, restSeconds: 45 },
            { name: 'Cable Face Pull',                 sets: 4, reps: 20, restSeconds: 45 },
            { name: 'Cable Reverse Fly',               sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Kneeling Crunch',           sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Air Bicycle',                     sets: 3, reps: 25, restSeconds: 45 },
          ],
        },
      ],
    },

    {
      id: 'machine_strength',
      name: 'Machine Strength Program',
      description: 'Heavy machine work at low reps to build maximal strength. 3 days, linear progression each session.',
      level: 'Intermediate–Advanced',
      frequency: '3×/week',
      equipment: ['machine'],
      days: [
        {
          name: 'Day A — Push Focus',
          exercises: [
            { name: 'Machine Chest Press',             sets: 5, reps: 5,  restSeconds: 180 },
            { name: 'Machine Shoulder Press',          sets: 5, reps: 5,  restSeconds: 180 },
            { name: 'Leg Press',                       sets: 5, reps: 5,  restSeconds: 180 },
            { name: 'Cable Tricep Pushdown',           sets: 3, reps: 8,  restSeconds: 90  },
            { name: 'Machine Calf Raise',              sets: 4, reps: 10, restSeconds: 60  },
          ],
        },
        {
          name: 'Day B — Pull Focus',
          exercises: [
            { name: 'Cable Lat Pulldown',              sets: 5, reps: 5,  restSeconds: 180 },
            { name: 'Cable Seated Row',                sets: 5, reps: 5,  restSeconds: 180 },
            { name: 'Machine Lying Leg Curl',          sets: 4, reps: 8,  restSeconds: 120 },
            { name: 'Cable Curl',                      sets: 3, reps: 8,  restSeconds: 90  },
            { name: 'Cable Face Pull',                 sets: 3, reps: 15, restSeconds: 60  },
          ],
        },
        {
          name: 'Day C — Full Body',
          exercises: [
            { name: 'Leg Press',                       sets: 5, reps: 5,  restSeconds: 180 },
            { name: 'Machine Chest Press',             sets: 4, reps: 6,  restSeconds: 180 },
            { name: 'Cable Lat Pulldown',              sets: 4, reps: 6,  restSeconds: 180 },
            { name: 'Machine Shoulder Press',          sets: 3, reps: 8,  restSeconds: 120 },
            { name: 'Cable Kneeling Crunch',           sets: 3, reps: 12, restSeconds: 60  },
          ],
        },
      ],
    },

    {
      id: 'machine_2day',
      name: 'Machine 2-Day Full Body',
      description: 'Minimal time commitment — two full body sessions per week on machines. Great for maintenance or beginners.',
      level: 'Beginner',
      frequency: '2×/week',
      equipment: ['machine'],
      days: [
        {
          name: 'Day A',
          exercises: [
            { name: 'Leg Press',                       sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Machine Chest Press',             sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Cable Lat Pulldown',              sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Machine Shoulder Press',          sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Cable Curl',                      sets: 2, reps: 15, restSeconds: 60 },
            { name: 'Cable Tricep Pushdown',           sets: 2, reps: 15, restSeconds: 60 },
            { name: 'Machine Calf Raise',              sets: 3, reps: 20, restSeconds: 45 },
          ],
        },
        {
          name: 'Day B',
          exercises: [
            { name: 'Machine Leg Extension',           sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Machine Lying Leg Curl',          sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Machine Chest Fly',               sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Seated Row',                sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Cable Lateral Raise',             sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Cable Face Pull',                 sets: 3, reps: 20, restSeconds: 45 },
            { name: 'Cable Kneeling Crunch',           sets: 3, reps: 15, restSeconds: 60 },
          ],
        },
      ],
    },

    {
      id: 'machine_cut',
      name: 'Machine Cut & Tone',
      description: 'High-rep, short-rest machine circuits designed for fat loss and muscle definition. 4 days.',
      level: 'Beginner–Intermediate',
      frequency: '4×/week',
      equipment: ['machine'],
      days: [
        {
          name: 'Upper Circuit A',
          exercises: [
            { name: 'Machine Chest Press',             sets: 4, reps: 20, restSeconds: 45 },
            { name: 'Cable Lat Pulldown',              sets: 4, reps: 20, restSeconds: 45 },
            { name: 'Cable Lateral Raise',             sets: 4, reps: 20, restSeconds: 30 },
            { name: 'Cable Curl',                      sets: 3, reps: 20, restSeconds: 30 },
            { name: 'Cable Tricep Pushdown',           sets: 3, reps: 20, restSeconds: 30 },
            { name: 'Cable Face Pull',                 sets: 3, reps: 25, restSeconds: 30 },
          ],
        },
        {
          name: 'Lower Circuit A',
          exercises: [
            { name: 'Leg Press',                       sets: 4, reps: 20, restSeconds: 45 },
            { name: 'Machine Leg Extension',           sets: 4, reps: 20, restSeconds: 30 },
            { name: 'Machine Lying Leg Curl',          sets: 4, reps: 20, restSeconds: 30 },
            { name: 'Machine Hip Abduction',           sets: 3, reps: 20, restSeconds: 30 },
            { name: 'Machine Calf Raise',              sets: 4, reps: 25, restSeconds: 30 },
            { name: 'Cable Kneeling Crunch',           sets: 4, reps: 20, restSeconds: 30 },
          ],
        },
        {
          name: 'Upper Circuit B',
          exercises: [
            { name: 'Machine Chest Fly',               sets: 4, reps: 20, restSeconds: 45 },
            { name: 'Cable Seated Row',                sets: 4, reps: 20, restSeconds: 45 },
            { name: 'Machine Shoulder Press',          sets: 3, reps: 20, restSeconds: 45 },
            { name: 'Cable Straight Arm Pulldown',     sets: 3, reps: 20, restSeconds: 30 },
            { name: 'Cable Crossover',                 sets: 3, reps: 20, restSeconds: 30 },
            { name: 'Air Bicycle',                     sets: 3, reps: 30, restSeconds: 30 },
          ],
        },
        {
          name: 'Lower Circuit B',
          exercises: [
            { name: 'Machine Hip Adduction',           sets: 4, reps: 20, restSeconds: 30 },
            { name: 'Machine Hip Abduction',           sets: 4, reps: 20, restSeconds: 30 },
            { name: 'Leg Press',                       sets: 4, reps: 20, restSeconds: 45 },
            { name: 'Machine Lying Leg Curl',          sets: 3, reps: 20, restSeconds: 30 },
            { name: 'Machine Calf Raise',              sets: 4, reps: 25, restSeconds: 30 },
            { name: 'Cable Kneeling Crunch',           sets: 4, reps: 20, restSeconds: 30 },
          ],
        },
      ],
    },

    {
      id: 'machine_6day_upper_lower',
      name: 'Machine 6-Day Upper / Lower',
      description: 'High-frequency upper/lower split — each muscle group hit 3×/week. Best for intermediate hypertrophy.',
      level: 'Intermediate–Advanced',
      frequency: '6×/week',
      equipment: ['machine'],
      days: [
        {
          name: 'Upper A (Strength)',
          exercises: [
            { name: 'Machine Chest Press',             sets: 4, reps: 6,  restSeconds: 120 },
            { name: 'Cable Lat Pulldown',              sets: 4, reps: 6,  restSeconds: 120 },
            { name: 'Machine Shoulder Press',          sets: 3, reps: 8,  restSeconds: 90  },
            { name: 'Cable Seated Row',                sets: 3, reps: 8,  restSeconds: 90  },
            { name: 'Cable Curl',                      sets: 3, reps: 10, restSeconds: 60  },
            { name: 'Cable Tricep Pushdown',           sets: 3, reps: 10, restSeconds: 60  },
          ],
        },
        {
          name: 'Lower A (Strength)',
          exercises: [
            { name: 'Leg Press',                       sets: 4, reps: 6,  restSeconds: 180 },
            { name: 'Machine Lying Leg Curl',          sets: 4, reps: 8,  restSeconds: 120 },
            { name: 'Machine Leg Extension',           sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Machine Calf Raise',              sets: 5, reps: 12, restSeconds: 60  },
            { name: 'Cable Kneeling Crunch',           sets: 3, reps: 12, restSeconds: 60  },
          ],
        },
        {
          name: 'Upper B (Hypertrophy)',
          exercises: [
            { name: 'Machine Chest Fly',               sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Cable Straight Arm Pulldown',     sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Cable Lateral Raise',             sets: 5, reps: 15, restSeconds: 45 },
            { name: 'Cable Face Pull',                 sets: 4, reps: 20, restSeconds: 45 },
            { name: 'Cable Hammer Curl',               sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Overhead Tricep Extension', sets: 3, reps: 15, restSeconds: 60 },
          ],
        },
        {
          name: 'Lower B (Hypertrophy)',
          exercises: [
            { name: 'Leg Press',                       sets: 5, reps: 15, restSeconds: 90  },
            { name: 'Machine Leg Extension',           sets: 4, reps: 15, restSeconds: 60  },
            { name: 'Machine Hip Abduction',           sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Machine Hip Adduction',           sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Machine Calf Raise',              sets: 5, reps: 20, restSeconds: 45  },
            { name: 'Air Bicycle',                     sets: 3, reps: 20, restSeconds: 45  },
          ],
        },
        {
          name: 'Upper C (Volume)',
          exercises: [
            { name: 'Cable Crossover',                 sets: 5, reps: 15, restSeconds: 60 },
            { name: 'Cable Lat Pulldown',              sets: 5, reps: 12, restSeconds: 60 },
            { name: 'Machine Shoulder Press',          sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Cable Curl',                      sets: 4, reps: 15, restSeconds: 45 },
            { name: 'Cable Tricep Pushdown',           sets: 4, reps: 15, restSeconds: 45 },
          ],
        },
        {
          name: 'Lower C (Volume)',
          exercises: [
            { name: 'Leg Press',                       sets: 5, reps: 20, restSeconds: 60  },
            { name: 'Machine Lying Leg Curl',          sets: 5, reps: 15, restSeconds: 60  },
            { name: 'Machine Leg Extension',           sets: 5, reps: 15, restSeconds: 60  },
            { name: 'Machine Calf Raise',              sets: 5, reps: 25, restSeconds: 45  },
            { name: 'Cable Kneeling Crunch',           sets: 4, reps: 20, restSeconds: 45  },
          ],
        },
      ],
    },

    {
      id: 'machine_arnold_split',
      name: 'Machine Arnold Split',
      description: 'Classic Arnold 3-day split (chest/back, shoulders/arms, legs) done twice per week on machines.',
      level: 'Intermediate',
      frequency: '6×/week',
      equipment: ['machine'],
      days: [
        {
          name: 'Chest & Back',
          exercises: [
            { name: 'Machine Chest Press',             sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Cable Lat Pulldown',              sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Machine Chest Fly',               sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Seated Row',                sets: 3, reps: 12, restSeconds: 90 },
            { name: 'Cable Crossover',                 sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Face Pull',                 sets: 3, reps: 20, restSeconds: 60 },
          ],
        },
        {
          name: 'Shoulders & Arms',
          exercises: [
            { name: 'Machine Shoulder Press',          sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Cable Lateral Raise',             sets: 4, reps: 15, restSeconds: 45 },
            { name: 'Cable Reverse Fly',               sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Cable Curl',                      sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Cable Hammer Curl',               sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Cable Tricep Pushdown',           sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Cable Overhead Tricep Extension', sets: 3, reps: 15, restSeconds: 60 },
          ],
        },
        {
          name: 'Legs',
          exercises: [
            { name: 'Leg Press',                       sets: 5, reps: 12, restSeconds: 120 },
            { name: 'Machine Leg Extension',           sets: 4, reps: 15, restSeconds: 60  },
            { name: 'Machine Lying Leg Curl',          sets: 4, reps: 15, restSeconds: 60  },
            { name: 'Machine Hip Abduction',           sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Machine Calf Raise',              sets: 5, reps: 20, restSeconds: 45  },
            { name: 'Cable Kneeling Crunch',           sets: 3, reps: 15, restSeconds: 60  },
          ],
        },
      ],
    },

    // ── FULL GYM ─────────────────────────────────────────────────────────────
    {
      id: 'fullgym_fullbody_3day',
      name: 'Full Gym Full Body (3-Day)',
      description: 'Classic 3-day total body program using barbells, dumbbells, and cables. Great all-around strength builder.',
      level: 'Beginner–Intermediate',
      frequency: '3×/week',
      equipment: ['barbell', 'dumbbell', 'cable', 'bench'],
      days: [
        {
          name: 'Day A',
          exercises: [
            { name: 'Barbell Squat',                   sets: 4, reps: 5,  restSeconds: 180 },
            { name: 'Barbell Bench Press',             sets: 4, reps: 5,  restSeconds: 180 },
            { name: 'Barbell Bent-Over Row',           sets: 4, reps: 5,  restSeconds: 180 },
            { name: 'Dumbbell Shoulder Press',         sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Cable Kneeling Crunch',           sets: 3, reps: 15, restSeconds: 60  },
          ],
        },
        {
          name: 'Day B',
          exercises: [
            { name: 'Deadlift',                        sets: 3, reps: 5,  restSeconds: 180 },
            { name: 'Barbell Shoulder Press',          sets: 4, reps: 5,  restSeconds: 180 },
            { name: 'Cable Lat Pulldown',              sets: 4, reps: 8,  restSeconds: 90  },
            { name: 'Dumbbell Lunge',                  sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Air Bicycle',                     sets: 3, reps: 20, restSeconds: 45  },
          ],
        },
        {
          name: 'Day C',
          exercises: [
            { name: 'Barbell Squat',                   sets: 4, reps: 8,  restSeconds: 120 },
            { name: 'Dumbbell Incline Bench Press',    sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Cable Seated Row',                sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Lateral Raise',          sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Dumbbell Romanian Deadlift',      sets: 3, reps: 10, restSeconds: 90  },
          ],
        },
      ],
    },

    {
      id: 'fullgym_fullbody_5day',
      name: 'Full Gym Full Body (5-Day)',
      description: 'High-frequency 5-day full body using all gym equipment. Each session is shorter but hits everything.',
      level: 'Intermediate–Advanced',
      frequency: '5×/week',
      equipment: ['barbell', 'dumbbell', 'cable', 'machine', 'bench'],
      days: [
        {
          name: 'Monday',
          exercises: [
            { name: 'Barbell Squat',                   sets: 4, reps: 6,  restSeconds: 180 },
            { name: 'Barbell Bench Press',             sets: 4, reps: 6,  restSeconds: 180 },
            { name: 'Cable Lat Pulldown',              sets: 4, reps: 8,  restSeconds: 90  },
            { name: 'Dumbbell Shoulder Press',         sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Air Bicycle',                     sets: 3, reps: 20, restSeconds: 45  },
          ],
        },
        {
          name: 'Tuesday',
          exercises: [
            { name: 'Deadlift',                        sets: 3, reps: 5,  restSeconds: 180 },
            { name: 'Dumbbell Incline Bench Press',    sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Cable Seated Row',                sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Lateral Raise',          sets: 4, reps: 15, restSeconds: 45  },
            { name: 'Cable Curl',                      sets: 3, reps: 12, restSeconds: 60  },
          ],
        },
        {
          name: 'Wednesday',
          exercises: [
            { name: 'Leg Press',                       sets: 4, reps: 12, restSeconds: 120 },
            { name: 'Barbell Shoulder Press',          sets: 4, reps: 8,  restSeconds: 120 },
            { name: 'Dumbbell Bent-Over Row',          sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Cable Tricep Pushdown',           sets: 3, reps: 12, restSeconds: 60  },
            { name: 'Plank',                           sets: 3, reps: 60, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Thursday',
          exercises: [
            { name: 'Barbell Squat',                   sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Fly',                    sets: 4, reps: 15, restSeconds: 60  },
            { name: 'Cable Lat Pulldown',              sets: 4, reps: 12, restSeconds: 90  },
            { name: 'Dumbbell Hip Thrust',             sets: 3, reps: 15, restSeconds: 90  },
            { name: 'Cable Face Pull',                 sets: 3, reps: 20, restSeconds: 45  },
          ],
        },
        {
          name: 'Friday',
          exercises: [
            { name: 'Dumbbell Romanian Deadlift',      sets: 4, reps: 12, restSeconds: 90  },
            { name: 'Barbell Bench Press',             sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Cable Seated Row',                sets: 4, reps: 12, restSeconds: 90  },
            { name: 'Machine Calf Raise',              sets: 4, reps: 20, restSeconds: 45  },
            { name: 'Air Bicycle',                     sets: 4, reps: 25, restSeconds: 30  },
          ],
        },
      ],
    },

    {
      id: 'fullgym_ppl_intermediate',
      name: 'PPL Intermediate (Gym)',
      description: 'Intermediate 6-day PPL with higher volume and more accessory work than the beginner version.',
      level: 'Intermediate',
      frequency: '6×/week',
      equipment: ['barbell', 'dumbbell', 'cable', 'bench'],
      days: [
        {
          name: 'Push A',
          exercises: [
            { name: 'Barbell Bench Press',             sets: 4, reps: 6,  restSeconds: 180 },
            { name: 'Barbell Shoulder Press',          sets: 3, reps: 8,  restSeconds: 120 },
            { name: 'Dumbbell Incline Bench Press',    sets: 3, reps: 12, restSeconds: 90  },
            { name: 'Dumbbell Lateral Raise',          sets: 4, reps: 15, restSeconds: 45  },
            { name: 'Cable Tricep Pushdown',           sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Dumbbell Lying Tricep Extension (2 Arm)', sets: 3, reps: 12, restSeconds: 60 },
          ],
        },
        {
          name: 'Pull A',
          exercises: [
            { name: 'Barbell Bent-Over Row',           sets: 4, reps: 6,  restSeconds: 180 },
            { name: 'Cable Lat Pulldown',              sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Lying Incline Row',      sets: 3, reps: 12, restSeconds: 90  },
            { name: 'Cable Face Pull',                 sets: 3, reps: 20, restSeconds: 45  },
            { name: 'Dumbbell Curl',                   sets: 3, reps: 12, restSeconds: 60  },
            { name: 'Dumbbell Hammer Curl',            sets: 3, reps: 12, restSeconds: 60  },
          ],
        },
        {
          name: 'Legs A',
          exercises: [
            { name: 'Barbell Squat',                   sets: 4, reps: 6,  restSeconds: 180 },
            { name: 'Dumbbell Romanian Deadlift',      sets: 3, reps: 10, restSeconds: 120 },
            { name: 'Dumbbell Lunge',                  sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Hip Thrust',             sets: 3, reps: 12, restSeconds: 90  },
            { name: 'Cable Kneeling Crunch',           sets: 3, reps: 15, restSeconds: 60  },
          ],
        },
        {
          name: 'Push B',
          exercises: [
            { name: 'Dumbbell Incline Bench Press',    sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Shoulder Press',         sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Dumbbell Fly',                    sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Dumbbell Arnold Press',           sets: 3, reps: 12, restSeconds: 90  },
            { name: 'Cable Tricep Pushdown',           sets: 4, reps: 15, restSeconds: 60  },
          ],
        },
        {
          name: 'Pull B',
          exercises: [
            { name: 'Dumbbell Bent-Over Row',          sets: 4, reps: 10, restSeconds: 90  },
            { name: 'Cable Seated Row',                sets: 4, reps: 12, restSeconds: 90  },
            { name: 'Dumbbell Back Fly',               sets: 3, reps: 15, restSeconds: 60  },
            { name: 'Dumbbell Bicep 21s',              sets: 3, reps: 21, restSeconds: 90  },
            { name: 'Cable Face Pull',                 sets: 3, reps: 20, restSeconds: 45  },
          ],
        },
        {
          name: 'Legs B',
          exercises: [
            { name: 'Deadlift',                        sets: 4, reps: 5,  restSeconds: 180 },
            { name: 'Barbell Squat',                   sets: 3, reps: 10, restSeconds: 120 },
            { name: 'Dumbbell Bulgarian Split Squat',  sets: 3, reps: 10, restSeconds: 90  },
            { name: 'Leg Press',                       sets: 3, reps: 15, restSeconds: 90  },
            { name: 'Air Bicycle',                     sets: 4, reps: 25, restSeconds: 30  },
          ],
        },
      ],
    },

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
          const isActive = pill.classList.contains('active');
          // Don't allow deselecting if it's the only active pill (would show bodyweight)
          const activeCount = modal.querySelectorAll('.eq-pill.active').length;
          if (isActive && activeCount <= 1) {
            // Already the only selection — do nothing
          } else {
            pill.classList.toggle('active');
          }
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

    let matches;
    if (selected.size === 0 || selected.has('bodyweight')) {
      matches = PROGRAMS.filter(p => p.equipment.length === 0);
    } else {
      matches = PROGRAMS.filter(p =>
        p.equipment.length > 0 &&
        p.equipment.every(req => selected.has(req))
      );
    }

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
