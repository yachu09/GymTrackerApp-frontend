import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

const ProgramExerciseDetail = ({ exercise }) => {
  const [sets, setSets] = useState(0);

  //handle any input different than number
  const handleChange = (text) => {
    // Usuwa wszystkie znaki, które nie są cyframi
    const numericText = text.replace(/[^0-9]/g, "");
    setSets(numericText);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
      {!exercise.sets ? (
        <View style={styles.setsContainer}>
          <Text style={styles.setsText}>Number of sets: </Text>
          <TextInput
            style={styles.setsInput}
            textAlign="center"
            placeholder="0"
            keyboardType="numeric"
            value={sets}
            onChangeText={(text) => handleChange(text)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightblue",
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 10,
  },
  setsText: {
    alignSelf: "center",
    // marginLeft: 10,
  },
  setsInput: {
    backgroundColor: "#f0f0f0",
    width: 40,
    margin: 5,
    borderRadius: 10,
    alignSelf: "center",
  },
  setsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  exerciseName: {
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default ProgramExerciseDetail;
