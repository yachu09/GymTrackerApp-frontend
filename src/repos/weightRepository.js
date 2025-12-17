import { getDb, initDatabase } from "../database/localDatabase";

export const addWeightToDb = async (date, weight) => {
  const db = await getDb();
  const result = await db.runAsync(
    "INSERT INTO weight (date, weight) VALUES (?, ?);",
    [date, weight]
  );
  console.log(`Dodano nowy log wagi: ${result}`);
  return result.lastInsertRowId;
};

export const loadWeightsFromDb = async () => {
  const db = await getDb();

  const weights = await db.getAllAsync(
    "SELECT * FROM weight ORDER BY id DESC;"
  );
  console.log("Loaded weightsL ", JSON.stringify(weights, null, 2));
  return weights;
};

export const weightExistsForDate = async (date) => {
  const db = await getDb();
  const result = await db.getFirstAsync(
    "SELECT * FROM weight WHERE date = ? LIMIT 1;",
    [date]
  );
  return result !== null; //true jeśli jest
};
