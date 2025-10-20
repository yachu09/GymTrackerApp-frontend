import { useEffect, useState, useRef } from "react";
import { getDb, initDatabase } from "../database/localDatabase";

export function useTrainingPrograms() {
  const [programs, setPrograms] = useState([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const setup = async () => {
      try {
        await initDatabase();
        await loadPrograms();
      } catch (e) {
        console.error("DB init/load error:", e);
      }
    };
    setup();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadPrograms = async () => {
    try {
      const db = await getDb();
      const rows = await db.getAllAsync(
        "SELECT * FROM trainingPrograms ORDER BY id DESC;"
      );
      if (mountedRef.current) setPrograms(rows);
    } catch (e) {
      console.error("loadPrograms error", e);
    }
  };

  const addProgram = async (name) => {
    try {
      const db = await getDb();
      await db.runAsync("INSERT INTO trainingPrograms (name) VALUES (?);", [
        name,
      ]);
      await loadPrograms();
    } catch (e) {
      console.error("addProgram error", e);
    }
  };

  return { programs, addProgram, loadPrograms };
}
