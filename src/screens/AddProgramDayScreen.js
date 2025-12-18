import React, { useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import StandardTextInput from "../components/shared/StandardTextInput";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import StandardButton from "../components/shared/StandardButton";
import { Context as TrainingProgramsContext } from "../context/TrainingProgramsContext";

const AddProgramDayScreen = ({ route }) => {
  const { state: programs, addProgramDay } = useContext(
    TrainingProgramsContext
  );

  const [term, setTerm] = useState("");
  const navigation = useNavigation();

  // Llog stanu bazy gdy się zmienia state
  // useEffect(() => {
  //   console.log("Aktualny stan bazy:", JSON.stringify(programs, null, 2));
  // }, [programs]);

  const idsToAdd = route.params.idsToAdd;
  const exercises = route.params.exercises;
  const programId = route.params.programId;

  const exercisesToProgramDay =
    idsToAdd?.length && exercises?.length
      ? exercises.filter((exercise) => idsToAdd.includes(exercise.id))
      : [];

  const [errorMessage, setErrorMessage] = useState("");

  const createProgram = async () => {
    if (!term.length) {
      // console.log("nie utworzono dnia planu: brakuje nazwy");
      setErrorMessage("Name is missing!");
      return;
    }
    if (term.length > 25) {
      setErrorMessage("Max 25 characters");
      return;
    }

    if (!exercisesToProgramDay.length) {
      // console.log("nie dodano ćwiczeń (lista jest pusta)");
      setErrorMessage("No exercises added");
      return;
    }

    try {
      console.log(`tworzenie dnia planu: "${term}"...`);
      const programDayId = await addProgramDay(
        programId,
        term,
        exercisesToProgramDay
      );

      console.log(`utworzono nowy dzien treningowy o id: ${programDayId}`);
      navigation.popToTop();
    } catch (err) {
      console.error("błąd podczas tworzenia dnia treningowego:", err);
      setErrorMessage("Failed to create training day");
    }
  };

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <View style={styles.container}>
        <StandardTextInput
          placeholder="Training day name"
          term={term}
          onTermChange={(newTerm) => {
            setTerm(newTerm);
          }}
        />
        <Text style={styles.selectedExercisesText}>
          {errorMessage && (
            <Text style={{ color: "red", alignSelf: "center" }}>
              {errorMessage}
              {"  "}
            </Text>
          )}
          {exercisesToProgramDay.length
            ? `You have selected ${exercisesToProgramDay.length} exercises`
            : "Select exercises first"}
        </Text>
        <StandardButton
          text="Add exercises"
          onPress={() => {
            // replace zeby nie nakładać ekranów
            navigation.replace("ExerciseSearch", {
              fromProgramPlanning: true,
              programId: programId,
              // wysyłamy ids jesli zostały wcześniej wybrane
              idsToAdd: idsToAdd || [],
            });
          }}
        />
        <StandardButton
          text="Create training day"
          onPress={() => {
            createProgram();
          }}
        />
      </View>
    </LinearGradient>
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

export default AddProgramDayScreen;
