import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SetNumber from "./SetNumber";

const WorkoutExerciseDetail = ({ exercise }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{exercise.exerciseName}</Text>
      {exercise.sets.map((set, index) => (
        <View key={set.id || index} style={styles.setContainer}>
          <SetNumber number={index + 1} />
          <Text>{set.weight}</Text>
          <Text style={{ alignSelf: "center" }}>kgs</Text>
          <Text>{set.reps}</Text>
          <Text style={{ alignSelf: "center" }}>reps</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#58b4e3",
    padding: 10,
    paddingRight: 25,
    marginBottom: 15,
    borderRadius: 15,
    marginHorizontal: 15,
  },
  setContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginVertical: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    // marginBottom: 10,
    alignSelf: "center",
  },
});

export default WorkoutExerciseDetail;
