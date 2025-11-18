import createDataContext from "./createDataContext";
import {
  loadWorkoutsFromDb,
  startWorkoutInDb,
  addWorkoutSetToDb,
  deleteWorkoutInDb,
  deleteAllWorkoutsInDb,
  getLatestWorkoutIdFromDb,
} from "../repos/workoutRepository";
import { initDatabase } from "../database/localDatabase";

const workoutReducer = (state, action) => {
  switch (action.type) {
    case "SET_WORKOUTS":
      return { ...state, workouts: action.payload };
    case "START_WORKOUT":
      return {
        ...state,
        isWorkoutRunning: true,
        currentWorkoutId: action.payload,
      };
    case "END_WORKOUT":
      return {
        ...state,
        isWorkoutRunning: false,
        currentWorkoutId: null,
      };
    default:
      return state;
  }
};

const loadWorkouts = (dispatch) => {
  return async () => {
    try {
      const workouts = await loadWorkoutsFromDb();
      dispatch({ type: "SET_WORKOUTS", payload: workouts });
    } catch (e) {
      console.error("loadWorkouts error:", e);
    }
  };
};

const startWorkout = (dispatch) => {
  return async (programId) => {
    const workoutId = await startWorkoutInDb(programId);

    dispatch({
      type: "START_WORKOUT",
      payload: workoutId,
    });

    return workoutId;
  };
};

const endWorkout = (dispatch) => {
  return () => {
    dispatch({ type: "END_WORKOUT" });
  };
};

const addWorkoutSet = () => {
  return async (workoutId, programExerciseId, setNumber, weight, reps) => {
    try {
      await addWorkoutSetToDb(
        workoutId,
        programExerciseId,
        setNumber,
        weight,
        reps
      );
    } catch (e) {
      console.error("addWorkoutSet error:", e);
    }
  };
};

const deleteWorkoutById = (dispatch) => {
  return async (workoutId) => {
    try {
      await deleteWorkoutInDb(workoutId);

      const updated = await loadWorkoutsFromDb();
      dispatch({ type: "set_workouts", payload: updated });
    } catch (e) {
      console.error("deleteWorkoutById error:", e);
    }
  };
};

const deleteAllWorkouts = (dispatch) => {
  return async () => {
    try {
      await deleteAllWorkoutsInDb();
      await initDatabase();

      dispatch({ type: "set_workouts", payload: [] });
      // console.log("Wyczyszczono wszystkie workouty.");
    } catch (e) {
      console.error("deleteAllWorkouts error:", e);
    }
  };
};

const getLatestWorkoutId = (dispatch) => {
  return async () => {
    const id = await getLatestWorkoutIdFromDb();
    return id;
  };
};

export const { Context, Provider } = createDataContext(
  workoutReducer,
  {
    loadWorkouts,
    startWorkout,
    endWorkout,
    addWorkoutSet,
    deleteWorkoutById,
    deleteAllWorkouts,
    getLatestWorkoutId,
  },
  {
    workouts: [],
    isWorkoutRunning: false,
    currentWorkoutId: null,
  }
);
