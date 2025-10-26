import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import NumericTextInput from "./NumericTextInput";
import { useTrainingPrograms } from "../hooks/useTrainingPrograms";

const ProgramExerciseDetail = ({ exercise }) => {
  const [sets, setSets] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [repsOfSets, setRepsOfSets] = useState([]);
  //repsOfSets is an "keyed array" - an array of objects
  // const repsOfSets = [
  // {
  //   set: '1',
  //   reps: 10
  // },
  // {
  //   set: 2,
  //   reps: 12
  // }
  // ];

  const { addSetsRepsAndBreakTime } = useTrainingPrograms();

  useEffect(() => {
    console.log(`exercise: ${exercise.exerciseName}`);
    console.log(JSON.stringify(repsOfSets, null, 2));
  }, [repsOfSets]);

  const items = [];

  for (let i = 0; i < sets; i++) {
    items.push(
      <View style={styles.repsContainer} key={i}>
        <Text style={styles.repsText}>Set {i + 1}: </Text>
        {/* these numeric fields dont work yet, add handling input and change the default value for break time to 120s
        adjust handling because the current handling is affecting sets state
        come up with an idea to handle reps state because its dynamically changed while number of sets change
        change break time to show only one text input for it to be the same for one exercise */}
        <NumericTextInput
          // i + 1 = set number
          term={repsOfSets.find((r) => r.set === i + 1)?.reps || ""}
          handleChange={(text) => handleChange(text, "reps", i + 1)}
        />
        <Text style={[styles.repsText, { marginRight: 20 }]}>reps</Text>
      </View>
    );
  }

  //handle any input different than number
  const handleChange = (text, from, set) => {
    //removes every character thats not a number
    const numericText = text.replace(/[^0-9]/g, "");
    switch (from) {
      case "sets":
        setSets(numericText);
        return;
      case "break":
        setBreakTime(numericText);
        return;
      case "reps":
        assignRepsToSets(numericText, set);
        return;
      default:
        return;
    }
  };

  const assignRepsToSets = (reps, setNumber) => {
    setRepsOfSets((prev) => {
      const existingIndex = prev.findIndex((s) => s.set === setNumber);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], reps: reps };
        return updated;
      } else {
        return [...prev, { set: setNumber, reps: reps }];
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
      <View style={styles.setsContainer}>
        <Text style={styles.setsText}>Number of sets: </Text>
        <NumericTextInput
          term={sets}
          handleChange={(text) => handleChange(text, "sets")}
        />
      </View>
      {items.length ? <View>{items}</View> : null}
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={styles.repsText}>Break time: </Text>
        <NumericTextInput
          handleChange={(text) => handleChange(text, "break")}
        />
        <Text style={styles.repsText}>seconds</Text>
      </View>
      <Button
        style={{ marginTop: 40 }}
        title="Confirm input"
        onPress={() => {
          addSetsRepsAndBreakTime(exercise.id, repsOfSets, breakTime);
        }}
      />
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
