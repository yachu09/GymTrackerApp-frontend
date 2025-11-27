import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SetNumber from "./SetNumber";
import { LinearGradient } from "expo-linear-gradient";

const WorkoutExerciseDetail = ({ exercise }) => {
  return (
    <LinearGradient
      start={{ x: 0, y: 0.5 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradientContainer}
      colors={["lightblue", "#58b4e3ff"]}
    >
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    marginBottom: 15,
    borderRadius: 25,
    marginHorizontal: 15,
  },
  container: {
    padding: 10,
    paddingRight: 25,
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
