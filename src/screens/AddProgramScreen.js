import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTrainingPrograms } from "../hooks/useTrainingPrograms";
import StandardTextInput from "../components/StandardTextInput";
import { useNavigation } from "@react-navigation/native";
import AddProgramButton from "../components/AddProgramButton";
// import { useTrainingPrograms } from "../hooks/useTrainingPrograms";

const AddProgramScreen = ({ route }) => {
  const { programs, addProgram } = useTrainingPrograms();
  const [term, setTerm] = useState("");
  const navigation = useNavigation();

  // Dodaj testowy wpis tylko raz po załadowaniu ekranu
  useEffect(() => {
    // addProgram("testowy plan");
  }, []);

  // Loguj stan bazy, gdy się zmieni
  useEffect(() => {
    console.log("Aktualny stan bazy:", programs);
  }, [programs]);

  const idsToAdd = route.params.idsToAdd;
  const exercises = route.params.exercises;
  let exercisesToProgram = [];
  if (idsToAdd.length && exercises.length) {
    // console.log(`id do dodania ${idsToAdd}`);
    exercisesToProgram = exercises.filter((exercise) =>
      idsToAdd.includes(exercise.id)
    );
    console.log(exercisesToProgram);
    if (term) {
    }
  }

  return (
    <View style={styles.container}>
      <StandardTextInput
        placeholder="Program name"
        term={term}
        onTermChange={(newTerm) => {
          setTerm(newTerm);
        }}
      />
      <AddProgramButton
        text="Add exercises"
        onPress={() => {
          navigation.navigate("ExerciseSearch", { fromProgramPlanning: true });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
});

export default AddProgramScreen;
