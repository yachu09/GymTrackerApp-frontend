import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
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
}) => {
  if (!exercise) return null;

  return (
    <View style={styles.page}>
      <Image source={{ uri: exercise.imageUrl }} style={styles.image} />

      <View style={styles.headerRow}>
        <Text style={styles.name}>{exercise.exerciseName}</Text>

        {focusedSet && oneRepMax ? (
          <Text style={styles.name}>1RM: {oneRepMax.toFixed(1)}</Text>
        ) : (
          <Text style={styles.name}>1RM: -</Text>
        )}
      </View>

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
          />
        );
      })}
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
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
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
