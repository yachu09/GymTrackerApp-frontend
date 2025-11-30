// context/ProgramsContext.js
import createDataContext from "./createDataContext";
import {
  loadProgramsFromDb,
  addProgramWithExercisesToDb,
  addSetsRepsBreakToDb,
  deleteAllProgramsInDb,
  deleteProgramInDb,
} from "../repos/trainingProgramsRepository";

const programsReducer = (state, action) => {
  switch (action.type) {
    case "SET_PROGRAMS":
      return action.payload;
    case "CLEAR_PROGRAMS":
      return [];
    case "DELETE_PROGRAM":
      return state.filter((program) => program.id !== action.payload);

    default:
      return state;
  }
};

const loadPrograms = (dispatch) => {
  return async () => {
    const programs = await loadProgramsFromDb();
    // console.log(
    //   "Context: programy z ćwiczeniami i seriami: ",
    //   JSON.stringify(programs, null, 2)
    // );
    dispatch({ type: "SET_PROGRAMS", payload: programs });
  };
};

const addProgramWithExercises = (dispatch) => {
  return async (name, exercisesArr) => {
    const programId = await addProgramWithExercisesToDb(name, exercisesArr);
    console.log(`dodano program: "${name}" (ID: ${programId})`);
    await loadPrograms(dispatch)();
    return programId;
  };
};

const addSetsRepsAndBreakTime = (dispatch) => {
  return async (programExerciseId, repsOfSets, breakTime) => {
    await addSetsRepsBreakToDb(programExerciseId, repsOfSets, breakTime);
    console.log(
      `dodano serie do ćwiczenia ${programExerciseId} (Break: ${breakTime}s)`
    );
    await loadPrograms(dispatch)();
  };
};

const dropAllTables = (dispatch) => {
  return async () => {
    await deleteAllProgramsInDb();
    dispatch({ type: "CLEAR_PROGRAMS" });
    console.log("wszystkie tabele z trainingPrograms zostały usunięte.");
  };
};

const deleteProgram = (dispatch) => {
  return async (programId) => {
    try {
      await deleteProgramInDb(programId);
      dispatch({ type: "delete_program", payload: programId });
      console.log(`Context: usunięto plan ID ${programId}`);
    } catch (error) {
      console.error("Context error deleteProgram:", error);
    }
  };
};

export const { Context, Provider } = createDataContext(
  programsReducer,
  {
    loadPrograms,
    addProgramWithExercises,
    addSetsRepsAndBreakTime,
    dropAllTables,
    deleteProgram,
  },
  []
);
