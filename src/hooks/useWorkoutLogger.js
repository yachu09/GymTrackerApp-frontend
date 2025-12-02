import { useState, useEffect } from "react";

export default function useWorkoutLogger({
  workout,
  exercises,
  currentWorkoutId,
  addWorkoutSet,
  loadWorkouts,
  startBreak,
  breakTimeGetter,
}) {
  const [loggedSets, setLoggedSets] = useState(new Set());

  // pobranie zalogowanych setów z bazy po odświeżeniu workoutu
  useEffect(() => {
    if (!workout) return;
    const logged = new Set();

    workout.exercises?.forEach((exercise) => {
      exercise.sets?.forEach((set) => {
        const key = `${exercise.programExerciseId}_${set.setNumber}`;
        logged.add(key);
      });
    });

    setLoggedSets(logged);
  }, [workout]);

  const logSet = async (focusedSet, inputs) => {
    if (!focusedSet) return;
    if (!currentWorkoutId) return;

    const { exerciseId, setId } = focusedSet;
    const key = `${exerciseId}_${setId}`;
    const data = inputs[key];

    if (!data) return;

    await addWorkoutSet(
      currentWorkoutId,
      exerciseId,
      setId,
      data.weight,
      data.reps
    );

    await loadWorkouts();

    setLoggedSets((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });

    const breakSeconds = breakTimeGetter(exerciseId, setId);
    startBreak(breakSeconds);
  };

  return {
    loggedSets,
    logSet,
  };
}
