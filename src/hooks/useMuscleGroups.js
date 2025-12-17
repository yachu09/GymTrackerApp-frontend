import React from "react";
import { useEffect, useState } from "react";
import ForgeTrackerAPI from "../api/ForgeTrackerAPI";

export default () => {
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const searchMuscleGroups = async () => {
    try {
      const response = await ForgeTrackerAPI.get("/musclegroup");
      setMuscleGroups(response.data);
    } catch (err) {
      console.log(err);
      setErrorMessage(err);
    }
  };

  useEffect(() => {
    searchMuscleGroups();
  }, []);

  return [searchMuscleGroups, muscleGroups, errorMessage];
};
