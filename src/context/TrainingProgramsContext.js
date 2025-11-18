// context/ProgramsContext.js
import createDataContext from "./createDataContext";
import {
  loadProgramsFromDb,
  addProgramWithExercisesToDb,
  addSetsRepsBreakToDb,
  deleteAllProgramsInDb,
} from "../repos/trainingProgramsRepository";

const programsReducer = (state, action) => {
  switch (action.type) {
    case "SET_PROGRAMS":
      return action.payload;
    case "CLEAR_PROGRAMS":
      return [];
    default:
      return state;
  }
};

const loadPrograms = (dispatch) => {
  return async () => {
    const programs = await loadProgramsFromDb();
    console.log(
      "%cProgramy z ćwiczeniami i seriami (Context):",
      "color: #0077cc; font-weight: bold;",
      JSON.stringify(programs, null, 2)
    );
    dispatch({ type: "SET_PROGRAMS", payload: programs });
  };
};

const addProgramWithExercises = (dispatch) => {
  return async (name, exercisesArr) => {
    const programId = await addProgramWithExercisesToDb(name, exercisesArr);
    console.log(
      `%cDodano program: "${name}" (ID: ${programId})`,
      "color: green; font-weight: bold;"
    );
    await loadPrograms(dispatch)();
    return programId;
  };
};

const addSetsRepsAndBreakTime = (dispatch) => {
  return async (programExerciseId, repsOfSets, breakTime) => {
    await addSetsRepsBreakToDb(programExerciseId, repsOfSets, breakTime);
    console.log(
      `%cDodano serie do ćwiczenia ${programExerciseId} (Break: ${breakTime}s)`,
      "color: purple; font-weight: bold;"
    );
    await loadPrograms(dispatch)();
  };
};

const dropAllTables = (dispatch) => {
  return async () => {
    await deleteAllProgramsInDb();
    dispatch({ type: "CLEAR_PROGRAMS" });
    console.log(
      "%cWszystkie tabele z trainingPrograms zostały usunięte.",
      "color: red; font-weight: bold;"
    );
  };
};

export const { Context, Provider } = createDataContext(
  programsReducer,
  {
    loadPrograms,
    addProgramWithExercises,
    addSetsRepsAndBreakTime,
    dropAllTables,
  },
  []
);
