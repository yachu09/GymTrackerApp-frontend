import { useState, useEffect } from "react";

export default function useWorkoutSetInputs(workout) {
  const [inputs, setInputs] = useState({});
  const [focusedSet, setFocusedSet] = useState(null);

  // generowanie unikalnego klucza
  const getKey = (exerciseId, setId) => `${exerciseId}_${setId}`;

  // inicjalizacja inputów z bazy
  useEffect(() => {
    if (!workout) return;

    const next = {};
    workout.exercises?.forEach((exercise) => {
      exercise.sets?.forEach((set) => {
        const key = getKey(exercise.programExerciseId, set.setNumber);
        next[key] = {
          weight:
            set.weight !== null && set.weight !== undefined
              ? String(set.weight)
              : "0",
          reps:
            set.reps !== null && set.reps !== undefined ? String(set.reps) : "",
        };
      });
    });

    setInputs((prev) => ({ ...prev, ...next }));
  }, [workout]);

  const handleFocus = (exerciseId, setId) => {
    setFocusedSet({ exerciseId, setId });
  };

  const handleInputChange = (exerciseId, setId, field, value) => {
    const key = getKey(exerciseId, setId);
    setInputs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  return {
    inputs,
    focusedSet,
    setFocusedSet,
    handleFocus,
    handleInputChange,
    getKey,
  };
}
