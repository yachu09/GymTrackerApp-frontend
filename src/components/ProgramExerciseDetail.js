import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import NumericTextInput from "./NumericTextInput";
import { useTrainingPrograms } from "../hooks/useTrainingPrograms";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const ProgramExerciseDetail = ({ exercise }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [sets, setSets] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [repsOfSets, setRepsOfSets] = useState([]);

  const [confirmed, setConfirmed] = useState(false);
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

  useEffect(() => {
    if (exercise.sets.length) {
      setConfirmed(true);
      setSets(exercise.sets.length);
    }
  }, []);

  useEffect(() => {
    if (exercise.sets.length) {
      setConfirmed(true);
      setSets(exercise.sets.length);
      setBreakTime(exercise.sets[0].breakTime);

      const mappedReps = exercise.sets.map((set) => ({
        set: set.setNumber,
        reps: set.reps,
      }));
      setRepsOfSets(mappedReps);
    }
  }, [exercise]);

  const items = [];

  for (let i = 0; i < sets; i++) {
    items.push(
      <View style={styles.repsContainer} key={i}>
        <Text style={styles.repsText}>Set {i + 1}: </Text>
        {/* FIXME change the default value for break time to 120s*/}
        <NumericTextInput
          // i + 1 = set number
          term={repsOfSets.find((r) => r.set === i + 1)?.reps || ""}
          handleChange={(text) => handleChange(text, "reps", i + 1)}
          placeholder={
            exercise.sets.length && exercise.sets[i]
              ? exercise.sets[i].reps.toString()
              : ""
          }
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
    <LinearGradient
      start={{ x: 0, y: 0.5 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
      colors={["lightblue", "#58b4e3ff"]}
    >
      <View>
        <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
        <View style={styles.setsContainer}>
          <Text style={styles.setsText}>Number of sets: </Text>
          <NumericTextInput
            term={sets}
            handleChange={(text) => handleChange(text, "sets")}
            placeholder={exercise.sets.length}
          />
        </View>
        {items.length ? <View>{items}</View> : null}
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={styles.repsText}>Break time: </Text>
          <NumericTextInput
            handleChange={(text) => handleChange(text, "break")}
            placeholder={exercise.sets.length ? exercise.sets[0].breakTime : 0}
          />
          <Text style={styles.repsText}>seconds</Text>
        </View>
        {confirmed ? (
          <MaterialIcons name="done" size={20} style={styles.confirmed} />
        ) : (
          <Button
            style={{ marginTop: 40 }}
            title="Confirm"
            onPress={() => {
              if (repsOfSets.length) {
                addSetsRepsAndBreakTime(exercise.id, repsOfSets, breakTime);
                setConfirmed(true);
              } else {
                setIsModalVisible(true);
              }
            }}
          />
        )}
        {isModalVisible && (
          <View style={styles.localModalContainer}>
            <View style={styles.localModalContent}>
              <Text style={{ color: "white", marginBottom: 10 }}>
                Enter number of sets and reps
              </Text>
              <Button
                title="Okay"
                onPress={() => {
                  setIsModalVisible(false);
                }}
              />
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightblue",
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 10,
    padding: 10,
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
  confirmed: {
    alignSelf: "center",
  },
  localModalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  localModalContent: {
    backgroundColor: "#ed4242",
    padding: 20,
    borderRadius: 10,
  },
});

export default ProgramExerciseDetail;
