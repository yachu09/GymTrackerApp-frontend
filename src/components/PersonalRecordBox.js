import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const PersonalRecordBox = ({ record }) => {
  return (
    // <LinearGradient
    //   start={{ x: 0, y: 0.5 }}
    //   end={{ x: 0, y: 1 }}
    //   style={styles.container}
    //   colors={["lightblue", "#58b4e3ff"]}
    // >
    <View style={styles.container}>
      <Text style={styles.exerciseName}>{record.exerciseName}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 20,
          marginBottom: 10,
        }}
      >
        <Text style={styles.text}>Weight: {record.weight} kg</Text>
        <Text style={styles.text}>Reps: {record.reps}</Text>
        <Text style={styles.text}>1RM: {record.oneRepMax.toFixed(1)} kg</Text>
      </View>
    </View>
    // </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#58b4e3",
    // justifyContent: "center",
    // alignItems: "center",
    // alignSelf: "stretch",
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 15,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 10,
  },
  text: { fontWeight: "bold" },
});

export default PersonalRecordBox;
