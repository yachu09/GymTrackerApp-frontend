// context/ProgramsContext.js
import createDataContext from "./createDataContext";
import {
  loadProgramsFromDb,
  addProgramToDb,
  addTrainingDayWithExercisesToDb,
  addSetsRepsBreakToDb,
  deleteAllProgramsInDb,
  deleteProgramInDb,
  deleteTrainingDayInDb,
  updateProgramNameInDb,
  updateTrainingDayNameInDb,
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
    dispatch({ type: "SET_PROGRAMS", payload: programs });
  };
};

const addProgram = (dispatch) => {
  return async (name) => {
    const programId = await addProgramToDb(name);
    await loadPrograms(dispatch)();
    return programId;
  };
};

const addProgramDay = (dispatch) => {
  return async (programId, dayName, exercisesArr) => {
    const dayId = await addTrainingDayWithExercisesToDb(
      programId,
      dayName,
      exercisesArr
    );
    await loadPrograms(dispatch)();
    return dayId;
  };
};

const addSetsRepsAndBreakTime = (dispatch) => {
  return async (programExerciseId, repsOfSets, breakTime) => {
    await addSetsRepsBreakToDb(programExerciseId, repsOfSets, breakTime);
    await loadPrograms(dispatch)();
  };
};

const dropAllTables = (dispatch) => {
  return async () => {
    await deleteAllProgramsInDb();
    dispatch({ type: "CLEAR_PROGRAMS" });
  };
};

const deleteProgram = (dispatch) => {
  return async (programId) => {
    await deleteProgramInDb(programId);
    dispatch({ type: "DELETE_PROGRAM", payload: programId });
  };
};

const deleteProgramDay = (dispatch) => {
  return async (programDayId) => {
    await deleteTrainingDayInDb(programDayId);
    await loadPrograms(dispatch)();
  };
};

const updateProgramName = (dispatch) => {
  return async (programId, newName) => {
    await updateProgramNameInDb(programId, newName);
    await loadPrograms(dispatch)();
  };
};

const updateTrainingDayName = (dispatch) => {
  return async (programDayId, newDayName) => {
    await updateTrainingDayNameInDb(programDayId, newDayName);
    await loadPrograms(dispatch)();
  };
};

export const { Context, Provider } = createDataContext(
  programsReducer,
  {
    loadPrograms,
    addProgram,
    addProgramDay,
    addSetsRepsAndBreakTime,
    dropAllTables,
    deleteProgram,
    deleteProgramDay,
    updateProgramName,
    updateTrainingDayName,
  },
  []
);
