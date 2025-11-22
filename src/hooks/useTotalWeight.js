import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { Context as WorkoutContext } from "../context/WorkoutContext";

export default (workoutId) => {
  const [totalWeight, setTotalWeight] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    state: { workouts },
    loadWorkouts,
  } = useContext(WorkoutContext);

  useEffect(() => {
    const loadAndCalculate = async () => {
      try {
        await loadWorkouts();
        const workout = workouts.find((w) => w.id === workoutId);
        const total = calculateTotalWeight(workout);
        setTotalWeight(total);
      } catch (err) {
        console.log(err);
        setErrorMessage(err);
      }
    };
    loadAndCalculate();
  }, []);

  const calculateTotalWeight = (workout) => {
    if (workout && workout.exercises) {
      let total = 0;
      workout.exercises.forEach((exercise) => {
        if (exercise.sets) {
          exercise.sets.forEach((set) => {
            total += set.weight * set.reps || 0;
          });
        }
      });
      return total;
    }
    return 0;
  };

  return [totalWeight, errorMessage];
};
