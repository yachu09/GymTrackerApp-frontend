// repositories/trainingProgramsRepository.js
import { getDb, initDatabase } from "../database/localDatabase";

export const loadProgramsFromDb = async () => {
  const db = await getDb();

  const programs = await db.getAllAsync(
    "SELECT * FROM trainingPrograms ORDER BY id DESC;"
  );
  const days = await db.getAllAsync(
    "SELECT * FROM trainingProgramDays ORDER BY dayOrder ASC;"
  );
  const exercises = await db.getAllAsync("SELECT * FROM programExercises;");
  const sets = await db.getAllAsync("SELECT * FROM exerciseSets;");

  const result = programs.map((program) => {
    const programDays = days
      .filter((d) => d.programId === program.id)
      .map((day) => {
        const dayExercises = exercises
          .filter((ex) => ex.programDayId === day.id)
          .map((exercise) => ({
            ...exercise,
            sets: sets
              .filter((s) => s.programExerciseId === exercise.id)
              .sort((a, b) => a.setNumber - b.setNumber),
          }));

        return { ...day, exercises: dayExercises };
      });

    return { ...program, days: programDays };
  });

  console.log(
    "Loaded programs (with days & exercises):",
    JSON.stringify(result, null, 2)
  );
  return result;
};

export const addProgramToDb = async (programName) => {
  const db = await getDb();
  const result = await db.runAsync(
    "INSERT INTO trainingPrograms (name) VALUES (?);",
    [programName]
  );
  console.log(`Dodano plan treningowy: ID=${result.lastInsertRowId}`);
  return result.lastInsertRowId;
};

export const addTrainingDayWithExercisesToDb = async (
  programId,
  dayName,
  exercisesArr
) => {
  const db = await getDb();

  const dayResult = await db.runAsync(
    `INSERT INTO trainingProgramDays (programId, dayOrder, dayName)
     VALUES (
       ?, 
       (SELECT IFNULL(MAX(dayOrder), 0) + 1 FROM trainingProgramDays WHERE programId = ?),
       ?
     );`,
    [programId, programId, dayName]
  );

  const programDayId = dayResult.lastInsertRowId;
  console.log(`Dodano dzień treningowy: ${dayName} (ID=${programDayId})`);

  for (const item of exercisesArr) {
    await db.runAsync(
      `INSERT INTO programExercises (programDayId, exerciseId, exerciseName, description, muscleGroup, imageUrl)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [
        programDayId,
        item.id,
        item.name,
        item.description,
        item.muscleGroup,
        item.imageUrl,
      ]
    );
  }

  console.log(`Dodano ${exercisesArr.length} ćwiczeń do dnia ${programDayId}`);
  return programDayId;
};

export const addSetsRepsBreakToDb = async (
  programExerciseId,
  repsOfSets,
  breakTime
) => {
  if (!repsOfSets?.length) return;

  const db = await getDb();
  await db.withTransactionAsync(async () => {
    for (const { set, reps } of repsOfSets) {
      await db.runAsync(
        `INSERT INTO exerciseSets (programExerciseId, setNumber, reps, breakTime)
         VALUES (?, ?, ?, ?);`,
        [programExerciseId, set, reps, breakTime]
      );
    }
  });

  console.log(
    `Zapisano serie (sets=${repsOfSets.length}, break=${breakTime}s) dla exerciseId=${programExerciseId}`
  );
};

export const deleteProgramInDb = async (programId) => {
  const db = await getDb();

  try {
    await db.withTransactionAsync(async () => {
      const days = await db.getAllAsync(
        "SELECT id FROM trainingProgramDays WHERE programId = ?;",
        [programId]
      );

      for (const { id: dayId } of days) {
        const exercises = await db.getAllAsync(
          "SELECT id FROM programExercises WHERE programDayId = ?;",
          [dayId]
        );

        for (const { id: programExerciseId } of exercises) {
          await db.runAsync(
            "DELETE FROM exerciseSets WHERE programExerciseId = ?;",
            [programExerciseId]
          );
        }

        await db.runAsync(
          "DELETE FROM programExercises WHERE programDayId = ?;",
          [dayId]
        );
      }

      await db.runAsync("DELETE FROM trainingProgramDays WHERE programId = ?", [
        programId,
      ]);
      await db.runAsync("DELETE FROM trainingPrograms WHERE id = ?", [
        programId,
      ]);
    });

    console.log(`Usunięto plan treningowy ID=${programId}`);
  } catch (error) {
    console.error("Błąd usuwania programu:", error);
    throw error;
  }
};

export const deleteAllProgramsInDb = async () => {
  const db = await getDb();
  try {
    await db.execAsync(`
      DROP TABLE IF EXISTS exerciseSets;
      DROP TABLE IF EXISTS programExercises;
      DROP TABLE IF EXISTS trainingProgramDays;
      DROP TABLE IF EXISTS trainingPrograms;
    `);
    await initDatabase();
    console.log("Wyczyszczono wszystkie tabele programu treningowego");
  } catch (error) {
    console.error("Błąd podczas czyszczenia tabel:", error);
    throw error;
  }
};

export const deleteTrainingDayInDb = async (programDayId) => {
  const db = await getDb();

  try {
    await db.withTransactionAsync(async () => {
      // Usuń serie z ćwiczeń
      const exercises = await db.getAllAsync(
        "SELECT id FROM programExercises WHERE programDayId = ?;",
        [programDayId]
      );

      for (const { id: exerciseId } of exercises) {
        await db.runAsync(
          "DELETE FROM exerciseSets WHERE programExerciseId = ?;",
          [exerciseId]
        );
      }

      // Usuń ćwiczenia
      await db.runAsync(
        "DELETE FROM programExercises WHERE programDayId = ?;",
        [programDayId]
      );

      // Usuń historię treningów i ich serie
      const workouts = await db.getAllAsync(
        "SELECT id FROM workouts WHERE programDayId = ?;",
        [programDayId]
      );

      for (const { id: workoutId } of workouts) {
        await db.runAsync("DELETE FROM workoutSets WHERE workoutId = ?;", [
          workoutId,
        ]);
      }

      await db.runAsync("DELETE FROM workouts WHERE programDayId = ?;", [
        programDayId,
      ]);

      // Usuń dzień programu
      await db.runAsync("DELETE FROM trainingProgramDays WHERE id = ?;", [
        programDayId,
      ]);
    });

    console.log(`Usunięto dzień treningowy ID=${programDayId}`);
  } catch (error) {
    console.error("Błąd podczas usuwania dnia treningowego:", error);
    throw error;
  }
};

export const updateProgramNameInDb = async (programId, newName) => {
  const db = await getDb();

  await db.runAsync("UPDATE trainingPrograms SET name = ? WHERE id = ?;", [
    newName,
    programId,
  ]);

  console.log(`Zmieniono nazwę programu ID=${programId} na "${newName}"`);
};

export const updateTrainingDayNameInDb = async (programDayId, newDayName) => {
  const db = await getDb();

  await db.runAsync(
    "UPDATE trainingProgramDays SET dayName = ? WHERE id = ?;",
    [newDayName, programDayId]
  );

  console.log(
    `Zmieniono nazwę dnia treningowego ID=${programDayId} na "${newDayName}"`
  );
};
