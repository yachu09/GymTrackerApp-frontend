// hooks/useUploadExercise.js
import { useState } from "react";
import ForgeTrackerAPI from "../api/ForgeTrackerAPI";

export default function useRateExercise() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const rateExercise = async ({ exerciseId, delta }) => {
    try {
      setError(null);
      setSuccess(false);

      if (!exerciseId && exerciseId !== 0) {
        throw new Error("exerciseId is required");
      }

      const numericDelta = Number(delta);
      if (![1, -1].includes(numericDelta)) {
        throw new Error("Delta must be 1 or -1");
      }

      const payload = {
        exerciseId: Number(exerciseId),
        delta: numericDelta,
      };

      const response = await ForgeTrackerAPI.post("/exercise/rating", payload);

      setSuccess(true);
      return response.data;
    } catch (err) {
      console.error("Rate error:", err);
      setError(err.response?.data || err.message);
      throw err;
    }
  };

  return {
    rateExercise,
    error,
    success,
  };
}
