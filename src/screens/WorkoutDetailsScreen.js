import React, { useContext } from "react";
import { Text, StyleSheet, View, FlatList, Dimensions } from "react-native";
import { Context as WorkoutContext } from "../context/WorkoutContext";
import SetNumber from "../components/SetNumber";

const { width } = Dimensions.get("window");
const WorkoutDetailsScreen = ({ route }) => {
  const { workoutId } = route.params;
  const {
    state: { workouts },
  } = useContext(WorkoutContext);
  const workout = workouts.find((w) => w.id === workoutId);
  console.log(JSON.stringify(workout, null, 2));
  return (
    <View>
      <Text>{workout.name}</Text>
      <FlatList
        data={workout.exercises}
        keyExtractor={(exercise) => exercise.programExerciseId.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <Text style={styles.name}>{item.exerciseName}</Text>

            {item.sets.map((set, index) => {
              return (
                <View key={set.id || index} style={styles.setContainer}>
                  <SetNumber number={index + 1} />
                  <Text>{set.weight}</Text>
                  <Text style={{ alignSelf: "center" }}>kgs</Text>

                  <Text>{set.reps}</Text>
                  <Text style={{ alignSelf: "center" }}>reps</Text>

                  {/* <MaterialIcons
                    name="done"
                    size={20}
                    style={[styles.done, { color: isDone ? "blue" : "black" }]}
                  /> */}
                </View>
              );
            })}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  setContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: width,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default WorkoutDetailsScreen;
