import { getDb, initDatabase } from "../database/localDatabase";

// pobieranie pełnej listy treningów
export const loadWorkoutsFromDb = async () => {
  const db = await getDb();

  console.log("Pobieram listę treningów...");

  const workouts = await db.getAllAsync(`
    SELECT w.id, w.programDayId, w.date, w.duration,
           tpd.dayName AS dayName,
           tp.name AS programName, tp.id AS programId
    FROM workouts w
    JOIN trainingProgramDays tpd ON w.programDayId = tpd.id
    JOIN trainingPrograms tp ON tpd.programId = tp.id
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

    return {
      ...workout,
      exercises: groupedExercises,
    };
  });

  console.log(
    "Załadowane treningi:",
    JSON.stringify(workoutsWithDetails, null, 2)
  );

  return workoutsWithDetails;
};

// Tworzenie treningu
export const startWorkoutInDb = async (programDayId) => {
  const db = await getDb();

  console.log(`Rozpoczynam trening dla dayId=${programDayId}...`);

  const result = await db.runAsync(
    `INSERT INTO workouts (programDayId, date) VALUES (?, datetime('now'));`,
    [programDayId]
  );

  const workoutId = result.lastInsertRowId;

  console.log(`Rozpoczęto trening (dayId=${programDayId}, id=${workoutId})`);
  return workoutId;
};

// Dodawanie serii do treningu
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

export const deleteAllWorkoutsInDb = async () => {
  const db = await getDb();

  console.log("Dropuję historię treningów...");

  await db.withTransactionAsync(async () => {
    await db.runAsync("DROP TABLE IF EXISTS workoutSets;");
    await db.runAsync("DROP TABLE IF EXISTS workouts;");
  });

  await initDatabase();
  console.log("Wyczyszczono wszystkie treningi (DROP + RECREATE).");
};

export const endWorkoutInDb = async (workoutId, durationInSeconds) => {
  const db = await getDb();
  await db.runAsync(`UPDATE workouts SET duration = ? WHERE id = ?;`, [
    durationInSeconds,
    workoutId,
  ]);
};

export const getLatestWorkoutIdFromDb = async () => {
  const db = await getDb();
  const rows = await db.getAllAsync(
    `SELECT id FROM workouts ORDER BY date DESC LIMIT 1;`
  );

  return rows.length ? rows[0].id : null;
};

export const addDummyDataInDb = async () => {
  const db = await getDb();

  try {
    console.log("Dodaję dummy data...");

    const statements = [
      `INSERT INTO workouts (programDayId, date) VALUES (2, "2026-01-01 02:10:32")`,
      `INSERT INTO workouts (programDayId, date) VALUES (2, "2026-01-02 01:18:27")`,
      // `INSERT INTO workouts (programDayId, date) VALUES (1, "2025-11-16 02:12:23")`,
      // `INSERT INTO workouts (programDayId, date) VALUES (1, "2025-11-17 02:15:26")`,
      // `INSERT INTO workouts (programDayId, date) VALUES (2, "2025-11-23 11:11:11")`,
      // `INSERT INTO workouts (programDayId, date) VALUES (1, "2025-11-24 11:11:11")`,
      // `INSERT INTO workouts (programDayId, date) VALUES (2, "2025-11-30 11:11:11")`,
    ];

    for (const sql of statements) {
      await db.runAsync(sql);
    }

    console.log("Dodano dummy data.");
  } catch (e) {
    console.error("addDummyDataInDb ERROR:", e);
  }
};

export const hasWorkoutTodayInDb = async () => {
  const db = await getDb();

  const rows = await db.getAllAsync(`
    SELECT 1
    FROM workouts
    WHERE date(date) = date('now')
    LIMIT 1;
  `);

  return rows.length > 0;
};
