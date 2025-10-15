import React from "react";
import { useEffect, useState } from "react";
import ForgeTrackerAPI from "../api/ForgeTrackerAPI";

export default () => {
  const [exercises, setExercises] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const searchExercises = async () => {
    try {
      const response = await ForgeTrackerAPI.get("/exercise");
      setExercises(response.data);
    } catch (err) {
      console.log(err);
      setErrorMessage(err);
    }
  };

  useEffect(() => {
    searchExercises();
  }, []);

  return [searchExercises, exercises, errorMessage];
};
