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

    CREATE TABLE IF NOT EXISTS trainingProgramDays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      programId INTEGER NOT NULL,
      dayOrder INTEGER NOT NULL,
      dayName TEXT NOT NULL,
      FOREIGN KEY (programId) REFERENCES trainingPrograms(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS programExercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      programDayId INTEGER NOT NULL,
      exerciseId INTEGER NOT NULL,
      exerciseName TEXT NOT NULL,
      description TEXT,
      muscleGroup TEXT,
      imageUrl TEXT,
      FOREIGN KEY (programDayId) REFERENCES trainingProgramDays(id)
    );

    CREATE TABLE IF NOT EXISTS exerciseSets(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      programExerciseId INTEGER NOT NULL,
      setNumber INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      breakTime INTEGER,
      FOREIGN KEY (programExerciseId) REFERENCES programExercises(id)
    );
  `);

  //tabele związane z zapisywaniem odbytych treningów
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      programDayId INTEGER NOT NULL,
      date TEXT DEFAULT (datetime('now')),
      duration INTEGER DEFAULT 0,
      FOREIGN KEY (programDayId) REFERENCES trainingProgramDays(id)
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
