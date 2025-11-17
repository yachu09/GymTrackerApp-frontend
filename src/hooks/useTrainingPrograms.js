import { useEffect, useState, useRef } from "react";
import { getDb, initDatabase } from "../database/localDatabase";

export function useTrainingPrograms() {
  const [programs, setPrograms] = useState([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const setup = async () => {
      try {
        await initDatabase();
        await loadPrograms();
      } catch (e) {
        console.error("DB init/load error:", e);
      }
    };
    setup();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  //nowy
  const loadPrograms = async () => {
    try {
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

      setPrograms(programsWithExercises);
      // console.log(
      //   "Programy z ćwiczeniami i seriami:",
      //   JSON.stringify(programsWithExercises, null, 2)
      // );
    } catch (e) {
      console.error("loadPrograms error:", e);
    }
  };

  /**
   * Dodaje serie, powtórzenia i czas przerwy dla konkretnego ćwiczenia.
   * - programExerciseId: ID ćwiczenia w tabeli programExercises
   * - repsOfSets: tablica [{ set: number, reps: number }]
   * - breakTime: liczba sekund (jedna wartość dla wszystkich serii)
   */
  const addSetsRepsAndBreakTime = async (
    programExerciseId,
    repsOfSets,
    breakTime
  ) => {
    try {
      const db = await getDb();

      //pominięcie pustej tablice
      if (!repsOfSets || repsOfSets.length === 0) {
        console.warn("Brak danych serii do zapisania");
        return;
      }

      //wszystkie inserty muszą się udać albo żaden
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
        `Zapisano ${repsOfSets.length} serii (breakTime: ${breakTime}s) dla ćwiczenia ${programExerciseId}`
      );
    } catch (e) {
      console.error("addSetsRepsAndBreakTime error:", e);
    }
  };

  const addProgramWithExercises = async (programName, exercisesArr) => {
    try {
      const db = await getDb();

      const result = await db.runAsync(
        "INSERT INTO trainingPrograms (name) VALUES (?);",
        [programName]
      );
      const programId = result.lastInsertRowId;

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

      return programId;
    } catch (err) {
      console.error("addProgramWithExercises error: ", err);
    }
  };

  const dropAllTables = async () => {
    try {
      const db = await getDb();

      await db.withTransactionAsync(async () => {
        await db.runAsync("DROP TABLE IF EXISTS exerciseSets;");
        await db.runAsync("DROP TABLE IF EXISTS programExercises;");
        await db.runAsync("DROP TABLE IF EXISTS trainingPrograms;");
      });

      console.log("Wszystkie tabele zostały usunięte.");

      setPrograms([]);
    } catch (e) {
      console.error("dropAllTables error:", e);
    }
  };

  return {
    programs,
    loadPrograms,
    addProgramWithExercises,
    addSetsRepsAndBreakTime,
    dropAllTables,
  };
}
