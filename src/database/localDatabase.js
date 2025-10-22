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
    CREATE TABLE IF NOT EXISTS programExercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    programId INTEGER NOT NULL,
    exerciseId INTEGER NOT NULL,
    exerciseName TEXT NOT NULL,
    description TEXT,
    muscleGroup TEXT,
    imageUrl TEXT,
    sets INTEGER,
    reps INTEGER,
    breakTime INTEGER,
    FOREIGN KEY (programId) REFERENCES trainingPrograms(id)
    )
  `);
};
