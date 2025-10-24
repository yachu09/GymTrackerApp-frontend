import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTrainingPrograms } from "../hooks/useTrainingPrograms";
import StandardTextInput from "../components/StandardTextInput";
import { useNavigation } from "@react-navigation/native";
import AddProgramButton from "../components/AddProgramButton";

const AddProgramScreen = ({ route }) => {
  const { programs, loadPrograms, addProgramWithExercises } =
    useTrainingPrograms();
  const [term, setTerm] = useState("");
  const navigation = useNavigation();

  // Llog stanu bazy gdy się zmienia state
  // useEffect(() => {
  //   console.log("Aktualny stan bazy:", JSON.stringify(programs, null, 2));
  // }, [programs]);

  const createProgram = async () => {
    console.log(`term: ${term}`);
    if (term.length && exercisesToProgram.length) {
      try {
        // Czekamy aż cały zapis do bazy się zakończy
        const programId = await addProgramWithExercises(
          term,
          exercisesToProgram
        );
        console.log(`Utworzono nowy plan - id: ${programId}`);

        // Dopiero teraz wracamy na początek stacka
        navigation.popToTop();
      } catch (err) {
        console.error("Błąd podczas tworzenia programu:", err);
      }
    } else {
      console.log("Nie utworzono nowego planu, brakuje nazwy");
    }
  };

  const idsToAdd = route.params.idsToAdd;
  const exercises = route.params.exercises;
  let exercisesToProgram = [];
  if (idsToAdd.length && exercises.length) {
    exercisesToProgram = exercises.filter((exercise) =>
      idsToAdd.includes(exercise.id)
    );
    // console.log(
    //   `Selected exercises: ${JSON.stringify(exercisesToProgram, null, 2)}`
    // );
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
          // navigation.navigate("WorkoutPlanning");
          // navigation.popToTop();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectedExercisesText: {
    alignSelf: "center",
    marginTop: 5,
  },
});

export default AddProgramScreen;
