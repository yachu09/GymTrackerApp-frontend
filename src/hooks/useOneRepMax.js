import React, { useState, useEffect } from "react";

export default (weight, reps) => {
  const [oneRepMax, setOneRepMax] = useState(null);

  useEffect(() => {
    if (!weight || !reps) {
      setOneRepMax(null);
      return;
    }
    const oneRM = calculateOneRepMax(weight, reps);
    setOneRepMax(oneRM);
  }, [weight, reps]);

  const calculateOneRepMax = (weight, reps) => {
    return (weight * reps) / 30.48 + weight;
  };

  return [oneRepMax];
};
