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
    "%cLoaded programs (repository):",
    "color: #222; font-weight: bold;",
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
    `%cZapisano ${repsOfSets.length} serii (breakTime: ${breakTime}s) dla ćwiczenia ${programExerciseId}`,
    "color: orange; font-weight: bold;"
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
