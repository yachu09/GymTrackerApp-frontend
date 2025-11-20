// repositories/programsRepository.js
import { getDb } from "../database/localDatabase";

export const loadProgramsFromDb = async () => {
  const db = await getDb();

  const programs = await db.getAllAsync(
    "SELECT * FROM trainingPrograms ORDER BY id DESC;"
  );
  const exercises = await db.getAllAsync("SELECT * FROM programExercises;");
  const sets = await db.getAllAsync("SELECT * FROM exerciseSets;");

  const programsWithExercises = programs.map((program) => {
    const programExercises = exercises
      .filter((ex) => ex.programId === program.id)
      .map((exercise) => ({
        ...exercise,
        sets: sets
          .filter((s) => s.programExerciseId === exercise.id)
          .sort((a, b) => a.setNumber - b.setNumber),
      }));

    return { ...program, exercises: programExercises };
  });

  console.log(
    "Loaded programs (repository):",
    JSON.stringify(programsWithExercises, null, 2)
  );

  return programsWithExercises;
};

export const addProgramWithExercisesToDb = async (
  programName,
  exercisesArr
) => {
  const db = await getDb();
  const result = await db.runAsync(
    "INSERT INTO trainingPrograms (name) VALUES (?);",
    [programName]
  );
  const programId = result.lastInsertRowId;
  console.log(
    `Dodano program treningowy: ID=${programId}, name="${programName}"`
  );

  for (const item of exercisesArr) {
    await db.runAsync(
      "INSERT INTO programExercises (programId, exerciseId, exerciseName, description, muscleGroup, imageUrl) VALUES (?, ?, ?, ?, ?, ?);",
      [
        programId,
        item.id,
        item.name,
        item.description,
        item.muscleGroup,
        item.imageUrl,
      ]
    );
  }

  console.log(
    `Dodano ${exercisesArr.length} ćwiczeń do programu ID=${programId}`
  );
  return programId;
};

export const addSetsRepsBreakToDb = async (
  programExerciseId,
  repsOfSets,
  breakTime
) => {
  if (!repsOfSets || repsOfSets.length === 0) return;

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
    `zapisano ${repsOfSets.length} serii (breakTime: ${breakTime}s) dla ćwiczenia ${programExerciseId}`
  );
};

export const deleteAllProgramsInDb = async () => {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    await db.runAsync("DROP TABLE IF EXISTS exerciseSets;");
    await db.runAsync("DROP TABLE IF EXISTS programExercises;");
    await db.runAsync("DROP TABLE IF EXISTS trainingPrograms;");
  });
  console.log("Wszystkie programy treningowe zostały usunięte.");
};

export const deleteProgramInDb = async (programId) => {
  const db = await getDb();

  try {
    await db.withTransactionAsync(async () => {
      const exercises = await db.getAllAsync(
        "SELECT id FROM programExercises WHERE programId = ?;",
        [programId]
      );

      for (const { id: programExerciseId } of exercises) {
        await db.runAsync(
          "DELETE FROM exerciseSets WHERE programExerciseId = ?;",
          [programExerciseId]
        );
      }

      await db.runAsync("DELETE FROM programExercises WHERE programId = ?;", [
        programId,
      ]);

      await db.runAsync("DELETE FROM trainingPrograms WHERE id = ?;", [
        programId,
      ]);
    });

    console.log(`Usunięto plan treningowy o ID: ${programId}`);
  } catch (error) {
    console.error("błąd podczas usuwania planu:", error);
    throw error;
  }
};
