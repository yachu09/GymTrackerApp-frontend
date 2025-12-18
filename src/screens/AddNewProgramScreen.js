import React, { useState, useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import StandardTextInput from "../components/shared/StandardTextInput";
import { useNavigation } from "@react-navigation/native";
import StandardButton from "../components/shared/StandardButton";
import { LinearGradient } from "expo-linear-gradient";
import { Context as TrainingProgramsContext } from "../context/TrainingProgramsContext";

const AddNewProgramScreen = ({ route }) => {
  const { state: programs, addProgram } = useContext(TrainingProgramsContext);

  const [term, setTerm] = useState("");
  const navigation = useNavigation();

  const [errorMessage, setErrorMessage] = useState("");

  // Llog stanu bazy gdy się zmienia state
  // useEffect(() => {
  //   console.log("Aktualny stan bazy:", JSON.stringify(programs, null, 2));
  // }, [programs]);

  const createProgram = async () => {
    if (!term.length) {
      // console.log("nie utworzono planu: brakuje nazwy");
      setErrorMessage("Name is missing!");
      return;
    }
    if (term.length > 20) {
      setErrorMessage("Max 20 characters");
      return;
    }
    try {
      console.log(`tworzenie planu: "${term}"...`);
      const programId = await addProgram(term);

      console.log(`utworzono nowy plan o id: ${programId}`);
      navigation.popToTop();
    } catch (err) {
      console.error("błąd podczas tworzenia programu:", err);
      setErrorMessage("Failed to create a program");
    }
  };

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <View style={styles.container}>
        <StandardTextInput
          placeholder="Program name"
          term={term}
          onTermChange={(newTerm) => {
            setTerm(newTerm);
          }}
        />
        {errorMessage && (
          <Text style={{ color: "red", alignSelf: "center" }}>
            {errorMessage}
          </Text>
        )}
        <StandardButton
          text="Create training program"
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

export default AddNewProgramScreen;
