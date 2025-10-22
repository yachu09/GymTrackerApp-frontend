import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTrainingPrograms } from "../hooks/useTrainingPrograms";
import StandardTextInput from "../components/StandardTextInput";
import { useNavigation } from "@react-navigation/native";
import AddProgramButton from "../components/AddProgramButton";

const AddProgramScreen = ({ route }) => {
  const { programs, addProgram, loadPrograms, addProgramWithExercises } =
    useTrainingPrograms();
  const [term, setTerm] = useState("");
  const navigation = useNavigation();

  // Dodaj testowy wpis tylko raz po załadowaniu ekranu
  useEffect(() => {
    // addProgram("testowy plan");
  }, []);

  // Loguj stan bazy, gdy się zmieni
  useEffect(() => {
    console.log("Aktualny stan bazy:", JSON.stringify(programs, null, 2));
  }, [programs]);

  const createProgram = () => {
    console.log(`term: ${term}`);
    if (term.length && exercisesToProgram.length) {
      //use hook and add program to local db
      const programId = addProgramWithExercises(term, exercisesToProgram);
      console.log(`Utworzono nowy plan - id: ${programId}`);
    } else console.log("Nie utworzono nowego planu, brakuje nazwy");
  };

  const idsToAdd = route.params.idsToAdd;
  const exercises = route.params.exercises;
  let exercisesToProgram = [];
  if (idsToAdd.length && exercises.length) {
    // console.log(`id do dodania ${idsToAdd}`);
    exercisesToProgram = exercises.filter((exercise) =>
      idsToAdd.includes(exercise.id)
    );
    console.log(
      `Selected exercises: ${JSON.stringify(exercisesToProgram, null, 2)}`
    );
  }

  return (
    <View style={styles.container}>
      <StandardTextInput
        placeholder="Program name"
        term={term}
        onTermChange={(newTerm) => {
          setTerm(newTerm);
        }}
        // onTermSubmit={() => {
        //   createProgram();
        // }}
      />
      <Text style={styles.selectedExercisesText}>
        {exercisesToProgram.length
          ? `You have selected ${exercisesToProgram.length} exercises`
          : "Select exercises first"}
      </Text>
      <AddProgramButton
        text="Add exercises"
        onPress={() => {
          navigation.navigate("ExerciseSearch", {
            fromProgramPlanning: true,
          });
        }}
      />
      <AddProgramButton
        style={styles.createProgramButton}
        text="Create training program"
        onPress={() => {
          createProgram();
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
  selectedExercisesText: {
    alignSelf: "center",
    marginTop: 5,
  },
});

export default AddProgramScreen;
