import { useCallback, useEffect, useState } from "react";
import { getDb } from "../database/localDatabase";

export const useWeightData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWeights = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDb();

      const result = await db.getAllAsync(
        `
        SELECT id, date, weight
        FROM weight
        ORDER BY date ASC
        `
      );
      //normalizacja
      const mapped = result.map((row) => ({
        id: row.id,
        date: new Date(row.date),
        value: Number(row.weight),
      }));

      setData(mapped);
    } catch (error) {
      console.error("Failed to load weight data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeights();
  }, [loadWeights]);

  return {
    weightData: data,
    loading,
    reload: loadWeights,
  };
};
