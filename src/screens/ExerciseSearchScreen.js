import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import useExercises from "../hooks/useExercises";
import SearchBar from "../components/SearchBar";
import ExercisesList from "../components/ExercisesList";

const ExerciseSearchScreen = () => {
  const [term, setTerm] = useState("");
  const [searchExercises, exercises, errorMessage] = useExercises([]);

  console.log(JSON.stringify(exercises, null, 2));
  return (
    <View>
      <SearchBar
        term={term}
        onTermChange={(newTerm) => {
          setTerm(newTerm);
        }}
        onTermSubmit={() => {}}
      />
      <Text>We found {exercises.length} exercises</Text>
      <ExercisesList header={"Chest Exercises"} exercises={exercises} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default ExerciseSearchScreen;
