import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTrainingPrograms } from "../hooks/useTrainingPrograms";

const AddProgramScreen = () => {
  const { programs, addProgram } = useTrainingPrograms();

  // Dodaj testowy wpis tylko raz po załadowaniu ekranu
  useEffect(() => {
    addProgram("testowy plan");
  }, []);

  // Loguj stan bazy, gdy się zmieni
  useEffect(() => {
    console.log("Aktualny stan bazy:", programs);
  }, [programs]);

  return (
    <View style={styles.container}>
      <Text>add training program screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default AddProgramScreen;
