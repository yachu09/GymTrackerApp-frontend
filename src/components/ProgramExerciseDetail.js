import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import NumericTextInput from "./NumericTextInput";

const ProgramExerciseDetail = ({ exercise }) => {
  const [sets, setSets] = useState(0);

  const items = [];

  for (let i = 0; i < sets; i++) {
    items.push(
      <View style={styles.repsContainer}>
        <Text style={styles.repsText} key={i}>
          Set {i + 1}:{" "}
        </Text>
        {/* these numeric fields dont work yet, add handling input and change the default value for break time to 120s
        adjust handling because the current handling is affecting sets state
        come up with an idea to handle reps state because its dynamically changed while number of sets change
        change break time to show only one text input for it to be the same for one exercise */}
        <NumericTextInput handleChange={(text) => handleChange(text)} />
        <Text style={[styles.repsText, { marginRight: 20 }]}>reps</Text>
        <Text style={styles.repsText}>Break time: </Text>
        <NumericTextInput handleChange={(text) => handleChange(text)} />
        <Text style={styles.repsText}>seconds</Text>
      </View>
    );
  }

  //handle any input different than number
  const handleChange = (text) => {
    // Usuwa wszystkie znaki, które nie są cyframi
    const numericText = text.replace(/[^0-9]/g, "");
    setSets(numericText);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
      {/* ternary operator might not be needed */}
      {!exercise.sets ? (
        <View style={styles.setsContainer}>
          <Text style={styles.setsText}>Number of sets: </Text>
          <NumericTextInput
            term={sets}
            handleChange={(text) => handleChange(text)}
          />
        </View>
      ) : null}
      {items.length ? <View>{items}</View> : null}
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
  repsText: {
    alignSelf: "center",
  },
  setsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  repsContainer: {
    flexDirection: "row",
  },
  exerciseName: {
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default ProgramExerciseDetail;
