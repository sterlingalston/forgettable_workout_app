// Pre-built workout programs — static, no API needed.
// Each program has an `equipment` array listing what's required.
// The UI filters by what the user says they have available.

const Programs = (() => {

  // ── Equipment catalog ────────────────────────────────────────────────────

  const EQUIPMENT_OPTIONS = [
    { id: 'bodyweight',      label: 'Bodyweight only',   icon: '🙆' },
    { id: 'dumbbell',        label: 'Dumbbells',          icon: '🏋️' },
    { id: 'barbell',         label: 'Barbell',            icon: '🏋️' },
    { id: 'bench',           label: 'Bench',              icon: '🪑' },
    { id: 'pullup-bar',      label: 'Pull-up bar',        icon: '🔝' },
    { id: 'parallettes',     label: 'Parallettes',        icon: '🤸' },
    { id: 'power-tower',     label: 'Power tower',        icon: '🗼' },
    { id: 'gymnastic-rings', label: 'Gymnastic rings',    icon: '⭕' },
    { id: 'cable',           label: 'Cable machine',      icon: '⚙️' },
    { id: 'machine',         label: 'Gym machines',       icon: '🏭' },
    { id: 'resistance-band', label: 'Resistance bands',   icon: '〰️' },
    { id: 'kettlebell',      label: 'Kettlebell',         icon: '⚫' },
    { id: 'ankle-weights',   label: 'Ankle weights',      icon: '🦵' },
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
      description: 'Intermediate calisthenics split with pull-up bar and parallettes. 3 days on, 1 rest, repeat.',
      level: 'Intermediate',
      frequency: '3–6×/week',
      equipment: ['pullup-bar', 'parallettes'],
      days: [
        {
          name: 'Push',
          exercises: [
            { name: 'Push-Up',              sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Triceps Dip',          sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Pike Push-Up',         sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Close Grip Push-Up',   sets: 3, reps: 12, restSeconds: 60 },
            { name: 'L-Sit',                sets: 3, reps: 15, restSeconds: 60, timed: true },
            { name: 'Plank',                sets: 3, reps: 45, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Pull',
          exercises: [
            { name: 'Pull-Up',              sets: 4, reps: 8,  restSeconds: 120 },
            { name: 'Wide-Grip Pull-Up',    sets: 3, reps: 6,  restSeconds: 120 },
            { name: 'Inverted Row',         sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Hanging Knee Raise',   sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Alternating Superman', sets: 3, reps: 15, restSeconds: 45 },
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

    {
      id: 'bw_abs',
      name: 'Bodyweight Abs',
      description: 'Dedicated core routine — no equipment needed. Three days target anti-extension, flexion, and rotation.',
      level: 'Beginner–Intermediate',
      frequency: '3×/week',
      equipment: [],
      days: [
        {
          name: 'Day A — Plank & Stability',
          exercises: [
            { name: 'Plank',               sets: 3, reps: 30,  restSeconds: 45, timed: true },
            { name: 'Dead Bug',            sets: 3, reps: 10,  restSeconds: 45 },
            { name: 'Hollow Hold',         sets: 3, reps: 20,  restSeconds: 45, timed: true },
            { name: 'Mountain Climber',    sets: 3, reps: 20,  restSeconds: 45 },
            { name: 'Air Bicycle',         sets: 3, reps: 20,  restSeconds: 45 },
            { name: 'Alternating Superman', sets: 3, reps: 12, restSeconds: 45 },
          ],
        },
        {
          name: 'Day B — Flexion & Crunch',
          exercises: [
            { name: 'Crunches',            sets: 3, reps: 20,  restSeconds: 45 },
            { name: 'Reverse Crunch',      sets: 3, reps: 15,  restSeconds: 45 },
            { name: 'Leg Raise',           sets: 3, reps: 12,  restSeconds: 60 },
            { name: 'Alternating Toe Touch', sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Air Bicycle',         sets: 3, reps: 25,  restSeconds: 45 },
            { name: 'Plank',               sets: 2, reps: 30,  restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Day C — Full Circuit',
          exercises: [
            { name: 'Plank',               sets: 3, reps: 45,  restSeconds: 45, timed: true },
            { name: 'Air Bicycle',         sets: 4, reps: 20,  restSeconds: 30 },
            { name: 'Reverse Crunch',      sets: 3, reps: 15,  restSeconds: 45 },
            { name: 'Mountain Climber',    sets: 3, reps: 20,  restSeconds: 45 },
            { name: 'Dead Bug',            sets: 3, reps: 12,  restSeconds: 45 },
            { name: 'Hollow Hold',         sets: 2, reps: 25,  restSeconds: 45, timed: true },
            { name: 'Russian Twist',       sets: 3, reps: 20,  restSeconds: 45 },
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

    {
      id: 'db_runners',
      name: 'Dumbbell Strength for Runners',
      description: 'Strength work for runners with one pair of dumbbells: single-leg strength, glutes and hamstrings, calves, and the core that holds your form late in a run. 2–3 sessions a week on easy or rest days; Day C is optional.',
      level: 'Beginner–Intermediate',
      frequency: '2–3×/week',
      equipment: ['dumbbell'],
      days: [
        {
          name: 'Single-Leg Strength',
          exercises: [
            { name: 'Dumbbell Goblet Squat',            sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Bulgarian Split Squat',   sets: 3, reps: 8,  restSeconds: 90 },
            { name: 'Dumbbell Step-Up',                 sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Dumbbell Single Leg Deadlift',     sets: 3, reps: 8,  restSeconds: 60 },
            { name: 'Standing Calf Raise with Dumbbell',sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Dead Bug',                         sets: 3, reps: 10, restSeconds: 45 },
            { name: 'Side Plank',                       sets: 3, reps: 30, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Posterior Chain & Hips',
          exercises: [
            { name: 'Dumbbell Romanian Deadlift',       sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Dumbbell Reverse Lunge',           sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Dumbbell Lateral Step Up',         sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Dumbbell Glute Bridge',            sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Dumbbell Row',                     sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Bird Dog',                         sets: 3, reps: 10, restSeconds: 30 },
            { name: 'Plank',                            sets: 3, reps: 45, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Power & Core (optional)',
          exercises: [
            { name: 'Dumbbell Walking Lunge',           sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Dumbbell Push Press',              sets: 3, reps: 8,  restSeconds: 90 },
            { name: 'Dumbbell Goblet Curtsey Lunge',    sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Single-Leg Dumbbell Hip Thrust',   sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Single Leg Calf Raise',            sets: 3, reps: 12, restSeconds: 45 },
            { name: 'Dumbbell Renegade Row',            sets: 3, reps: 8,  restSeconds: 60 },
            { name: 'Superman',                         sets: 3, reps: 12, restSeconds: 30 },
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

    {
      id: 'kot_knee_ability',
      name: 'Knees Over Toes — Knee Ability',
      description: "Ben Patrick's ATG/Knees Over Toes approach, bodyweight only: build knee resilience by loading the joint through full range instead of avoiding it. Starts with backward walking, tibialis and calf work, then adds split squats, hinges and hamstring eccentrics. Arthritis rule — keep pain at or under 3/10 during and after; if it lingers past 24 h, cut the range or the sets. Backward walking works on a treadmill, outdoors, or up a slope; no sled needed.",
      level: 'Beginner',
      frequency: '3×/week',
      equipment: [],
      days: [
        {
          name: 'Knee Prep',
          exercises: [
            { name: 'Backward Walking',                 sets: 3, reps: 60, restSeconds: 60, timed: true },
            { name: 'Tibialis Raise',                   sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Knees Over Toes Calf Raise',       sets: 3, reps: 15, restSeconds: 45 },
            { name: 'ATG Split Squat',                  sets: 3, reps: 8,  restSeconds: 90 },
            { name: 'Wall Sit',                         sets: 3, reps: 30, restSeconds: 60, timed: true },
            { name: 'Couch Stretch',                    sets: 2, reps: 45, restSeconds: 30, timed: true },
          ],
        },
        {
          name: 'Posterior Chain',
          exercises: [
            { name: 'Backward Walking',                 sets: 3, reps: 60, restSeconds: 60, timed: true },
            { name: 'Seated Calf Raise',                sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Patrick Step',                     sets: 3, reps: 8,  restSeconds: 60 },
            { name: 'Seated Good Morning',              sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Elephant Walk',                    sets: 2, reps: 30, restSeconds: 45, timed: true },
            { name: 'Nordic Hamstring Curl',            sets: 2, reps: 5,  restSeconds: 90 },
            { name: 'Standing Hamstring Stretch',       sets: 2, reps: 30, restSeconds: 30, timed: true },
          ],
        },
        {
          name: 'Integration',
          exercises: [
            { name: 'Backward Walking',                 sets: 3, reps: 60, restSeconds: 60, timed: true },
            { name: 'Tibialis Raise',                   sets: 3, reps: 15, restSeconds: 45 },
            { name: 'ATG Split Squat',                  sets: 3, reps: 8,  restSeconds: 90 },
            { name: 'Bodyweight Kneeling Sissy Squat',  sets: 3, reps: 8,  restSeconds: 60 },
            { name: 'Single Leg Calf Raise',            sets: 3, reps: 12, restSeconds: 45 },
            { name: 'Couch Stretch',                    sets: 2, reps: 45, restSeconds: 30, timed: true },
          ],
        },
      ],
    },

    {
      id: 'kot_band_ankle',
      name: 'Knees Over Toes — Bands & Ankle Weights',
      description: "The ATG/Knees Over Toes progression loaded with fabric loop bands and ankle weights. Ankle weights add resistance to the knee-extension and hip work that bodyweight can't load; the loop bands anchor the tibialis raise and the Spanish squat, and assist the Nordic curl. Same arthritis rule — pain at or under 3/10 during and after, and back off the load before you back off the range. Progression: the three bands stack for 7 resistance levels (L, M, H, L+M, L+H, M+H, L+M+H), so add a band before you add range. Start with the light band and the lowest weight setting.",
      level: 'Beginner–Intermediate',
      frequency: '3×/week',
      equipment: ['resistance-band', 'ankle-weights'],
      days: [
        {
          name: 'Loaded Knee Prep',
          exercises: [
            { name: 'Backward Walking',                 sets: 3, reps: 60, restSeconds: 60, timed: true },
            { name: 'Banded Tibialis Raise',            sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Knees Over Toes Calf Raise',       sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Spanish Squat',                    sets: 3, reps: 30, restSeconds: 60, timed: true },
            { name: 'ATG Split Squat',                  sets: 3, reps: 8,  restSeconds: 90 },
            { name: 'Couch Stretch',                    sets: 2, reps: 45, restSeconds: 30, timed: true },
          ],
        },
        {
          name: 'Posterior Chain',
          exercises: [
            { name: 'Backward Walking',                 sets: 3, reps: 60, restSeconds: 60, timed: true },
            { name: 'Seated Calf Raise',                sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Patrick Step',                     sets: 3, reps: 8,  restSeconds: 60 },
            { name: 'Seated Good Morning',              sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Band Assisted Nordic Curl',        sets: 2, reps: 5,  restSeconds: 90 },
            { name: 'Elephant Walk',                    sets: 2, reps: 30, restSeconds: 45, timed: true },
            { name: 'Standing Hamstring Stretch',       sets: 2, reps: 30, restSeconds: 30, timed: true },
          ],
        },
        {
          name: 'Quad & Hip Isolation',
          exercises: [
            { name: 'Backward Walking',                 sets: 3, reps: 60, restSeconds: 60, timed: true },
            { name: 'Ankle Weight Leg Extension',       sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Ankle Weight Standing Leg Curl',   sets: 3, reps: 12, restSeconds: 45 },
            { name: 'Ankle Weight Straight Leg Raise',  sets: 3, reps: 12, restSeconds: 45 },
            { name: 'Banded Standing Glute Kickback',   sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Resistance Band Lateral Walk',     sets: 3, reps: 12, restSeconds: 45 },
            { name: 'Single Leg Calf Raise',            sets: 3, reps: 12, restSeconds: 45 },
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

    {
      id: 'band_knee_kick',
      name: 'Band Knee Armor + Kick Speed',
      description: 'Fabric loop bands (light/medium/heavy) for arthritic knees and faster Muay Thai kicks. Low-impact quad, glute, and hip work, then banded hip drive and rotation for teeps, knees, and roundhouses. Stop any rep that causes sharp knee pain.',
      level: 'Beginner–Intermediate',
      frequency: '3×/week',
      equipment: ['resistance-band'],
      days: [
        {
          name: 'Knee Armor',
          exercises: [
            { name: 'Banded Glute Bridge',                       sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Resistance Band Lateral Walk',              sets: 3, reps: 12, restSeconds: 45 },
            { name: 'Band Side Lying Clam',                      sets: 3, reps: 15, restSeconds: 30 },
            { name: 'Bodyweight Box Squat',                      sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Seated Leg Extension with Resistance Band', sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Standing Leg Curl with Resistance Band',    sets: 3, reps: 12, restSeconds: 45 },
            { name: 'Wall Sit',                                  sets: 3, reps: 30, restSeconds: 60, timed: true },
            { name: 'Bodyweight Standing Calf Raise',            sets: 3, reps: 15, restSeconds: 45 },
          ],
        },
        {
          name: 'Kick Speed',
          exercises: [
            { name: 'Hip Circles',                               sets: 2, reps: 10, restSeconds: 30 },
            { name: 'Standing Leg Raise with Resistance Band',   sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Banded Standing Glute Kickback',            sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Banded Fire Hydrant',                       sets: 3, reps: 15, restSeconds: 30 },
            { name: 'Band Seated Hip External Rotation',         sets: 3, reps: 15, restSeconds: 30 },
            { name: 'Band Seated Hip Internal Rotation',         sets: 3, reps: 15, restSeconds: 30 },
            { name: 'Banded Walk',                               sets: 3, reps: 12, restSeconds: 45 },
            { name: 'Muay Thai Roundhouse Kick',                 sets: 3, reps: 10, restSeconds: 45 },
          ],
        },
        {
          name: 'Support Leg',
          exercises: [
            { name: 'Banded Step-Up',                            sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Banded Split Squat',                        sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Lateral Step-Up',                           sets: 3, reps: 10, restSeconds: 45 },
            { name: 'Banded Single Leg Glute Bridge',            sets: 3, reps: 12, restSeconds: 45 },
            { name: 'Standing Straight Leg Raise with Resistance Band', sets: 3, reps: 15, restSeconds: 30 },
            { name: 'Reverse Lunge Knee Lift',                   sets: 3, reps: 10, restSeconds: 45 },
            { name: 'Single Leg Calf Raise',                     sets: 3, reps: 12, restSeconds: 45 },
            { name: 'Kneeling Hip Flexor Stretch',               sets: 2, reps: 30, restSeconds: 30, timed: true },
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
      id: 'bw_kb_ppl',
      name: 'Bodyweight + KB PPL',
      description: 'Push/pull/legs hybrid: one kettlebell, pull-up bar, and parallettes. Run 3 or 6 days/week.',
      level: 'Intermediate',
      frequency: '3–6×/week',
      equipment: ['kettlebell', 'pullup-bar', 'parallettes'],
      days: [
        {
          name: 'Push',
          exercises: [
            { name: 'Kettlebell Military Press',  sets: 4, reps: 8,  restSeconds: 90 },
            { name: 'Push-Up',                    sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Triceps Dip',                sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Kettlebell Halo',             sets: 3, reps: 10, restSeconds: 60 },
            { name: 'L-Sit',                       sets: 3, reps: 15, restSeconds: 60, timed: true },
            { name: 'Plank',                       sets: 3, reps: 45, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Pull',
          exercises: [
            { name: 'Pull-Up',                     sets: 4, reps: 8,  restSeconds: 120 },
            { name: 'Kettlebell Row',              sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Close-Grip Pull-Up',          sets: 3, reps: 8,  restSeconds: 120 },
            { name: 'Kettlebell Single Leg Deadlift', sets: 3, reps: 8, restSeconds: 90 },
            { name: 'Hanging Knee Raise',          sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Kettlebell Windmill',         sets: 3, reps: 5,  restSeconds: 90 },
          ],
        },
        {
          name: 'Legs',
          exercises: [
            { name: 'Kettlebell Goblet Squat',            sets: 4, reps: 12, restSeconds: 90 },
            { name: 'Kettlebell Swing',                    sets: 4, reps: 20, restSeconds: 60 },
            { name: 'Kettlebell Sumo Deadlift',            sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Bodyweight Bulgarian Split Squat',    sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Bodyweight Walking Lunge',            sets: 3, reps: 12, restSeconds: 60 },
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

    // ── POWER TOWER ──────────────────────────────────────────────────────────
    {
      id: 'tower_fullbody_12min',
      name: '12 Min Full Body Calisthenics (Power Tower)',
      description: 'Follow-along circuit hitting pull, push, dip, and core using a power tower. Parallettes can sub for push-ups.',
      level: 'Beginner',
      frequency: 'Single circuit',
      equipment: ['power-tower'],
      videoId: 'ZOiDStlKrOw',
      days: [
        {
          name: 'Full Body Circuit',
          exercises: [
            { name: 'Wide-Grip Pull-Up',   sets: 3, reps: 8,  restSeconds: 45 },
            { name: 'Inverted Row',        sets: 3, reps: 10, restSeconds: 45 },
            { name: 'Triceps Dip',         sets: 3, reps: 10, restSeconds: 45 },
            { name: 'Push-Up',             sets: 3, reps: 12, restSeconds: 45 },
            { name: 'Hanging Knee Raise',  sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Plank',               sets: 3, reps: 30, restSeconds: 30, timed: true },
          ],
        },
      ],
    },

    {
      id: 'tower_upper_20min',
      name: '20 Min Power Tower Upper Body',
      description: 'Total upper-body session on the power tower: pull-ups, chin-ups, dips, push-ups, and hanging core work.',
      level: 'Intermediate',
      frequency: 'Single session',
      equipment: ['power-tower'],
      videoId: 'dEuEZvGDxLI',
      days: [
        {
          name: 'Upper Body',
          exercises: [
            { name: 'Wide-Grip Pull-Up',   sets: 4, reps: 8,  restSeconds: 90 },
            { name: 'Close-Grip Pull-Up',  sets: 3, reps: 8,  restSeconds: 90 },
            { name: 'Triceps Dip',         sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Push-Up',             sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Hanging Knee Raise',  sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Hanging Leg Raise',   sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Plank',               sets: 3, reps: 45, restSeconds: 45, timed: true },
          ],
        },
      ],
    },

    // ── GYMNASTIC RINGS ──────────────────────────────────────────────────────
    {
      id: 'rings_beginner_start',
      name: 'How to Start Calisthenics with Rings Only',
      description: 'Best beginner rings workout. Ring rows, push-ups, assisted dips and pull-ups, plus ring core work.',
      level: 'Beginner',
      frequency: 'Single session',
      equipment: ['gymnastic-rings'],
      videoId: 'i_9EoXX3Hmw',
      days: [
        {
          name: 'Rings Circuit',
          exercises: [
            { name: 'Inverted Row',       sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Push-Up',            sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Triceps Dip',        sets: 3, reps: 8,  restSeconds: 90 },
            { name: 'Wide-Grip Pull-Up',  sets: 3, reps: 5,  restSeconds: 90 },
            { name: 'Plank',              sets: 3, reps: 30, restSeconds: 45, timed: true },
          ],
        },
      ],
    },

    {
      id: 'rings_beginner_circuit',
      name: 'Beginner Calisthenics Rings Workout',
      description: 'Full beginner rings session: rows at multiple angles, push-ups, dips, pull-ups, ring holds, and lower-body filler.',
      level: 'Beginner',
      frequency: 'Single session',
      equipment: ['gymnastic-rings'],
      videoId: 'H2dE7-ZoxpA',
      days: [
        {
          name: 'Full Body Circuit',
          exercises: [
            { name: 'Inverted Row',              sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Push-Up',                   sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Triceps Dip',               sets: 3, reps: 8,  restSeconds: 90 },
            { name: 'Wide-Grip Pull-Up',         sets: 3, reps: 5,  restSeconds: 90 },
            { name: 'Plank',                     sets: 3, reps: 30, restSeconds: 45, timed: true },
            { name: 'Bodyweight Squat',          sets: 3, reps: 15, restSeconds: 45 },
            { name: 'Bodyweight Walking Lunge',  sets: 3, reps: 10, restSeconds: 60 },
          ],
        },
      ],
    },

    {
      id: 'rings_beginner_20min',
      name: '20 Min Rings Workout for Beginners',
      description: 'Timed interval circuit on the rings: rows, push-ups, dips, static holds, and core finishers.',
      level: 'Beginner',
      frequency: '20 min circuit',
      equipment: ['gymnastic-rings'],
      videoId: 'AVfCDyG70DU',
      days: [
        {
          name: 'Rings Circuit',
          exercises: [
            { name: 'Inverted Row',      sets: 4, reps: 10, restSeconds: 45 },
            { name: 'Push-Up',           sets: 4, reps: 12, restSeconds: 45 },
            { name: 'Triceps Dip',       sets: 4, reps: 8,  restSeconds: 60 },
            { name: 'Plank',             sets: 4, reps: 30, restSeconds: 30, timed: true },
            { name: 'Close Grip Push-Up',sets: 3, reps: 12, restSeconds: 45 },
          ],
        },
      ],
    },

    // ── CALISTHENICS + KETTLEBELL ────────────────────────────────────────────
    {
      id: 'cali_kb_combo',
      name: 'Calisthenics × Kettlebells Combo',
      description: 'Killer combo pairing calisthenics and a single kettlebell in supersets: swings + pull-ups, goblet squats + push-ups, presses, rows, and core.',
      level: 'Intermediate',
      frequency: 'Single session',
      equipment: ['power-tower', 'kettlebell'],
      videoId: 'DmRS8RPCqWM',
      days: [
        {
          name: 'Full Body Supersets',
          exercises: [
            { name: 'Kettlebell Swing',         sets: 4, reps: 15, restSeconds: 45 },
            { name: 'Wide-Grip Pull-Up',        sets: 4, reps: 8,  restSeconds: 45 },
            { name: 'Kettlebell Goblet Squat',  sets: 4, reps: 10, restSeconds: 60 },
            { name: 'Push-Up',                  sets: 4, reps: 15, restSeconds: 45 },
            { name: 'Kettlebell Military Press',sets: 3, reps: 8,  restSeconds: 60 },
            { name: 'Kettlebell Row',           sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Bodyweight Walking Lunge', sets: 3, reps: 12, restSeconds: 45 },
            { name: 'Plank',                    sets: 3, reps: 45, restSeconds: 30, timed: true },
          ],
        },
      ],
    },

    {
      id: 'rings_kb_conditioner',
      name: 'Rings + Kettlebell Pull/Push Conditioner',
      description: 'Conditioning circuit alternating ring pull and push moves with kettlebell swings and loaded carries. Great as a holiday or travel workout.',
      level: 'Intermediate',
      frequency: 'Conditioning circuit',
      equipment: ['gymnastic-rings', 'kettlebell'],
      videoId: 'IMXKS4zRd3E',
      days: [
        {
          name: 'Pull/Push Circuit',
          exercises: [
            { name: 'Inverted Row',             sets: 4, reps: 10, restSeconds: 45 },
            { name: 'Push-Up',                  sets: 4, reps: 12, restSeconds: 45 },
            { name: 'Triceps Dip',              sets: 4, reps: 8,  restSeconds: 60 },
            { name: 'Kettlebell Swing',         sets: 5, reps: 15, restSeconds: 45 },
            { name: 'Kettlebell Clean and Press',sets: 3, reps: 6, restSeconds: 60 },
            { name: 'Kettlebell Row',           sets: 3, reps: 10, restSeconds: 60 },
          ],
        },
      ],
    },

    {
      id: 'kb_rings_part1',
      name: 'Kettlebell and Gymnastics Rings – Part 1',
      description: 'Rounds pairing a ring move with a kettlebell move each round: swings, goblet squats, ring rows, push-ups, and core finishers.',
      level: 'Intermediate',
      frequency: 'Single session',
      equipment: ['gymnastic-rings', 'kettlebell'],
      videoId: 'nphjsz6S-s4',
      days: [
        {
          name: 'Combo Rounds',
          exercises: [
            { name: 'Kettlebell Swing',        sets: 4, reps: 15, restSeconds: 60 },
            { name: 'Inverted Row',            sets: 4, reps: 10, restSeconds: 60 },
            { name: 'Kettlebell Goblet Squat', sets: 4, reps: 10, restSeconds: 90 },
            { name: 'Push-Up',                sets: 4, reps: 12, restSeconds: 60 },
            { name: 'Triceps Dip',            sets: 3, reps: 8,  restSeconds: 90 },
            { name: 'Plank',                  sets: 3, reps: 45, restSeconds: 45, timed: true },
          ],
        },
      ],
    },

    // ── THE REP THEORY (youtube.com/@thereptheory111) ───────────────────────
    // Transcribed from the channel's own videos. Set/rep/hold prescriptions are
    // his; equipment substitutions use the power tower, rings and kettlebell in
    // equipment/inventory.json in place of his improvised tables and chairs.
    {
      id: 'rt_90_roadmap',
      name: 'Rep Theory 90 — Calisthenics Roadmap',
      description: "The channel's own 90-day roadmap, in three 30-day phases. Phase 1 builds the pattern (he is explicit that month-one gains are nervous-system, not size, so chase clean reps and not a pump). Phase 2 raises the leverage and adds a tendon day. Phase 3 keeps Phase 2 and opens each session with one skill while you are fresh. Progression rule throughout: three clean sets of 12 earns the next step — \"not when you feel like it, when your numbers say so.\" Benchmark three numbers on day 0 and retest at day 60: max clean push-ups, straight-body plank, and bar hang. Three days a week is the prescription; he warns that training daily is what wrecks wrists and elbows by week two. Eat slightly above maintenance with ~1.6 g protein per kg bodyweight.",
      level: 'Beginner',
      frequency: '3×/week (+1 holds day in Phase 2+)',
      equipment: ['power-tower'],
      days: [
        {
          name: 'Phase 1 — Foundation (Days 1–30)',
          exercises: [
            { name: 'Push-Up',                   sets: 3, reps: 8,  restSeconds: 60 },
            { name: 'Inverted Row',              sets: 3, reps: 8,  restSeconds: 60 },
            { name: 'Split Squat',               sets: 3, reps: 8,  restSeconds: 60 },
            { name: 'Push-Up Bottom Hold',       sets: 2, reps: 25, restSeconds: 45, timed: true },
            { name: 'Wall Sit',                  sets: 2, reps: 25, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Phase 2 — Build (Days 31–60)',
          exercises: [
            { name: 'Decline Push-Up',           sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Pike Push-Up',              sets: 3, reps: 8,  restSeconds: 60 },
            { name: 'Pull-Up Negative',          sets: 3, reps: 5,  restSeconds: 90 },
            { name: 'Bulgarian Split Squat',     sets: 3, reps: 10, restSeconds: 90 },
            { name: 'Triceps Dip',               sets: 3, reps: 8,  restSeconds: 60 },
          ],
        },
        {
          name: 'Phase 2 — Tendon Holds Day',
          exercises: [
            { name: 'Push-Up Bottom Hold',       sets: 4, reps: 25, restSeconds: 60, timed: true },
            { name: 'Split Squat Hold',          sets: 4, reps: 25, restSeconds: 60, timed: true },
            { name: 'Wall Sit',                  sets: 3, reps: 30, restSeconds: 45, timed: true },
          ],
        },
        {
          name: 'Phase 3 — Skills (Days 61–90)',
          exercises: [
            { name: 'Planche Lean',              sets: 5, reps: 8,  restSeconds: 45, timed: true },
            { name: 'L-Sit',                     sets: 4, reps: 15, restSeconds: 60, timed: true },
            { name: 'Wall Handstand',            sets: 4, reps: 20, restSeconds: 60, timed: true },
            { name: 'Decline Push-Up',           sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Pull-Up',                   sets: 3, reps: 5,  restSeconds: 90 },
            { name: 'Bulgarian Split Squat',     sets: 3, reps: 12, restSeconds: 90 },
          ],
        },
      ],
    },

    {
      id: 'rt_isometrics',
      name: 'Rep Theory — Isometric Strength',
      description: "Six holds on the channel's own three-day week: Monday and Friday are the long-hold days, Wednesday is the explosive day. The rule that governs all of it — long holds sit at about 7/10 effort so the last five seconds are a fight, while the short overcoming pushes are all-out from the first instant (\"don't ease into it, go from zero to everything\"). Long holds build tendon stiffness and some muscle; the short pushes teach the nervous system to fire everything at once. Breathe out as you push and never hold your breath, since hard holds raise blood pressure while you do them; stop if a joint hurts rather than burns. Give it 12 weeks before judging it. Self-test is the push-up bottom hold: under 15s start from the knees, 15–30s run the plan as written, 30–60s add a backpack or elevate the feet, over a minute go straight to the hardest versions.",
      level: 'Beginner–Intermediate',
      frequency: '3×/week (~15 min)',
      equipment: [],
      days: [
        {
          name: 'Long Holds (Mon / Fri)',
          exercises: [
            { name: 'Push-Up Bottom Hold',       sets: 4, reps: 25, restSeconds: 60, timed: true },
            { name: 'Split Squat Hold',          sets: 4, reps: 25, restSeconds: 60, timed: true },
            { name: 'L-Sit',                     sets: 4, reps: 10, restSeconds: 60, timed: true },
          ],
        },
        {
          name: 'Overcoming Strength (Wed)',
          exercises: [
            { name: 'Towel Curl Isometric',      sets: 5, reps: 5,  restSeconds: 45, timed: true },
            { name: 'Isometric Chest Press',     sets: 5, reps: 5,  restSeconds: 45, timed: true },
            { name: 'Doorway Push Isometric',    sets: 5, reps: 5,  restSeconds: 45, timed: true },
            { name: 'Hollow Body Hold',          sets: 4, reps: 25, restSeconds: 60, timed: true },
            { name: 'Wall Handstand',            sets: 4, reps: 20, restSeconds: 60, timed: true },
          ],
        },
        {
          name: '5-Minute Version (busy day)',
          exercises: [
            { name: 'Push-Up Bottom Hold',       sets: 1, reps: 25, restSeconds: 30, timed: true },
            { name: 'Split Squat Hold',          sets: 2, reps: 25, restSeconds: 30, timed: true },
            { name: 'Doorway Push Isometric',    sets: 5, reps: 5,  restSeconds: 30, timed: true },
          ],
        },
      ],
    },

    {
      id: 'rt_morning_core',
      name: 'Rep Theory — Morning Core',
      description: "Ten minutes of holds, built for the first hour after waking. No sit-ups and no toe touches early — overnight the spinal discs take on water and sit tight, so loaded flexion hits them hardest first thing; he cites a trial where people with ongoing back pain changed nothing but avoiding early-morning bending and saw pain drop significantly over six months. So every move here holds a position instead of bending the spine. Side planks start on your weaker side, and the left/right gap matters more than the total: more than about 10 seconds of difference is your weak link, and that is the side that gives out when you carry, lift or land. Add 5 seconds to the holds each week, or step up to the harder version. Short on time, do the side plank and the hard plank — those two cover the most. The hard plank puts the elbows forward under your eyes rather than your shoulders, which a study found worked upper abs, lower abs and obliques significantly harder.",
      level: 'Beginner',
      frequency: 'Daily (~10 min)',
      equipment: [],
      days: [
        {
          name: 'Morning Core',
          exercises: [
            { name: 'Glute Bridge',              sets: 2, reps: 12, restSeconds: 30 },
            { name: 'Bird Dog',                  sets: 6, reps: 8,  restSeconds: 20, timed: true },
            { name: 'Side Plank',                sets: 4, reps: 30, restSeconds: 30, timed: true },
            { name: 'Hollow Body Hold',          sets: 3, reps: 25, restSeconds: 30, timed: true },
            { name: 'Long-Lever Plank',          sets: 3, reps: 20, restSeconds: 30, timed: true },
          ],
        },
      ],
    },

    {
      id: 'rt_carries',
      name: 'Rep Theory — Loaded Carries',
      description: "Five carries ranked worst to best, with the suitcase carry at number one: all the load on one side pulls you over at every step, so the muscles around the whole waist fire together and brace the trunk — real core strength is refusing to bend, not bending. Pick three carries a session (he recommends the suitcase, the farmer's walk and whichever you like most), 40 seconds each, a minute of rest, three rounds, two or three times a week. On off days take the backpack for a walk — start near a tenth of your bodyweight for 20 minutes and add a book when it gets easy. Form: hips back and flat back on the pickup, never round to grab the load; short quiet steps like carrying a full cup you can't spill; chest up, shoulders down away from the ears, small breaths behind a braced stomach. If you lean, it's too heavy. Switch hands every round on the one-sided carries. Self-test is holding a loaded jug in each hand — under 30 seconds and your grip is holding the rest of you back.",
      level: 'Beginner',
      frequency: '2–3×/week',
      equipment: ['kettlebell'],
      days: [
        {
          name: 'Carry Day',
          exercises: [
            { name: 'Suitcase Carry',            sets: 6, reps: 40, restSeconds: 60, timed: true },
            { name: "Farmer's Walk",             sets: 3, reps: 40, restSeconds: 60, timed: true },
            { name: 'Bear Hug Carry',            sets: 3, reps: 40, restSeconds: 60, timed: true },
          ],
        },
        {
          name: 'Grip Focus',
          exercises: [
            { name: 'Suitcase Carry',            sets: 6, reps: 40, restSeconds: 60, timed: true },
            { name: 'Pinch Carry',               sets: 3, reps: 40, restSeconds: 60, timed: true },
            { name: "Farmer's Walk",             sets: 3, reps: 40, restSeconds: 60, timed: true },
          ],
        },
        {
          name: 'Off-Day Backpack Walk',
          exercises: [
            { name: 'Weighted Backpack Walk',    sets: 1, reps: 1200, restSeconds: 0, timed: true },
          ],
        },
      ],
    },

    {
      id: 'rt_back_no_bar',
      name: 'Rep Theory — Back Without a Bar',
      description: "Back work for a home setup with no pull-up bar, two or three times a week: each session takes one row, one pull-down and the Y/T raises at the end — about 10 hard sets a week. One rule governs every move: pull with your elbows, not your hands, and keep them close to your sides, which studies on rows found makes the lats work harder. Take sets close to failure, stopping with one or two reps left, and rest about a minute. Pull at least as much as you push — if you do push-ups three times a week, your back gets the same. Self-test is the Y hold: under 30 seconds means your upper back is the weak link, so do the Y/T raises every session rather than only at the end. Door rows rank first here because your own bodyweight is the load and the angle gets harder as you walk your feet in; test the handles with a small lean before the first rep.",
      level: 'Beginner',
      frequency: '2–3×/week',
      equipment: [],
      days: [
        {
          name: 'Back A',
          exercises: [
            { name: 'Door Row',                  sets: 3, reps: 12, restSeconds: 60 },
            { name: 'Towel Lat Pulldown Hold',   sets: 5, reps: 10, restSeconds: 45, timed: true },
            { name: 'Y Raise',                   sets: 3, reps: 12, restSeconds: 45 },
            { name: 'T Raise',                   sets: 3, reps: 12, restSeconds: 45 },
          ],
        },
        {
          name: 'Back B',
          exercises: [
            { name: 'One-Arm Backpack Row',      sets: 3, reps: 15, restSeconds: 60 },
            { name: 'Floor Slide Pull',          sets: 3, reps: 10, restSeconds: 60 },
            { name: 'Y Raise',                   sets: 3, reps: 12, restSeconds: 45 },
            { name: 'T Raise',                   sets: 3, reps: 12, restSeconds: 45 },
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
        ${p.videoId ? `<a class="program-video-link" href="https://www.youtube.com/watch?v=${p.videoId}" target="_blank" rel="noopener">▶ Watch video</a>` : ''}
        <div class="program-card-days">
          ${p.days.map(d => `<span class="program-day-pill">${d.name}</span>`).join('')}
        </div>
        <button class="btn btn-primary full-w program-add-btn" data-id="${p.id}">
          Add to My Routines
        </button>
      </div>`).join('');

    list.querySelectorAll('.program-add-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const prog = PROGRAMS.find(p => p.id === btn.dataset.id);
        if (!prog) return;
        btn.disabled = true;
        btn.textContent = 'Adding…';
        await addProgramAsRoutine(prog);
        document.getElementById('programs-modal')?.remove();
      });
    });
  }

  // ── Add program to user's routines ────────────────────────────────────────

  async function addProgramAsRoutine(program) {
    const allExercises = await API.loadAll();

    // Create one routine per day in the program
    program.days.forEach(day => {
      const routineName = `${program.name} — ${day.name}`;
      // Skip if already exists
      if (Storage.getRoutines().some(r => r.name === routineName)) return;

      const r = Storage.createRoutine(routineName);
      if (program.videoId) Storage.updateRoutine(r.id, { videoId: program.videoId });
      day.exercises.forEach(ex => {
        const dbEx = allExercises.find(e => e.displayName.toLowerCase() === ex.name.toLowerCase());
        Storage.addExerciseToRoutine(r.id, {
          id:           dbEx?.id || 'custom_' + ex.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
          displayName:  ex.name,
          equipment:    dbEx?.equipment || '',
          primaryMuscle: dbEx?.primaryMuscle || [],
          sets:         ex.sets,
          reps:         ex.reps,
          restSeconds:  ex.restSeconds,
          timed:        ex.timed || false,
        });
      });
    });

    Routine.renderList();
    App.toast(`${program.name} added (${program.days.length} routines)`);
  }

  return { openBrowser, PROGRAMS, EQUIPMENT_OPTIONS };
})();
