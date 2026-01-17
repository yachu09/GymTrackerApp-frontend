import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import ExerciseSetRow from "./ExerciseSetRow";

const { width } = Dimensions.get("window");

const ExercisePage = ({
  exercise,
  setInputs,
  loggedSets,
  focusedSet,
  handleFocus,
  handleInputChange,
  oneRepMax,
  isWorkoutRunning,
}) => {
  if (!exercise) return null;

  return (
    <View style={styles.page}>
      <View style={{ backgroundColor: "white", marginBottom: 5 }}>
        <Image source={{ uri: exercise.imageUrl }} style={styles.image} />
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.name}>{exercise.exerciseName}</Text>

        {focusedSet && oneRepMax ? (
          <Text style={styles.name}>1RM: {oneRepMax.toFixed(1)}</Text>
        ) : (
          <Text style={styles.name}>1RM: -</Text>
        )}
      </View>

      <ScrollView>
        {exercise.sets.map((set, index) => {
          const setNumber = set.setNumber ?? set.id ?? index + 1;
          const key = `${exercise.id}_${setNumber}`;
          const values = setInputs[key] || {};

          const isFocused =
            focusedSet?.exerciseId === exercise.id &&
            focusedSet?.setId === setNumber;

          return (
            <ExerciseSetRow
              key={key}
              exerciseId={exercise.id}
              setId={setNumber}
              index={index}
              values={values}
              logged={loggedSets.has(key)}
              isFocused={isFocused}
              onFocus={handleFocus}
              onInputChange={handleInputChange}
              suggestedReps={set.reps}
              isWorkoutRunning={isWorkoutRunning}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    width: width,
    height: "100%",
    backgroundColor: "transparent",
  },
  image: {
    width: width,
    height: 200,
    // borderRadius: 10,
    // marginBottom: 5,
    aspectRatio: 1,
    alignSelf: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default ExercisePage;
