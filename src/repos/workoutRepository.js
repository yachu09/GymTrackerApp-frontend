import { getDb } from "../database/localDatabase";

//pobieranie pełnej listy workoutów
export const loadWorkoutsFromDb = async () => {
  const db = await getDb();

  console.log("Pobieram listę treningów...");

  const workouts = await db.getAllAsync(`
    SELECT w.id, w.programId, w.date, tp.name as programName
    FROM workouts w
    JOIN trainingPrograms tp ON w.programId = tp.id
    ORDER BY w.date DESC;
  `);

  const workoutSets = await db.getAllAsync(`
    SELECT ws.*, pe.exerciseName, pe.imageUrl, pe.muscleGroup
    FROM workoutSets ws
    JOIN programExercises pe ON ws.programExerciseId = pe.id;
  `);

  const workoutsWithDetails = workouts.map((workout) => {
    const setsForWorkout = workoutSets.filter(
      (s) => s.workoutId === workout.id
    );

    const groupedExercises = Object.values(
      setsForWorkout.reduce((acc, s) => {
        if (!acc[s.programExerciseId]) {
          acc[s.programExerciseId] = {
            programExerciseId: s.programExerciseId,
            exerciseName: s.exerciseName,
            muscleGroup: s.muscleGroup,
            imageUrl: s.imageUrl,
            sets: [],
          };
        }
        acc[s.programExerciseId].sets.push({
          setNumber: s.setNumber,
          weight: s.weight,
          reps: s.reps,
        });
        return acc;
      }, {})
    );

    return { ...workout, exercises: groupedExercises };
  });

  console.log(
    "Załadowane treningi:",
    JSON.stringify(workoutsWithDetails, null, 2)
  );

  return workoutsWithDetails;
};

// tworzenie treningu
export const startWorkoutInDb = async (programId) => {
  const db = await getDb();

  console.log(`Rozpoczynam trening dla programId=${programId}...`);

  const result = await db.runAsync(
    `INSERT INTO workouts (programId, date) VALUES (?, datetime('now'));`,
    [programId]
  );

  const workoutId = result.lastInsertRowId;

  console.log(`Rozpoczęto trening (programId=${programId}, id=${workoutId})`);

  return workoutId;
};

//dodawanie serii do treningu
export const addWorkoutSetToDb = async (
  workoutId,
  programExerciseId,
  setNumber,
  weight,
  reps
) => {
  const db = await getDb();

  console.log(
    `Dodaję serię: workoutId=${workoutId}, exerciseId=${programExerciseId}, set=${setNumber} (${weight}kg x ${reps})`
  );

  await db.runAsync(
    `INSERT INTO workoutSets (workoutId, programExerciseId, setNumber, weight, reps)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(workoutId, programExerciseId, setNumber)
     DO UPDATE SET weight = excluded.weight, reps = excluded.reps;`,
    [workoutId, programExerciseId, setNumber, weight, reps]
  );

  console.log("Seria zapisana.");
};

//usuwanie treningu
export const deleteWorkoutInDb = async (workoutId) => {
  const db = await getDb();

  console.log(`Usuwam trening ID=${workoutId}...`);

  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM workoutSets WHERE workoutId = ?;", [
      workoutId,
    ]);
    await db.runAsync("DELETE FROM workouts WHERE id = ?;", [workoutId]);
  });

  console.log(`Trening o ID ${workoutId} został usunięty.`);
};

//usuwanie całej historii treningów
export const deleteAllWorkoutsInDb = async () => {
  const db = await getDb();

  console.log("Usuwam całą historię treningów...");

  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM workoutSets;");
    await db.runAsync("DELETE FROM workouts;");
  });

  console.log("Wyczyściłem wszystkie treningi.");
};

export const getLatestWorkoutIdFromDb = async () => {
  const db = await getDb();
  const rows = await db.getAllAsync(
    `SELECT id FROM workouts ORDER BY date DESC LIMIT 1;`
  );

  if (rows.length === 0) return null;

  return rows[0].id;
};

export const addDummyDataInDb = async () => {
  const db = await getDb();

  try {
    console.log("Dodaję dummy data...");

    const statements = [
      `INSERT INTO workouts (programId, date) VALUES (1, "2025-11-09 02:10:32")`,
      `INSERT INTO workouts (programId, date) VALUES (1, "2025-11-10 01:18:27")`,
      `INSERT INTO workouts (programId, date) VALUES (1, "2025-11-12 02:12:23")`,
      `INSERT INTO workouts (programId, date) VALUES (1, "2025-11-13 02:15:26")`,
      `INSERT INTO workouts (programId, date) VALUES (1, "2025-11-16 11:11:11")`,
    ];

    for (const sql of statements) {
      await db.runAsync(sql);
    }

    console.log("Dodano dummy data.");
  } catch (e) {
    console.error("addDummyDataInDb ERROR:", e);
  }
};
