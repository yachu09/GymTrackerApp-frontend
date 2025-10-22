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

  const loadPrograms = async () => {
    try {
      const db = await getDb();

      const programs = await db.getAllAsync(`
      SELECT * FROM trainingPrograms ORDER BY id DESC;
    `);

      const exercises = await db.getAllAsync(`
      SELECT * FROM programExercises ORDER BY programId;
    `);

      const programsWithExercises = programs.map((program) => ({
        ...program,
        exercises: exercises.filter((ex) => ex.programId === program.id),
      }));

      setPrograms(programsWithExercises);
      console.log("Aktualne plany treningowe:", programsWithExercises);
    } catch (e) {
      console.error("loadPrograms error:", e);
    }
  };

  const addProgram = async (name) => {
    try {
      const db = await getDb();
      await db.runAsync("INSERT INTO trainingPrograms (name) VALUES (?);", [
        name,
      ]);
      await loadPrograms();
    } catch (e) {
      console.error("addProgram error", e);
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
    } catch (err) {
      console.error("addProgramWithExercises error: ", err);
    }

    return programId;
  };

  return { programs, addProgram, loadPrograms, addProgramWithExercises };
}
