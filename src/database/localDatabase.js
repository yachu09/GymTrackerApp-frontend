// database.js
import * as SQLite from "expo-sqlite";

let dbInstance = null;

export const getDb = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("localDatabase.db");
  }
  return dbInstance;
};

export const executeSql = async (sql, params = []) => {
  const db = await getDb();
  return await db.execAsync(sql, params);
};

export const initDatabase = async () => {
  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS trainingPrograms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `);
};

// tak ma wyglądać +- element tabeli trainingProgram w bazie
const trainingProgramsItem = {
  id: 0, //primary key //autoincrement
  name: "", //TEXT
  //array of objects
  exercsises: [
    {
      exercise: {}, //object
      sets: 0, //INTEGER
      reps: 0, //INTEGER
      breakTime: 0, //INTEGER (seconds)
    },
  ],
};
