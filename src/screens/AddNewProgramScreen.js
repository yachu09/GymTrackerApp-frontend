import React, { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import StandardTextInput from "../components/shared/StandardTextInput";
import { useNavigation } from "@react-navigation/native";
import StandardButton from "../components/shared/StandardButton";
import { LinearGradient } from "expo-linear-gradient";
import { Context as TrainingProgramsContext } from "../context/TrainingProgramsContext";

const AddNewProgramScreen = ({ route }) => {
  const { state: programs, addProgram } = useContext(TrainingProgramsContext);

  const [term, setTerm] = useState("");
  const navigation = useNavigation();

  // Llog stanu bazy gdy się zmienia state
  // useEffect(() => {
  //   console.log("Aktualny stan bazy:", JSON.stringify(programs, null, 2));
  // }, [programs]);

  const createProgram = async () => {
    if (!term.length) {
      console.log("nie utworzono planu: brakuje nazwy");
      return;
    }
    try {
      console.log(`tworzenie planu: "${term}"...`);
      const programId = await addProgram(term);

      console.log(`utworzono nowy plan o id: ${programId}`);
      navigation.popToTop();
    } catch (err) {
      console.error("błąd podczas tworzenia programu:", err);
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
