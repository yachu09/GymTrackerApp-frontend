import { useContext, useEffect, useState } from "react";
import { Context as WorkoutContext } from "../context/WorkoutContext";

const calculateOneRepMax = (weight, reps) => {
  if (!weight || !reps) return null;
  return (weight * reps) / 30.48 + weight;
};

const usePersonalRecords = () => {
  const {
    state: { workouts },
    loadWorkouts,
  } = useContext(WorkoutContext);

  const [personalRecords, setPersonalRecords] = useState([]);

  useEffect(() => {
    loadWorkouts();
  }, []);

  useEffect(() => {
    if (!workouts || workouts.length === 0) {
      setPersonalRecords([]);
      return;
    }

    const exerciseRecords = {};

    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          const oneRM = calculateOneRepMax(set.weight, set.reps);

          if (!oneRM) return;

          if (
            !exerciseRecords[exercise.exerciseName] ||
            exerciseRecords[exercise.exerciseName].oneRepMax < oneRM
          ) {
            exerciseRecords[exercise.exerciseName] = {
              exerciseName: exercise.exerciseName,
              weight: set.weight,
              reps: set.reps,
              oneRepMax: oneRM,
              muscleGroup: exercise.muscleGroup,
              imageUrl: exercise.imageUrl,
            };
          }
        });
      });
    });

    setPersonalRecords(Object.values(exerciseRecords));
  }, [workouts]);

  return personalRecords;
};

export default usePersonalRecords;
