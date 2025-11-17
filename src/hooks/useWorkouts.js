import { useState, useEffect, useRef } from "react";
import { getDb, initDatabase } from "../database/localDatabase";

export function useWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const setup = async () => {
      try {
        await initDatabase();
        await loadWorkouts();
      } catch (err) {
        console.error("DB init/load error:", err);
      }
    };
    setup();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadWorkouts = async () => {
    try {
      const db = await getDb();

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

      setWorkouts(workoutsWithDetails);
      console.log(
        "Załadowane treningi:",
        JSON.stringify(workoutsWithDetails, null, 2)
      );
    } catch (e) {
      console.error("loadWorkouts error:", e);
    }
  };

  const startWorkout = async (programId) => {
    try {
      const db = await getDb();

      const result = await db.runAsync(
        `INSERT INTO workouts (programId, date) VALUES (?, datetime('now'));`,
        [programId]
      );

      const workoutId = result.lastInsertRowId;
      console.log(
        `Rozpoczęto trening (programId=${programId}, id=${workoutId})`
      );
      return workoutId;
    } catch (e) {
      console.error("startWorkout error:", e);
    }
  };

  const addWorkoutSet = async (
    workoutId,
    programExerciseId,
    setNumber,
    weight,
    reps
  ) => {
    try {
      const db = await getDb();

      await db.runAsync(
        `INSERT INTO workoutSets (workoutId, programExerciseId, setNumber, weight, reps)
   VALUES (?, ?, ?, ?, ?)
   ON CONFLICT(workoutId, programExerciseId, setNumber)
   DO UPDATE SET weight = excluded.weight, reps = excluded.reps;`,
        [workoutId, programExerciseId, setNumber, weight, reps]
      );

      console.log(
        `Dodano serię: workout=${workoutId}, ćwiczenie=${programExerciseId}, seria=${setNumber}, ${weight}kg x ${reps}`
      );
    } catch (e) {
      console.error("addWorkoutSet error:", e);
    }
  };

  const dropWorkoutById = async (workoutId) => {
    try {
      const db = await getDb();
      await db.withTransactionAsync(async () => {
        await db.runAsync("DELETE FROM workoutSets WHERE workoutId = ?;", [
          workoutId,
        ]);
        await db.runAsync("DELETE FROM workouts WHERE id = ?;", [workoutId]);
      });
      console.log(`Treningi o ID: ${workoutId} zostały usunięte.`);
      await loadWorkouts();
    } catch (err) {}
    return;
  };

  const getLatestWorkoutId = async () => {
    try {
      const db = await getDb();
      const rows = await db.getAllAsync(
        `SELECT id FROM workouts ORDER BY date DESC LIMIT 1;`
      );

      if (rows.length === 0) return null;

      return rows[0].id;
    } catch (e) {
      console.error("getLatestWorkoutId error:", e);
      return null;
    }
  };

  const dropAllWorkouts = async () => {
    try {
      const db = await getDb();
      await db.withTransactionAsync(async () => {
        await db.runAsync("DROP TABLE IF EXISTS workoutSets;");
        await db.runAsync("DROP TABLE IF EXISTS workouts;");
      });
      setWorkouts([]);
      console.log("Usunięto wszystkie dane treningów.");

      await initDatabase();
    } catch (e) {
      console.error("dropAllWorkouts error:", e);
    }
  };
  return {
    workouts,
    loadWorkouts,
    startWorkout,
    addWorkoutSet,
    dropAllWorkouts,
    dropWorkoutById,
    getLatestWorkoutId,
  };
}
