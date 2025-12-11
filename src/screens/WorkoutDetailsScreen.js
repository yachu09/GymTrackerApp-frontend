import React, { useContext } from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";
import { Context as WorkoutContext } from "../context/WorkoutContext";
import WorkoutExerciseDetail from "../components/WorkoutExerciseDetail";
import { LinearGradient } from "expo-linear-gradient";

const WorkoutDetailsScreen = ({ route }) => {
  const { workoutId } = route.params;
  const {
    state: { workouts },
  } = useContext(WorkoutContext);
  const workout = workouts.find((w) => w.id === workoutId);
  console.log(JSON.stringify(workout, null, 2));
  return (
    <LinearGradient
      style={{ flex: 1, paddingBottom: 80 }}
      colors={["#FFFFFF", "lightblue"]}
    >
      <View>
        <Text style={styles.programNameText}>
          {workout.programName} - {workout.dayName}
        </Text>
        <Text style={styles.dateText}>{workout.date}</Text>
        <FlatList
          data={workout.exercises}
          keyExtractor={(exercise) => exercise.programExerciseId.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <WorkoutExerciseDetail exercise={item} />}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  programNameText: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 10,
  },
  dateText: {
    fontSize: 16,
    alignSelf: "center",
    marginBottom: 10,
    fontWeight: "300",
    fontStyle: "italic",
  },
});

export default WorkoutDetailsScreen;
