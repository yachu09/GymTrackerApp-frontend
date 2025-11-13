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
  //tabele związane z planami treningowymi
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
      FOREIGN KEY (programId) REFERENCES trainingPrograms(id)
    ); 

    CREATE TABLE IF NOT EXISTS exerciseSets(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      programExerciseId INTEGER NOT NULL,
      setNumber INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      breakTime INTEGER,
      FOREIGN KEY (programExerciseId) REFERENCES programExercsises(id)
    );
  `);

  //tabele związane z zapisywaniem odbytych treningów
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      programId INTEGER NOT NULL,
      date TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (programId) REFERENCES trainingPrograms(id)
    );

    CREATE TABLE IF NOT EXISTS workoutSets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workoutId INTEGER NOT NULL,
      programExerciseId INTEGER NOT NULL,
      setNumber INTEGER NOT NULL,
      weight REAL,
      reps INTEGER,
      FOREIGN KEY (workoutId) REFERENCES workouts(id),
      FOREIGN KEY (programExerciseId) REFERENCES programExercises(id),
      UNIQUE(workoutId, programExerciseId, setNumber)
    );
  `);
};
